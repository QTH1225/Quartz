---
title: Quartz Feature Test Article
draft: false
author: Tianhao Qin
authorLink: https://github.com/QTH1225
lang: en-US
tags:
  - test
  - Quartz
  - Markdown
translations:
  zh: "/代码工具（code）/quartz功能测试文章"
---

This article is used to check Quartz rendering. It covers math formulas, PDF embedding, regular code blocks, collapsible long code blocks, tables, task lists, quotes, and common image layouts.

## Math Formula Test

Inline formula example: when $a^2+b^2=c^2$, the triangle satisfies the Pythagorean relation. Einstein's mass-energy equation can be written as $E=mc^2$.

Block formula example:

$$
\nabla \cdot \mathbf{D} = \rho_f,\qquad
\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}
$$

Matrix equation and optimization objective:

$$
\mathbf{K}\mathbf{u}=\mathbf{f},\qquad
\min_{\theta}\ \mathcal{L}(\theta)=\frac{1}{n}\sum_{i=1}^{n}\left(y_i-f_{\theta}(x_i)\right)^2+\lambda\lVert\theta\rVert_2^2
$$

Piecewise function:

$$
g(x)=
\begin{cases}
x^2, & x \ge 0 \\
-x, & x < 0
\end{cases}
$$

## PDF Embed Test

The following uses Obsidian-style attachment embedding to test PDF inline display. Quartz converts this PDF embed into a web preview during build.

![[/Attachments/提问的艺术How-To-Ask-Questions-The-Smart-Way.pdf]]

[Open PDF attachment](/Attachments/提问的艺术How-To-Ask-Questions-The-Smart-Way.pdf)

## Image Embed Test

Single image:

![Single image test](/Attachments/quartz-test-single.svg)
*Single image test*

Side-by-side images:

| ![Left side-by-side image](/Attachments/quartz-test-left.svg) | ![Right side-by-side image](/Attachments/quartz-test-right.svg) |
| --- | --- |
| *Left side-by-side image* | *Right side-by-side image* |

## Image CDN Test

The following tests whether a jsDelivr-hosted image can display correctly in Quartz:

![CDN image test](https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251225163945225.webp)
*CDN image test*

[Open original CDN image](https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251225163945225.webp)

## Regular Code Block Test

Python code block:

```python
from dataclasses import dataclass


@dataclass
class Experiment:
    name: str
    samples: int
    accuracy: float


def summarize(exp: Experiment) -> str:
    return f"{exp.name}: n={exp.samples}, accuracy={exp.accuracy:.2%}"


if __name__ == "__main__":
    experiment = Experiment("quartz-render-test", 128, 0.973)
    print(summarize(experiment))
```

TypeScript code block:

```ts
type Author = {
  name: string
  link?: string
}

function renderAuthors(authors: Author[]) {
  return authors.map((author) => {
    const label = author.link ? `[${author.name}](${author.link})` : author.name
    return `Author: ${label}`
  })
}
```

## Collapsible Long Code Block Test

> [!note]- Click to expand the long code block
> The following is a longer TypeScript test snippet used to check collapsible regions, syntax highlighting, copy buttons, horizontal scrolling, and long-line display.
>
> ```ts
> type NodeId = string
>
> interface GraphNode {
>   id: NodeId
>   label: string
>   tags: string[]
>   weight: number
> }
>
> interface GraphEdge {
>   source: NodeId
>   target: NodeId
>   relation: "references" | "depends-on" | "extends" | "contradicts"
>   confidence: number
> }
>
> interface Graph {
>   nodes: GraphNode[]
>   edges: GraphEdge[]
> }
>
> const graph: Graph = {
>   nodes: [
>     { id: "doc-001", label: "Document engineering introduction and writing", tags: ["docs", "document engineering", "AI"], weight: 0.92 },
>     { id: "doc-002", label: "Building a document engineering project", tags: ["docs", "practice"], weight: 0.88 },
>     { id: "doc-003", label: "How to ask questions correctly", tags: ["docs", "communication"], weight: 0.81 },
>     { id: "doc-004", label: "Harness Engineering", tags: ["AI", "engineering"], weight: 0.95 },
>   ],
>   edges: [
>     { source: "doc-001", target: "doc-002", relation: "depends-on", confidence: 0.91 },
>     { source: "doc-003", target: "doc-001", relation: "references", confidence: 0.77 },
>     { source: "doc-004", target: "doc-001", relation: "extends", confidence: 0.86 },
>   ],
> }
>
> function normalizeWeight(value: number) {
>   if (Number.isNaN(value)) return 0
>   if (value < 0) return 0
>   if (value > 1) return 1
>   return value
> }
>
> function scoreNode(node: GraphNode, incoming: GraphEdge[], outgoing: GraphEdge[]) {
>   const structuralScore =
>     incoming.reduce((sum, edge) => sum + edge.confidence, 0) * 0.4 +
>     outgoing.reduce((sum, edge) => sum + edge.confidence, 0) * 0.6
>
>   const tagBonus = node.tags.includes("docs") ? 0.08 : 0
>   return normalizeWeight(node.weight * 0.7 + structuralScore * 0.2 + tagBonus)
> }
>
> function rankGraph(input: Graph) {
>   return input.nodes
>     .map((node) => {
>       const incoming = input.edges.filter((edge) => edge.target === node.id)
>       const outgoing = input.edges.filter((edge) => edge.source === node.id)
>       return {
>         ...node,
>         score: scoreNode(node, incoming, outgoing),
>         incoming: incoming.length,
>         outgoing: outgoing.length,
>       }
>     })
>     .sort((a, b) => b.score - a.score)
> }
>
> const ranked = rankGraph(graph)
>
> for (const item of ranked) {
>   console.log(
>     `${item.id.padEnd(8)} | ${item.label.padEnd(42)} | score=${item.score.toFixed(3)} | tags=${item.tags.join(", ")}`,
>   )
> }
>
> const deliberatelyLongLineForHorizontalScrollTesting = "This is a deliberately very very very very very very very very very very very very very very very very very very very long string used to check whether code blocks can scroll horizontally without breaking the whole page layout."
> console.log(deliberatelyLongLineForHorizontalScrollTesting)
> ```

## Table Test

| Module | Test Content | Expected Behavior | Status |
| --- | --- | --- | --- |
| Math formulas | Inline formulas, block formulas, piecewise functions | KaTeX renders correctly | To check |
| PDF | Obsidian embed plus regular link | Inline preview or clickable opening | To check |
| Images | Single image and side-by-side images | Images load correctly; side-by-side layout stacks on mobile | To check |
| Code | Python and TypeScript | Highlighting, monospace font, copy button | To check |
| Long code | Collapsible callout and long line | Collapsed by default; highlighted, copyable, and horizontally scrollable after expansion | To check |
| Table | Markdown table | Stable column widths and mobile scrolling | To check |

## Quote and Task List Test

> This is a quote used to check whether blockquote borders, spacing, and text color fit the current theme.

- [x] Math formulas have been added
- [x] PDF embedding has been added
- [x] Image embedding has been added
- [x] Regular code blocks have been added
- [x] Collapsible long code block has been added
- [x] Table has been added
- [ ] Check the final result in the browser after build

## Internal Link Test

You can jump from here to [[Document Engineering: Introduction and Writing]] to check whether wikilinks resolve correctly.
