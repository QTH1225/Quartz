import { jsx } from "preact/jsx-runtime"
import { publishedSummary } from "../../../published-word-count/dist/count.js"
import { goatCounterPath } from "../../../../util/goatcounter.js"

const metrics = [
  ["goatcounter_site_count", "全站访问计数", "Site visits"],
  ["goatcounter_page_count", "本页访问计数", "Page visits"],
]

const css = `
.site-stats {
  flex: 0 0 auto;
  min-width: 0;
  color: var(--darkgray);
}
.site-stats-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}
.site-stats-header h3 {
  margin: 0;
  font-size: 1rem;
}
.site-stats-header a {
  font-size: 0.75rem;
  font-weight: normal;
  background: transparent;
  color: var(--gray);
}
.site-stats dl {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.6rem;
  margin: 0.75rem 0 0;
}
.site-stats dt {
  font-size: 0.8rem;
  line-height: 1.4;
}
.site-stats dd {
  margin: 0;
  text-align: right;
  color: var(--secondary);
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
.site-stats dl > div {
  grid-column: 1 / -1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
}
.site-stats .site-stats-note-count {
  padding-top: 0.6rem;
  border-top: 1px solid var(--lightgray);
}
.site-stats-word-count .site-stats-word-unit,
.site-stats-note-count .site-stats-note-unit {
  font-size: 0.75rem;
  font-weight: normal;
  color: var(--gray);
}
.site-stats-status {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  line-height: 1.4;
}
.site-stats-status:empty { display: none; }
.site-stats-retry {
  border: 0;
  background: transparent;
  color: var(--secondary);
  padding: 0;
  font-family: inherit;
  font-size: 0.75rem;
  text-decoration: underline;
  cursor: pointer;
}
.site-stats-retry[hidden] { display: none; }
`

// Public JSON reads do not record visits. Tracking is handled independently,
// including on mobile and pages without a sidebar, by ComponentResources.
function installSiteStats(pagePath) {
  let lastPath
  let counts
  let controller
  let timer
  let generation = 0

  function showCounts(widget) {
    if (!counts || pagePath(window.location.pathname) !== lastPath) return
    for (const [index, scope] of ["site", "page"].entries()) {
      const element = widget.querySelector(`#goatcounter_${scope}_count`)
      element.textContent = counts[index].value ?? "—"
    }
    const normalizeHost = (host) => host.toLowerCase().replace(/^www\./, "")
    const preview =
      normalizeHost(window.location.hostname) !== normalizeHost(widget.dataset.siteStatsHost)
    const errors = counts.map((result) => result.error).filter(Boolean)
    const message = errors.includes("permission")
      ? widget.dataset.permissionText
      : errors.includes("unavailable")
        ? widget.dataset.errorText
        : errors.includes("missing")
          ? widget.dataset.missingText
          : ""
    widget.querySelector(".site-stats-status").textContent = [
      preview ? widget.dataset.previewText : "",
      message,
    ]
      .filter(Boolean)
      .join(" ")
    widget.querySelector(".site-stats-retry").hidden = errors.length === 0
  }

  function cancelRequest() {
    generation++
    controller?.abort()
    clearTimeout(timer)
    if (!counts) lastPath = undefined
  }

  async function updateSiteStats(force = false) {
    const widget = document.querySelector(".site-stats")
    if (!widget) return
    const status = widget.querySelector(".site-stats-status")
    if (!widget.dataset.goatcounterOrigin) {
      status.textContent = widget.dataset.errorText
      return
    }
    const path = pagePath(window.location.pathname)
    if (!force && path === lastPath) {
      showCounts(widget)
      return
    }
    cancelRequest()
    const requestGeneration = generation
    lastPath = path
    counts = undefined
    status.textContent = ""
    widget.querySelector(".site-stats-retry").hidden = true
    for (const element of widget.querySelectorAll("[id^='goatcounter_']")) {
      element.textContent = "—"
    }
    controller = new AbortController()
    const requestController = controller
    timer = setTimeout(() => requestController.abort(), 10000)
    try {
      const results = await Promise.all(
        ["TOTAL", path].map(async (key) => {
          try {
            const response = await fetch(
              `${widget.dataset.goatcounterOrigin}/counter/${encodeURIComponent(key)}.json`,
              { method: "GET", credentials: "omit", signal: requestController.signal },
            )
            if (response.status === 403) return { error: "permission" }
            if (response.status === 404) return { error: "missing" }
            if (!response.ok) throw new Error("Counter request failed")
            const result = await response.json()
            // Official JSON formats numbers with thousands separators.
            const value = String(result?.count ?? "")
            if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value)) throw new Error("Invalid counter")
            const number = Number(value.replaceAll(",", ""))
            if (!Number.isSafeInteger(number) || number < 0) throw new Error("Invalid counter")
            return { value: number.toLocaleString(widget.dataset.numberLocale) }
          } catch {
            return { error: "unavailable" }
          }
        }),
      )
      if (requestGeneration !== generation) return
      counts = results
      showCounts(document.querySelector(".site-stats") ?? widget)
    } finally {
      if (requestGeneration === generation) clearTimeout(timer)
    }
  }

  // Quartz loads component handlers before dispatching its initial nav event.
  // No extra eager request; reads and retries cannot increase visit counts.
  document.addEventListener("prenav", cancelRequest)
  document.addEventListener("nav", () => updateSiteStats())
  document.addEventListener("click", (event) => {
    if (event.target?.closest?.(".site-stats-retry")) return updateSiteStats(true)
  })
  document.addEventListener("render", () => {
    const widget = document.querySelector(".site-stats")
    if (widget) showCounts(widget)
  })
}

