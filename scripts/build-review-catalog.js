import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildSkillCatalogEntry } from "../cli/skill-metadata.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const metadata = JSON.parse(fs.readFileSync(path.join(root, "registry/review-metadata.json"), "utf8"));
const skillRoot = path.join(root, ".agents/skills");
const outputRoot = path.join(root, "docs/review");
const mode = process.argv.slice(2);
if (mode.length !== 1 || !["--write", "--check"].includes(mode[0])) {
  throw new Error("Use node scripts/build-review-catalog.js --write or --check.");
}
const allowed = new Set(["id", "canonicalId", "sourceId", "label", "tier", "tierBasis", "group", "reviewStatus", "reviewCompletedOn", "origin", "changeStatus", "summary", "historicalBaselineBundleSha256", "consolidatedFrom"]);
const canonical = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const tiers = ["Core", "Optional", "Outside pack"];
const bases = ["shortlist-recommendation", "coordinator-recommendation", "explicit-selection"];
const unsafe = /(?<![A-Za-z0-9])[A-Za-z]:[\\/]|file:\/\/|codex:\/\/|chatgpt\.com\/|sourceChatId|sourceNotePath|humanReviewInstruction|implementationAuthorization|Bearer\s+|sk-[A-Za-z0-9]{15}/;
if (metadata.schemaVersion !== 1 || unsafe.test(JSON.stringify(metadata))) {
  throw new Error("Invalid or nonportable public review metadata.");
}
const names = fs.readdirSync(skillRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
const ids = metadata.skills.map((skill) => skill.id).sort();
if (new Set(ids).size !== ids.length || JSON.stringify(names) !== JSON.stringify(ids)) {
  throw new Error("Review metadata must describe exactly the current skill catalog.");
}
const groupIds = new Set(metadata.groups.map((group) => group.id));
const groupedSkills = metadata.groups.flatMap((group) => group.skills);
if (groupIds.size !== metadata.groups.length || JSON.stringify([...groupedSkills].sort()) !== JSON.stringify(ids)) {
  throw new Error("Workflow groups must cover each current skill exactly once.");
}
for (const relationship of metadata.relationships) {
  if (!ids.includes(relationship.a) || !ids.includes(relationship.b)) throw new Error("Relationship references an unknown skill.");
}
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
function filesIn(directory, relative = "") {
  return fs.readdirSync(path.join(directory, relative), { withFileTypes: true }).flatMap((entry) => {
    if (entry.isSymbolicLink()) throw new Error("Review catalog cannot contain linked skill files.");
    const name = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) return filesIn(directory, name);
    if (!entry.isFile()) throw new Error("Review catalog requires regular files.");
    return [name];
  }).sort();
}
const texts = new Map();
const skills = [...metadata.skills].sort((a, b) => a.id.localeCompare(b.id, "en")).map((skill) => {
  if (Object.keys(skill).some((key) => !allowed.has(key)) || !canonical.test(skill.id) || skill.canonicalId !== skill.id ||
      !tiers.includes(skill.tier) || !bases.includes(skill.tierBasis) || skill.reviewStatus !== "complete" ||
      !groupIds.has(skill.group) || !metadata.groups.find((group) => group.id === skill.group).skills.includes(skill.id)) {
    throw new Error(`Invalid public metadata for ${skill.id}.`);
  }
  const directory = path.join(skillRoot, skill.id);
  const entry = buildSkillCatalogEntry({ skillDirectoryPath: directory, relativeSkillDirectoryPath: `.agents/skills/${skill.id}` });
  const text = fs.readFileSync(path.join(directory, "SKILL.md"), "utf8");
  texts.set(skill.id, text);
  const files = filesIn(directory).map((name) => {
    const bytes = fs.readFileSync(path.join(directory, name));
    return { path: name, bytes: bytes.length, sha256: hash(bytes) };
  });
  const bundleSha256 = hash(files.map((file) => `${file.path}\0${file.sha256}\n`).join(""));
  return { ...skill, description: entry.description, skillPath: `../../.agents/skills/${skill.id}/SKILL.md`,
    mainWords: text.trim().split(/\s+/u).length, bundleSha256, files };
});
const counts = { all: skills.length, core: skills.filter((skill) => skill.tier === "Core").length,
  optional: skills.filter((skill) => skill.tier === "Optional").length, outside: skills.filter((skill) => skill.tier === "Outside pack").length,
  explicitSelections: skills.filter((skill) => skill.tierBasis === "explicit-selection").length,
  files: skills.reduce((sum, skill) => sum + skill.files.length, 0) };
