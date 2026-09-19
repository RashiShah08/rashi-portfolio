// Browser-window chrome and the preview dialog, shared by the project cards and the resume.
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowIcon, CloseIcon, DownloadIcon } from "./Icons";
import { lockScroll } from "../scrollLock";

const ease = [0.19, 1, 0.22, 1];

export const external = (url) => (url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});
export const addressOf = (project) =>
  project.preview.address ??
  (project.preview.url ? new URL(project.preview.url).host : `${project.title} · desktop app`);

export const ctaLabel = { site: "Try it live", app: "View app" };
export const thumbLabel = { site: "Try {t} live", app: "View {t} preview" };

export function WindowBar({ project, children }) {
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

export function PreviewModal({ project, onClose }) {
  const { preview } = project;
  const closeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const opener = document.activeElement;
    const unlock = lockScroll();
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlock();
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
          {preview.download && (
            <a className="pv-action" href={preview.download} download>
              <DownloadIcon style={{ width: 15, height: 15 }} /> <span className="pv-action-label">Download</span>
            </a>
          )}
          {preview.url && (
            <a className="pv-action" href={preview.url} target="_blank" rel="noopener noreferrer">
              <span className="pv-action-label">{preview.download ? "Open PDF" : "Open in new tab"}</span>{" "}
              <ArrowIcon style={{ width: 14, height: 14 }} />
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
          ) : preview.type === "doc" ? (
            <div className="pv-doc">
              <img src={preview.image} alt={preview.alt} />
            </div>
          ) : (
            <img src={preview.image} alt={preview.alt} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
