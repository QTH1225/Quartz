import { spawnSync } from "node:child_process"
import process from "node:process"
import "./patch-quartz-date-format.mjs"

// The CLI already builds both languages, derives /en from the configured baseUrl,
// and copies shared attachments. Keep both build commands on the same code path.
const result = spawnSync(process.execPath, ["quartz/bootstrap-cli.mjs", "build"], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
  shell: false,
})

if (result.status !== 0) process.exit(result.status ?? 1)
