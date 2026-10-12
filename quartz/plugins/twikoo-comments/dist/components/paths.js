// Keep these values unchanged: they are the keys already stored in Twikoo.
// Only public article paths belong here, never exported comment/user data.
export const legacyPaths = Object.freeze({
  "/": "/posts/about-me",
  "/02engineering/structure/plasticity-2": "/posts/elastoplastic-mechanics-2",
  "/05tools/obsidian-mizuki": "/posts/obsidianmizuki",
  "/01code/github-profile": "/posts/github-profile",
  "/05tools/mcm-template": "/posts/latex-mcm-template",
})

function normalizePath(value) {
  const result = "/" + String(value).replace(/^\/+|\/+$/g, "")
  return result === "/index" ? "/" : result.replace(/\/index$/, "") || "/"
}

export function canonicalPath(data) {
  if (data.frontmatter?.translations?.zh) return normalizePath(data.frontmatter.translations.zh)
  return normalizePath(data.slug)
}

export function commentPath(data) {
  const custom = data.frontmatter?.commentPath
  if (custom) {
    if (typeof custom !== "string" || !custom.startsWith("/") || custom.startsWith("//")) {
      throw new Error("commentPath must be a site-relative discussion identifier")
    }
    return custom
  }
  const canonical = canonicalPath(data)
  // New articles use their slug basename so moving category folders does not
  // create a new discussion. Renaming the article needs a fixed commentPath.
  return legacyPaths[canonical] ?? `/notes/${canonical.split("/").at(-1) || "home"}`
}

export function isCommentable(data) {
  const fm = data.frontmatter ?? {}
  const slug = String(data.slug ?? "")
  if (!slug || fm.comments === false || fm.comments === "false") return false
  if (fm.draft || fm.unlisted || fm.encrypted || data.unlisted || data.encrypted) return false
  if (slug === "404" || slug === "tags" || slug.startsWith("tags/")) return false
  if (/\/index$/.test(slug)) return false
  if (data.relativePath && !data.relativePath.endsWith(".md")) return false
  return true
}
