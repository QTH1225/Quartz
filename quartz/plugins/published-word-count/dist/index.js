import { countProse, proseText, hasBodyContent } from "./count.js"

export const manifest = {
  name: "published-word-count",
  displayName: "Published Word Count",
  version: "1.0.0",
  category: "transformer",
}

export default function PublishedWordCount() {
  return {
    name: "PublishedWordCount",
    htmlPlugins(ctx) {
      return [
        () => (tree, file) => {
          const locale = file.data.frontmatter?.lang ?? ctx.cfg.configuration.locale
          file.data.publishedWordCount = {
            count: countProse(proseText(tree)),
            hasBody: hasBodyContent(tree),
            language: String(locale).toLowerCase().startsWith("zh") ? "zh" : "en",
          }
        },
      ]
    },
  }
}
