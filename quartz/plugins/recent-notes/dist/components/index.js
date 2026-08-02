import { jsx } from "preact/jsx-runtime"

const css = `
.recent-notes {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  min-height: 1.2rem;
  flex: 0 1 auto;
}

.recent-notes.collapsed {
  flex: 0 1 1.2rem;
}

.recent-notes.collapsed .fold {
  transform: rotateZ(-90deg);
}

.recent-notes .fold {
  display: block;
  flex: 0 0 auto;
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  opacity: 0.8;
}

.recent-notes-toggle {
  background-color: transparent;
  border: none;
  color: var(--dark);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  text-align: left;
}

.recent-notes-toggle h3 {
  display: inline-block;
  margin: 0;
  font-size: 1rem;
  line-height: 1.2rem;
}

.recent-notes.collapsed > ul.recent-ul,
.recent-notes.collapsed > p {
  display: none;
}

.recent-notes > ul.recent-ul {
  list-style: none;
  margin-top: 1rem;
  padding-left: 0;
}

.recent-notes > ul.recent-ul > li {
  margin: 1rem 0;
}

.recent-notes > ul.recent-ul > li .section > .desc > h3 > a {
  background-color: transparent;
}

.recent-notes > ul.recent-ul > li .section > .meta {
  margin: 0 0 0.5rem 0;
  opacity: 0.6;
}
`

const script = `
function setupRecentNotes() {
  for (const button of document.querySelectorAll(".recent-notes-toggle")) {
    if (button.dataset.recentNotesBound === "true") continue
    button.dataset.recentNotesBound = "true"

    const recentNotes = button.closest(".recent-notes")
    if (!recentNotes) continue

    button.addEventListener("click", () => {
      const collapsed = recentNotes.classList.toggle("collapsed")
      button.setAttribute("aria-expanded", collapsed ? "false" : "true")
    })
  }
}

document.addEventListener("nav", setupRecentNotes)
document.addEventListener("render", setupRecentNotes)
setupRecentNotes()
`

const defaults = {
  limit: 5,
  linkToMore: false,
  showTags: false,
  showDate: false,
  defaultCollapsed: true,
  hideTagPages: true,
  hideFolderPages: true,
  filter: () => true,
}

function titleForLocale(locale) {
  return String(locale ?? "en-US").toLowerCase().startsWith("zh")
    ? "\u6700\u8fd1\u7684\u7b14\u8bb0"
    : "Recent Notes"
}

function seeMoreText(locale, remaining) {
  return String(locale ?? "en-US").toLowerCase().startsWith("zh")
    ? `\u67e5\u770b\u66f4\u591a${remaining}\u7bc7\u7b14\u8bb0 \u2192`
    : `See ${remaining} more \u2192`
}

