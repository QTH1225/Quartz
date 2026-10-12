import assert from "node:assert/strict"
import test from "node:test"
import vm from "node:vm"
import render from "preact-render-to-string"
import { TwikooComments } from "./dist/components/index.js"
import { canonicalPath, commentPath, isCommentable, legacyPaths } from "./dist/components/paths.js"

const envId = "https://twikoocom.netlify.app/.netlify/functions/twikoo"

test("five existing discussions retain their exact old keys in both languages", () => {
  for (const [route, legacy] of Object.entries(legacyPaths)) {
    const slug = route === "/" ? "index" : route.slice(1)
    assert.equal(commentPath({ slug, frontmatter: { lang: "zh-CN" } }), legacy)
    const en = { slug, frontmatter: { lang: "en-US", translations: { zh: route } } }
    assert.equal(canonicalPath(en), route)
    assert.equal(commentPath(en), legacy)
  }
})

test("new discussions survive folder moves; explicit identifiers survive renames", () => {
  assert.equal(commentPath({ slug: "01code/example" }), "/notes/example")
  assert.equal(commentPath({ slug: "05tools/example" }), "/notes/example")
  assert.equal(
    commentPath({ slug: "05tools/renamed", frontmatter: { commentPath: "/notes/example" } }),
    "/notes/example",
  )
  assert.throws(() =>
    commentPath({ slug: "example", frontmatter: { commentPath: "https://example.org" } }),
  )
})

test("drafts, private pages, directory/tag pages and disabled comments are excluded", () => {
  for (const slug of ["404", "tags/index", "tags/tools", "05tools/index"]) {
    assert.equal(isCommentable({ slug }), false)
  }
  for (const frontmatter of [
    { draft: true },
    { unlisted: true },
    { encrypted: true },
    { comments: false },
  ]) {
    assert.equal(isCommentable({ slug: "example", frontmatter }), false)
  }
  assert.equal(isCommentable({ slug: "index", relativePath: "index.md" }), true)
})

test("rendering uses the existing backend, shared path and localized static asset", () => {
  for (const [locale, baseUrl, lang, prefix] of [
    ["zh-CN", "tianhao.blog", "zh-CN", ""],
    ["en-US", "tianhao.blog/en", "en", "/en"],
  ]) {
    const html = render(
      TwikooComments({ envId })({
        cfg: { locale, baseUrl },
        fileData: {
          slug: "05tools/mcm-template",
          frontmatter: { translations: { zh: "/05tools/mcm-template" } },
        },
      }),
    )
    assert.ok(html.includes(`data-env-id="${envId}"`))
    assert.ok(html.includes('data-comment-path="/posts/latex-mcm-template"'))
    assert.ok(html.includes(`data-lang="${lang}"`))
    assert.ok(html.includes(`data-client-src="${prefix}/static/twikoo/twikoo-1.6.44.all.min.js"`))
    assert.ok(html.includes('data-preview-readonly="true"'))
  }
  assert.equal(render(TwikooComments({ envId })({ cfg: {}, fileData: { slug: "tags/index" } })), "")
})

function widget(path = "/posts/about-me") {
  const classes = new Set()
  const status = { textContent: "" }
  const notice = { textContent: "" }
  const retry = { hidden: true }
  const host = {
    children: [],
    attributeWrites: 0,
    hasComments: false,
    replaceChildren(node) {
      this.children = [node]
    },
    setAttribute(name, value) {
      this.attributeWrites++
      this[name] = value
    },
    getAttribute(name) {
      return this[name] ?? null
    },
    querySelector(selector) {
      if (selector === ".twikoo") return this.vueRoot
      if (selector === ".tk-comments") return this.commentRoot
      if (selector === ".tk-comment") return this.hasComments ? {} : null
      return null
    },
  }
  const w = {
    isConnected: true,
    status,
    notice,
    retry,
    host,
    classes,
    dataset: {
      envId,
      commentPath: path,
      lang: "zh-CN",
      productionHost: "tianhao.blog",
      previewReadonly: "true",
      clientSrc: "/static/twikoo/twikoo-1.6.44.all.min.js",
      loadingText: "loading",
      emptyText: "empty",
      errorText: "error",
      readonlyText: "readonly",
      previewText: "live preview",
    },
    classList: {
      toggle(name, enabled) {
        enabled ? classes.add(name) : classes.delete(name)
      },
    },
    setAttribute(name, value) {
      this[name] = value
    },
    querySelector(selector) {
      return {
        ".twikoo-comments-status": status,
        ".twikoo-comments-preview": notice,
        ".twikoo-comments-retry": retry,
        ".twikoo-comments-body": host,
        ".twikoo": host.vueRoot,
      }[selector]
    },
  }
  return w
}

