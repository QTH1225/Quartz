import assert from "node:assert/strict"
import test from "node:test"
import { createBuildTargets } from "./handlers.js"

test("builds only the requested content directory and output", () => {
  for (const directory of ["content", "docs"]) {
    const [target, ...extra] = createBuildTargets({ directory, output: "public", baseDir: "" })
    assert.equal(extra.length, 0)
    assert.equal(target.argv.directory, directory)
    assert.equal(target.argv.output, "public")
    assert.equal(target.argv.serveBasePath, "")
    assert.deepEqual(target.env, {})
  }
})

test("preserves the preview URL prefix without a trailing slash", () => {
  const [target] = createBuildTargets({
    directory: "content",
    output: "preview",
    baseDir: "/blog/",
  })
  assert.equal(target.argv.serveBasePath, "/blog")
  assert.equal(target.argv.output, "preview")
})
