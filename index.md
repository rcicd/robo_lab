---
layout: default
title: "Главная"
---

<div class="home-intro">
  <h2>Добро пожаловать в лабораторию «Название»</h2>
  <p>Мы занимаемся исследованием …</p>
</div>

<section class="latest-projects">
  <h3>Последние проекты</h3>
  <ul>
    {% for proj in site.data.projects %}
      <li>
        <a href="{{ proj.url }}">{{ proj.title }}</a> —
        {{ proj.short_description }}
      </li>
    {% endfor %}
  </ul>
  <p><a href="{{ "/projects/" | relative_url }}">Все проекты →</a></p>
</section>

<section class="upcoming-events">
  <h3>Ближайшие события</h3>
  <ul>
    {% assign future_events = site.data.events | where_exp: "item", "item.date >= site.time" | sort: "date" %}
    {% for ev in future_events limit:3 %}
      <li>
        {{ ev.date | date: "%d.%m.%Y" }} — <strong>{{ ev.title }}</strong>
      </li>
    {% endfor %}
  </ul>
  <p><a href="{{ "/events/" | relative_url }}">Все события →</a></p>
</section>
