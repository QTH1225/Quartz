import { spawnSync } from "node:child_process"
import process from "node:process"

function run(label, args, env) {
  console.log(`\n[${label}] node quartz/bootstrap-cli.mjs ${args.join(" ")}\n`)
  const result = spawnSync(process.execPath, ["quartz/bootstrap-cli.mjs", ...args], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    stdio: "inherit",
    shell: false,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run("zh", ["build", "-d", "content", "-o", "public"], {
  QUARTZ_LOCALE: "zh-CN",
})

run("en", ["build", "-d", "content-en", "-o", "public/en"], {
  QUARTZ_LOCALE: "en-US",
  QUARTZ_BASE_URL: "quartz.jzhao.xyz/en",
})
