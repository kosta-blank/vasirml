import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const reviewRoot = new URL("../docs/review/", import.meta.url);
const readJson = (name) => JSON.parse(fs.readFileSync(new URL(name, reviewRoot), "utf8"));

test("public review catalog and tracker retain pending status without invented completion dates", () => {
  for (const document of [readJson("catalog.json"), readJson("change-tracker.json")]) {
    assert.equal(document.sourceReviewsCompleted, 39);
    assert.equal(document.counts.all, 67);
    assert.equal(document.counts.files, 225);
    assert.equal(document.counts.reviewed, 38);
    assert.equal(document.counts.pendingReview, 29);
    const pending = document.skills.filter((skill) => skill.reviewStatus === "pending");
    assert.equal(pending.length, 29);
    for (const skill of pending) {
      assert.equal(skill.changeStatus, "imported", skill.id);
      assert.equal("reviewCompletedOn" in skill, false, skill.id);
    }
  }
});

test("interactive map renders pending imports separately from accepted reviewed changes", () => {
  const html = fs.readFileSync(new URL("skill-map.html", reviewRoot), "utf8");
  const embedded = html.match(/<script type="application\/json" id="review-data">([\s\S]*?)<\/script>/);
  const script = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(embedded && script, "interactive map exposes its data and renderer");
  const elements = { "review-data": { textContent: embedded[1] }, groups: {}, inspector: {} };
  let click;
  const document = {
    getElementById: (id) => elements[id],
    querySelectorAll: () => [],
    addEventListener: (name, callback) => { assert.equal(name, "click"); click = callback; }
  };
  vm.runInNewContext(script[1], { document }, { timeout: 1000 });
  assert.match(elements.groups.innerHTML, /Review pending/);
  const select = (id) => click({ target: { closest: () => ({ dataset: { skill: id } }) } });
  select("art-direction-defining-game-art");
  assert.match(elements.inspector.innerHTML, /Content review pending/);
  assert.match(elements.inspector.innerHTML, /<h3>Source import<\/h3>/);
  assert.doesNotMatch(elements.inspector.innerHTML, /<h3>Accepted changes<\/h3>/);
  select("code-auditing");
  assert.match(elements.inspector.innerHTML, /Review complete/);
  assert.match(elements.inspector.innerHTML, /<h3>Accepted changes<\/h3>/);
});
