import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildRegistry } from "../registry/build.js";
import { initializeProjectAgentsFile } from "../cli/agents.js";
import { renderRootContractTemplates } from "../scripts/build-agent-templates.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_ROOT = path.join(REPO_ROOT, ".agents", "skills");
const AGENTS_TEMPLATE_SNIPPETS_ROOT = path.join(REPO_ROOT, "templates", "agents", "snippets");

const AGENTS_SNIPPET_MARKER_PAIRS = Object.freeze([
  ["<!-- vasir:purpose:start -->", "<!-- vasir:purpose:end -->"],
  ["<!-- vasir:routing:start -->", "<!-- vasir:routing:end -->"],
  ["<!-- vasir:engineering-doctrine-inserts:start -->", "<!-- vasir:engineering-doctrine-inserts:end -->"]
]);

const ROOT_CONTRACT_MARKER_PAIRS = Object.freeze([
  ["<!-- vasir:purpose:start -->", "<!-- vasir:purpose:end -->"],
  ["<!-- vasir:routing:start -->", "<!-- vasir:routing:end -->"],
  ["<!-- vasir:nonobvious:start -->", "<!-- vasir:nonobvious:end -->"],
  ["<!-- vasir:model-routing:start -->", "<!-- vasir:model-routing:end -->"],
  ["<!-- vasir:engineering-doctrine-inserts:start -->", "<!-- vasir:engineering-doctrine-inserts:end -->"],
  ["<!-- vasir:consumer:start -->", "<!-- vasir:consumer:end -->"]
]);

const ROOT_TEMPLATE_MAX_BYTES = 12 * 1024;
const COMPOSED_ROOT_MAX_BYTES = 32 * 1024;

function assertMarkerPairs(documentText, markerPairs, documentName) {
  for (const [startMarker, endMarker] of markerPairs) {
    assert.equal(documentText.split(startMarker).length - 1, 1, `${documentName}: unique ${startMarker}`);
    assert.equal(documentText.split(endMarker).length - 1, 1, `${documentName}: unique ${endMarker}`);
    assert.ok(documentText.indexOf(startMarker) < documentText.indexOf(endMarker), `${documentName}: ordered ${startMarker}`);
  }
}

