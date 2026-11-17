import fs from "node:fs";
import path from "node:path";

import { GENERATED_CONTRACT_HEADER, NONOBVIOUS_SOURCE_RELATIVE_PATH } from "./agents.js";
import { VasirCliError } from "./cli-error.js";
import { COMMANDS_REFERENCE_DOCS_REF } from "./docs-ref.js";
import { getEvalHistoryRootDirectory } from "./eval/history.js";
import { buildProjectPaths } from "./path-layout.js";
import { getProjectInstallStateFilePath, normalizeProjectInstallState } from "./project-install-state.js";

const BACKUPS_DIRECTORY = ".vasir-backups";

function uninstallError(code, message, suggestion, context = {}, cause) {
  return new VasirCliError({ code, message, suggestion, context, cause, docsRef: COMMANDS_REFERENCE_DOCS_REF });
}

function unsafePath(targetPath) {
  return uninstallError(
    "UNSAFE_UNINSTALL_PATH",
    "Uninstall requires a real directory or file at " + targetPath + ".",
    "Review the project path and its links before retrying.",
    { path: targetPath }
  );
}

function lstat(targetPath) {
  return fs.lstatSync(targetPath, { throwIfNoEntry: false });
}

function pathKey(targetPath) {
  return process.platform === "win32" ? targetPath.toLowerCase() : targetPath;
}

function samePath(first, second) {
  return pathKey(first) === pathKey(second);
}

function inspectProjectRoot(projectRootDirectory) {
  const filesystemRoot = path.parse(projectRootDirectory).root;
  const relativePath = path.relative(filesystemRoot, projectRootDirectory);
  let currentPath = filesystemRoot;
  for (const component of relativePath.split(path.sep).filter(Boolean)) {
    currentPath = path.join(currentPath, component);
    const stats = lstat(currentPath);
    if (!stats) {
      throw uninstallError(
        "PROJECT_ROOT_NOT_FOUND",
        "Project root does not exist: " + projectRootDirectory,
        "Pass an existing directory as an uninstall target.",
        { projectRootDirectory }
      );
    }
    if (!stats.isDirectory()) {
      throw unsafePath(currentPath);
    }
  }

  // Use the on-disk spelling for deduping paths on case-insensitive filesystems.
  return fs.realpathSync.native(projectRootDirectory);
}

function resolveTargets({ projectRootArgument, targetPaths, currentWorkingDirectory }) {
  if (projectRootArgument !== null && targetPaths.length > 0) {
    throw uninstallError(
      "INVALID_UNINSTALL_TARGETS",
      "Uninstall accepts positional project paths or --repo-root.",
      "Choose positional project paths for a batch, or --repo-root for one project."
    );
  }

  const requestedRoots = targetPaths.length > 0
    ? targetPaths
    : [projectRootArgument ?? buildProjectPaths({ currentWorkingDirectory }).projectRootDirectory];
  const roots = new Map();
  for (const target of requestedRoots) {
    if (target.length === 0) {
      throw uninstallError(
        "INVALID_UNINSTALL_TARGETS",
        "Uninstall received an empty project path.",
        "Pass . explicitly to target the current directory."
      );
    }
    const root = inspectProjectRoot(path.resolve(currentWorkingDirectory, target));
    const existingRoot = roots.get(pathKey(root));
    if (existingRoot && existingRoot !== root) {
      throw uninstallError(
        "OVERLAPPING_UNINSTALL_TARGETS",
        "Uninstall project roots differ only in case: " + existingRoot + " and " + root,
        "Run one uninstall per project."
      );
    }
    roots.set(pathKey(root), root);
  }

  for (const root of roots.values()) {
    let parent = root;
    while (parent !== path.dirname(parent)) {
      parent = path.dirname(parent);
      if (roots.has(pathKey(parent))) {
        throw uninstallError(
          "OVERLAPPING_UNINSTALL_TARGETS",
          "Uninstall project roots overlap: " + parent + " and " + root,
          "Run one uninstall per nested project.",
          { projectRootDirectory: root, parentProjectRootDirectory: parent }
        );
      }
    }
  }

  return [...roots.values()];
}

function relativeName(projectRootDirectory, absolutePath) {
  return path.relative(projectRootDirectory, absolutePath).split(path.sep).join("/");
}

