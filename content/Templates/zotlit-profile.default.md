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
  - key: title_zh
    expr: 'zt.extra.fields.titleTranslation | default: ""'
    merge: keep
  - key: tags
    expr: 'zt.collections | collection_paths | push: "文献笔记" | obsidian_tag | uniq'
    merge: append
  - key: status
    value: "unread"
    merge: keep
  - key: authors
    expr: 'zt.authors | map: "fullName"'
    merge: replace
  - key: year
    expr: zt.date.year
    merge: replace
  - key: journal
    expr: zt.containerTitle
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