function sharedContractText(documentText) {
  return documentText
    .replace(/^# (?:AGENTS|CLAUDE)\.md\b/m, "# ROOT.md")
    .replace(/<!-- vasir:consumer:start -->[\s\S]*?<!-- vasir:consumer:end -->/, "<!-- consumer adapter -->")
    .replace(/<!-- vasir:model-routing:start -->[\s\S]*?<!-- vasir:model-routing:end -->/, "<!-- project model routing -->");
}

function assertContractSections(documentText, documentName) {
  const sectionNumbers = [...documentText.matchAll(/^#{1,6}\s+(\d+)\.\s+/gm)].map((matchEntry) => Number(matchEntry[1]));
  assert.deepEqual(sectionNumbers, Array.from({ length: 12 }, (_, index) => index), `${documentName}: stable section references §0–11`);
}

function walkFiles(directoryPath) {
  const discoveredFiles = [];
  for (const directoryEntry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const absoluteEntryPath = path.join(directoryPath, directoryEntry.name);
    if (directoryEntry.isDirectory()) {
      discoveredFiles.push(...walkFiles(absoluteEntryPath));
      continue;
    }
    discoveredFiles.push(absoluteEntryPath);
  }
  return discoveredFiles.sort();
}

function findLocalMarkdownLinks(filePath) {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const linkMatches = [...fileContents.matchAll(/\]\((?!https?:|mailto:|#)([^)]+)\)/g)];
  return linkMatches.map((matchEntry) => matchEntry[1]);
}

test("skills use a flat .agents/skills/<name> directory layout", () => {
  // Nested SKILL.md reference documents belong to their containing bundle;
  // only direct skill directories define independently installable entries.
  const skillManifestPaths = fs.readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(SKILLS_ROOT, entry.name, "SKILL.md"));
  assert.ok(skillManifestPaths.length > 0, "expected at least one skill");

  for (const manifestPath of skillManifestPaths) {
    assert.ok(fs.existsSync(manifestPath), `${manifestPath}: installable manifest`);
    const relativeManifestPath = path.relative(REPO_ROOT, manifestPath).replace(/\\/g, "/");
    assert.match(
      relativeManifestPath,
      /^\.agents\/skills\/[^/]+\/SKILL\.md$/,
      `root skill manifests must live directly under .agents/skills/<name>: ${relativeManifestPath}`
    );
  }
});

test("optional legacy meta.json files only appear at .agents/skills/<name>/meta.json", () => {
  const metaFilePaths = walkFiles(SKILLS_ROOT).filter((filePath) => path.basename(filePath) === "meta.json");

  for (const metaFilePath of metaFilePaths) {
    const relativeMetaPath = path.relative(REPO_ROOT, metaFilePath).replace(/\\/g, "/");
    assert.match(
      relativeMetaPath,
      /^\.agents\/skills\/[^/]+\/meta\.json$/,
      `legacy meta.json files must live directly under .agents/skills/<name>: ${relativeMetaPath}`
    );
  }
});

test("built registry file inventories match checked-in skill files", () => {
  const registry = buildRegistry();
  assert.ok(registry.skills.length > 0, "expected at least one built skill");

  for (const skillEntry of registry.skills) {
    const skillDirectoryPath = path.join(REPO_ROOT, skillEntry.path);
    const actualRelativeFilePaths = walkFiles(skillDirectoryPath)
      .map((filePath) => path.relative(skillDirectoryPath, filePath).replace(/\\/g, "/"))
      .sort();

    assert.deepEqual(
      skillEntry.files,
      actualRelativeFilePaths,
      `file inventory mismatch for ${skillEntry.path}`
    );
  }
});

test("catalog inventories 67 canonical skills with complete and pending reviews", () => {
  const registry = buildRegistry();
  const metadata = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "registry", "review-metadata.json"), "utf8"));
  assert.equal(registry.skills.length, 67);
  assert.equal(new Set(registry.skills.map((skill) => skill.name)).size, 67);
  assert.equal(registry.skills.reduce((count, skill) => count + skill.files.length, 0), 225);
  assert.equal(metadata.sourceReviewsCompleted, 39);
  assert.equal(metadata.skills.filter((skill) => skill.reviewStatus === "complete").length, 38);
  assert.equal(metadata.skills.filter((skill) => skill.reviewStatus === "pending").length, 29);
  assert.deepEqual(metadata.skills.map((skill) => skill.canonicalId).sort(), registry.skills.map((skill) => skill.name).sort());
  for (const [status, expectedFiles] of [["complete", 81], ["pending", 144]]) {
    const names = new Set(metadata.skills.filter((skill) => skill.reviewStatus === status).map((skill) => skill.canonicalId));
    assert.equal(registry.skills.filter((skill) => names.has(skill.name)).reduce((count, skill) => count + skill.files.length, 0), expectedFiles);
  }
  for (const skill of registry.skills) {
    assert.match(skill.name, /^[a-z0-9]+(?:-[a-z0-9]+)+$/);
    assert.ok(skill.files.includes("SKILL.md"), `${skill.name}: installable manifest`);
    assert.equal(skill.path, `.agents/skills/${skill.name}`);
    assert.ok(!skill.files.includes("evals/suite.json"), `${skill.name}: no bundled behavioral suite`);
  }
});

test("work spec skill owns portable formats and keeps evidence and delivery boundaries explicit", () => {
  const workSpecSkillPath = path.join(SKILLS_ROOT, "plan-maintain-work-spec", "SKILL.md");
  const workSpecSkillText = fs.readFileSync(workSpecSkillPath, "utf8");
  const formatPath = path.join(SKILLS_ROOT, "plan-maintain-work-spec", "references", "spec-formats.md");
  const formatText = fs.readFileSync(formatPath, "utf8");
  assert.ok(findLocalMarkdownLinks(workSpecSkillPath).includes("references/spec-formats.md"));
  assert.match(workSpecSkillText, /intended outcome, requirements, scope, constraints, decisions, current state, acceptance criteria/);
  assert.match(workSpecSkillText, /Requests remain traceable/);
  assert.match(workSpecSkillText, /Separate evidence from judgment/);
  assert.match(workSpecSkillText, /Keep one authoritative copy/);
  assert.match(workSpecSkillText, /Preserve stable references/);
  assert.match(workSpecSkillText, /Synchronize summaries/);
  assert.match(workSpecSkillText, /Evidence must survive/);
  assert.match(workSpecSkillText, /Protect concurrent decisions/);
  assert.match(workSpecSkillText, /Dedicated ML evaluation owns metric selection/);
  assert.match(workSpecSkillText, /record an approval or required human acceptance only when it exists/i);
  assert.match(formatText, /## Brief spec/);
  assert.match(formatText, /## Fuller living spec/);
  assert.match(formatText, /## POC architecture and documentation/);
  assert.match(formatText, /## Application POC and foundation/);
  assert.match(formatText, /Separate real integrations from mocks, fixtures, and manual setup/);
  assert.match(formatText, /Pending or unimplemented checks stay visible/);
});

test("agent template snippets own profile-specific insertion blocks", () => {
  assert.ok(!fs.existsSync(path.join(REPO_ROOT, "templates", "agents", "profiles")), "profiles/ must not return; profile selection composes from snippets/");

  const snippetFilePaths = fs.readdirSync(AGENTS_TEMPLATE_SNIPPETS_ROOT, { withFileTypes: true })
    .filter((directoryEntry) => directoryEntry.isFile() && directoryEntry.name.endsWith(".md"))
    .map((directoryEntry) => path.join(AGENTS_TEMPLATE_SNIPPETS_ROOT, directoryEntry.name))
    .sort();
  assert.ok(snippetFilePaths.length > 0, "expected AGENTS profile snippets");

  for (const snippetFilePath of snippetFilePaths) {
    const relativeSnippetPath = path.relative(REPO_ROOT, snippetFilePath).replace(/\\/g, "/");
    const snippetText = fs.readFileSync(snippetFilePath, "utf8");

    for (const [startMarker, endMarker] of AGENTS_SNIPPET_MARKER_PAIRS) {
      assert.equal(
        (snippetText.match(new RegExp(startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length,
        1,
        `${relativeSnippetPath} must contain exactly one ${startMarker}`
      );
      assert.equal(
        (snippetText.match(new RegExp(endMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length,
        1,
        `${relativeSnippetPath} must contain exactly one ${endMarker}`
      );
      assert.ok(
        snippetText.indexOf(startMarker) < snippetText.indexOf(endMarker),
        `${relativeSnippetPath} must place ${startMarker} before ${endMarker}`
      );
    }
  }
});

test("root contracts have unique renderer seams and stable skill section references", () => {
  const templateDirectory = path.join(REPO_ROOT, "templates", "agents");
  for (const templateName of ["shared-contract.md", "AGENTS.md", "CLAUDE.md"]) {
    const templateText = fs.readFileSync(path.join(templateDirectory, templateName), "utf8");
    assertMarkerPairs(templateText, ROOT_CONTRACT_MARKER_PAIRS, templateName);
    assertContractSections(templateText, templateName);
    assert.ok(
      Buffer.byteLength(templateText, "utf8") <= ROOT_TEMPLATE_MAX_BYTES,
      `${templateName} exceeds the 12 KiB source-root budget; move task-specific guidance into scoped files or skills`
    );
  }
});

test("provider templates are current projections of one shared contract", () => {
  const templateDirectory = path.join(REPO_ROOT, "templates", "agents");
  const sharedText = fs.readFileSync(path.join(templateDirectory, "shared-contract.md"), "utf8");
  assert.equal(sharedText.split("{{contract_filename}}").length - 1, 1, "one contract filename slot");
  assert.equal(sharedText.split("{{agent_adapter}}").length - 1, 1, "one provider adapter slot");

  const renderedTemplates = renderRootContractTemplates({ sharedText });
  assert.deepEqual(Object.keys(renderedTemplates).sort(), ["AGENTS.md", "CLAUDE.md"]);
  for (const [templateName, renderedText] of Object.entries(renderedTemplates)) {
    assert.equal(
      fs.readFileSync(path.join(templateDirectory, templateName), "utf8").replaceAll("\r\n", "\n"),
      renderedText,
      `${templateName} is stale; run node scripts/build-agent-templates.js --write`
    );
    assert.ok(renderedText.startsWith(`# ${templateName}`), `${templateName}: correct consumer filename`);
    assert.doesNotMatch(renderedText, /\{\{(?:contract_filename|agent_adapter)\}\}/, `${templateName}: resolved source slots`);
  }
  assert.equal(sharedContractText(renderedTemplates["AGENTS.md"]), sharedContractText(renderedTemplates["CLAUDE.md"]));
  assert.notEqual(renderedTemplates["AGENTS.md"], renderedTemplates["CLAUDE.md"], "provider adapters remain distinct");
});

test("shared renderer rejects invalid slots and UTF-8 budget overflow before producing templates", () => {
  const minimalSource = "# {{contract_filename}}\n{{agent_adapter}}\n";
  assert.throws(() => renderRootContractTemplates({ sharedText: minimalSource.replace("{{agent_adapter}}", "") }), /exactly one/);
  assert.throws(() => renderRootContractTemplates({ sharedText: `${minimalSource}{{agent_adapter}}` }), /exactly one/);
  assert.throws(() => renderRootContractTemplates({ sharedText: `${minimalSource}${"é".repeat(ROOT_TEMPLATE_MAX_BYTES / 2)}` }), /12 KiB source budget/);

  const atSourceBudget = `${minimalSource}${"x".repeat(ROOT_TEMPLATE_MAX_BYTES - Buffer.byteLength(minimalSource, "utf8"))}`;
  assert.throws(() => renderRootContractTemplates({ sharedText: atSourceBudget }), /after inserting its adapter/);
});

test("every built-in profile composes both contracts within the output budget", (testContext) => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "vasir-contract-profiles-"));
  testContext.after(() => {
    assert.equal(path.dirname(temporaryRoot), path.resolve(os.tmpdir()), "cleanup stays in the created temporary directory");
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  });

  for (const profileName of ["generic", "backend", "frontend", "ios"]) {
    const projectRootDirectory = path.join(temporaryRoot, profileName);
    fs.mkdirSync(projectRootDirectory);
    const initialized = initializeProjectAgentsFile({
      globalCatalogDirectory: REPO_ROOT,
      projectRootDirectory,
      profileName
    });
    assert.equal(initialized.profile, profileName);
    const contracts = {};
    for (const templateName of ["AGENTS.md", "CLAUDE.md"]) {
      const contractText = fs.readFileSync(path.join(projectRootDirectory, templateName), "utf8");
      assert.ok(Buffer.byteLength(contractText, "utf8") <= COMPOSED_ROOT_MAX_BYTES, `${profileName}/${templateName}: 32 KiB output budget`);
      assertMarkerPairs(contractText, ROOT_CONTRACT_MARKER_PAIRS, `${profileName}/${templateName}`);
      assertContractSections(contractText, `${profileName}/${templateName}`);
      contracts[templateName] = contractText;
    }
    assert.equal(sharedContractText(contracts["AGENTS.md"]), sharedContractText(contracts["CLAUDE.md"]), `${profileName}: shared laws agree`);
  }
});

test("contract docs route maintainers to the shared source and distinguish folder steering maps", () => {
  const templateReadmePath = path.join(REPO_ROOT, "templates", "agents", "README.md");
  const examplePath = path.join(REPO_ROOT, "docs", "example-agents.md");
  for (const documentPath of [templateReadmePath, examplePath]) {
    const documentText = fs.readFileSync(documentPath, "utf8");
    assert.ok(findLocalMarkdownLinks(documentPath).some((linkPath) => path.basename(linkPath) === "shared-contract.md"), `${documentPath}: link to canonical shared source`);
    assert.match(documentText, /build-agent-templates\.js/, `${documentPath}: template regeneration command`);
    assert.match(documentText, /Nested root|nested root/, `${documentPath}: nested app/package roots`);
    assert.match(documentText, /Folder `AGENTS\.md`|folder steering maps/, `${documentPath}: hand-authored folder guidance`);
  }

  const folderAgentsSkillText = fs.readFileSync(
    path.join(SKILLS_ROOT, "agents-creating-folder-agents", "SKILL.md"),
    "utf8"
  );
  assert.match(folderAgentsSkillText, /folder `AGENTS\.md` files as local steering maps/);
  assert.match(folderAgentsSkillText, /Folder `AGENTS\.md`: hand-authored steering map for one subtree/);
  assert.match(folderAgentsSkillText, /Verify the repository's supported filename, sidecar, template, and generation conventions/);
  assert.match(folderAgentsSkillText, /Do not apply a root template or generator to a hand-authored folder map/);
});

test("handoff skill separates durable commands and scoped closure from temporary proof", () => {
  const handoffSkillText = fs.readFileSync(
    path.join(SKILLS_ROOT, "handoff-final-quality-gate", "SKILL.md"),
    "utf8"
  );
  assert.match(handoffSkillText, /Repo shape & commands/);
  assert.match(handoffSkillText, /temporary proof follows the project's artifact convention/);
  assert.match(handoffSkillText, /Package scripts remain useful developer\/CI interfaces/);
  assert.match(handoffSkillText, /Remaining work/);
  assert.match(handoffSkillText, /each item precisely scoped with a closure gate and recorded human acceptance of deferral/);
  assert.match(handoffSkillText, /Subjective acceptance requires a recorded human decision, never an automated PASS/);
});

test("testing skill ties absence assertions to positive observable guarantees", () => {
  const testingSkillText = fs.readFileSync(
    path.join(SKILLS_ROOT, "testing-enforcing-mandate", "SKILL.md"),
    "utf8"
  );
  assert.match(testingSkillText, /Do not write tombstone tests/);
  assert.match(testingSkillText, /Assert observable output, public reads, persisted effects/);
  assert.match(testingSkillText, /Absence assertions remain useful when they protect an approved positive contract/);
  assert.match(testingSkillText, /Name the guarantee and harm prevented by a negative assertion/);
});
test("local markdown links resolve", () => {
  const documentPathsToCheck = [
    "README.md",
    "MANIFESTO.md",
    "docs/cli-reference.md",
    "docs/create-your-first-skill.md",
    "docs/example-agents.md",
    "docs/skill-reference.md",
    "docs/troubleshooting.md",
    "work/WORK.md",
    "docs/writing-skills.md",
    "templates/SKILL.md"
  ];
  documentPathsToCheck.push(
    ...walkFiles(path.join(REPO_ROOT, "templates", "agents"))
      .filter((filePath) => filePath.endsWith(".md"))
      .map((filePath) => path.relative(REPO_ROOT, filePath))
  );

  for (const relativeDocumentPath of documentPathsToCheck) {
    const absoluteDocumentPath = path.join(REPO_ROOT, relativeDocumentPath);
    for (const relativeLinkPath of findLocalMarkdownLinks(absoluteDocumentPath)) {
      const [relativeFilePath] = relativeLinkPath.split("#");
      const resolvedLinkPath = path.resolve(path.dirname(absoluteDocumentPath), relativeFilePath);
      assert.ok(fs.existsSync(resolvedLinkPath), `${relativeDocumentPath} references missing path ${relativeLinkPath}`);
    }
  }
});