function isSafeName(name) {
  // Also reject Windows device names, alternate streams, and path aliases in
  // state written on other platforms and later copied to Windows.
  return typeof name === "string" && name.length > 0 &&
    !/[\\/:*?"<>|\u0000-\u001f]/.test(name) &&
    !/[. ]$/.test(name) &&
    !/^(con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)/i.test(name);
}

function readTrackedSkills(statePath) {
  try {
    const state = normalizeProjectInstallState(JSON.parse(fs.readFileSync(statePath, "utf8")));
    const names = new Map();
    for (const [name, entry] of Object.entries(state.skills)) {
      if (!isSafeName(name) || names.has(pathKey(name))) {
        throw new Error("Invalid or duplicate skill name.");
      }
      for (const file of [...entry.managedFiles, ...Object.keys(entry.fileHashes)]) {
        if (typeof file !== "string" || !file.split("/").every(isSafeName)) {
          throw new Error("Invalid managed file path.");
        }
      }
      names.set(pathKey(name), name);
    }
    return names;
  } catch (cause) {
    throw uninstallError(
      "INVALID_PROJECT_INSTALL_STATE",
      "Uninstall could not verify skill ownership from " + statePath + ".",
      "Restore a valid install-state file before retrying.",
      { installStateFilePath: statePath },
      cause
    );
  }
}

function matchesProjectAlias(aliasPath, target, skillsPath, skillsStats) {
  const relative = path.relative(path.dirname(aliasPath), skillsPath);
  const candidates = [relative, skillsPath, path.toNamespacedPath(skillsPath)];
  // Match equivalent direct spellings without collapsing arbitrary parent
  // segments across a symlink on the way to the skill tree.
  const normalizeAlias = (value) => {
    const spelling = process.platform === "win32" ? value.replace(/\//g, "\\") : value;
    const { root } = path.parse(spelling);
    const components = spelling.slice(root.length).split(path.sep);
    return root + components.filter((component) => component !== "." && component !== "").join(path.sep);
  };
  if (!candidates.some((candidate) => samePath(normalizeAlias(candidate), normalizeAlias(target)))) {
    return false;
  }
  try {
    const aliasTarget = fs.realpathSync.native(aliasPath);
    return Boolean(skillsStats) && aliasTarget === fs.realpathSync.native(skillsPath);
  } catch (error) {
    if (["ENOENT", "ENOTDIR"].includes(error.code)) {
      return !skillsStats;
    }
    if (error.code === "ELOOP") {
      return false;
    }
    throw error;
  }
}

function planProject(projectRootDirectory) {
  const paths = buildProjectPaths({ projectRootDirectory });
  const statePath = getProjectInstallStateFilePath(paths);
  const configPath = paths.projectConfigFilePath;
  const evalHistoryPath = getEvalHistoryRootDirectory({ projectRootDirectory });
  const moves = [];
  const aliases = [];
  const preserved = new Set();
  const warnings = [];
  const preserve = (absolutePath) => preserved.add(relativeName(projectRootDirectory, absolutePath));
  const addMove = (absolutePath, stats) => {
    moves.push({ path: relativeName(projectRootDirectory, absolutePath), action: "move", stats });
  };

  const agentsStats = lstat(paths.agentsDirectory);
  if (agentsStats && !agentsStats.isDirectory()) {
    throw unsafePath(paths.agentsDirectory);
  }
  const stateStats = lstat(statePath);
  if (stateStats && !stateStats.isFile()) {
    throw unsafePath(statePath);
  }
  const trackedSkills = stateStats ? readTrackedSkills(statePath) : new Map();
  const configStats = lstat(configPath);

  const skillsStats = lstat(paths.projectSkillsDirectory);
  if (skillsStats && !skillsStats.isDirectory()) {
    throw unsafePath(paths.projectSkillsDirectory);
  }
  const skillEntries = skillsStats ? fs.readdirSync(paths.projectSkillsDirectory).sort() : [];
  const evaluatedSkills = new Set();
  for (const name of skillEntries) {
    const skillPath = path.join(paths.projectSkillsDirectory, name);
    const trackingKey = pathKey(name);
    const trackedName = trackedSkills.get(trackingKey);
    if (trackedName && evaluatedSkills.has(trackingKey)) {
      throw uninstallError(
        "AMBIGUOUS_UNINSTALL_SKILL_NAME",
        "Skill directory names differ only in case in " + paths.projectSkillsDirectory + ".",
        "Review the conflicting skill directories before retrying.",
        { projectRootDirectory, skillName: trackedName }
      );
    }
    evaluatedSkills.add(trackingKey);
    const trackedPath = trackedName && path.join(paths.projectSkillsDirectory, trackedName);
    const skillStats = trackedPath ? lstat(trackedPath) : null;
    if (skillStats?.isDirectory()) {
      addMove(skillPath, skillStats);
    } else {
      preserve(skillPath);
    }
  }
  if (agentsStats) {
    for (const name of fs.readdirSync(paths.agentsDirectory)) {
      if (!["skills", statePath, configPath, evalHistoryPath].some((known) => samePath(path.basename(known), name))) {
        preserve(path.join(paths.agentsDirectory, name));
      }
    }
  }
  const contracts = [];
  const preservedContracts = [];
  for (const name of ["AGENTS.md", "CLAUDE.md"]) {
    const contractPath = path.join(projectRootDirectory, name);
    const stats = lstat(contractPath);
    if (stats?.isFile() && fs.readFileSync(contractPath, "utf8").split(/\r?\n/).some(
      (line) => line.trim() === GENERATED_CONTRACT_HEADER
    )) {
      contracts.push({ contractPath, stats });
    } else if (stats) {
      preserve(contractPath);
      preservedContracts.push(name);
    }
  }
  const generatedContractFound = contracts.length > 0;
  const hasVasirOwnership = Boolean(stateStats || configStats?.isFile() || generatedContractFound);
  if (preservedContracts.length > 0) {
    warnings.push("Review retained root contracts without the Vasir generation marker: " + preservedContracts.join(", ") + ".");
  }
  const evalHistoryStats = lstat(evalHistoryPath);
  if (evalHistoryStats?.isDirectory()) {
    addMove(evalHistoryPath, evalHistoryStats);
  } else if (evalHistoryStats) {
    preserve(evalHistoryPath);
  }
  const sidecarPath = path.join(projectRootDirectory, NONOBVIOUS_SOURCE_RELATIVE_PATH);
  const sidecarStats = lstat(sidecarPath);
  if (sidecarStats?.isFile() && generatedContractFound) {
    addMove(sidecarPath, sidecarStats);
  } else if (sidecarStats) {
    preserve(sidecarPath);
  }
  for (const { contractPath, stats } of contracts) {
    addMove(contractPath, stats);
  }

  for (const aliasPath of [paths.claudeSkillsAliasPath, paths.codexSkillsAliasPath]) {
    const parent = path.dirname(aliasPath);
    const parentStats = lstat(parent);
    if (!parentStats?.isDirectory()) {
      if (parentStats) {
        preserve(parent);
      }
      continue;
    }
    for (const name of fs.readdirSync(parent)) {
      if (!samePath(name, path.basename(aliasPath))) {
        preserve(path.join(parent, name));
      }
    }
    const stats = lstat(aliasPath);
    if (!stats) {
      continue;
    }
    if (stats.isSymbolicLink()) {
      const target = fs.readlinkSync(aliasPath);
      if (matchesProjectAlias(aliasPath, target, paths.projectSkillsDirectory, skillsStats)) {
        aliases.push({ path: relativeName(projectRootDirectory, aliasPath), action: "unlink", stats, target });
        continue;
      }
    }
    preserve(aliasPath);
  }
  if (!stateStats && skillEntries.length > 0 && (configStats || generatedContractFound || aliases.length > 0)) {
    throw uninstallError(
      "UNINSTALL_OWNERSHIP_UNKNOWN",
      "Potential Vasir skills exist without install state in " + projectRootDirectory + ".",
      "Restore the original .agents/vasir-install-state.json, or move the skill content to a safe location after reviewing its ownership.",
      { projectRootDirectory }
    );
  }
  if (configStats?.isFile()) {
    addMove(configPath, configStats);
  } else if (configStats) {
    preserve(configPath);
  }
  if (stateStats) {
    addMove(statePath, stateStats);
  }

  const operations = hasVasirOwnership ? [...aliases, ...moves] : moves;
  if (!hasVasirOwnership) {
    aliases.forEach((alias) => preserved.add(alias.path));
  }
  const backupBase = path.join(projectRootDirectory, BACKUPS_DIRECTORY);
  const backupStats = operations.length > 0 ? lstat(backupBase) : null;
  if (backupStats && !backupStats.isDirectory()) {
    throw unsafePath(backupBase);
  }
  const entries = operations.map(({ stats, ...entry }) => entry);
  return { projectRootDirectory, operations, entries, preservedPaths: [...preserved].sort(), warnings };
}

function checkRealDirectories(directory) {
  // Recheck each ancestor before mutating paths from the preflight plan.
  const canonical = inspectProjectRoot(directory);
  if (!samePath(directory, canonical)) {
    throw unsafePath(directory);
  }
}

function ensureBackupDirectory(projectRootDirectory, directory) {
  let currentPath = projectRootDirectory;
  for (const component of path.relative(projectRootDirectory, directory).split(path.sep)) {
    checkRealDirectories(currentPath);
    currentPath = path.join(currentPath, component);
    const stats = lstat(currentPath);
    if (!stats) {
      fs.mkdirSync(currentPath, { mode: 0o700 });
    } else if (!stats.isDirectory()) {
      throw unsafePath(currentPath);
    }
  }
}

function applyProject(plan, progress) {
  const { projectRootDirectory, entries, operations } = plan;
  const backupBase = path.join(projectRootDirectory, BACKUPS_DIRECTORY);
  checkRealDirectories(projectRootDirectory);
  ensureBackupDirectory(projectRootDirectory, backupBase);
  checkRealDirectories(backupBase);
  const timestamp = new Date().toISOString();
  const timestampPrefix = timestamp.replace(/[:.]/g, "-");
  progress.backupDirectory = fs.mkdtempSync(path.join(backupBase, "uninstall-" + timestampPrefix + "-"));

  const manifest = {
    schemaVersion: 1,
    createdAt: timestamp,
    projectRootDirectory,
    entries
  };
  checkRealDirectories(progress.backupDirectory);
  fs.writeFileSync(
    path.join(progress.backupDirectory, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    { flag: "wx", mode: 0o600 }
  );

  for (const operation of operations) {
    const source = path.join(projectRootDirectory, operation.path);
    let destination = null;
    if (operation.action === "move") {
      destination = path.join(progress.backupDirectory, operation.path);
      ensureBackupDirectory(projectRootDirectory, path.dirname(destination));
      checkRealDirectories(path.dirname(destination));
      if (lstat(destination)) {
        throw unsafePath(destination);
      }
    }
    checkRealDirectories(path.dirname(source));
    const stats = lstat(source);
    if (!stats || stats.dev !== operation.stats.dev || stats.ino !== operation.stats.ino ||
      stats.mode !== operation.stats.mode || stats.mtimeMs !== operation.stats.mtimeMs ||
      (operation.action === "unlink" && fs.readlinkSync(source) !== operation.target)) {
      throw uninstallError(
        "UNINSTALL_PATH_CHANGED",
        "Uninstall input changed after preflight: " + source,
        "Review the project for concurrent edits before retrying."
      );
    }
    if (operation.action === "unlink") {
      fs.unlinkSync(source);
    } else {
      fs.renameSync(source, destination);
    }
    progress.completedPaths.push(operation.path);
  }
}

export function uninstallProjects({ projectRootArgument, targetPaths, currentWorkingDirectory, dryRun }) {
  const roots = resolveTargets({ projectRootArgument, targetPaths, currentWorkingDirectory });
  const plans = roots.map(planProject);
  const projects = [];
  for (const plan of plans) {
    const progress = {
      projectRootDirectory: plan.projectRootDirectory,
      backupDirectory: null,
      completedPaths: []
    };
    if (!dryRun && plan.operations.length > 0) {
      try {
        applyProject(plan, progress);
      } catch (cause) {
        const backups = [...projects, progress].filter((project) => project.backupDirectory);
        throw uninstallError(
          "UNINSTALL_INCOMPLETE",
          "Uninstall stopped in " + progress.projectRootDirectory + ". " + cause.message,
          backups.length > 0
            ? "Review the backup manifests and the remaining project files before retrying. Recovery backups: " +
              backups.map((project) => project.backupDirectory).join(", ")
            : "Review the project path and file permissions before retrying.",
          { projects, failedProject: progress },
          cause
        );
      }
    }
    projects.push({ ...progress, entries: plan.entries, preservedPaths: plan.preservedPaths, warnings: plan.warnings });
  }
  return { dryRun, projects };
}
