import fs from "node:fs"
import path from "node:path"
import { globby } from "globby"
import { fromHtml } from "hast-util-from-html"

const root = path.resolve(process.argv[2] ?? "public")
const errors = []
let checked = 0
let commentPages = 0
function elements(node) {
  return [node, ...(node.children ?? []).flatMap(elements)].filter((n) => n.type === "element")
}
function hasClass(node, name) {
  return node.properties?.className?.includes(name)
}
for (const page of await globby("**/*.html", { cwd: root })) {
  if (page.endsWith("404.html")) continue
  const nodes = elements(fromHtml(fs.readFileSync(path.join(root, page), "utf8")))
  const sidebar = nodes.find((n) => hasClass(n, "sidebar") && hasClass(n, "left"))
  const footer = nodes.find((n) => hasClass(n, "page-footer"))
  const desktop = sidebar && elements(sidebar).filter((n) => hasClass(n, "recent-notes"))
  const mobile = footer && elements(footer).filter((n) => hasClass(n, "recent-notes-mobile"))
  if (desktop?.length !== 1 || mobile?.length !== 1) {
    errors.push(`${page}：桌面左栏和移动端正文底部应各有一个最近笔记组件`)
    continue
  }
  checked++
  const mobileWrapper = footer.children?.find(
    (n) => hasClass(n, "mobile-only") && elements(n).includes(mobile[0]),
  )
  if (!mobileWrapper) errors.push(`${page}：底部笔记组件必须仅在移动端显示`)
  const comments = elements(footer).find((n) => hasClass(n, "twikoo-comments"))
  if (comments) {
    commentPages++
    if (nodes.indexOf(mobile[0]) >= nodes.indexOf(comments))
      errors.push(`${page}：移动端笔记必须位于评论上方`)
  }
  const links = (n) =>
    elements(n)
      .filter((x) => x.tagName === "a" && hasClass(x, "internal"))
      .map((x) => x.properties.href)
  if (JSON.stringify(links(desktop[0])) !== JSON.stringify(links(mobile[0])))
    errors.push(`${page}：桌面和移动端的笔记顺序或链接不一致`)
  if (elements(mobile[0]).some((n) => n.tagName === "button"))
    errors.push(`${page}：移动端不应显示侧栏折叠按钮`)
}
if (!checked) errors.push("没有找到最近笔记，请先构建网站")
console.log(
  `最近笔记响应式检查：${checked} 个页面、${commentPages} 个评论页，错误 ${errors.length}`,
)
for (const error of errors) console.error(error)
if (errors.length) process.exitCode = 1
