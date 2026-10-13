import { goatCounterPath, installGoatCounter } from "../../util/goatcounter.js"

// Supplied by ComponentResources. Use Quartz's browser bundler rather than
// Function.toString(): the Node build injects keepNames helpers into functions.
declare const __QUARTZ_GOATCOUNTER_OPTIONS__: {
  productionHost: string
  endpoint: string
  scriptSrc: string
}

installGoatCounter(__QUARTZ_GOATCOUNTER_OPTIONS__, goatCounterPath)
