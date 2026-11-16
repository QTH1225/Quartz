---
id: default
name: 默认
version: 1.0.0
author: ZotLit
description: 文献笔记的内置格式。
contract: 3
filename: |
  {{ zt.date.year }}_{{ zt.authors[0].family }}_{{ zt.title | truncatewords: 5, "" }}{% suffix %}
language: liquid
frontmatter:
  - key: title
    expr: zt.title
    merge: replace
  - key: related
    expr: zt.relatedItems | note_links
    merge: replace
  - key: collections
    expr: zt.collections | collection_paths
    merge: replace
  - key: citekey
    expr: zt.citationKey
    merge: replace
---
# {{ zt.title }}

[Zotero]({{ zt.backlink }}) {{ zt.attachments | map: "fileLink" | compact | join: " " }}

## Annotations

```zotquery
views:
  - type: annotations
    name: Annotations
    from: annotations
    filters: item == this.item
    sort:
      - property: attachment.dateAdded
        direction: ASC
      - property: sortIndex
        direction: ASC
```


--- zotlit:annotation ---
{% bq %}
[!note] {% if zt.pageLabel and zt.pageLabel != "" %}Page [{{ zt.pageLabel }}]({{ zt.backlink }}){% else %}[Zotero]({{ zt.backlink }}){% endif %}

{{ zt.imgLink | embed }}{{ zt.text }}{% if zt.citation %} {{ zt.citation }}{% endif %}
{% if zt.comment %}

{{ zt.comment }}
{% endif %}
{% endbq %}
