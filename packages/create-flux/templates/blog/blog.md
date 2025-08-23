---
title: Blog
---

# Blog Posts

{% for post in collections.blog %}

## [{{ post.title }}]({{ post.url }})

**{{ post.date }}** - {{ post.excerpt }}

{% endfor %}