export function SiteStats() {
  function Component({ cfg, allFiles, displayClass }) {
    const zh = String(cfg?.locale ?? "zh-CN")
      .toLowerCase()
      .startsWith("zh")
    const host = new URL(`https://${cfg.baseUrl}`).hostname
    const analytics = cfg.analytics
    const origin =
      analytics?.provider === "goatcounter"
        ? `https://${analytics.websiteId}.${analytics.host ?? "goatcounter.com"}`
        : ""
    const { words: total, notes } = publishedSummary(allFiles, cfg.locale)
    return jsx("section", {
      class: ["site-stats", displayClass].filter(Boolean).join(" "),
      "aria-label": zh ? "网站统计" : "Site statistics",
      "data-site-stats-host": host,
      "data-goatcounter-origin": origin,
      "data-number-locale": zh ? "zh-CN" : "en-US",
      "data-preview-text": zh
        ? "预览：显示线上计数，不记录访问。"
        : "Preview: live counters, visits not recorded.",
      "data-error-text": zh
        ? "统计暂不可用，请检查公开计数设置或网络。"
        : "Statistics unavailable; check public counter settings or your connection.",
      "data-permission-text": zh
        ? "请在 GoatCounter 开启公开计数。"
        : "Enable public visitor counters in GoatCounter.",
      "data-missing-text": zh
        ? "尚无公开计数，新页面可能需要等待数据更新。"
        : "No public count yet; new pages may need time to update.",
      children: [
        jsx("div", {
          class: "site-stats-header",
          children: [
            jsx("h3", { children: zh ? "网站统计" : "Site statistics" }),
            jsx("a", {
              href: "https://www.goatcounter.com/",
              target: "_blank",
              rel: "noopener noreferrer",
              "data-no-popover": true,
              children: "GoatCounter",
            }),
          ],
        }),
        jsx("dl", {
          children: [
            ...metrics.map(([id, chinese, english]) =>
              jsx("div", {
                title: zh
                  ? "GoatCounter 访问计数，公开数值最多缓存四小时；不是独立的 PV/UV 指标。"
                  : "GoatCounter visits, not separate PV/UV metrics; public counts are cached for up to four hours.",
                children: [
                  jsx("dt", { children: zh ? chinese : english }),
                  jsx("dd", { children: jsx("span", { id, children: "—" }) }),
                ],
              }),
            ),
            jsx("div", {
              class: "site-stats-note-count",
              title: zh
                ? "有正文且 draft 为 false 的已发布笔记，不含关于我文件夹、根目录首页、空页、目录页和隐藏内容。"
                : "Published notes with content and draft: false; excludes the about folder, root homepage, empty, directory and hidden pages.",
              children: [
                jsx("dt", { children: zh ? "已发布笔记" : "Published notes" }),
                jsx("dd", {
                  children: [
                    jsx("span", {
                      "data-published-note-count": notes,
                      children: notes.toLocaleString(zh ? "zh-CN" : "en-US"),
                    }),
                    " ",
                    jsx("span", { class: "site-stats-note-unit", children: zh ? "篇" : "notes" }),
                  ],
                }),
              ],
            }),
            jsx("div", {
              class: "site-stats-word-count",
              title: zh
                ? "仅统计已发布正文：汉字按字、英文按词；不含代码块、公式和链接地址。"
                : "Published prose only: words and Chinese characters; excludes code blocks, formulas and URLs.",
              children: [
                jsx("dt", { children: zh ? "已发布字数" : "Published words" }),
                jsx("dd", {
                  children: [
                    jsx("span", {
                      "data-published-word-count": total,
                      children: total.toLocaleString(zh ? "zh-CN" : "en-US"),
                    }),
                    " ",
                    jsx("span", { class: "site-stats-word-unit", children: zh ? "字" : "words" }),
                  ],
                }),
              ],
            }),
          ],
        }),
        jsx("p", { class: "site-stats-status", role: "status", children: "" }),
        jsx("button", {
          class: "site-stats-retry",
          type: "button",
          hidden: true,
          children: zh ? "重试" : "Retry",
        }),
      ],
    })
  }
  Component.css = css
  Component.afterDOMLoaded = `(${installSiteStats.toString()})(${goatCounterPath.toString()});`
  return Component
}
