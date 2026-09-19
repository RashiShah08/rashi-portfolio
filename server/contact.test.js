import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { handleContact, RATE, validate } from "./contact.js";
import { buildMessage, gmailSender } from "./gmail.js";

const good = { name: "Asha Mehta", email: "asha@example.com", message: "Hello Rashi, I'd love to talk about an internship." };
const request = (over = {}) => ({
  method: "POST",
  contentType: "application/json",
  origin: "https://rashi.dev",
  host: "rashi.dev",
  ip: "203.0.113.7",
  userAgent: "test",
  body: { ...good },
  ...over,
});

let db, mailed, deps;
beforeEach(async () => {
  db = new PGlite();
  mailed = [];
  deps = { db, salt: "s", sendMail: async (v) => mailed.push(v) };
});
const rows = async () => (await db.query("SELECT * FROM contact_messages ORDER BY id")).rows;

test("a valid message is stored and emailed", async () => {
  const res = await handleContact(request(), deps);
  assert.deepEqual(res, { status: 200, body: { ok: true } });
  const [row] = await rows();
  assert.equal(row.name, good.name);
  assert.equal(row.email, good.email);
  assert.equal(row.message, good.message);
  assert.equal(row.emailed, true);
  assert.equal(mailed.length, 1);
});

test("the visitor's IP is never stored, only a salted hash", async () => {
  await handleContact(request(), deps);
  const [row] = await rows();
  assert.ok(!JSON.stringify(row).includes("203.0.113.7"));
  assert.match(row.sender_hash, /^[0-9a-f]{32}$/);
});

test("a mail outage still keeps the message", async () => {
  deps.sendMail = async () => {
    throw new Error("gmail down");
  };
  const res = await handleContact(request(), deps);
  assert.equal(res.status, 200);
  const [row] = await rows();
  assert.equal(row.emailed, false);
});

test("without email settings the message is still stored", async () => {
  deps.sendMail = null;
  assert.equal((await handleContact(request(), deps)).status, 200);
  assert.equal((await rows()).length, 1);
});

test("invalid fields come back with a message for each", async () => {
  const res = await handleContact(request({ body: { name: " ", email: "nope", message: "short" } }), deps);
  assert.equal(res.status, 422);
  assert.deepEqual(Object.keys(res.body.fields).sort(), ["email", "message", "name"]);
  assert.equal((await db.query("SELECT to_regclass('contact_messages') AS t")).rows[0].t, null);
});

test("oversized fields are refused", async () => {
  const res = await handleContact(request({ body: { ...good, name: "x".repeat(81), message: "y".repeat(2001) } }), deps);
  assert.equal(res.status, 422);
  assert.ok(res.body.fields.name && res.body.fields.message);
});

test("the honeypot makes a bot think it worked, and nothing is kept or sent", async () => {
  const res = await handleContact(request({ body: { ...good, botcheck: true } }), deps);
  assert.deepEqual(res, { status: 200, body: { ok: true } });
  assert.equal(mailed.length, 0);
  assert.equal((await db.query("SELECT to_regclass('contact_messages') AS t")).rows[0].t, null);
});

test("another site cannot post to the form", async () => {
  for (const origin of ["https://evil.example", "null", "not a url"]) {
    assert.equal((await handleContact(request({ origin }), deps)).status, 403, origin);
  }
  assert.equal(mailed.length, 0);
});

test("only JSON POSTs are accepted", async () => {
  assert.equal((await handleContact(request({ method: "GET" }), deps)).status, 405);
  assert.equal((await handleContact(request({ contentType: "text/plain" }), deps)).status, 415);
  assert.equal((await handleContact(request({ contentType: "application/x-www-form-urlencoded" }), deps)).status, 415);
  for (const body of [undefined, null, "text", [good]]) {
    assert.equal((await handleContact(request({ body }), deps)).status, 400);
  }
});

test("one sender is limited, and other senders are not affected", async () => {
  for (let i = 0; i < RATE.perSender; i++) assert.equal((await handleContact(request(), deps)).status, 200);
  assert.equal((await handleContact(request(), deps)).status, 429);
  assert.equal((await handleContact(request({ ip: "198.51.100.9" }), deps)).status, 200);
  assert.equal((await rows()).length, RATE.perSender + 1);
});

test("the whole site is capped per hour, so a flood cannot burn the email quota", async () => {
  for (let i = 0; i < RATE.perSite; i++) {
    assert.equal((await handleContact(request({ ip: `10.0.0.${i}` }), deps)).status, 200);
  }
  assert.equal((await handleContact(request({ ip: "10.0.1.1" }), deps)).status, 429);
});

test("without a database the form reports it is not set up", async () => {
  deps.db = null;
  assert.deepEqual(await handleContact(request(), deps), { status: 503, body: { ok: false, error: "not_configured" } });
});

test("control characters are stripped, line breaks in the message are kept", () => {
  const { values, errors } = validate({ name: "Asha\u0000\r\nMehta", email: " a@b.co ", message: "line one\r\nline two\u0007" });
  assert.deepEqual(errors, {});
  assert.equal(values.name, "Asha Mehta");
  assert.equal(values.email, "a@b.co");
  assert.equal(values.message, "line one\nline two");
});

test("emails that could smuggle headers are rejected", () => {
  for (const email of ["a@b.co\r\nBcc: x@y.z", "a b@c.co", "<a@b.co>", "a@b", "a@b.co,c@d.co"]) {
    assert.ok(validate({ ...good, email }).errors.email, email);
  }
});

