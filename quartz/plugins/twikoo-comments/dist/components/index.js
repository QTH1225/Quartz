import { jsx } from "preact/jsx-runtime"
import { commentPath, isCommentable } from "./paths.js"

const css = `
.twikoo-comments { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--lightgray); }
.twikoo-comments h2 { margin-top: 0; }
.twikoo-comments .twikoo { color: var(--darkgray); }
.twikoo-comments .tk-content { overflow-wrap: anywhere; }
.twikoo-comments .tk-content a { color: var(--secondary); }
.twikoo-comments .tk-icon.__comments { width: 1rem; height: 1rem; flex-shrink: 0; }
.twikoo-comments .tk-icon.__comments > svg { width: 1rem; height: 1rem; display: block; }
.twikoo-comments .tk-action-icon > svg,
.twikoo-comments .tk-icon.__comment > svg { width: 1em; height: 1em; }
.twikoo-comments .el-loading-spinner .circular { width: 1.25rem; height: 1.25rem; fill: none; }
/* The list uses our textual status, not Element UI's large overlay spinner. */
.twikoo-comments .tk-comments-container > .el-loading-mask { display: none !important; }
.twikoo-comments .tk-comments-no { display: none; }
.twikoo-comments .el-textarea__inner,
.twikoo-comments .el-input__inner { color: var(--darkgray); background-color: var(--light); border-color: var(--lightgray); }
.twikoo-comments-status,
.twikoo-comments-preview { font-size: 0.85rem; color: var(--darkgray); }
.twikoo-comments-status:empty,
.twikoo-comments-preview:empty { display: none; }
.twikoo-comments.is-readonly .tk-submit,
.twikoo-comments.is-readonly .tk-action,
.twikoo-comments.is-readonly .tk-admin-container { display: none; }
.twikoo-comments-retry { padding: 0.4rem 0.75rem; border: 1px solid var(--lightgray); border-radius: 5px; background: var(--light); color: var(--secondary); cursor: pointer; }
.twikoo-comments-retry[hidden] { display: none; }
`

function installTwikooComments() {
  let loading
  let active
  let generation = 0
  let initialized
  let observer
  let requestTimer

  function loadClient(src) {
    if (window.twikoo?.init) return Promise.resolve(window.twikoo)
    if (loading) return loading
    loading = new Promise((resolve, reject) => {
      const previousStyles = new Set(document.head.querySelectorAll("style"))
      const script = document.createElement("script")
      script.src = src
      script.async = true
      script.dataset.persist = "true"
      const timer = setTimeout(() => {
        script.remove()
        reject(new Error("Twikoo client load timed out"))
      }, 15000)
      script.onload = () => {
        clearTimeout(timer)
        // The client injects CSS into <head>; preserve it across Quartz SPA
        // navigation without retaining unrelated pre-existing style nodes.
        for (const style of document.head.querySelectorAll("style")) {
          if (!previousStyles.has(style)) {
            style.dataset.persist = "true"
            style.dataset.twikooStyle = "true"
          }
        }
        if (window.twikoo?.init) resolve(window.twikoo)
        else reject(new Error("Invalid Twikoo client"))
      }
      script.onerror = () => {
        clearTimeout(timer)
        script.remove()
        reject(new Error("Twikoo client failed to load"))
      }
      document.head.appendChild(script)
    }).catch((error) => {
      loading = undefined
      throw error
    })
    return loading
  }

  function cleanup() {
    generation++
    observer?.disconnect()
    observer = undefined
    clearTimeout(requestTimer)
    requestTimer = undefined
    // Pinned 1.6.44 uses Vue 2; destroy its instance before Quartz removes the
    // DOM, so navigation does not retain watchers/listeners from old pages.
    active?.querySelector(".twikoo")?.__vue__?.$destroy()
    active = undefined
    initialized = undefined
  }

  async function setup() {
    const widget = document.querySelector(".twikoo-comments")
    if (!widget || widget === active) return
    cleanup()
    active = widget
    const requestGeneration = generation
    const status = widget.querySelector(".twikoo-comments-status")
    const retry = widget.querySelector(".twikoo-comments-retry")
    const host = widget.querySelector(".twikoo-comments-body")
    let failed = false
    let wasLoading = false
    let receivedComments = false
    let commentsBeforeRequest
    const isCurrent = () => generation === requestGeneration && widget.isConnected
    function setState(state, text) {
      if (!isCurrent()) return
      widget.dataset.commentState = state
      const busy = String(state === "loading")
      // The observer watches attributes too; writing the same value again
      // would create a self-triggering MutationObserver loop.
      if (host.getAttribute("aria-busy") !== busy) host.setAttribute("aria-busy", busy)
      status.textContent = text
      retry.hidden = state !== "error"
    }
    function fail() {
      if (!isCurrent()) return
      clearTimeout(requestTimer)
      requestTimer = undefined
      failed = true
      setState("error", widget.dataset.errorText)
    }
    function pending() {
      if (!isCurrent() || failed) return
      setState("loading", widget.dataset.loadingText)
      if (requestTimer === undefined) requestTimer = setTimeout(fail, 20000)
    }
    function loaded() {
      if (!isCurrent()) return
      const component = host.querySelector(".tk-comments")?.__vue__
      // Vue 2 shares the Twikoo configuration through its prototype. A late
      // callback from a destroyed page must not complete the current request.
      if (component?.loading && component.comments === commentsBeforeRequest) return
      receivedComments = true
      if (component) {
        component.errorMessage = ""
        wasLoading = component.loading || component.loadingMore
      }
      clearTimeout(requestTimer)
      requestTimer = undefined
      failed = false
      const hasComments = Boolean(host.querySelector(".tk-comment"))
      setState(hasComments ? "ready" : "empty", hasComments ? "" : widget.dataset.emptyText)
    }
    function checkState() {
      if (!isCurrent()) return
      const component = host.querySelector(".tk-comments")?.__vue__
      if (!component || typeof component.loading !== "boolean") return
      const loadingComments = component.loading || component.loadingMore
      if (loadingComments) {
        if (!wasLoading) {
          // Twikoo 1.6.44 doesn't clear the previous error on refresh.
          component.errorMessage = ""
          failed = false
          receivedComments = false
          commentsBeforeRequest = component.comments
        }
        wasLoading = true
        if (!receivedComments) pending()
      } else {
        wasLoading = false
        if (component.errorMessage) fail()
        else if (receivedComments) loaded()
      }
    }
    const preview = window.location.hostname !== widget.dataset.productionHost
    const readonly = preview && widget.dataset.previewReadonly === "true"
    widget.classList.toggle("is-readonly", readonly)
    widget.querySelector(".twikoo-comments-preview").textContent = readonly
      ? widget.dataset.readonlyText
      : preview
        ? widget.dataset.previewText
        : ""
    widget.setAttribute(
      "data-theme",
      document.documentElement.getAttribute("saved-theme") ?? "light",
    )
    pending()
    retry.onclick = () => {
      cleanup()
      setup()
    }
    try {
      const client = await loadClient(widget.dataset.clientSrc)
      if (generation !== requestGeneration || !widget.isConnected) return
      const mount = document.createElement("div")
      host.replaceChildren(mount)
      if (typeof MutationObserver !== "undefined") {
        observer = new MutationObserver(checkState)
        observer.observe(host, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
        })
      }
      // A DOM element, not a global selector: a late async mount must never
      // populate the next article after navigation.
      await client.init({
        envId: widget.dataset.envId,
        el: mount,
        path: widget.dataset.commentPath,
        lang: widget.dataset.lang,
        // Fires after a successful COMMENT_GET, including an empty array.
        onCommentLoaded: loaded,
      })
      if (generation === requestGeneration) {
        initialized = widget
        checkState()
      } else {
        host.querySelector(".twikoo")?.__vue__?.$destroy()
      }
    } catch {
      fail()
    }
  }

  document.addEventListener("prenav", cleanup)
  document.addEventListener("nav", setup)
  document.addEventListener("render", () => {
    const widget = document.querySelector(".twikoo-comments")
    if (widget === initialized) return
    setup()
  })
  document.addEventListener("themechange", () => {
    active?.setAttribute(
      "data-theme",
      document.documentElement.getAttribute("saved-theme") ?? "light",
    )
  })
}

