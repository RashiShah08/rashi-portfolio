// One-time setup for the contact form's email alerts.
//
//   node scripts/gmail-token.mjs <downloaded-client.json> [sender@gmail.com]
//
// Opens Google's consent page for a send-only Gmail permission, catches the answer on a
// local port, and writes GMAIL_CLIENT_ID / _SECRET / _REFRESH_TOKEN / _SENDER into
// .env.local (git-ignored). Nothing secret is printed. Finishes by sending a test email.
import http from "node:http";
import { createHash, randomBytes } from "node:crypto";
import { exec } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { gmailSender } from "../server/gmail.js";

const [clientFile, sender = "rashishah0803@gmail.com"] = process.argv.slice(2);
if (!clientFile || !existsSync(clientFile)) {
  console.error("Usage: node scripts/gmail-token.mjs <path to the downloaded client JSON> [sender@gmail.com]");
  process.exit(1);
}
const json = JSON.parse(readFileSync(clientFile, "utf8"));
const client = json.installed ?? json.web;
if (!client?.client_id || !client?.client_secret) {
  console.error("That file is not a Google OAuth client. Download it from Clients -> your Desktop app -> Download JSON.");
  process.exit(1);
}

const SCOPE = "https://www.googleapis.com/auth/gmail.send"; // send only: cannot read the mailbox
const state = randomBytes(16).toString("hex");
const verifier = randomBytes(32).toString("base64url");
const challenge = createHash("sha256").update(verifier).digest("base64url");

const server = http.createServer();
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const redirectUri = `http://127.0.0.1:${server.address().port}`;

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: client.client_id,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    login_hint: sender,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

console.log("\nOpening Google in your browser. If it does not open, paste this link:\n\n" + authUrl + "\n");
exec(process.platform === "win32" ? `start "" "${authUrl}"` : `open "${authUrl}" || xdg-open "${authUrl}"`);

const code = await new Promise((resolve, reject) => {
  server.on("request", (req, res) => {
    const url = new URL(req.url, redirectUri);
    if (!url.searchParams.has("code") && !url.searchParams.has("error")) return res.end();
    const done = (text) => res.end(`<p style="font:16px sans-serif;margin:40px">${text}</p>`);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    if (url.searchParams.get("state") !== state) {
      done("Something went wrong (state mismatch). Close this tab and run the script again.");
      return reject(new Error("state mismatch"));
    }
    if (url.searchParams.get("error")) {
      done("Permission was not given. Close this tab and run the script again.");
      return reject(new Error(url.searchParams.get("error")));
    }
    done("Done. You can close this tab and go back to the terminal.");
    resolve(url.searchParams.get("code"));
  });
}).finally(() => server.close());

const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    code,
    client_id: client.client_id,
    client_secret: client.client_secret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
    code_verifier: verifier,
  }),
});
const tokens = await tokenRes.json();
if (!tokenRes.ok || !tokens.refresh_token) {
  console.error("Google did not return a refresh token:", tokens.error_description || tokens.error || tokenRes.status);
  process.exit(1);
}

const values = {
  GMAIL_CLIENT_ID: client.client_id,
  GMAIL_CLIENT_SECRET: client.client_secret,
  GMAIL_REFRESH_TOKEN: tokens.refresh_token,
  GMAIL_SENDER: sender,
};
const envFile = new URL("../.env.local", import.meta.url);
const kept = existsSync(envFile)
  ? readFileSync(envFile, "utf8").split(/\r?\n/).filter((line) => line && !/^GMAIL_(CLIENT_ID|CLIENT_SECRET|REFRESH_TOKEN|SENDER)=/.test(line))
  : [];
writeFileSync(envFile, [...kept, ...Object.entries(values).map(([k, v]) => `${k}=${v}`)].join("\n") + "\n");
console.log("Saved GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN and GMAIL_SENDER to .env.local (git-ignored).");

try {
  await gmailSender({ ...values, CONTACT_TO: sender })({
    name: "Portfolio setup",
    email: sender,
    message: "Your portfolio's contact form can now email you. This is the one-time test message.",
  });
  console.log(`Sent a test email to ${sender} - check your inbox.`);
} catch (err) {
  console.error("Saved, but the test email failed:", err.message, "- is the Gmail API enabled for this project?");
  process.exit(1);
}
