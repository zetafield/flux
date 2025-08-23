---
title: Home
---

# {{ data.site.name }}

{{ data.site.description }}

## Recent Posts

{% for post in collections.blog %}

- [{{ post.title }}]({{ post.url }}) - {{ post.date }}
  {% endfor %}
