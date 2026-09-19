import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "../data/content";
import SectionHead from "./SectionHead";
import { ArrowIcon } from "./Icons";
import { PreviewModal, WindowBar, ctaLabel, external, thumbLabel } from "./Preview";

const ease = [0.19, 1, 0.22, 1];

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
