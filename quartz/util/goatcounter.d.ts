export function goatCounterPath(pathname: string): string
export function installGoatCounter(
  options: { productionHost: string; endpoint: string; scriptSrc: string },
  pagePath: (pathname: string) => string,
): void
