import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { VasirCliError } from "./cli-error.js";
import { COMMANDS_REFERENCE_DOCS_REF } from "./docs-ref.js";

const PRIORITIES_FILENAME = "skill-priorities.json";
const PRIORITIES_FILE_PATH = fileURLToPath(new URL(`../${PRIORITIES_FILENAME}`, import.meta.url));
const TIER_NAMES = ["A", "B", "C"];
const CANONICAL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function readDefaultSkillNames({ registry, sourceDirectory }) {
  const sourcePrioritiesPath = sourceDirectory && path.join(sourceDirectory, PRIORITIES_FILENAME);
  const prioritiesFilePath = sourcePrioritiesPath && fs.existsSync(sourcePrioritiesPath)
    ? sourcePrioritiesPath : PRIORITIES_FILE_PATH;

  try {
    const definitions = JSON.parse(fs.readFileSync(prioritiesFilePath, "utf8"));
    if (!isRecord(definitions) || definitions.schemaVersion !== 1 ||
        Object.keys(definitions).some((key) => !["schemaVersion", "tiers"].includes(key)) ||
        !isRecord(definitions.tiers) || Object.keys(definitions.tiers).length !== TIER_NAMES.length ||
        !TIER_NAMES.every((name) => Array.isArray(definitions.tiers[name])) ||
        definitions.tiers.A.length === 0) {
      throw new Error("Expected schemaVersion 1 and skill lists for tiers A, B, and C, with at least one Tier A skill.");
    }

    const knownSkills = new Set(registry.skills.map((entry) => entry.name));
    const seenSkills = new Set();
    for (const tierName of TIER_NAMES) {
      for (const skillName of definitions.tiers[tierName]) {
        if (typeof skillName !== "string" || !CANONICAL_NAME.test(skillName)) {
          throw new Error(`Tier ${tierName} contains a noncanonical skill name.`);
        }
        if (!knownSkills.has(skillName)) {
          throw new Error(`Tier ${tierName} references unknown skill ${skillName} in the effective catalog.`);
        }
        if (seenSkills.has(skillName)) {
          throw new Error(`Tier ${tierName} repeats skill ${skillName}; each skill can appear only once.`);
        }
        seenSkills.add(skillName);
      }
    }
    return definitions.tiers.A;
  } catch (cause) {
    throw new VasirCliError({
      code: "INVALID_SKILL_PRIORITIES",
      message: `Cannot load skill priorities: ${cause.message}`,
      suggestion: "Repair or reinstall the package's skill-priorities.json, or supply a skill-priorities.json in your local catalog override with skill IDs from its registry.",
      docsRef: COMMANDS_REFERENCE_DOCS_REF,
      context: { prioritiesFilePath },
      cause
    });
  }
}
