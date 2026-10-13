// Shared by the collector and public counters: queries/fragments are not pages.
export function goatCounterPath(pathname) {
  return pathname.replace(/\/+$/, "") || "/"
}

// Serialised into the browser bundle by ComponentResources. No API key needed.
export function installGoatCounter(options, pagePath) {
  const host = (value) => value.toLowerCase().replace(/^www\./, "")
  if (host(window.location.hostname) !== host(options.productionHost)) return
  if (window.__quartzGoatCounter) return
  window.__quartzGoatCounter = true

  window.goatcounter = { no_onload: true, no_events: true }
  let loaded = false
  let pending
  let lastPath

  function flush() {
    if (!loaded || !pending || pending.path === lastPath) return
    // Preserve GoatCounter's opt-out, frame and prerender filtering.
    if (window.goatcounter.filter()) return
    const visit = pending
    lastPath = visit.path
    pending = undefined
    try {
      window.goatcounter.count(visit)
    } catch {
      // Never retry an uncertain delivery: it could already have been counted.
    }
  }

  document.addEventListener("nav", () => {
    const path = pagePath(window.location.pathname)
    pending = {
      path,
      title: document.title,
      referrer: lastPath ? `https://${options.productionHost}${lastPath}` : document.referrer,
    }
    flush()
  })
  document.addEventListener("visibilitychange", flush)

  const script = document.createElement("script")
  script.src = options.scriptSrc
  script.defer = true
  script.setAttribute("data-goatcounter", options.endpoint)
  script.setAttribute("data-goatcounter-settings", '{"no_onload":true,"no_events":true}')
  script.setAttribute("data-persist", "true")
  script.onload = () => {
    loaded = true
    window.goatcounter.endpoint = options.endpoint
    flush()
  }
  document.head.appendChild(script)
}
