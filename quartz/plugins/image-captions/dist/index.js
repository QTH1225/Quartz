export const manifest = {
  name: "image-captions",
  displayName: "Image Captions",
  description: "Render standalone Markdown images with alt text as figure captions.",
  version: "1.0.0",
  category: "transformer",
}

function isWhitespace(node) {
  return node?.type === "text" && String(node.value ?? "").trim() === ""
}

function textContent(node) {
  if (!node) return ""
  if (node.type === "text") return String(node.value ?? "")
  if (!Array.isArray(node.children)) return ""
  return node.children.map(textContent).join("")
}

function captionFromAlt(value) {
  const raw = String(value ?? "").trim()
  if (!raw) return ""

  // Obsidian image dimensions are often encoded as `alt|300` or `alt|300x200`.
  return raw.replace(/\|\s*\d+(?:x\d+)?\s*$/i, "").trim()
}

function asCaptionFigure(paragraph) {
  const meaningful = (paragraph.children ?? []).filter((child) => !isWhitespace(child))
  if (meaningful.length === 0) return undefined

  const image = meaningful[0]
  if (image?.type !== "element" || image.tagName !== "img") return undefined

  let caption = captionFromAlt(image.properties?.alt)
  if (!caption) return undefined

  if (meaningful.length === 2) {
    const maybeCaption = meaningful[1]
    if (maybeCaption?.type !== "element" || maybeCaption.tagName !== "em") return undefined

    const explicitCaption = textContent(maybeCaption).trim()
    if (explicitCaption) caption = explicitCaption
  } else if (meaningful.length !== 1) {
    return undefined
  }

  return {
    type: "element",
    tagName: "figure",
    properties: { className: ["image-caption"] },
    children: [
      image,
      {
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: [{ type: "text", value: caption }],
      },
    ],
  }
}

function transformImageCaptions() {
  return (tree) => {
    function walk(parent) {
      if (!Array.isArray(parent?.children)) return

      parent.children = parent.children.map((child) => {
        if (child?.type === "element" && child.tagName === "p") {
          return asCaptionFigure(child) ?? child
        }

        walk(child)
        return child
      })
    }

    walk(tree)
  }
}

export default function ImageCaptions() {
  return {
    name: "ImageCaptions",
    htmlPlugins() {
      return [transformImageCaptions]
    },
  }
}
