---
layout: blog-detail
name: "Wait, there is more async?! (green threads)"
# tg_post_link: "robocy/3"
description: "Async/await wasn't enough, let's build some intuition about how async works __without__ `async` keyword!"
tags:
  - "Fundamentals"
  - "Learning"
---

# Wait, there is more async?!

## Prerequisite

I expect from you, dear reader, to know what stackless coroutines are.
If you don't, read [the first post](https://robocy.org/blog/async-stackless-coroutines/) first :)

Quick recap: we built an event loop that runs multiple tasks on a
single thread. Each task saves its state at `await` points,
and the loop decides who runs next. Our computer is safe, the servers
are happy. Life is good (generally)

...Or is it?

## The pain of async

Let's take another look at our server function:

```python
async def send_to_server(addr):
    time_before_next_request = 0
    while True:
        await asyncio.sleep(time_before_next_request)
        resp = await aiohttp.request("GET", addr)
        time_before_next_request = int(resp.data)
```

It works, but imagine you have a helper function that
formats the response:

```python
def parse_response(resp):
    return int(resp.data)
```

Innocent enough from my point of view. But maybe now you want `parse_response` to also
fetch something from a cache server? To use `await`, the function
must become `async`:

```python
async def parse_response(resp):
    extra = await aiohttp.request("GET", "http://cache/validate")
    return int(resp.data) + int(extra.data)
```

And now *every function that calls `parse_response`* must become `async` too.
And every function that calls *those* functions. One `await` deep
in a helper, and suddenly half your codebase is painted `async`.
I've mentioned this in the first post and called it
**function coloring**. Back then I said: "Accept." Well, 
I lied :D. There's another way!

### And it gets worse

There's a second problem. What happens if someone writes `time.sleep(10)`
instead of `await asyncio.sleep(10)` in one of the tasks?

```python
async def send_to_server(addr):
    time.sleep(10)  # oops, blocking!
    resp = await aiohttp.request("GET", addr)
    ...
```

