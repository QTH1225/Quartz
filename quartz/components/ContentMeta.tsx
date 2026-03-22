import { Date, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
  showAuthor: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
  showAuthor: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        segments.push(<Date date={getDate(cfg, fileData)!} locale={cfg.locale} />)
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      // Display author(s) if enabled and author field exists
      if (options.showAuthor && fileData.frontmatter?.author) {
        const authors = fileData.frontmatter.author
        const authorLinks = fileData.frontmatter.authorLink
        
        // Handle both single author and multiple authors
        if (Array.isArray(authors)) {
          // Multiple authors
          const authorElements: JSX.Element[] = []
          authors.forEach((authorName, index) => {
            const authorLink = Array.isArray(authorLinks) ? authorLinks[index] : authorLinks
            if (authorLink) {
              authorElements.push(
                <a href={authorLink} target="_blank" rel="noopener noreferrer">{authorName}</a>
              )
            } else {
              authorElements.push(<span>{authorName}</span>)
            }
            
            // Add separator except for the last author
            if (index < authors.length - 1) {
              authorElements.push(<span>, </span>)
            }
          })
          
          segments.push(
            <span>
              by {authorElements}
            </span>
          )
        } else {
          // Single author (backward compatibility)
          const authorName = authors
          const authorLink = authorLinks
          
          if (authorLink) {
            segments.push(
              <span>
                by <a href={authorLink} target="_blank" rel="noopener noreferrer">{authorName}</a>
              </span>
            )
          } else {
            segments.push(<span>by {authorName}</span>)
          }
        }
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor