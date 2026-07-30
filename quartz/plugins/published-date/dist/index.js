export const manifest = {
  name: "published-date",
  displayName: "Published Date",
  description: "Prefer frontmatter published dates while falling back to modified dates.",
  version: "1.0.0",
  category: "transformer",
}

function parseDate(value) {
  if (value === undefined || value === null) return undefined

  const raw =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00`
      : value
  const date = new Date(raw)

  return Number.isNaN(date.getTime()) ? undefined : date
}

export default function PublishedDate() {
  return {
    name: "PublishedDate",
    markdownPlugins() {
      return [
        () => (_tree, file) => {
          const data = file.data
          const frontmatter = data.frontmatter ?? {}
          const explicitPublished = parseDate(frontmatter.published ?? frontmatter.publshed)

          if (data.dates) {
            data.dates.published =
              explicitPublished ?? data.dates.modified ?? data.dates.created ?? data.dates.published
          } else if (explicitPublished) {
            data.dates = {
              created: explicitPublished,
              modified: explicitPublished,
              published: explicitPublished,
            }
          }

          data.defaultDateType = "published"
        },
      ]
    },
  }
}
