import { motion } from "framer-motion";
import { projects } from "../data/content";
import SectionHead from "./SectionHead";
import { ArrowIcon } from "./Icons";

const ease = [0.19, 1, 0.22, 1];

function ProjectCard({ p, i }) {
  const dark = i === 1 || i === 2;

  return (
    <motion.article
      className={`${dark ? "card-dark" : "card"} proj-card${dark ? " is-dark" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease }}
    >
      <div className="proj-top">
        <span className="proj-num">{p.number}</span>
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
          <a className="ulink" href={p.github}>
            GitHub <ArrowIcon style={{ width: 14, height: 14 }} />
          </a>
          <a className="ulink" href={p.demo}>
            {p.demoLabel} <ArrowIcon style={{ width: 14, height: 14 }} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="wrap">
        <SectionHead num="03" kicker="Things I've built" lines={[<>Selected <em>projects</em></>]} />
        <div className="projects-grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.number} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
