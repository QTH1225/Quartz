import { jsx } from "preact/jsx-runtime"

const defaults = {
  roots: {
    zh: "/",
    en: "/en/",
  },
  labels: {
    zh: "中",
    en: "EN",
  },
}

const css = `
.language-switch {
  align-items: center;
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  box-sizing: border-box;
  color: var(--darkgray);
  display: inline-flex;
  flex-shrink: 0;
  font-family: var(--interfaceFont);
  font-size: 0.78rem;
  font-weight: 600;
  height: 24px;
  justify-content: center;
  line-height: 1;
  min-width: 28px;
  padding: 0 0.35rem;
}

.language-switch:hover {
  border-color: var(--tertiary);
  color: var(--tertiary);
}
`

function languageFromLocale(locale) {
  return String(locale ?? "en-US").toLowerCase().startsWith("zh") ? "zh" : "en"
}

function normalizeRoot(root) {
  let value = String(root || "/")
  if (!/^https?:\/\//.test(value) && !value.startsWith("/")) {
    value = `/${value}`
  }
  return value.endsWith("/") ? value : `${value}/`
}

function normalizePath(value, root) {
  if (!value) return undefined
  const raw = String(value)
  if (/^https?:\/\//.test(raw) || raw.startsWith("/")) return raw
  return `${normalizeRoot(root)}${raw.replace(/^\/+/, "")}`
}

function mirrorPath(slug, root) {
  const cleanSlug = String(slug || "index").replace(/\/index$/, "")
  if (!cleanSlug || cleanSlug === "index") return normalizeRoot(root)
  return `${normalizeRoot(root)}${cleanSlug.replace(/^\/+/, "").replace(/\/?$/, "/")}`
}

export function LanguageSwitch(userOpts = {}) {
  const opts = {
    roots: { ...defaults.roots, ...(userOpts.roots ?? {}) },
    labels: { ...defaults.labels, ...(userOpts.labels ?? {}) },
  }

  function Component({ cfg, displayClass, fileData }) {
    const frontmatter = fileData?.frontmatter ?? {}
    const current = languageFromLocale(frontmatter.lang ?? cfg?.locale)
    const target = current === "zh" ? "en" : "zh"
    const root = opts.roots[target]
    const translations = frontmatter.translations ?? {}
    const href = normalizePath(translations[target], root) ?? mirrorPath(fileData?.slug, root)
    const label = opts.labels[target] ?? target.toUpperCase()
    const title = target === "zh" ? "切换到中文" : "Switch to English"
    const className = [displayClass, "language-switch"].filter(Boolean).join(" ")

    return jsx("a", {
      class: className,
      href,
      "aria-label": title,
      title,
      "data-router-ignore": true,
      "data-no-popover": true,
      children: label,
    })
  }

  Component.css = css
  return Component
}
