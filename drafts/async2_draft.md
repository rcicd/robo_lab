# But what about green threads?

## Prerequisite

I expect from you, dear reader, to know what stackless coroutines are. So, if you don't, read [this](https://robocy.org/blog/async-stackless-coroutines/) :)

## Problem

Okay, we already have stackless coroutines, so any task, that requires concurrency is already solved for us, right? Not exactly, because stackless coroutines are cooperative and, therefore, much harder to control

Take that example:
```python3
async def send_to_server(addr):
    time_before_next_request = 0
    while True:
        await asyncio.sleep(time_before_next_request)
        resp = await aiohttp.request("GET", addr)
        time_before_next_request = int(resp.data)
```
What if we would use not `asyncio.sleep`, but `time.sleep` in it? Moreover, what if I just don't want to mark any function `async` if it merely uses some another async function? It's not very pleasant to use and absolutely disasterous to maintain (imagine: one helper-function became async and ALL functions that use it should become async too. And what if this function is in library?)

So, out main problems are _cooperativity_ and _function coloring_ (propagation of `async` is called so poetic). Let's talk about them and their solutions one-by-one

## Cooperativity

What comes to your mind when you're thinking about non-cooperative ways of implementing concurrency (monstrous construction, either simplify or make a joke about it later)? Threads! 
> Note: if you see this word first time in your life or fell like you need to make sure that you understand what will happen next, you can read [this](https://www.geeksforgeeks.org/operating-systems/thread-in-operating-system/)

Buuut, threads are slow to create, right? And they do require a lot of RAM too. Maybe we could use less of them? Something like `N` threads that execute some tasks in parallel and when some of them becomes free picks new task up from queue? This approach is called `thread pool` and, while it works in some scenarios, it still kinda cooperative? I mean, what if all threads will be blocked by some nasty `time.sleep` like in example above? Unclear. But what if we could've cheap threads..?

## Function coloring

Why did we even colored functions? Because we should've known that they will be called in async context in _compile-time_. But what if we will think about such things in _runtime_? Maybe it will make our lives easier? 
> Note: while languages like python do not produce executable, they typically still processed through some kind of compilation. If you are interested in it, please read `Crafting interpreters`, very nice book

## Solution

Maybe we could design some approach to use threads, not use function coloring and provide a way to use a non-cooperative concurrency. Such approach is called `green threads`. When system handles threads, from time to time it switches one thread to another, while saving it's state in memory. Let's ~steal~ reuse this approach! 
```C
void switch_thread(Thread t1, Thread t2) {
    Thread saved_thread = {
        .regs = t1->regs,
        .stack = t1->stack
    }; // saving t1 to some data_structure
    save_thread(saved_thread);
    t1 = t2;
}
```
Ok, but who will call this code? Most obvious answer is user, but it makes this whole process cooperative, which is not what we wanted. Let's just delegate it to some pre-written code! It usually is called `runtime`. `Runtime` will manage these _user-space threads_ for us.
> Note: when I say _user-space threads_, I talk about this `Thread` structure, which isn't an OS thread, but some kind of abstraction on it. There could be several `Thread`s in one OS thread

(some more explanation, but I need to think about structure a little more, but let idea be like that)





