import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "../data/content";
import SectionHead from "./SectionHead";
import { ArrowIcon, CloseIcon } from "./Icons";

const ease = [0.19, 1, 0.22, 1];

const external = (url) => (url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});
const addressOf = (project) =>
  project.preview.url ? new URL(project.preview.url).host : `${project.title} · desktop app`;

const ctaLabel = { site: "Try it live", app: "View app" };
const thumbLabel = { site: "Try {t} live", app: "View {t} preview" };

function WindowBar({ project, children }) {
  return (
    <span className="pv-bar">
      <span className="pv-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="pv-address">{addressOf(project)}</span>
      {children}
    </span>
  );
}

function PreviewThumb({ project, onOpen }) {
  const { preview } = project;
  return (
    <button
      type="button"
      className={`pv-thumb is-${preview.type} cursor-hover`}
      onClick={() => onOpen(project)}
      aria-label={thumbLabel[preview.type].replace("{t}", project.title)}
    >
      <WindowBar project={project} />
      <span className="pv-shot">
        <img src={preview.image} alt={preview.alt} loading="lazy" />
      </span>
      <span className="pv-cta">
        {ctaLabel[preview.type]} <ArrowIcon style={{ width: 14, height: 14 }} />
      </span>
    </button>
  );
}

function PreviewModal({ project, onClose }) {
  const { preview } = project;
  const closeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="pv-backdrop"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} preview`}
        className={`pv-modal is-${preview.type}`}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.45, ease }}
        onClick={(e) => e.stopPropagation()}
      >
        <WindowBar project={project}>
          {preview.url && (
            <a className="pv-action" href={preview.url} {...external(preview.url)}>
              <span className="pv-action-label">Open in new tab</span> <ArrowIcon style={{ width: 14, height: 14 }} />
            </a>
          )}
          <button ref={closeRef} type="button" className="pv-close" aria-label="Close preview" onClick={onClose}>
            <CloseIcon />
          </button>
        </WindowBar>
        <div className="pv-body">
          {preview.type === "site" ? (
            <>
              {!loaded && <div className="pv-loading">{preview.loading ?? "Loading the live site…"}</div>}
              <iframe
                src={preview.url}
                title={`${project.title}, running live`}
                onLoad={() => setLoaded(true)}
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-top-navigation-to-custom-protocols"
                referrerPolicy="no-referrer"
              />
            </>
          ) : (
            <img src={preview.image} alt={preview.alt} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ p, i, onOpen }) {
  // checkerboard across a two-column grid, however many projects there are
  const dark = i % 4 === 1 || i % 4 === 2;
  const number = String(i + 1).padStart(2, "0");

  return (
    <motion.article
      className={`${dark ? "card-dark" : "card"} proj-card${dark ? " is-dark" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease }}
    >
      {p.preview && <PreviewThumb project={p} onOpen={onOpen} />}
      <div className="proj-top">
        <span className="proj-num">{number}</span>
        <span className="eyebrow proj-meta">{p.meta}</span>
      </div>
      <h3 className="proj-title">{p.title}</h3>
      <p className="proj-desc">{p.description}</p>
      <div className="proj-foot">
        <div className="proj-tags">
          {p.tech.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <div className="proj-links">
          <a className="ulink" href={p.github} {...external(p.github)}>
            GitHub <ArrowIcon style={{ width: 14, height: 14 }} />
          </a>
          {p.demo && (
            <a className="ulink" href={p.demo} {...external(p.demo)}>
              {p.demoLabel} <ArrowIcon style={{ width: 14, height: 14 }} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="projects" className="section">
      <div className="wrap">
        <SectionHead num="03" kicker="Things I've built" lines={[<>Selected <em>projects</em></>]} />
        <div className="projects-grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} p={p} i={i} onOpen={setOpen} />
          ))}
        </div>
      </div>
      <AnimatePresence>{open && <PreviewModal key={open.title} project={open} onClose={close} />}</AnimatePresence>
    </section>
  );
}