const catalog = { schemaVersion: 1, collection: metadata.collection, tierPolicy: metadata.tierPolicy,
  sourceReviewsCompleted: metadata.sourceReviewsCompleted, counts, groups: metadata.groups, relationships: metadata.relationships, skills };
const tracker = { schemaVersion: 1, collection: metadata.collection,
  hashMethod: "SHA-256 of sorted UTF-8 relativePath + NUL + fileSha256 + LF entries",
  baselinePolicy: "Historical baseline hashes describe source/import bundles before review and portability changes. Current hashes describe this repository's final canonical bundles; historical hashes are provenance, not current-file acceptance checks.",
  sourceReviewsCompleted: metadata.sourceReviewsCompleted, counts,
  skills: skills.map(({ id, sourceId, origin, changeStatus, reviewStatus, reviewCompletedOn, summary,
    historicalBaselineBundleSha256, consolidatedFrom, bundleSha256, files }) => ({ id, sourceId, origin, changeStatus,
    reviewStatus, reviewCompletedOn, summary, historicalBaselineBundleSha256, consolidatedFrom, bundleSha256, files })) };
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const installGroups = JSON.parse(fs.readFileSync(path.join(root, "skill-groups.json"), "utf8")).groups;
const readme = `# Reviewed skill catalog\n\nThe active catalog contains ${counts.all} canonical skills and ${counts.files} files. ${metadata.sourceReviewsCompleted} source reviews were completed; two reviewed frontend source bundles were replaced by the approved frontend foundation. The custom milestone planner and consolidated foundation retain their provenance.\n\nBrowse the [interactive map](skill-map.html), [catalog metadata](catalog.json), or [accepted change tracker](change-tracker.json). Skill links point to the current repository files. The HTML map is a standalone read-only page; open it in a browser after cloning or downloading the repository.\n\nSelection tiers contain ${counts.core} Core, ${counts.optional} Optional, and ${counts.outside} Outside pack skills. These are recommendations for an ML/engineering management workflow, with ${counts.explicitSelections} explicitly recorded Optional selections; remaining tiers come from the shortlist or coordinator recommendation. All ${counts.all} skills remain available. These tiers differ from the install groups in [skill-groups.json](../../skill-groups.json), which contain ${installGroups.base.skills.length} base and ${installGroups.frontend.skills.length} frontend skills. Tiers select neither installations nor AGENTS profiles. Software proof does not establish ML model quality.\n\nPublic curation lives in [registry/review-metadata.json](../../registry/review-metadata.json). Update its labels, summaries, grouping, or tier basis when agreed decisions change. The generator reads the current skill descriptions, text, file inventories, and hashes directly from the repository. It needs no external review workspace, transcript archive, installed skill copies, or provider calls.\n\nAfter changing skills or curation, run:\n\n\`\`\`sh\nnode scripts/build-review-catalog.js --write\nnode scripts/build-review-catalog.js --check\n\`\`\`\n\nGeneration is deterministic. The tracker distinguishes historical source/import hashes from current canonical bundle hashes; consolidation has no invented baseline. The files record accepted content changes and review completion, without original audit proposals, private review conversations, or deferred trial instructions. They describe content review and catalog integrity, not measured behavioral skill performance.\n`;

