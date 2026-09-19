// POST /api/contact - a Vercel serverless function (and, in development, a Vite middleware).
import pg from "pg";
import { handleContact } from "../server/contact.js";
import { gmailSender } from "../server/gmail.js";

const MAX_BODY = 16 * 1024;
let pool;

// One small pool per warm function instance; Neon's pooled URL handles the fan-in.
function database() {
  if (globalThis.__contactDb) return globalThis.__contactDb; // the in-memory database used in development
  if (!process.env.DATABASE_URL) return null;
  pool ??= new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1, idleTimeoutMillis: 10_000 });
  return pool;
}

async function readJson(req) {
  if (req.body !== undefined) return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw Object.assign(new Error("too large"), { status: 413 });
    chunks.push(chunk);
  }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : undefined;
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (status === 405) res.setHeader("Allow", "POST");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  let body;
  try {
    if (Number(req.headers["content-length"] || 0) > MAX_BODY) return send(res, 413, { ok: false, error: "too_large" });
    if (req.method === "POST") body = await readJson(req);
  } catch (err) {
    return send(res, err.status || 400, { ok: false, error: err.status === 413 ? "too_large" : "bad_request" });
  }

  try {
    const result = await handleContact(
      {
        method: req.method,
        contentType: req.headers["content-type"],
        origin: req.headers.origin,
        host: req.headers["x-forwarded-host"] || req.headers.host,
        // Vercel puts the real client address first; it is only ever stored hashed.
        ip: String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim(),
        userAgent: req.headers["user-agent"],
        body,
      },
      {
        db: database(),
        sendMail: globalThis.__contactMail ?? gmailSender(process.env),
        salt: process.env.CONTACT_SALT || process.env.GMAIL_CLIENT_SECRET || "portfolio-contact",
        log: console.error,
      },
    );
    return send(res, result.status, result.body);
  } catch (err) {
    console.error("contact: failed", err?.message);
    return send(res, 500, { ok: false, error: "server_error" });
  }
}
