import { spawnSync } from "node:child_process"
import process from "node:process"
import "./patch-quartz-date-format.mjs"

// Keep existing deployment commands working. The CLI follows publication.json:
// Chinese only while English is paused; both languages when it is restored.
const result = spawnSync(process.execPath, ["quartz/bootstrap-cli.mjs", "build"], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
  shell: false,
})

if (result.status !== 0) process.exit(result.status ?? 1)