const embedded = JSON.stringify({ ...catalog, skills: skills.map((skill) => ({ ...skill, text: texts.get(skill.id) })) }).replaceAll("<", "\\u003c");
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Reviewed skill map</title>
<style>
:root{color-scheme:light;--ink:#292524;--muted:#57534e;--line:#d6d3d1;--paper:#fafaf9;--accent:#1c5b4b}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 system-ui,sans-serif}main{max-width:1400px;margin:auto;padding:32px}h1,h2,h3{line-height:1.2}h1{font-size:32px;margin:0}h2{font-size:23px}h3{font-size:17px}a{color:var(--accent)}button{font:inherit;cursor:pointer;color:inherit}.sm-head{display:flex;flex-wrap:wrap;gap:12px 24px;align-items:center;justify-content:space-between}.sm-intro{max-width:80ch;color:var(--muted)}.sm-filters{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0}.btn{border:1px solid var(--line);background:white;border-radius:6px;padding:8px 14px}.btn[aria-pressed=true]{background:var(--accent);border-color:var(--accent);color:white}.sm-layout{display:grid;grid-template-columns:minmax(360px,1fr) minmax(360px,1fr);gap:24px}.sm-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-content:start}.sm-group,.sm-inspector{padding:20px;border:1px solid var(--line);border-radius:10px;background:white}.sm-group h2{font-size:17px;margin-top:0}.sm-skill{display:block;width:100%;text-align:left;border:0;background:transparent;border-radius:5px;padding:8px 6px}.sm-skill:hover,.sm-skill[aria-pressed=true]{background:#e8f1ed}.sm-skill small{display:block;color:var(--muted)}.sm-inspector{align-self:start;position:sticky;top:16px}.text-small{font-size:13px;color:var(--muted)}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.5 ui-monospace,monospace;background:var(--paper);padding:16px;max-height:550px;overflow:auto}details{margin-top:20px}summary{cursor:pointer;font-weight:600}.sm-relationships{padding-left:20px}.sm-empty{grid-column:1/-1;color:var(--muted)}button:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #b45309;outline-offset:3px}@media(max-width:850px){main{padding:20px}.sm-layout{grid-template-columns:1fr}.sm-inspector{position:static}}@media(max-width:500px){.sm-groups{grid-template-columns:1fr}}
</style></head><body><main>
<header class="sm-head"><h1>Reviewed skill map</h1><nav aria-label="Review documents"><a href="README.md">About the catalog</a> · <a href="change-tracker.json">Change tracker</a></nav></header>
<p class="sm-intro">Explore ${counts.all} reviewed skills by the work they support. Core, Optional and Outside pack are selection recommendations; all skills remain available. ${counts.explicitSelections} Optional selections were recorded explicitly. Install groups and AGENTS profiles are separate choices.</p>
<div class="sm-filters" role="group" aria-label="Selection tier"><button class="btn" data-scope="all" aria-pressed="true">All · ${counts.all}</button><button class="btn" data-scope="core" aria-pressed="false">Core · ${counts.core}</button><button class="btn" data-scope="optional" aria-pressed="false">Optional · ${counts.optional}</button><button class="btn" data-scope="outside" aria-pressed="false">Outside pack · ${counts.outside}</button></div>
<div class="sm-layout"><section class="sm-groups" id="groups" aria-label="Workflow groups"></section><section class="sm-inspector" id="inspector" aria-label="Selected skill" aria-live="polite"></section></div>
<p class="text-small">${metadata.sourceReviewsCompleted} source reviews completed · ${counts.files} canonical files · Content review does not measure behavioral performance. Historical IDs are provenance, not CLI aliases.</p>
<noscript>Enable JavaScript for the interactive map, or read <a href="catalog.json">the complete catalog</a>.</noscript>
</main><script type="application/json" id="review-data">${embedded}</script><script>
const data=JSON.parse(document.getElementById('review-data').textContent);
const skills=new Map(data.skills.map(skill=>[skill.id,skill]));
let scope='all',active=data.skills[0].id;
const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const visible=skill=>scope==='all'||skill.tier===({core:'Core',optional:'Optional',outside:'Outside pack'}[scope]);
const basis=skill=>({'explicit-selection':'Explicit Optional selection','shortlist-recommendation':'Shortlist recommendation','coordinator-recommendation':'Coordinator recommendation'}[skill.tierBasis]);
function render(){
 document.getElementById('groups').innerHTML=data.groups.map(group=>{const members=group.skills.map(id=>skills.get(id)).filter(visible);return members.length?'<article class="sm-group"><h2>'+escape(group.name)+' <span class="text-small">'+members.length+'</span></h2>'+members.map(skill=>'<button class="sm-skill" data-skill="'+escape(skill.id)+'" aria-pressed="'+(skill.id===active)+'">'+escape(skill.label)+'<small>'+escape(skill.tier)+'</small></button>').join('')+'</article>':'';}).join('');
 const skill=skills.get(active),relations=data.relationships.filter(item=>item.a===active||item.b===active);
 document.getElementById('inspector').innerHTML='<h2>'+escape(skill.label)+'</h2><p><a href="'+escape(skill.skillPath)+'">'+escape(skill.id)+'</a></p><p>'+escape(skill.description)+'</p><p class="text-small">'+escape(skill.tier)+' · '+escape(basis(skill))+' · Review complete'+(skill.reviewCompletedOn?' · '+escape(skill.reviewCompletedOn):'')+'</p><h3>Accepted changes</h3><p>'+escape(skill.summary)+'</p><p class="text-small">'+skill.files.length+' files · '+skill.mainWords+' main-file words · '+escape(skill.changeStatus)+'</p><h3>Related skills</h3><ul class="sm-relationships">'+relations.map(item=>{const other=skills.get(item.a===active?item.b:item.a);return '<li><button class="btn" data-related="'+escape(other.id)+'">'+escape(other.label)+'</button><p class="text-small">'+escape(item.type)+': '+escape(item.why)+'</p></li>';}).join('')+'</ul><details><summary>Current skill instructions</summary><pre>'+escape(skill.text)+'</pre></details><details><summary>File inventory and provenance</summary><p class="text-small">Source ID: '+escape(skill.sourceId)+'<br>Origin: '+escape(skill.origin)+'<br>Current bundle SHA-256: '+escape(skill.bundleSha256)+'</p><ul>'+skill.files.map(file=>'<li>'+escape(file.path)+' · '+file.bytes+' bytes</li>').join('')+'</ul></details>';
 document.querySelectorAll('[data-scope]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scope===scope)));
}
document.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.scope){scope=button.dataset.scope;if(!visible(skills.get(active)))active=data.skills.find(visible).id;}if(button.dataset.skill)active=button.dataset.skill;if(button.dataset.related){scope='all';active=button.dataset.related;}render();});
render();
</script></body></html>\n`;
const outputs = { "README.md": readme, "catalog.json": json(catalog), "change-tracker.json": json(tracker), "skill-map.html": html };
const stale = [];
for (const [name, contents] of Object.entries(outputs)) {
  const destination = path.join(outputRoot, name);
  if (mode[0] === "--write") {
    fs.mkdirSync(outputRoot, { recursive: true });
    fs.writeFileSync(destination, contents, "utf8");
  } else if (!fs.existsSync(destination) || fs.readFileSync(destination, "utf8").replaceAll("\r\n", "\n") !== contents) stale.push(name);
}
if (stale.length) throw new Error(`Stale public review files: ${stale.join(", ")}. Run --write.`);
console.log(`Public review catalog ${mode[0] === "--write" ? "generated" : "current"}: ${counts.all} skills, ${counts.files} files, ${metadata.groups.length} groups, ${metadata.relationships.length} relationships.`);
