import assert from "node:assert/strict"
import test from "node:test"
import path from "node:path"
import { createBuildTargets } from "./handlers.js"
import publication from "../publication.json" with { type: "json" }

const argv = { directory: "content", output: "public", baseDir: "" }

test("the default build follows the saved publication policy", () => {
  const targets = createBuildTargets(argv, { directorySpecified: false })
  assert.equal(targets.length, publication.englishEnabled ? 2 : 1)
  assert.equal(targets[0].argv.directory, "content")
  assert.equal(targets[0].argv.output, "public")
})

test("pausing English builds Chinese only even when English source files exist", () => {
  assert.equal(
    createBuildTargets(argv, { englishEnabled: false, directorySpecified: false }).length,
    1,
  )
})

test("English cannot be explicitly published while paused", () => {
  assert.throws(
    () =>
      createBuildTargets(
        { ...argv, directory: "content-en" },
        { englishEnabled: false, directorySpecified: true },
      ),
    /英文发布已暂停/,
  )
})

test("restoring the switch preserves the bilingual build targets and preview paths", () => {
  const targets = createBuildTargets(
    { ...argv, baseDir: "/preview/" },
    { englishEnabled: true, directorySpecified: false },
  )
  assert.equal(targets.length, 2)
  assert.deepEqual(
    targets.map((target) => target.argv.directory),
    ["content", "content-en"],
  )
  assert.equal(targets[1].argv.output, path.join("public", "en"))
  assert.equal(targets[0].argv.serveBasePath, "/preview")
  assert.equal(targets[1].argv.serveBasePath, "/preview/en")
  assert.equal(targets[1].env.QUARTZ_LOCALE, "en-US")
  assert.match(targets[1].env.QUARTZ_BASE_URL, /\/en$/)
})

test("explicit Chinese and docs builds remain single-directory builds", () => {
  for (const directory of ["content", "docs"]) {
    const targets = createBuildTargets(
      { ...argv, directory },
      { englishEnabled: true, directorySpecified: true },
    )
    assert.equal(targets.length, 1)
    assert.equal(targets[0].argv.directory, directory)
  }
})