function browser({
  hostname = "localhost",
  loaded = true,
  count = 2,
  error = "",
  stalled = false,
  malformed = false,
} = {}) {
  const events = new Map()
  const calls = []
  const scripts = []
  const styles = [{ dataset: {} }]
  const timers = new Map()
  let timerId = 0
  const observers = []
  const state = { widget: widget(), destroyed: 0, theme: "light" }
  const client = {
    async init(options) {
      calls.push(options)
      state.widget.host.vueRoot = {
        __vue__: {
          $destroy() {
            state.destroyed++
          },
        },
      }
      state.widget.host.hasComments = count > 0
      state.widget.host.commentRoot = {
        __vue__: { loading: stalled, loadingMore: false, errorMessage: error, comments: [] },
      }
      if (!stalled && !error && !malformed) options.onCommentLoaded()
    },
  }
  const context = {
    window: { location: { hostname }, twikoo: loaded ? client : undefined },
    document: {
      querySelector: () => state.widget,
      documentElement: { getAttribute: () => state.theme },
      head: { appendChild: (script) => scripts.push(script), querySelectorAll: () => styles },
      createElement: () => ({ dataset: {}, remove() {} }),
      addEventListener: (name, callback) => events.set(name, callback),
    },
    setTimeout: (callback) => {
      const id = ++timerId
      timers.set(id, callback)
      return id
    },
    clearTimeout: (id) => timers.delete(id),
    MutationObserver: class {
      constructor(callback) {
        this.callback = callback
        observers.push(this)
      }
      observe() {}
      disconnect() {
        this.disconnected = true
      }
    },
  }
  vm.runInNewContext(TwikooComments({ envId }).afterDOMLoaded, context)
  return {
    state,
    calls,
    scripts,
    styles,
    timers,
    observers,
    client,
    context,
    event: (name) => events.get(name)?.(),
  }
}

test("successful zero-comment response shows empty text, not a loading spinner", async () => {
  const b = browser({ count: 0 })
  await b.event("nav")
  assert.equal(b.state.widget.dataset.commentState, "empty")
  assert.equal(b.state.widget.status.textContent, "empty")
  assert.equal(b.state.widget.host["aria-busy"], "false")
  assert.equal(b.state.widget.retry.hidden, true)
  assert.equal(b.timers.size, 0)
  const writes = b.state.widget.host.attributeWrites
  for (let i = 0; i < 5; i++) b.observers[0].callback()
  assert.equal(b.state.widget.host.attributeWrites, writes)
})

test("mounting the component does not finish an outstanding data request", async () => {
  const b = browser({ count: 0, stalled: true })
  await b.event("nav")
  assert.equal(b.state.widget.dataset.commentState, "loading")
  assert.equal(b.state.widget.host["aria-busy"], "true")
  assert.equal(b.timers.size, 1)
  const timeout = [...b.timers.values()][0]
  timeout()
  assert.equal(b.state.widget.dataset.commentState, "error")
  assert.equal(b.state.widget.retry.hidden, false)
})

test("backend errors and malformed responses are never reported as zero comments", async () => {
  for (const options of [
    { count: 0, error: "network failed" },
    { count: 0, malformed: true },
  ]) {
    const b = browser(options)
    await b.event("nav")
    for (const timeout of b.timers.values()) timeout()
    assert.equal(b.state.widget.dataset.commentState, "error")
    assert.equal(b.state.widget.status.textContent, "error")
    assert.equal(b.state.widget.retry.hidden, false)
  }
})

