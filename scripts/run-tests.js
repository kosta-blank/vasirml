import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Enumerate explicitly because older supported Node versions do not expand test globs on Windows.
const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const testDirectory = path.join(repositoryRoot, "test");
const testFiles = fs.readdirSync(testDirectory)
  .filter((name) => name.endsWith(".test.js"))
  .sort()
  .map((name) => path.join(testDirectory, name));
if (testFiles.length === 0) {
  throw new Error("No repository regression tests were found.");
}
const result = spawnSync(process.execPath, ["--test", ...testFiles], {
  cwd: repositoryRoot,
  env: process.env,
  stdio: "inherit"
});
if (result.error) {
  throw result.error;
}
process.exitCode = result.status ?? 1;
