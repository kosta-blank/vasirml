const HOSTS = ["codex", "claude"];
const ROLES = ["default", "planning", "execution", "subagent", "review", "design"];
const REASONING_EFFORTS = new Set(["none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"]);
const MODEL_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function requireRecord(value, location) {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(value))) {
    throw new Error(`Unexpected ${location} shape; expected an object.`);
  }
}

function requireKnownFields(value, fields, location) {
  for (const field of Object.keys(value)) {
    if (!fields.includes(field)) {
      throw new Error(`Unexpected ${location} field: ${field}.`);
    }
  }
}

function normalizeRoute(rawRoute, location, allowFallback) {
  requireRecord(rawRoute, location);
  requireKnownFields(rawRoute, allowFallback ? ["host", "model", "reasoningEffort", "fallback"] : ["host", "model", "reasoningEffort"], location);
  if (typeof rawRoute.model !== "string" || rawRoute.model.trim() !== rawRoute.model ||
      !MODEL_ID_PATTERN.test(rawRoute.model)) {
    throw new Error(`Unexpected ${location} model; expected a nonempty safe model ID.`);
  }

  const route = { model: rawRoute.model };
  if (Object.hasOwn(rawRoute, "host")) {
    if (!HOSTS.includes(rawRoute.host)) {
      throw new Error(`Unexpected ${location} host; expected codex or claude.`);
    }
    route.host = rawRoute.host;
  }
  if (Object.hasOwn(rawRoute, "reasoningEffort")) {
    if (!REASONING_EFFORTS.has(rawRoute.reasoningEffort)) {
      throw new Error(`Unexpected ${location} reasoningEffort.`);
    }
    route.reasoningEffort = rawRoute.reasoningEffort;
  }
  if (Object.hasOwn(rawRoute, "fallback")) {
    route.fallback = normalizeRoute(rawRoute.fallback, `${location}.fallback`, false);
  }
  return route;
}

export function normalizeModelRouting(rawModelRouting) {
  if (rawModelRouting === null || rawModelRouting === undefined) {
    return null;
  }
  requireRecord(rawModelRouting, "agents.modelRouting");
  requireKnownFields(rawModelRouting, HOSTS, "agents.modelRouting");

  const modelRouting = {};
  for (const host of HOSTS) {
    if (!Object.hasOwn(rawModelRouting, host)) continue;
    const rawHost = rawModelRouting[host];
    requireRecord(rawHost, `agents.modelRouting.${host}`);
    requireKnownFields(rawHost, ROLES, `agents.modelRouting.${host}`);
    const hostRouting = {};
    for (const role of ROLES) {
      if (Object.hasOwn(rawHost, role)) {
        hostRouting[role] = normalizeRoute(rawHost[role], `agents.modelRouting.${host}.${role}`, true);
      }
    }
    modelRouting[host] = hostRouting;
  }
  return modelRouting;
}

function renderModel(route, targetHost, consumer) {
  const prefix = targetHost === consumer ? "" : `${targetHost === "codex" ? "Codex" : "Claude"}: `;
  return `${prefix}\`${route.model}\``;
}

function renderFallback(fallback, primaryHost, consumer) {
  if (!fallback) return "Report limitation";
  // An omitted fallback host follows the selected primary host, not the caller.
  return `${renderModel(fallback, fallback.host ?? primaryHost, consumer)} (${fallback.reasoningEffort ? `effort: \`${fallback.reasoningEffort}\`` : "host default effort"})`;
}

export function renderModelRoutingPolicy({ modelRouting, consumer }) {
  if (!HOSTS.includes(consumer)) {
    throw new Error(`Unsupported model-routing consumer: ${consumer}`);
  }
  const hostRouting = normalizeModelRouting(modelRouting)?.[consumer];
  const hostName = consumer === "codex" ? "Codex" : "Claude";
  if (!hostRouting || Object.keys(hostRouting).length === 0) {
    return `No project model routes are configured for ${hostName}. Inherit the host's model and reasoning settings; explicit user choices prevail. Routing does not change permissions.`;
  }

  const roles = [
    ["planning", "Planning"],
    ["execution", "Execution"],
    ["subagent", "Routine subagents"],
    ["review", "Independent review"],
    ["design", "Design"]
  ];
  const rows = roles.map(([role, label]) => {
    const route = hostRouting[role] ?? hostRouting.default;
    const primaryHost = route?.host ?? consumer;
    return route
      ? `| ${label} | ${renderModel(route, primaryHost, consumer)} | ${route.reasoningEffort ? `\`${route.reasoningEffort}\`` : "Host default"} | ${renderFallback(route.fallback, primaryHost, consumer)} |`
      : `| ${label} | Inherit host | Inherit host | Report limitation |`;
  });

  return `Project model routing for ${hostName}; omitted roles use the configured default, otherwise inherit the host.

| Role | Model | Reasoning effort | Fallback |
| --- | --- | --- | --- |
${rows.join("\n")}

- Explicit user model and effort choices prevail. Use only host-supported model and effort controls; the host validates availability.
- This text does not change the main model. Use an explicit host handoff or configured planner/executor delegation when supported; never claim a model change from text alone.
- A route's optional host selects Codex or Claude; it defaults to the current consumer. A fallback without a host stays on the primary route's host. Cross-host routes require an available, authorized runner, handoff, or delegation; never pass another host's model to the current host's model selector.
- Use Design for design deliverables and decisions, including product, UI/UX, visual, interaction, and architecture design; use Execution for routine implementation.
- If the requested host, model, or effort is unavailable, use only its configured fallback. State the original selection, fallback, and reason. If there is no fallback or it is also unavailable, report the limitation; do not invent another route or retry indefinitely.
- Run independent review in clean context, separate from the implementation conversation.
- Model routing does not change permissions or authorize additional actions.`;
}