test("the alert email cannot be given extra headers by a crafted name", () => {
  const raw = buildMessage({ from: "me@gmail.com", to: "me@gmail.com", values: { ...good, name: "Eve\r\nBcc: victim@x.com" } });
  const headers = raw.split("\r\n\r\n")[0];
  assert.ok(!/^Bcc:/im.test(headers));
  assert.match(headers, /^Reply-To: asha@example\.com$/m);
  assert.match(headers, /^Subject: =\?UTF-8\?B\?/m);
});

test("the Gmail sender refreshes a token, then sends", async () => {
  const calls = [];
  const fakeFetch = async (url, init) => {
    calls.push([url, init]);
    return url.includes("oauth2")
      ? { ok: true, json: async () => ({ access_token: "tok" }) }
      : { ok: true, json: async () => ({}) };
  };
  const env = { GMAIL_CLIENT_ID: "id", GMAIL_CLIENT_SECRET: "sec", GMAIL_REFRESH_TOKEN: "ref", GMAIL_SENDER: "me@gmail.com" };
  await gmailSender(env, fakeFetch)(good);
  assert.equal(calls.length, 2);
  assert.equal(calls[1][1].headers.Authorization, "Bearer tok");
  const raw = Buffer.from(JSON.parse(calls[1][1].body).raw, "base64url").toString();
  assert.match(raw, /^To: me@gmail\.com$/m);
  assert.equal(gmailSender({}, fakeFetch), null);
});

test("a failed Gmail call is reported, not swallowed", async () => {
  const env = { GMAIL_CLIENT_ID: "id", GMAIL_CLIENT_SECRET: "sec", GMAIL_REFRESH_TOKEN: "ref", GMAIL_SENDER: "me@gmail.com" };
  await assert.rejects(gmailSender(env, async () => ({ ok: false, status: 401 }))(good), /token 401/);
});

test("a burst of simultaneous requests cannot slip past the limit", async () => {
  await handleContact(request({ ip: "192.0.2.1" }), deps); // first message creates the table
  const burst = await Promise.all(Array.from({ length: 30 }, () => handleContact(request({ ip: "192.0.2.1" }), deps)));
  assert.equal(burst.filter((r) => r.status === 200).length, RATE.perSender - 1);
  assert.equal(burst.filter((r) => r.status === 429).length, 30 - (RATE.perSender - 1));
  assert.equal(mailed.length, RATE.perSender);
});

test("a simultaneous flood from many addresses still stops at the site-wide cap", async () => {
  await handleContact(request({ ip: "198.18.0.0" }), deps);
  const burst = await Promise.all(Array.from({ length: 80 }, (_, i) => handleContact(request({ ip: `198.18.1.${i}` }), deps)));
  assert.equal(burst.filter((r) => r.status === 200).length, RATE.perSite - 1);
  assert.equal(mailed.length, RATE.perSite);
});

test("invisible and right-to-left override characters are removed", () => {
  const rlo = String.fromCharCode(0x202e);
  const zwsp = String.fromCharCode(0x200b);
  const { values } = validate({ name: `Asha${rlo}moc.live${zwsp}`, email: "a@b.co", message: `hello${zwsp} there, friend` });
  assert.equal(values.name, "Ashamoc.live");
  assert.equal(values.message, "hello there, friend");
});

test("with a pg-style pool the insert runs in a transaction, and a failure rolls back", async () => {
  const log = [];
  const client = { query: async (text, params) => (log.push(text.trim().split(/\s+/)[0]), db.query(text, params)), release: () => log.push("release") };
  const pool = { query: (t, p) => db.query(t, p), connect: async () => client };
  assert.equal((await handleContact(request(), { ...deps, db: pool })).status, 200);
  assert.deepEqual(log.filter((x) => ["BEGIN", "COMMIT", "ROLLBACK", "release"].includes(x)), ["BEGIN", "COMMIT", "release"]);

  log.length = 0;
  client.query = async (text, params) => {
    log.push(text.trim().split(/\s+/)[0]);
    if (text.includes("INSERT")) throw new Error("disk full");
    return db.query(text, params);
  };
  await assert.rejects(handleContact(request({ ip: "203.0.113.99" }), { ...deps, db: pool }), /disk full/);
  assert.deepEqual(log.filter((x) => ["BEGIN", "COMMIT", "ROLLBACK", "release"].includes(x)), ["BEGIN", "ROLLBACK", "release"]);
});

test("fields sent as objects, arrays or numbers are refused, not turned into text", async () => {
  const res = await handleContact(request({ body: { name: { a: 1 }, email: ["a@b.co"], message: 1234567890123 } }), deps);
  assert.equal(res.status, 422);
  assert.deepEqual(Object.keys(res.body.fields).sort(), ["email", "message", "name"]);
});

test("SQL and HTML in a message are stored as plain text and nothing else changes", async () => {
  const body = {
    name: "Robert'); DROP TABLE contact_messages;--",
    email: "sql@example.com",
    message: "<script>alert(1)</script> ' OR 1=1; DELETE FROM contact_messages; --",
  };
  assert.equal((await handleContact(request({ body }), deps)).status, 200);
  const [row] = await rows();
  assert.equal(row.name, body.name);
  assert.equal(row.message, body.message);
  assert.equal((await rows()).length, 1);
});

test("a __proto__ key cannot change how the request is handled", async () => {
  const body = JSON.parse('{"__proto__":{"botcheck":true},"name":"P","email":"p@example.com","message":"prototype pollution try"}');
  const res = await handleContact(request({ body }), deps);
  assert.equal(res.status, 200);
  assert.equal(mailed.length, 1, "treated as a real message, not as a bot");
  assert.equal({}.botcheck, undefined);
});
