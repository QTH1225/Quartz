import assert from "node:assert/strict"
import test from "node:test"
import vm from "node:vm"
import render from "preact-render-to-string"
import { build } from "esbuild"
import { fileURLToPath } from "node:url"
import { SiteStats } from "./dist/components/index.js"
import { goatCounterPath, installGoatCounter } from "../../util/goatcounter.js"

const origin = "https://tianhao.goatcounter.com"
const ids = ["goatcounter_site_count", "goatcounter_page_count"]
const cfg = {
  locale: "zh-CN",
  baseUrl: "tianhao.blog",
  analytics: { provider: "goatcounter", websiteId: "tianhao" },
}

function widget() {
  const elements = Object.fromEntries(ids.map((id) => [id, { textContent: "—" }]))
  const status = { textContent: "" }
  const retry = { hidden: true }
  return {
    elements,
    status,
    retry,
    dataset: {
      siteStatsHost: "tianhao.blog",
      goatcounterOrigin: origin,
      numberLocale: "zh-CN",
      previewText: "预览不记录访问",
      errorText: "统计暂不可用",
      permissionText: "请开启公开计数",
      missingText: "尚无公开计数",
    },
    querySelector: (selector) =>
      selector === ".site-stats-status"
        ? status
        : selector === ".site-stats-retry"
          ? retry
          : elements[selector.slice(1)],
    querySelectorAll: () => Object.values(elements),
  }
}
function browser(href = "https://tianhao.blog/", tracking = false) {
  const listeners = new Map(),
    requests = [],
    scripts = [],
    visits = [],
    timers = new Map()
  let timerId = 0
  const state = { widget: widget(), filtered: false }
  const location = new URL(href)
  const context = {
    URL,
    AbortController,
    window: { location },
    document: {
      title: "Test page",
      referrer: "https://example.org/",
      querySelector: () => state.widget,
      addEventListener: (name, handler) => {
        if (!listeners.has(name)) listeners.set(name, [])
        listeners.get(name).push(handler)
      },
      createElement: () => ({
        attrs: {},
        setAttribute(key, value) {
          this.attrs[key] = value
        },
      }),
      head: { appendChild: (script) => scripts.push(script) },
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
  const installTracking = () =>
    vm.runInNewContext(
      "(" +
        installGoatCounter.toString() +
        ")(" +
        JSON.stringify({
          productionHost: "tianhao.blog",
          endpoint: origin + "/count",
          scriptSrc: "https://gc.zgo.at/count.v5.js",
        }) +
        ", " +
        goatCounterPath.toString() +
        ")",
      context,
    )
  if (tracking) installTracking()
  const event = (name, value) =>
    Promise.all((listeners.get(name) ?? []).map((handler) => handler(value)))
  return {
    state,
    requests,
    scripts,
    visits,
    timers,
    location,
    event,
    installTracking,
    runScript: (script) => vm.runInNewContext(script, context),
    load: () => {
      context.window.goatcounter.count = (value) => visits.push({ ...value })
      context.window.goatcounter.filter = () => state.filtered
      scripts[0].onload()
    },
    navigate: (path) => {
      event("prenav")
      location.href = new URL(path, location).href
      state.widget = widget()
      return event("nav")
    },
  }
}
function respond(request, count = "12", status = 200) {
  request.resolve({
    status,
    ok: status === 200,
    json: async () => ({ count, count_unique: "999" }),
  })
}
function respondPair(b, offset = 0, total = "12", page = "34") {
  respond(b.requests[offset], total)
  respond(b.requests[offset + 1], page)
}
test("both locales render two visits, note/word rows and no separate UV", () => {
  const allFiles = [
    {
      filePath: "/zh/article.md",
      relativePath: "article.md",
      frontmatter: { draft: false },
      publishedWordCount: { language: "zh", count: 12345 },
    },
    {
      filePath: "/en/article.md",
      relativePath: "article.md",
      frontmatter: { draft: false },
      publishedWordCount: { language: "en", count: 4567 },
    },
  ]
  for (const [locale, count, label] of [
    ["zh-CN", 12345, "全站访问计数"],
    ["en-US", 4567, "Site visits"],
  ]) {
    const html = render(SiteStats()({ cfg: { ...cfg, locale }, allFiles }))
    assert.ok(html.includes(label))
    assert.ok(html.includes('data-goatcounter-origin="' + origin + '"'))
    for (const id of ids) assert.equal(html.split('id="' + id + '"').length - 1, 1)
    assert.ok(!/busuanzi|Total visitors|今日访问|今日访客/.test(html))
    assert.ok(html.includes('data-published-word-count="' + count + '"'))
    assert.ok(html.includes('data-published-note-count="1"'))
    assert.ok(html.includes(count.toLocaleString("en-US")))
    assert.ok(html.indexOf("site-stats-note-count") > html.indexOf('id="goatcounter_page_count"'))
    assert.ok(html.indexOf("site-stats-note-count") < html.indexOf("site-stats-word-count"))
    assert.ok(!html.includes("<script"))
  }
  assert.ok(SiteStats().css.includes("grid-column: 1 / -1"))
})
test("all statistics use one full-width row, with labels left and values right", () => {
  const css = SiteStats().css
  assert.match(css, /\.site-stats dl \{[^}]*grid-template-columns: minmax\(0, 1fr\);/)
  assert.match(
    css,
    /\.site-stats dl > div \{[^}]*display: flex;[^}]*justify-content: space-between;/,
  )
  assert.match(css, /\.site-stats dd \{[^}]*margin: 0;[^}]*text-align: right;/)
  assert.ok(!css.includes("repeat(2"))
})
test("GET accepts formatted count, ignores count_unique and strips query/fragment/trailing slash", async () => {
  const b = browser("https://www.tianhao.blog/en/?utm_source=test#heading")
  assert.equal(b.requests.length, 0)
  const task = b.event("nav")
  assert.equal(b.requests.length, 2)
  assert.equal(b.requests[0].endpoint, origin + "/counter/TOTAL.json")
  assert.equal(b.requests[1].endpoint, origin + "/counter/%2Fen.json")
  assert.equal(b.requests[0].options.method, "GET")
  assert.equal(b.requests[0].options.credentials, "omit")
  respondPair(b, 0, "12,345", "0")
  await task
  assert.equal(b.state.widget.elements.goatcounter_site_count.textContent, "12,345")
  assert.equal(b.state.widget.elements.goatcounter_page_count.textContent, "0")
  await b.event("render")
  b.location.hash = "#next"
  await b.event("nav")
  assert.equal(b.requests.length, 2)
  assert.equal(b.timers.size, 0)
})
test("SPA aborts and ignores stale results, including same-path pending navigation", async () => {
  for (const path of ["/", "/01Code/article"]) {
    const b = browser()
    const initial = b.event("nav"),
      next = b.navigate(path)
    assert.ok(b.requests[0].options.signal.aborted)
    respondPair(b, 0, "999", "999")
    await initial
    assert.equal(b.state.widget.elements.goatcounter_site_count.textContent, "—")
    respondPair(b, 2, "42", "43")
    await next
    assert.equal(b.state.widget.elements.goatcounter_page_count.textContent, "43")
    const back = b.navigate("/en/")
    respondPair(b, 4)
    await back
    assert.equal(b.requests.length, 6)
  }
})
test("www/apex share site counts; local/preview only read and never collect", async () => {
  for (const host of [
    "tianhao.blog",
    "www.tianhao.blog",
    "localhost:8080",
    "127.0.0.1:8080",
    "preview.tianhao.blog",
    "tianhao.blog.example.org",
    "www.www.tianhao.blog",
  ]) {
    const b = browser("http://" + host + "/", true)
    const task = b.event("nav")
    respondPair(b)
    await task
    const production = ["tianhao.blog", "www.tianhao.blog"].includes(host)
    assert.equal(b.scripts.length, production ? 1 : 0)
    assert.equal(b.state.widget.status.textContent, production ? "" : "预览不记录访问")
    assert.equal(b.visits.length, 0)
  }
})
test("network/invalid/timeout/403 keep placeholders and permit read-only retry", async () => {
  for (const error of ["network", "invalid", "timeout", "403"]) {
    const b = browser()
    const task = b.event("nav")
    if (error === "timeout") {
      ;[...b.timers.values()][0]()
      assert.ok(b.requests[0].options.signal.aborted)
    }
    for (const request of b.requests) {
      if (error === "invalid") respond(request, "12,<img>")
      else if (error === "403") respond(request, "", 403)
      else request.reject(new Error(error))
    }
    await task
    assert.equal(
      b.state.widget.status.textContent,
      error === "403" ? "请开启公开计数" : "统计暂不可用",
    )
    for (const id of ids) assert.equal(b.state.widget.elements[id].textContent, "—")
    assert.equal(b.state.widget.retry.hidden, false)
    const retry = b.event("click", { target: { closest: () => true } })
    respondPair(b, 2)
    await retry
    assert.equal(b.state.widget.retry.hidden, true)
    assert.equal(b.state.widget.elements.goatcounter_site_count.textContent, "12")
    assert.equal(b.timers.size, 0)
  }
})
test("missing page retains site total without a fake zero", async () => {
  const b = browser(),
    task = b.event("nav")
  respond(b.requests[0], "25")
  respond(b.requests[1], "", 404)
  await task
  assert.equal(b.state.widget.elements.goatcounter_site_count.textContent, "25")
  assert.equal(b.state.widget.elements.goatcounter_page_count.textContent, "—")
  assert.equal(b.state.widget.status.textContent, "尚无公开计数")
})
test("tracker load/nav race records once; installation, hash, query and render do not duplicate", async () => {
  for (const loadFirst of [true, false]) {
    const b = browser("https://tianhao.blog/", true)
    b.installTracking()
    assert.equal(b.scripts.length, 1)
    assert.equal(b.scripts[0].attrs["data-persist"], "true")
    assert.equal(JSON.parse(b.scripts[0].attrs["data-goatcounter-settings"]).no_onload, true)
    if (loadFirst) b.load()
    const task = b.event("nav")
    if (!loadFirst) b.load()
    respondPair(b)
    await task
    assert.equal(b.visits.length, 1)
    assert.equal(b.visits[0].path, "/")
    b.location.hash = "#next"
    await b.event("nav")
    b.location.search = "?test=1"
    await b.event("nav")
    await b.event("render")
    assert.equal(b.visits.length, 1)
    const next = b.navigate("/en/01Code/article/")
    respondPair(b, 2)
    await next
    assert.equal(b.visits.length, 2)
    assert.equal(b.visits[1].path, "/en/01Code/article")
    assert.equal(b.visits[1].referrer, "https://tianhao.blog/")
    const back = b.navigate("/")
    respondPair(b, 4)
    await back
    assert.equal(b.visits.length, 3)
  }
})
test("late script load counts current page only and respects prerender/opt-out filtering", async () => {
  const b = browser("https://tianhao.blog/", true),
    first = b.event("nav")
  respondPair(b)
  await first
  const next = b.navigate("/en/")
  respondPair(b, 2)
  await next
  b.state.filtered = "prerender"
  b.load()
  assert.equal(b.visits.length, 0)
  b.state.filtered = false
  await b.event("visibilitychange")
  assert.equal(b.visits.length, 1)
  assert.equal(b.visits[0].path, "/en")
})
test("collection works without a sidebar, independently of public-counter permission", async () => {
  const b = browser("https://www.tianhao.blog/01Code/test", true)
  b.state.widget = null
  b.load()
  await b.event("nav")
  assert.equal(b.requests.length, 0)
  assert.equal(b.visits.length, 1)
})

test("browser-bundled tracker has no missing Node keepNames helpers and does not block initialization", async () => {
  const result = await build({
    entryPoints: [
      fileURLToPath(new URL("../../components/scripts/goatcounter.inline.ts", import.meta.url)),
    ],
    bundle: true,
    minify: true,
    platform: "browser",
    format: "esm",
    write: false,
  })
  const options = {
    productionHost: "tianhao.blog",
    endpoint: origin + "/count",
    scriptSrc: "https://gc.zgo.at/count.v5.js",
  }
  const source =
    "const __QUARTZ_GOATCOUNTER_OPTIONS__ = " +
    JSON.stringify(options) +
    ";\n" +
    result.outputFiles[0].text
  for (const host of ["localhost:8080", "www.tianhao.blog"]) {
    const b = browser("http://" + host + "/")
    assert.doesNotThrow(() => b.runScript(source))
    const task = b.event("nav")
    respondPair(b)
    if (host !== "localhost:8080") b.load()
    await task
    assert.equal(b.scripts.length, host === "localhost:8080" ? 0 : 1)
    assert.equal(b.visits.length, host === "localhost:8080" ? 0 : 1)
  }
})
