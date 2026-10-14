import { eventConfig } from "../config/eventConfig.js";

const humanize = (key) => key.replace(/([A-Z])/g, " $1").toLowerCase();

/** A single configurable value, or a visible placeholder when it's unset. */
export function Field({ name, fields = eventConfig.fields }) {
  const v = fields[name];
  if (v) return <span>{v}</span>;
  return (
    <span className="ph" title="Not set yet — edit src/config/eventConfig.js">
      [{humanize(name)} TBD]
    </span>
  );
}

/** Replaces {tokens} in a string with Field values/placeholders. */
export function fillTemplate(str, fields = eventConfig.fields) {
  return str.split(/(\{\w+\})/g).map((part, i) => {
    const m = part.match(/^\{(\w+)\}$/);
    if (!m) return part;
    return <Field key={i} name={m[1]} fields={fields} />;
  });
}

/** Names of config values that are still unset (used for the dev badge). */
export function missingConfig() {
  const c = eventConfig;
  const missing = Object.entries(c.fields)
    .filter(([, v]) => !v)
    .map(([k]) => humanize(k));
  if (c.recipientName.startsWith("[")) missing.unshift("recipient name");
  if (!c.poster) missing.push("poster");
  if (!c.performers.length) missing.push("performers");
  if (!c.reply.email && !c.reply.phone) missing.push("reply email/phone");
  return missing;
}