test("refresh clears a stale error and can recover to an empty discussion", async () => {
  const b = browser({ error: "old failure" })
  await b.event("nav")
  const component = b.state.widget.host.commentRoot.__vue__
  component.loading = true
  b.observers[0].callback()
  assert.equal(component.errorMessage, "")
  assert.equal(b.state.widget.dataset.commentState, "loading")
  b.state.widget.host.hasComments = false
  component.loading = false
  b.calls[0].onCommentLoaded()
  b.observers[0].callback()
  assert.equal(b.state.widget.dataset.commentState, "empty")
  assert.equal(b.timers.size, 0)
})

test("navigation disconnects request observers and ignores stale completion", async () => {
  const b = browser({ stalled: true })
  await b.event("nav")
  const oldCallback = b.calls[0].onCommentLoaded
  b.event("prenav")
  assert.equal(b.timers.size, 0)
  assert.equal(b.observers[0].disconnected, true)
  b.state.widget = widget("/notes/new-page")
  await b.event("nav")
  oldCallback()
  assert.equal(b.state.widget.dataset.commentState, "loading")
  // The vendored Vue client shares configuration: an old request can invoke
  // the new callback too. The new page's unchanged data must remain pending.
  b.calls[1].onCommentLoaded()
  assert.equal(b.state.widget.dataset.commentState, "loading")
  b.state.widget.host.hasComments = false
  b.state.widget.host.commentRoot.__vue__.comments = []
  b.calls[1].onCommentLoaded()
  assert.equal(b.state.widget.dataset.commentState, "empty")
})

test("list loading uses text and SVG controls have explicit bounded dimensions", () => {
  const component = TwikooComments({ envId })
  assert.match(
    component.css,
    /\.tk-comments-container > \.el-loading-mask \{ display: none !important; \}/,
  )
  assert.match(component.css, /\.tk-icon\.__comments > svg \{ width: 1rem; height: 1rem;/)
  assert.match(
    component.css,
    /\.el-loading-spinner \.circular \{ width: 1\.25rem; height: 1\.25rem; fill: none;/,
  )
})

test("local preview reads live comments but hides posting; production can post", async () => {
  for (const hostname of ["localhost", "tianhao.blog"]) {
    const b = browser({ hostname })
    await b.event("nav")
    assert.equal(b.calls.length, 1)
    assert.equal(b.calls[0].envId, envId)
    assert.equal(b.state.widget.classes.has("is-readonly"), hostname === "localhost")
    assert.equal(b.state.widget.notice.textContent, hostname === "localhost" ? "readonly" : "")
  }
  assert.match(TwikooComments({ envId }).css, /\.is-readonly \.tk-submit/)
})

test("SPA navigation destroys the old Vue instance; render does not mount twice", async () => {
  const b = browser()
  await b.event("nav")
  await b.event("nav")
  await b.event("render")
  assert.equal(b.calls.length, 1)
  b.event("prenav")
  assert.equal(b.state.destroyed, 1)
  b.state.widget = widget("/posts/github-profile")
  await b.event("nav")
  assert.equal(b.calls.length, 2)
  assert.equal(b.calls[1].path, "/posts/github-profile")
  assert.equal(typeof b.calls[1].el, "object")
  b.state.theme = "dark"
  b.event("themechange")
  assert.equal(b.state.widget["data-theme"], "dark")
})

test("client is loaded once and a stale navigation never mounts the old discussion", async () => {
  const b = browser({ loaded: false })
  const initial = b.event("nav")
  b.event("prenav")
  b.state.widget = widget("/posts/github-profile")
  const next = b.event("nav")
  assert.equal(b.scripts.length, 1)
  b.context.window.twikoo = b.client
  b.styles.push({ dataset: {} })
  b.scripts[0].onload()
  await Promise.all([initial, next])
  assert.equal(b.calls.length, 1)
  assert.equal(b.calls[0].path, "/posts/github-profile")
  assert.equal(b.styles[0].dataset.persist, undefined)
  assert.equal(b.styles[1].dataset.persist, "true")
})

test("failed loading displays an error and can be retried", async () => {
  const b = browser({ loaded: false })
  const initial = b.event("nav")
  b.scripts[0].onerror()
  await initial
  assert.equal(b.state.widget.status.textContent, "error")
  assert.equal(b.state.widget.retry.hidden, false)
  b.context.window.twikoo = b.client
  b.state.widget.retry.onclick()
  await Promise.resolve()
  await Promise.resolve()
  assert.equal(b.calls.length, 1)
})
