import { fromHtml } from "hast-util-from-html"

const omittedTags = new Set(["pre", "script", "style", "template", "svg", "math", "img"])
const blockTags = new Set([
  "p",
  "div",
  "section",
  "article",
  "blockquote",
  "li",
  "td",
  "th",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "br",
  "hr",
])

export function proseText(node) {
  if (!node) return ""
  if (node.type === "text") return node.value
  if (node.type === "raw") return proseText(fromHtml(node.value, { fragment: true }))
  if (node.type === "comment") return ""
  const properties = node.properties ?? {}
  const classes = Array.isArray(properties.className)
    ? properties.className
    : String(properties.className ?? "").split(/\s+/)
  if (
    omittedTags.has(node.tagName) ||
    properties.hidden === true ||
    String(properties.ariaHidden) === "true" ||
    properties.dataFootnoteRef !== undefined ||
    properties.dataFootnoteBackref !== undefined ||
    classes.some((name) => /^(katex(?:-|$)|math(?:-|$)|mermaid$|transclude$)/.test(name))
  )
    return " "

  const text = (node.children ?? []).map(proseText).join("")
  // Autolinks display their destination rather than an authored link label.
  if (node.tagName === "a" && /^(?:https?:\/\/|www\.|mailto:)/i.test(text.trim())) return " "
  return blockTags.has(node.tagName) ? ` ${text} ` : text
}

export function countProse(text) {
  const clean = String(text)
    .normalize("NFC")
    .replace(/(?:https?:\/\/|www\.|mailto:)[^\s<>，。！？；：、（）【】“”‘’]+/gi, " ")
  const chinese = clean.match(/\p{Script=Han}/gu)?.length ?? 0
  const words =
    clean
      .replace(/\p{Script=Han}/gu, " ")
      .match(/\p{N}+(?:[.,]\p{N}+)+|[\p{L}\p{N}]+(?:['’\-\u2011][\p{L}\p{N}]+)*/gu)?.length ?? 0
  return chinese + words
}

export function hasBodyContent(node) {
  if (!node) return false
  if (node.type === "text") return Boolean(String(node.value).trim())
  if (node.type === "raw") return hasBodyContent(fromHtml(node.value, { fragment: true }))
  if (node.type === "comment") return false
  const properties = node.properties ?? {}
  if (["script", "style", "template"].includes(node.tagName) || properties.hidden === true)
    return false
  if (["img", "audio", "video", "iframe", "object"].includes(node.tagName))
    return Boolean(properties.src || properties.data)
  return (node.children ?? []).some(hasBodyContent)
}

export function publishedSummary(allFiles = [], locale = "zh-CN") {
  const language = String(locale).toLowerCase().startsWith("zh") ? "zh" : "en"
  const seen = new Set()
  let total = 0
  let notes = 0
  for (const data of allFiles) {
    const fm = data.frontmatter ?? {}
    const relative = String(data.relativePath ?? "").replaceAll("\\", "/")
    const measurement = data.publishedWordCount
    if (
      fm.draft !== false ||
      fm.unlisted ||
      fm.encrypted ||
      data.unlisted ||
      data.encrypted ||
      !data.filePath ||
      !/\.md$/i.test(relative) ||
      /\/index\.md$/i.test(relative) ||
      data.slug === "404" ||
      String(data.slug).startsWith("tags/") ||
      measurement?.language !== language ||
      !Number.isSafeInteger(measurement?.count) ||
      measurement.count < 0 ||
      seen.has(data.filePath)
    )
      continue
    seen.add(data.filePath)
    total += measurement.count
    if (
      !/^00aboutme\//i.test(relative) &&
      !/^index\.md$/i.test(relative) &&
      (measurement.hasBody === true || (measurement.hasBody !== false && measurement.count > 0))
    )
      notes++
  }
  return { words: total, notes }
}

export function publishedTotal(allFiles, locale) {
  return publishedSummary(allFiles, locale).words
}