function formatDate(date, locale = "en-US") {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function getDate(data, cfg) {
  const dateType = data.defaultDateType ?? cfg?.defaultDateType
  return dateType ? data.dates?.[dateType] : undefined
}

function sortByDateAndTitle(cfg) {
  return (first, second) => {
    const firstDate = getDate(first, cfg)
    const secondDate = getDate(second, cfg)

    if (firstDate && secondDate) {
      return secondDate.getTime() - firstDate.getTime()
    }
    if (firstDate && !secondDate) return -1
    if (!firstDate && secondDate) return 1

    const firstTitle = String(first.frontmatter?.title ?? "").toLowerCase()
    const secondTitle = String(second.frontmatter?.title ?? "").toLowerCase()
    return firstTitle.localeCompare(secondTitle, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }
}

function endsWithPath(value, suffix) {
  return value === suffix || value.endsWith(`/${suffix}`)
}

function isFolderPath(value) {
  return (
    value.endsWith("/") ||
    endsWithPath(value, "index") ||
    endsWithPath(value, "index.md") ||
    endsWithPath(value, "index.html")
  )
}

function isTagPageSlug(slug) {
  if (!slug) return false
  return slug === "tags" || slug === "tags/index" || slug.startsWith("tags/")
}

function isFolderPageSlug(slug) {
  return slug ? isFolderPath(slug) : false
}

function filterListedPages(pages) {
  return pages.filter((page) => page.unlisted !== true)
}

function stripSlashes(value, onlyStripPrefix = false) {
  let result = String(value ?? "")
  if (result.startsWith("/")) result = result.substring(1)
  if (!onlyStripPrefix && result.endsWith("/")) result = result.slice(0, -1)
  return result
}

function trimSuffix(value, suffix) {
  let result = String(value ?? "")
  if (endsWithPath(result, suffix)) {
    result = result.slice(0, -suffix.length)
  }
  return result
}

function simplifySlug(slug) {
  const result = stripSlashes(trimSuffix(slug, "index"), true)
  return result.length === 0 ? "/" : result
}

function joinSegments(...segments) {
  if (segments.length === 0) return ""

  let joined = segments
    .filter((segment) => segment !== "" && segment !== "/")
    .map((segment) => stripSlashes(segment))
    .join("/")

  const first = segments[0]
  const last = segments[segments.length - 1]
  if (String(first ?? "").startsWith("/")) joined = `/${joined}`
  if (String(last ?? "").endsWith("/")) joined = `${joined}/`
  return joined
}

function pathToRoot(slug) {
  const rootPath = String(slug ?? "")
    .split("/")
    .filter((segment) => segment !== "")
    .slice(0, -1)
    .map(() => "..")
    .join("/")

  return rootPath.length === 0 ? "." : rootPath
}

function resolveRelative(current, target) {
  return joinSegments(pathToRoot(current), simplifySlug(target))
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function renderFoldIcon() {
  return jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "5 8 14 8",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "fold",
    children: jsx("polyline", { points: "6 9 12 15 18 9" }),
  })
}

export function RecentNotes(userOpts = {}) {
  function Component({ allFiles, fileData, displayClass, cfg }) {
    const opts = {
      ...defaults,
      sort: sortByDateAndTitle(cfg),
      ...userOpts,
    }

    const pages = filterListedPages(allFiles)
      .filter((page) => !opts.hideTagPages || !isTagPageSlug(page.slug))
      .filter((page) => !opts.hideFolderPages || !isFolderPageSlug(page.slug))
      .filter(opts.filter)
      .sort(opts.sort)

    const locale = cfg?.locale ?? "en-US"
    const slug = fileData?.slug ?? "index"
    const remaining = Math.max(0, pages.length - opts.limit)
    const isCollapsed = opts.defaultCollapsed !== false

    return jsx("div", {
      class: classNames(displayClass, "recent-notes", isCollapsed ? "collapsed" : undefined),
      children: [
        jsx("button", {
          type: "button",
          class: "recent-notes-toggle",
          "aria-expanded": isCollapsed ? "false" : "true",
          children: [jsx("h3", { children: opts.title ?? titleForLocale(locale) }), renderFoldIcon()],
        }),
        jsx("ul", {
          class: "recent-ul",
          children: pages.slice(0, opts.limit).map((page) => {
            const title = page.frontmatter?.title ?? "Untitled"
            const tags = page.frontmatter?.tags ?? []
            const date = getDate(page, cfg)

            return jsx("li", {
              class: "recent-li",
              children: jsx("div", {
                class: "section",
                children: [
                  jsx("div", {
                    class: "desc",
                    children: jsx("h3", {
                      children: jsx("a", {
                        href: resolveRelative(slug, page.slug),
                        class: "internal",
                        children: title,
                      }),
                    }),
                  }),
                  opts.showDate &&
                    date &&
                    jsx("p", {
                      class: "meta",
                      children: jsx("time", {
                        datetime: date.toISOString(),
                        children: formatDate(date, locale),
                      }),
                    }),
                  opts.showTags &&
                    jsx("ul", {
                      class: "tags",
                      children: tags.map((tag) =>
                        jsx("li", {
                          children: jsx("a", {
                            class: "internal tag-link",
                            href: resolveRelative(slug, `tags/${tag}`),
                            children: tag,
                          }),
                        }),
                      ),
                    }),
                ],
              }),
            })
          }),
        }),
        opts.linkToMore &&
          remaining > 0 &&
          jsx("p", {
            children: jsx("a", {
              href: resolveRelative(slug, opts.linkToMore),
              children: seeMoreText(locale, remaining),
            }),
          }),
      ],
    })
  }

  Component.css = css
  Component.afterDOMLoaded = script
  return Component
}