The entire event loop freezes. No other task can run, because
`time.sleep` doesn't yield control - it just blocks the thread.
The event loop only gets control back at `await` points, and we just
skipped one. Our concurrency model is **cooperative**: it only works
when *everyone cooperates*. One bad function and the whole thing falls apart (in other words, cooperativity is good,
but, as you may have noticed from your life experience - it's not always practical :()

So we have two problems:

1. **Function coloring** - `async` propagates through the codebase like a virus
2. **Cooperativity** - one blocking call can starve all other tasks

Can we solve both at once?

## Threads to the rescue?

When you think "non-cooperative concurrency", you probably
think of **threads**. And you'd be right! The operating system can
interrupt any thread at any time and switch to another one - no `await`
needed, no function coloring, no cooperation required. This is called
**preemptive** scheduling.

```python
import threading

def send_to_server(addr):
    time_before_next_request = 0
    while True:
        time.sleep(time_before_next_request)  # totally fine now
        resp = http.request("GET", addr)
        time_before_next_request = int(resp.data)

t1 = threading.Thread(target=send_to_server, args=(addr1,))
t2 = threading.Thread(target=send_to_server, args=(addr2,))
t1.start()
t2.start()
```

No `async`. No `await`. Just normal, friendly functions. Beautiful even, maybe

### But threads are heavy

Every OS thread gets its own stack, usually around 1–8 MB.
Creating one involves a system call, and switching between
them requires the kernel to save and restore register state.
If you need 10 threads, this is fine. If you need 10,000
(say, one per connection on a busy web server), you're
looking at gigabytes of RAM just for stacks that are mostly empty

Okay, so OS threads are too expensive to use in large numbers.
Stackless coroutines are lightweight but cooperative and colored.
What if we could have something in between?

## Green threads

Here's the idea: what if we build our **own** threads inside
the program? Not OS threads - just a `Thread` data structure
that holds saved registers and a small stack. We can allocate
thousands of them cheaply, and we control the scheduling ourselves.
These are called **green threads** (or user-space threads,
fibers, goroutines - different names, same core idea, developers love to give many names to same thing,
I even prepared a quote!!)

> There are only two hard things in Computer Science: cache invalidation and naming things
>
> -- Phil Karlton

### What a green thread looks like

At minimum, a green thread needs to store the execution state:
where we were in the code and what the stack looked like.

```c
struct GreenThread {
    void *stack;         // separately allocated, small (e.g 4 KB)
    void *stack_pointer;
    int   status;        // READY, RUNNING, WAITING, DONE
};
```

### Context switching

The heart of green threads is the **context switch**: saving
the state of the currently running thread and restoring
the state of the next one

> Remark: this is exactly what the OS kernel does when
> switching between OS threads, but we're doing it ourselves
> in user space => we don't need to call OS to help us => we shouldn't 
> sacrifice performance 

In simplified pseudocode (imagine the registers as variables):

```c
void switch_to(GreenThread *current, GreenThread *next) {
    current->stack_pointer = save_registers();
    restore_registers(next->stack_pointer);
    // execution continues from where `next` left off!
}
```

In real implementations, `save_registers` and `restore_registers` are a
few lines of assembly that push/pop callee-saved registers and swap
the stack pointer. It's fast - way faster than a syscall to the kernel.

### Who calls the switch?

This is the crucial question. There are two options:

1. The **user** calls `yield()` manually - but this is cooperative again,
   which is exactly what we're trying to escape
2. A **timer signal** (like `SIGALRM` on Linux) fires periodically
   and forces a switch - this is preemptive!

Let's go with option 2. We set up a timer that fires, say,
every 10 milliseconds, and in the signal handler we call our
`switch_to`:

```c
void timer_handler(int sig) {
    GreenThread *current = runtime.current_thread;
    GreenThread *next    = runtime.pick_next_thread();
    if (next != current) {
        switch_to(current, next);
    }
}

void setup_preemption() {
    signal(SIGALRM, timer_handler);
    // alarm rings every 10ms
    set_interval_timer(10);
}
```

Now no thread can hog the CPU forever - the timer will
eventually interrupt it and give someone else a turn. That
way every thread will complete step-by-step

### The runtime

Just like with stackless coroutines, we need a runtime
to manage everything. But instead of an event loop that polls
for `epoll` events and timers, our green thread runtime
manages a pool of threads and a scheduler:

```c
struct Runtime {
    GreenThread  *current_thread;
    GreenThread  *threads[MAX_THREADS];
    int           thread_count;
};

GreenThread *pick_next_thread(Runtime *rt) {
    // just pick first READY thread
    for (int i = 0; i < rt->thread_count; i++) {
        if (rt->threads[i]->status == READY) {
            return rt->threads[i];
        }
    }
    return rt->current_thread; // nothing else to run
}

void spawn(Runtime *rt, void (*func)()) {
    GreenThread *t = new_green_thread();
    t->stack_pointer = setup_stack(t->stack, func);
    t->status = READY;
    rt->threads[rt->thread_count++] = t;
}
```

And using it looks refreshingly simple:

```c
void send_to_server(char *addr) {
    int delay = 0;
    while (1) {
        sleep(delay);  // NOTE: sleep() blocks the entire OS thread, not just this green thread
        int resp = http_request(addr);
        delay = resp;
    }
}

int main() {
    Runtime rt = new_runtime();
    setup_preemption();

    spawn(&rt, send_to_server, addr1);
    spawn(&rt, send_to_server, addr2);

    run(&rt);  // runs until all threads are done
}
```

Look at that! No `async`, no `await`: just regular functions
that block whenever they want, and the runtime handles the rest.

> Note: The example above simplifies one important detail. `sleep()` is a
> blocking syscall that puts the entire OS thread to sleep - the timer signal
> will interrupt it, but after the signal handler returns, `sleep()` resumes
> waiting. So in this naive implementation, green threads would still block each
> other on I/O. Real runtimes solve this by intercepting blocking syscalls and
> replacing them with non-blocking equivalents. Go, for instance, has its own
> netpoller that wraps all network I/O and parks goroutines instead of blocking
> the OS thread. The scheduling idea here is correct - but a production runtime
> needs this I/O layer too, which is arguably the harder part

## Comparing the two models

| | Stackless coroutines | Green threads |
|---|---|---|
| State storage | Compiler-generated state machine | Separate stack per thread |
| Yielding | Explicit (`await`) | Implicit (timer / signal) |
| Function coloring | Yes | No |
| Scheduling | Cooperative | Can be preemptive |
| Memory per task | Tens to hundreds of bytes (just the state) | 2–8 KB typical |
| Context switch cost | Minimal (state machine jump) | Low (save/restore registers) |

Neither model is better (and I, personally, like both equally).
Stackless coroutines use less memory and have cheaper context switches, 
but require you to mark everything with `async/await`. Green threads are 
more ergonomic but use more memory and have slightly more expensive switches

## Who uses what?

Green threads aren't just a theoretical exercise:

* **Go** - goroutines are green threads on a thread pool.
  The Go runtime manages scheduling and can grow/shrink goroutine stacks
  as needed
* **Erlang/Elixir** - "processes" in the BEAM VM are essentially
  green threads with message-passing
* **Java 21+** - Project Loom introduced "virtual threads", which
  are green threads on the JVM
* **Rust** - to my surprise chose *not* to use green threads.
  Rust's `async/await` uses stackless coroutines, prioritizing
  zero-cost abstractions over ergonomics

> Remark: if you want to go deeper into how these implementations
> differ (stackful vs stackless, M:N threading, work-stealing schedulers),
> each of these is worth a whole separate post.

## Conclusion

In the [first post](https://robocy.org/blog/async-stackless-coroutines/),
we built an event loop that runs stackless coroutines. It works,
but comes with the cost of function coloring and cooperative scheduling.
Green threads offer an alternative: give each task its own
small stack, switch between them with a timer signal, and let
programmers write plain blocking code without worrying about `async`
infecting their entire codebase.

The trade-off is real though - you pay with slightly more memory per
task and slightly more expensive context switches. That's why most
modern languages pick one model or the other based on their priorities,
and some (like Java) ended up adopting green threads *after* years
of living with only OS threads (but, you know, it's java, they can afford anything)

As always, there's no silver bullet. But now you know both approaches
and can appreciate why the concurrency landscape looks the way it does :)

Thanks for reading! 

## Read more about it

[Fibers, Oh My!](https://graphitemaster.github.io/fibers/)
[Go scheduler](https://morsmachine.dk/go-scheduler)
[Project Loom (Java virtual threads)](https://openjdk.org/jeps/444)
[Why Rust doesn't have green threads](https://without.boats/blog/why-async-rust/)

> by [miko089](https://github.com/miko089)
