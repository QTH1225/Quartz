import assert from "node:assert/strict"
import test from "node:test"
import vm from "node:vm"
import render from "preact-render-to-string"
import { SiteStats } from "./dist/components/index.js"

const ids = ["busuanzi_site_pv", "busuanzi_site_uv", "busuanzi_page_pv", "busuanzi_page_uv"]
const values = {
  busuanzi_today_pv: 10,
  busuanzi_today_uv: 11,
  ...Object.fromEntries(ids.map((id, index) => [id, index + 12])),
}

function widget() {
  const elements = Object.fromEntries(ids.map((id) => [id, { textContent: "—" }]))
  const status = { textContent: "" }
  return {
    elements,
    status,
    dataset: {
      siteStatsHost: "tianhao.blog",
      previewText: "本地预览不计入统计",
      errorText: "统计暂不可用",
    },
    querySelector: (selector) =>
      selector === ".site-stats-status" ? status : elements[selector.slice(1)],
    querySelectorAll: () => Object.values(elements),
  }
}

function browser(href = "https://tianhao.blog/") {
  const listeners = new Map()
  const requests = []
  const timers = new Map()
  let timerId = 0
  const state = { widget: widget() }
  const location = new URL(href)
  const context = {
    URL,
    AbortController,
    window: { location },
    document: {
      referrer: "https://example.org/",
      querySelector: () => state.widget,
      addEventListener: (name, handler) => listeners.set(name, handler),
    },
    fetch: (endpoint, options) =>
      new Promise((resolve, reject) => requests.push({ endpoint, options, resolve, reject })),
    setTimeout: (callback) => {
      timers.set(++timerId, callback)
      return timerId
    },
    clearTimeout: (id) => timers.delete(id),
  }
  vm.runInNewContext(SiteStats().afterDOMLoaded, context)
  return {
    state,
    requests,
    timers,
    location,
    event: (name) => listeners.get(name)?.(),
    navigate: (path) => {
      listeners.get("prenav")?.()
      location.href = new URL(path, location).href
      state.widget = widget()
      return listeners.get("nav")?.()
    },
  }
}

function respond(request, data = values) {
  request.resolve({ ok: true, json: async () => data })
}

test("Chinese and English render four official IDs without today's counters", () => {
  for (const [locale, label] of [
    ["zh-CN", "网站统计"],
    ["en-US", "Site statistics"],
  ]) {
    const html = render(SiteStats()({ cfg: { locale, baseUrl: "tianhao.blog/en" } }))
    assert.ok(html.includes(label))
    assert.ok(html.includes('data-site-stats-host="tianhao.blog"'))
    for (const id of ids) assert.equal(html.split(`id="${id}"`).length - 1, 1)
    assert.ok(!html.includes("busuanzi_today_"))
    assert.ok(!/今日访问|今日访客|Views today|Visitors today/.test(html))
    assert.ok(!html.includes("<script"))
  }
})

test("initial nav counts once using the official POST protocol; render/hash do not count", async () => {
  const b = browser()
  assert.equal(b.requests.length, 0)
  const first = b.event("nav")
  assert.equal(b.requests.length, 1)
  assert.equal(b.requests[0].endpoint, "https://cdn.busuanzi.cc/api.php")
  assert.equal(b.requests[0].options.method, "POST")
  assert.deepEqual(JSON.parse(b.requests[0].options.body), {
    url: "https://tianhao.blog/",
    referrer: "https://example.org/",
  })
  respond(b.requests[0])
  await first
  for (const id of ids) assert.equal(b.state.widget.elements[id].textContent, String(values[id]))
  b.event("render")
  b.location.hash = "#section"
  await b.event("nav")
  b.location.search = "?utm_source=test"
  await b.event("nav")
  assert.equal(b.requests.length, 1)
  assert.equal(b.timers.size, 0)
})

test("SPA forward/back updates page counts and ignores stale responses", async () => {
  const b = browser()
  const initial = b.event("nav")
  const next = b.navigate("/01Code/article")
  assert.ok(b.requests[0].options.signal.aborted)
  respond(b.requests[0], { ...values, busuanzi_page_pv: 999 })
  await initial
  assert.equal(b.state.widget.elements.busuanzi_page_pv.textContent, "—")
  respond(b.requests[1], { ...values, busuanzi_page_pv: 42 })
  await next
  assert.equal(b.state.widget.elements.busuanzi_page_pv.textContent, "42")
  const back = b.navigate("/")
  assert.equal(b.requests.length, 3)
  respond(b.requests[2])
  await back
  assert.equal(b.state.widget.elements.busuanzi_page_pv.textContent, "14")
})

test("a same-page navigation after aborting a pending load does not leave the counter stuck", async () => {
  const b = browser()
  const initial = b.event("nav")
  const next = b.navigate("/")
  b.requests[0].reject(new Error("aborted"))
  await initial
  respond(b.requests[1])
  await next
  assert.equal(b.state.widget.elements.busuanzi_site_pv.textContent, "12")
})

test("local/preview hosts do not contact Busuanzi", async () => {
  for (const host of ["localhost:8080", "127.0.0.1:8080", "preview.example.org"]) {
    const b = browser(`http://${host}/`)
    await b.event("nav")
    assert.equal(b.requests.length, 0)
    assert.equal(b.state.widget.status.textContent, "本地预览不计入统计")
  }
})

test("English paths retain the common domain and their distinct page URL", async () => {
  const b = browser("https://tianhao.blog/en/01Code/article#heading")
  const task = b.event("nav")
  assert.equal(JSON.parse(b.requests[0].options.body).url, "https://tianhao.blog/en/01Code/article")
  respond(b.requests[0])
  await task
})

test("network failure, invalid responses and timeout keep placeholders, not fake zeros", async () => {
  for (const failure of ["network", "invalid", "timeout"]) {
    const b = browser()
    const task = b.event("nav")
    if (failure === "invalid") respond(b.requests[0], { error: "unavailable" })
    else {
      if (failure === "timeout") {
        ;[...b.timers.values()][0]()
        assert.ok(b.requests[0].options.signal.aborted)
      }
      b.requests[0].reject(new Error(failure))
    }
    await task
    assert.equal(b.state.widget.status.textContent, "统计暂不可用")
    for (const id of ids) assert.equal(b.state.widget.elements[id].textContent, "—")
    assert.equal(b.timers.size, 0)
  }
})
