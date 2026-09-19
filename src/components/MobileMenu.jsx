import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { contact, nav } from "../data/content";
import { CloseIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";
import Monogram from "./Monogram";
import { openResume } from "./Resume";
import { lockScroll } from "../scrollLock";

const ease = [0.19, 1, 0.22, 1];
const list = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const scrollToSection = (href) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });

function Sheet({ active, onClose, onNavigate }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const unlock = lockScroll();
    closeRef.current?.focus();
    // The phone's back gesture closes the menu instead of leaving the site (one entry, however often this runs).
    if (!history.state?.menu) history.pushState({ menu: true }, "");
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [onClose]);

  const go = (href) => (e) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <motion.div
      className="mm"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ clipPath: "circle(0% at calc(100% - 48px) 56px)" }}
      animate={{ clipPath: "circle(150% at calc(100% - 48px) 56px)", transition: { duration: 0.7, ease } }}
      exit={{ clipPath: "circle(0% at calc(100% - 48px) 56px)", transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
    >
      <div className="mm-top">
        <a href="#home" className="mm-brand" onClick={go("#home")}>
          <Monogram size={42} fill="var(--maroon-dark)" />
          <span>Rashi Shah</span>
        </a>
        <button ref={closeRef} type="button" className="mm-close" aria-label="Close menu" onClick={() => onClose()}>
          <CloseIcon />
        </button>
      </div>

      <motion.nav className="mm-links" variants={list} initial="hidden" animate="show">
        {nav.map((n, i) => (
          <motion.a
            key={n.href}
            href={n.href}
            variants={item}
            onClick={go(n.href)}
            className={active === n.href ? "is-active" : undefined}
            aria-current={active === n.href ? "true" : undefined}
          >
            <span className="mm-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="mm-label">{n.label}</span>
            {active === n.href && <span className="mm-here">you&apos;re here</span>}
          </motion.a>
        ))}
      </motion.nav>

      <motion.div className="mm-foot" variants={item} initial="hidden" animate="show" transition={{ delay: 0.45 }}>
        <div className="mm-actions">
          <button
            type="button"
            className="mm-pill is-outline"
            onClick={() => onNavigate(openResume)}
          >
            Resume
          </button>
          <a href="#contact" className="mm-pill is-solid" onClick={go("#contact")}>
            Contact Me
          </a>
        </div>
        <div className="mm-social">
          <a href={`mailto:${contact.email}`} aria-label="Email">
            <MailIcon />
          </a>
          <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <a href={contact.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GitHubIcon />
          </a>
          <span className="mm-mail">{contact.email}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * The phone and tablet menu: a full-screen maroon sheet that opens from the menu button.
 * Opening adds a history entry so the back gesture closes it. Closing from inside the sheet
 * takes that entry back off first, then scrolls (or opens the resume) once the browser has
 * finished going back, so the two never fight over the scroll position.
 */
export default function MobileMenu({ open, active, setOpen }) {
  const pending = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPop = () => {
      setOpen(false);
      const next = pending.current;
      pending.current = null;
      if (typeof next === "string") setTimeout(() => scrollToSection(next), 40);
      else if (typeof next === "function") setTimeout(next, 120);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open, setOpen]);

  const leave = useCallback(
    (next = null) => {
      pending.current = next;
      if (history.state?.menu) history.back();
      else {
        setOpen(false);
        if (typeof next === "string") setTimeout(() => scrollToSection(next), 40);
        else if (typeof next === "function") setTimeout(next, 120);
      }
    },
    [setOpen],
  );
  const close = useCallback(() => leave(), [leave]);

  return createPortal(
    <AnimatePresence>{open && <Sheet active={active} onClose={close} onNavigate={leave} />}</AnimatePresence>,
    document.body,
  );
}