export function TwikooComments(opts = {}) {
  if (!opts.envId) throw new Error("Twikoo envId is required")
  if (new URL(opts.envId).protocol !== "https:") throw new Error("Twikoo envId must use HTTPS")
  function Component({ cfg, fileData, displayClass }) {
    if (!isCommentable(fileData)) return null
    const zh = String(cfg.locale).toLowerCase().startsWith("zh")
    const base = new URL(`https://${cfg.baseUrl}/`)
    return jsx("section", {
      class: ["twikoo-comments", displayClass].filter(Boolean).join(" "),
      "aria-label": zh ? "评论" : "Comments",
      "data-env-id": opts.envId,
      "data-comment-path": commentPath(fileData),
      "data-lang": zh ? "zh-CN" : "en",
      "data-production-host": base.hostname,
      "data-preview-readonly": String(opts.previewReadOnly !== false),
      "data-client-src": `${base.pathname.replace(/\/$/, "")}/static/twikoo/twikoo-1.6.44.all.min.js`,
      "data-loading-text": zh ? "正在加载评论…" : "Loading comments…",
      "data-empty-text": zh ? "暂无评论" : "No comments yet",
      "data-error-text": zh
        ? "评论加载失败，请检查网络后重试。"
        : "Comments failed to load. Check your connection and retry.",
      "data-readonly-text": zh
        ? "本地预览：显示线上评论，留言输入框已隐藏。"
        : "Preview: live comments are shown; posting is hidden.",
      "data-preview-text": zh
        ? "预览连接线上评论，留言会写入正式数据库。"
        : "Preview uses live comments; posting writes to the production database.",
      children: [
        jsx("h2", { children: zh ? "评论" : "Comments" }),
        jsx("p", { class: "twikoo-comments-preview", children: "" }),
        jsx("p", { class: "twikoo-comments-status", role: "status", children: "" }),
        jsx("div", { class: "twikoo-comments-body" }),
        jsx("button", {
          class: "twikoo-comments-retry",
          type: "button",
          hidden: true,
          children: zh ? "重试" : "Retry",
        }),
      ],
    })
  }
  Component.css = css
  Component.afterDOMLoaded = `(${installTwikooComments.toString()})();`
  return Component
}
