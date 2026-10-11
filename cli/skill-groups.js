import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { VasirCliError } from "./cli-error.js";
import { ADD_REFERENCE_DOCS_REF } from "./docs-ref.js";

const GROUPS_FILE_PATH = fileURLToPath(new URL("../skill-groups.json", import.meta.url));
const CANONICAL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function readSkillGroups({ registry, sourceDirectory }) {
  const sourceGroupsPath = sourceDirectory && path.join(sourceDirectory, "skill-groups.json");
  const groupsFilePath = sourceGroupsPath && fs.existsSync(sourceGroupsPath)
    ? sourceGroupsPath : GROUPS_FILE_PATH;
  try {
    const definitions = JSON.parse(fs.readFileSync(groupsFilePath, "utf8"));
    if (!isRecord(definitions) || definitions.schemaVersion !== 1 ||
        Object.keys(definitions).some((key) => !["schemaVersion", "groups"].includes(key)) ||
        !isRecord(definitions.groups) || Object.keys(definitions.groups).length === 0) {
      throw new Error("Expected schemaVersion 1 and a nonempty groups object.");
    }
    const knownSkills = new Set(registry.skills.map((entry) => entry.name));
    for (const [name, group] of Object.entries(definitions.groups)) {
      if (!CANONICAL_NAME.test(name) || name === "all" || !isRecord(group) ||
          Object.keys(group).some((key) => !["description", "skills"].includes(key)) ||
          typeof group.description !== "string" || group.description.trim().length === 0 ||
          !Array.isArray(group.skills) || group.skills.length === 0 ||
          new Set(group.skills).size !== group.skills.length) {
        throw new Error(`Invalid definition for group ${name}: use a canonical lowercase name, description, and nonempty skills list.`);
      }
      for (const skillName of group.skills) {
        if (typeof skillName !== "string" || !CANONICAL_NAME.test(skillName)) {
          throw new Error(`Group ${name} contains a noncanonical skill name.`);
        }
        if (!knownSkills.has(skillName)) {
          throw new Error(`Group ${name} references unknown skill ${skillName} in the effective catalog.`);
        }
      }
    }
    return definitions;
  } catch (cause) {
    throw new VasirCliError({
      code: "INVALID_SKILL_GROUPS",
      message: `Cannot load skill groups: ${cause.message}`,
      suggestion: "Repair or reinstall the package's skill-groups.json; when using a catalog override, include every referenced skill in its registry.",
      docsRef: ADD_REFERENCE_DOCS_REF,
      context: { groupsFilePath },
      cause
    });
  }
}

export function resolveSkillGroups({ definitions, requestedGroupNames = [] }) {
  const selectedGroups = [...new Set(requestedGroupNames.length > 0
    ? requestedGroupNames : Object.keys(definitions.groups))];
  const groups = selectedGroups.map((name) => {
    if (!Object.hasOwn(definitions.groups, name)) {
      throw new VasirCliError({
        code: "UNKNOWN_SKILL_GROUP",
        message: `Unknown skill group: ${name}`,
        suggestion: "Run `vasir groups` to see valid names; repeat `--group <name>` once for each group to install.",
        docsRef: ADD_REFERENCE_DOCS_REF,
        context: { groupName: name, availableGroups: Object.keys(definitions.groups) }
      });
    }
    const group = definitions.groups[name];
    const skills = [...new Set(group.skills)];
    return { name, description: group.description, skills, skillCount: skills.length };
  });
  const skills = [...new Set(groups.flatMap((group) => group.skills))];
  return { selectedGroups, groups, skills, skillCount: skills.length };
}
