import { readFileSync } from "fs"
import { join } from "path"
import { jsx } from "preact/jsx-runtime"

const css = `
footer {
  text-align: left;
  margin-bottom: 4rem;
  opacity: 0.7;
}

footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: -1rem;
}
`

const defaults = {
  links: {},
  license: {
    text: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans",
  },
}

function getQuartzVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8"))
    return pkg.version ?? ""
  } catch {
    return ""
  }
}

export function Footer(userOpts = {}) {
  const opts = {
    ...defaults,
    ...userOpts,
    license: {
      ...defaults.license,
      ...(userOpts.license ?? {}),
    },
  }

  const version = getQuartzVersion()

  function Component({ displayClass }) {
    const year = new Date().getFullYear()
    const links = opts.links ?? {}
    const license = opts.license ?? defaults.license

    return jsx("footer", {
      class: `${displayClass ?? ""}`,
      children: [
        jsx("p", {
          children: [
            "Created with ",
            jsx("a", {
              href: "https://quartz.jzhao.xyz/",
              children: ["Quartz", version ? ` v${version}` : ""],
            }),
            " \u00a9 ",
            year,
            " · ",
            jsx("a", {
              href: license.url,
              children: license.text,
            }),
          ],
        }),
        jsx("ul", {
          children: Object.entries(links).map(([text, link]) =>
            jsx("li", {
              children: jsx("a", {
                href: link,
                children: text,
              }),
            }),
          ),
        }),
      ],
    })
  }

  Component.css = css
  return Component
}
