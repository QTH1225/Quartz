import { jsx } from "preact/jsx-runtime"

const metrics = [
  ["busuanzi_site_pv", "总访问量", "Total views"],
  ["busuanzi_site_uv", "总访客数", "Total visitors"],
  ["busuanzi_page_pv", "本页阅读", "Page views"],
  ["busuanzi_page_uv", "本页访客", "Page visitors"],
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem 1rem;
  margin: 0.75rem 0 0;
}
.site-stats dt {
  font-size: 0.8rem;
  line-height: 1.4;
}
.site-stats dd {
  margin: 0.15rem 0 0;
  color: var(--secondary);
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
.site-stats-status {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  line-height: 1.4;
}
.site-stats-status:empty { display: none; }
`

// Same POST endpoint/body and display IDs as the official 3.6.9 script:
// https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js
// That script has a window.busuanziRequestSent one-shot guard. Use its request
// protocol directly so SPA navigation can abort obsolete responses safely.
function installSiteStats() {
  let lastUrl
  let counts
  let controller
  let timer
  let generation = 0

  function currentUrl(host) {
    const url = new URL(window.location.href)
    // Count HTTP/HTTPS and www/apex visits under the configured canonical URL.
    url.protocol = "https:"
    url.hostname = host
    url.port = ""
    url.hash = ""
    url.search = ""
    return url.href
  }

  function showCounts(widget) {
    if (!counts) return
    for (const [key, value] of Object.entries(counts)) {
      if (!/^busuanzi_(site|page)_(pv|uv)$/.test(key)) continue
      if (!/^\d+$/.test(String(value))) continue
      const element = widget.querySelector("#" + key)
      if (element) element.textContent = String(value)
    }
  }

  function cancelRequest() {
    generation++
    controller?.abort()
    clearTimeout(timer)
    if (!counts) lastUrl = undefined
  }

  async function updateSiteStats() {
    const widget = document.querySelector(".site-stats")
    if (!widget) return
    const status = widget.querySelector(".site-stats-status")
    // Only the configured host and its www/apex counterpart are production.
    // Other subdomains and local previews must not generate production visits.
    const normalizeHost = (host) => host.toLowerCase().replace(/^www\./, "")
    if (normalizeHost(window.location.hostname) !== normalizeHost(widget.dataset.siteStatsHost)) {
      status.textContent = widget.dataset.previewText
      return
    }
    const url = currentUrl(widget.dataset.siteStatsHost)
    if (url === lastUrl) {
      showCounts(widget)
      return
    }
    cancelRequest()
    const requestGeneration = generation
    lastUrl = url
    counts = undefined
    status.textContent = ""
    for (const element of widget.querySelectorAll("[id^='busuanzi_']")) {
      element.textContent = "—"
    }
    controller = new AbortController()
    timer = setTimeout(() => controller.abort(), 10000)
    try {
      const response = await fetch("https://cdn.busuanzi.cc/api.php", {
        method: "POST",
        body: JSON.stringify({ url, referrer: document.referrer }),
        signal: controller.signal,
      })
      if (!response.ok) throw new Error("Counter request failed")
      const result = await response.json()
      if (requestGeneration !== generation) return
      if (!result || !/^\d+$/.test(String(result.busuanzi_site_pv))) {
        throw new Error("Invalid counter response")
      }
      counts = result
      showCounts(document.querySelector(".site-stats") ?? widget)
    } catch {
      if (requestGeneration === generation) status.textContent = widget.dataset.errorText
    } finally {
      if (requestGeneration === generation) clearTimeout(timer)
    }
  }

  // Quartz loads component handlers before dispatching its initial nav event.
  // No extra eager request: one navigation produces exactly one PV request.
  document.addEventListener("prenav", cancelRequest)
  document.addEventListener("nav", updateSiteStats)
  document.addEventListener("render", () => {
    const widget = document.querySelector(".site-stats")
    if (widget) showCounts(widget)
  })
}

export function SiteStats() {
  function Component({ cfg, displayClass }) {
    const zh = String(cfg?.locale ?? "zh-CN")
      .toLowerCase()
      .startsWith("zh")
    const host = new URL(`https://${cfg.baseUrl}`).hostname
    return jsx("section", {
      class: ["site-stats", displayClass].filter(Boolean).join(" "),
      "aria-label": zh ? "网站统计" : "Site statistics",
      "data-site-stats-host": host,
      "data-preview-text": zh ? "本地预览不计入统计" : "Preview visits are not counted",
      "data-error-text": zh ? "统计暂不可用" : "Statistics temporarily unavailable",
      children: [
        jsx("div", {
          class: "site-stats-header",
          children: [
            jsx("h3", { children: zh ? "网站统计" : "Site statistics" }),
            jsx("a", {
              href: "https://www.busuanzi.cc/",
              target: "_blank",
              rel: "noopener noreferrer",
              "data-no-popover": true,
              children: zh ? "不蒜子" : "Busuanzi",
            }),
          ],
        }),
        jsx("dl", {
          children: metrics.map(([id, chinese, english]) =>
            jsx("div", {
              children: [
                jsx("dt", { children: zh ? chinese : english }),
                jsx("dd", { children: jsx("span", { id, children: "—" }) }),
              ],
            }),
          ),
        }),
        jsx("p", { class: "site-stats-status", role: "status", children: "" }),
      ],
    })
  }
  Component.css = css
  Component.afterDOMLoaded = `(${installSiteStats.toString()})();`
  return Component
}
