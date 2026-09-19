// The contact form's backend: validate, rate-limit, store in Postgres, then email the owner.
// Pure of any web framework: callers pass the request's parts in and send the returned
// { status, body } back out, which is what lets the tests run it without a server.
import { createHash } from "node:crypto";

export const LIMITS = { name: 80, email: 120, message: 2000, messageMin: 10 };
export const RATE = { perSender: 3, perSite: 40, windowMinutes: 10, siteWindowMinutes: 60 };
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;

export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id          BIGSERIAL PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    message     TEXT NOT NULL,
    sender_hash TEXT NOT NULL,
    user_agent  TEXT,
    emailed     BOOLEAN NOT NULL DEFAULT false
  )`,
  "CREATE INDEX IF NOT EXISTS contact_messages_sender_time ON contact_messages (sender_hash, created_at)",
];

// Any fixed number: the advisory lock that serialises rate-limit checks across every function instance.
const RATE_LOCK = 7_240_301;

// A pg Pool hands out a dedicated client for the transaction; PGlite (tests, local dev) has its own API.
async function withTransaction(db, work) {
  if (typeof db.transaction === "function") return db.transaction(work);
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

// The table is created on first use, once per database connection.
const ready = new WeakSet();
async function ensureSchema(db) {
  if (ready.has(db)) return;
  for (const statement of SCHEMA) await db.query(statement);
  ready.add(db);
}

// Control characters out (newlines and tabs stay in the message), whitespace trimmed.
/* oxlint-disable no-control-regex -- stripping control characters is the point */
const CONTROL = /[\u0000-\u001F\u007F]/g;
const CONTROL_EXCEPT_LINES = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
/* oxlint-enable no-control-regex */
// Zero-width and bidi-override characters: invisible, and able to make a name or subject read reversed.
const INVISIBLE = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/g;
const clean = (value, keepLines = false) =>
  String(value ?? "")
    .replace(keepLines ? CONTROL_EXCEPT_LINES : CONTROL, keepLines ? "" : " ")
    .replace(INVISIBLE, "")
    .trim();

// Only real strings count; an object or array sent as a field is treated as empty, never stringified.
const text = (value) => (typeof value === "string" ? value : "");

export function validate(input) {
  const name = clean(text(input?.name)).replace(/\s+/g, " ");
  const email = clean(text(input?.email));
  const message = clean(text(input?.message), true).replace(/\r\n?/g, "\n");
  const errors = {};
  if (!name) errors.name = "Please tell me your name.";
  else if (name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;
  if (!EMAIL.test(email) || email.length > LIMITS.email) errors.email = "That email doesn't look right.";
  if (message.length < LIMITS.messageMin) errors.message = "A little more detail, please (10+ characters).";
  else if (message.length > LIMITS.message) errors.message = `Please keep it under ${LIMITS.message} characters.`;
  return { values: { name, email, message }, errors };
}

// Visitors are counted by a salted hash of their IP, so the raw address is never stored.
export const senderHash = (ip, salt) =>
  createHash("sha256").update(`${salt}:${ip || "unknown"}`).digest("hex").slice(0, 32);

const reply = (status, body) => ({ status, body });

/**
 * @param req   { method, contentType, origin, host, ip, userAgent, body } - body already parsed JSON (or undefined)
 * @param deps  { db: { query(text, params) }, sendMail(values) | null, salt }
 */
export async function handleContact(req, deps) {
  if (req.method !== "POST") return reply(405, { ok: false, error: "method_not_allowed" });
  if (!/^application\/json\b/i.test(req.contentType || "")) return reply(415, { ok: false, error: "json_only" });
  // Browsers always send Origin on a cross-site POST; only this site's own pages may submit.
  if (req.origin) {
    let originHost = null;
    try {
      originHost = new URL(req.origin).host;
    } catch {
      /* malformed origin */
    }
    if (originHost !== req.host) return reply(403, { ok: false, error: "forbidden_origin" });
  }
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return reply(400, { ok: false, error: "bad_request" });
  }
  // The hidden field only bots fill in: pretend it worked, keep nothing.
  if (req.body.botcheck) return reply(200, { ok: true });

  const { values, errors } = validate(req.body);
  if (Object.keys(errors).length) return reply(422, { ok: false, error: "invalid", fields: errors });

  if (!deps.db) return reply(503, { ok: false, error: "not_configured" });
  await ensureSchema(deps.db);

  const sender = senderHash(req.ip, deps.salt);
  // Count and insert under one lock. Without it, a burst of simultaneous requests all read
  // the same count before any of them writes, and every one gets through the limit.
  const id = await withTransaction(deps.db, async (tx) => {
    await tx.query("SELECT pg_advisory_xact_lock($1)", [RATE_LOCK]);
    const { rows } = await tx.query(
      `SELECT
         count(*) FILTER (WHERE sender_hash = $1 AND created_at > now() - make_interval(mins => $2))::int AS mine,
         count(*) FILTER (WHERE created_at > now() - make_interval(mins => $3))::int AS everyone
       FROM contact_messages`,
      [sender, RATE.windowMinutes, RATE.siteWindowMinutes],
    );
    if (rows[0].mine >= RATE.perSender || rows[0].everyone >= RATE.perSite) return null;
    const inserted = await tx.query(
      `INSERT INTO contact_messages (name, email, message, sender_hash, user_agent)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [values.name, values.email, values.message, sender, clean(text(req.userAgent)).slice(0, 300) || null],
    );
    return inserted.rows[0].id;
  });
  if (id === null) return reply(429, { ok: false, error: "too_many" });

  // Saved first, so a mail outage never loses a message; the email is a best-effort alert.
  if (deps.sendMail) {
    try {
      await deps.sendMail(values);
      await deps.db.query("UPDATE contact_messages SET emailed = true WHERE id = $1", [id]);
    } catch (err) {
      deps.log?.("contact: saved but not emailed", err?.message);
    }
  }
  return reply(200, { ok: true });
}
