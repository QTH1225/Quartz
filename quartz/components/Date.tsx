import { ValidLocale } from "../i18n"
import { QuartzPluginData } from "../plugins/vfile"

interface Props {
  date: Date
  locale?: ValidLocale
}

export type ValidDateType = keyof Required<QuartzPluginData>["dates"]

function parsePublishedDate(data: QuartzPluginData): Date | undefined {
  const published = data.frontmatter?.published
  if (published === undefined || published === null) return undefined

  const raw = typeof published === "string" && /^\d{4}-\d{2}-\d{2}$/.test(published)
    ? `${published}T00:00:00`
    : published
  const date = new globalThis.Date(raw as string | number | Date)

  return Number.isNaN(date.getTime()) ? undefined : date
}

export function getDate(data: QuartzPluginData): Date | undefined {
  const published = parsePublishedDate(data)
  if (published) return published

  if (!data.defaultDateType) {
    throw new Error(
      `Field 'defaultDateType' was not set. Ensure the CreatedModifiedDate plugin is configured with a 'defaultDateType' option. See https://quartz.jzhao.xyz/plugins/CreatedModifiedDate for more details.`,
    )
  }
  return data.dates?.[data.defaultDateType]
}

export function formatDate(d: Date, locale: ValidLocale = "en-US"): string {
  if (locale.startsWith("zh")) {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}年${month}月${day}日`
  }

  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

export function Date({ date, locale }: Props) {
  return <time datetime={date.toISOString()}>{formatDate(date, locale)}</time>
}
