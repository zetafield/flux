---
title: Blog
---

# Blog Posts

<ul class="post-list">
{% for post in collections.blog %}
  <li class="post-card">
    <a href="{{ post.url }}">
      {% if post.date %}<time>{{ post.date }}</time>{% endif %}
      <h3>{{ post.title }}</h3>
    </a>
  </li>
{% endfor %}
</ul>
