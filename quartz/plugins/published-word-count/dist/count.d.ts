import type { VFileData } from "vfile"

export function publishedSummary(
  allFiles?: readonly VFileData[],
  locale?: string,
): { words: number; notes: number }
