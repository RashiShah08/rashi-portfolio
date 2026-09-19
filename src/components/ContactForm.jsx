import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact } from "../data/content";
import { ArrowIcon } from "./Icons";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 80, email: 120, message: 2000 };

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = "Please tell me your name.";
  if (!EMAIL.test(email.trim())) errors.email = "That email doesn't look right.";
  if (message.trim().length < 10) errors.message = "A little more detail, please (10+ characters).";
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "", botcheck: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed | limited

  const update = (field) => (e) => {
    const value = field === "botcheck" ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    if (values.botcheck) return; // a bot filled the hidden field

    setStatus("sending");
    try {
      // The site's own serverless function (api/contact.js): stores the message, then emails it to me.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          botcheck: values.botcheck,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 422 && result.fields) {
        setErrors(result.fields);
        setStatus("idle");
        return;
      }
      if (response.status === 429) {
        setStatus("limited");
        return;
      }
      if (!response.ok || !result.ok) throw new Error(result.error || "Send failed");
      setStatus("sent");
      setValues({ name: "", email: "", message: "", botcheck: false });
    } catch {
      setStatus("failed");
    }
  };

  const field = (name, label, props = {}) => (
    <label className={`cf-field${errors[name] ? " has-error" : ""}`}>
      <span className="cf-label">{label}</span>
      {props.as === "textarea" ? (
        <textarea
          name={name}
          rows={5}
          value={values[name]}
          onChange={update(name)}
          maxLength={LIMITS[name]}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `cf-${name}-error` : undefined}
          placeholder={props.placeholder}
        />
      ) : (
        <input
          name={name}
          type={props.type ?? "text"}
          autoComplete={props.autoComplete}
          value={values[name]}
          onChange={update(name)}
          maxLength={LIMITS[name]}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `cf-${name}-error` : undefined}
          placeholder={props.placeholder}
        />
      )}
      {errors[name] && (
        <span className="cf-error" id={`cf-${name}-error`}>
          {errors[name]}
        </span>
      )}
    </label>
  );

  return (
    <div className="cf" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            className="cf-done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <span className="cf-done-mark" aria-hidden="true">
              ✓
            </span>
            <h3>Message sent.</h3>
            <p>Thank you! I&apos;ll get back to you at the email you gave.</p>
            <button type="button" className="cf-again cursor-hover" onClick={() => setStatus("idle")}>
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={submit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <div className="cf-row">
              {field("name", "Name", { autoComplete: "name", placeholder: "Your name" })}
              {field("email", "Email", { type: "email", autoComplete: "email", placeholder: "you@example.com" })}
            </div>
            {field("message", "Message", { as: "textarea", placeholder: "What would you like to talk about?" })}

            {/* hidden from people; bots that fill every field give themselves away */}
            <input
              type="checkbox"
              name="botcheck"
              className="cf-honeypot"
              tabIndex={-1}
              autoComplete="off"
              checked={values.botcheck}
              onChange={update("botcheck")}
              aria-hidden="true"
            />

            <div className="cf-foot">
              <button type="submit" className="cf-send btn3d cursor-hover" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
                {status !== "sending" && <ArrowIcon style={{ width: 16, height: 16 }} />}
              </button>
              {status === "limited" && (
                <p className="cf-failed" role="alert">
                  That&apos;s a few messages in a short time - please try again in a little while, or email me at{" "}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </p>
              )}
              {status === "failed" && (
                <p className="cf-failed" role="alert">
                  Couldn&apos;t send just now. Please email me at{" "}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
