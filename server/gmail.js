// Sends the "new message" alert through the Gmail API with a send-only OAuth refresh token
// (the same kind BloodConnect uses). Plain text only, so nothing a visitor types can render as HTML.

const b64 = (text) => Buffer.from(text, "utf8").toString("base64");
const b64url = (text) => b64(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
// RFC 2047, so names with any script survive in the subject; CR/LF can never reach a header.
const header = (text) => `=?UTF-8?B?${b64(String(text).replace(/[\r\n]+/g, " "))}?=`;
// Defence in depth for a raw header value (e.g. Reply-To): strip every character that could
// start a new header line, so a crafted address can never inject Bcc/extra headers. The caller
// already validates, but the builder must be safe even if reached with unvalidated input.
const headerSafe = (text) => String(text).replace(/[\r\n\u0000-\u001F\u007F]/g, "").slice(0, 320);

export function buildMessage({ from, to, values }) {
  const email = headerSafe(values.email);
  const body = [
    `New message from your portfolio.`,
    ``,
    `Name:  ${values.name}`,
    `Email: ${email}`,
    ``,
    values.message,
    ``,
    `- Reply to this email to answer ${values.name} directly.`,
  ].join("\r\n");
  return [
    `From: ${header("Portfolio contact form")} <${headerSafe(from)}>`,
    `To: ${headerSafe(to)}`,
    `Reply-To: ${email}`,
    `Subject: ${header(`Portfolio message from ${values.name}`.slice(0, 150))}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    b64(body).replace(/.{76}/g, "$&\r\n"),
  ].join("\r\n");
}

/** Returns a sendMail(values) function, or null when the Gmail settings are missing. */
export function gmailSender(env, fetchImpl = fetch) {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_SENDER } = env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !GMAIL_SENDER) return null;
  const to = env.CONTACT_TO || GMAIL_SENDER;

  return async (values) => {
    const tokenRes = await fetchImpl("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GMAIL_CLIENT_ID,
        client_secret: GMAIL_CLIENT_SECRET,
        refresh_token: GMAIL_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });
    if (!tokenRes.ok) throw new Error(`gmail token ${tokenRes.status}`);
    const { access_token } = await tokenRes.json();

    const sendRes = await fetchImpl("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw: b64url(buildMessage({ from: GMAIL_SENDER, to, values })) }),
    });
    if (!sendRes.ok) throw new Error(`gmail send ${sendRes.status}`);
  };
}
