import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const templateDirectory = path.join(repositoryRoot, "templates", "agents");
const sourceBudgetBytes = 12 * 1024;

const adapters = {
  "AGENTS.md": "Use Codex or the current host's available tools, permissions, and configured model. Do not assume a local CLI, shell wrapper, or another provider's capabilities.",
  "CLAUDE.md": "Use Claude or the current host's available tools, permissions, and configured model. Do not assume a local CLI, shell wrapper, or another provider's capabilities."
};

export function renderRootContractTemplates({ sharedText }) {
  if (Buffer.byteLength(sharedText, "utf8") > sourceBudgetBytes) {
    throw new Error("Shared root contract exceeds the 12 KiB source budget; move detailed workflows into skills or scoped guidance.");
  }
  for (const placeholder of ["{{contract_filename}}", "{{agent_adapter}}"]) {
    if (sharedText.split(placeholder).length !== 2) {
      throw new Error(`Shared contract must contain exactly one ${placeholder}.`);
    }
  }
  const templates = Object.fromEntries(Object.entries(adapters).map(([filename, adapter]) => [
    filename,
    `${sharedText.replaceAll("\r\n", "\n").trim()
      .replace("{{contract_filename}}", filename)
      .replace("{{agent_adapter}}", adapter)}\n`
  ]));
  for (const [filename, text] of Object.entries(templates)) {
    if (Buffer.byteLength(text, "utf8") > sourceBudgetBytes) {
      throw new Error(`${filename} exceeds the 12 KiB source budget after inserting its adapter.`);
    }
  }
  return templates;
}

export function buildRootContractTemplates({ write = false } = {}) {
  const sharedText = fs.readFileSync(path.join(templateDirectory, "shared-contract.md"), "utf8");
  const templates = renderRootContractTemplates({ sharedText });
  const staleFiles = [];
  for (const [filename, renderedText] of Object.entries(templates)) {
    const outputPath = path.join(templateDirectory, filename);
    const existingText = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8").replaceAll("\r\n", "\n") : null;
    if (existingText === renderedText) {
      continue;
    }
    staleFiles.push(filename);
    if (write) {
      fs.writeFileSync(outputPath, renderedText);
    }
  }
  return { templates, staleFiles };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.length !== 1 || !["--write", "--check"].includes(argumentsList[0])) {
    process.stderr.write("Usage: node scripts/build-agent-templates.js --write|--check\n");
    process.exitCode = 1;
  } else {
    const write = argumentsList[0] === "--write";
    const result = buildRootContractTemplates({ write });
    if (!write && result.staleFiles.length > 0) {
      process.stderr.write(`Root contract templates need regeneration: ${result.staleFiles.join(", ")}. Run node scripts/build-agent-templates.js --write.\n`);
      process.exitCode = 1;
    } else {
      process.stdout.write(write ? "Root contract templates regenerated.\n" : "Root contract templates match the shared source.\n");
    }
  }
}
