import { motion } from "framer-motion";
import {
  siArduino,
  siBlender,
  siC,
  siCelery,
  siCplusplus,
  siDocker,
  siFastapi,
  siFlask,
  siFrappe,
  siGit,
  siHtml5,
  siJavascript,
  siMongodb,
  siMysql,
  siNumpy,
  siOpencv,
  siOpenjdk,
  siPandas,
  siPostgresql,
  siPython,
  siRaspberrypi,
  siReact,
  siRedis,
  siScikitlearn,
  siTemporal,
  siTensorflow,
  siTypescript,
} from "simple-icons";
import SectionHead from "./SectionHead";
import { skillGroups } from "../data/content";

const logos = {
  "Scikit-learn": siScikitlearn,
  "TensorFlow / Keras": siTensorflow,
  NumPy: siNumpy,
  Pandas: siPandas,
  OpenCV: siOpencv,
  Python: siPython,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  C: siC,
  "C++": siCplusplus,
  Java: siOpenjdk,
  React: siReact,
  "React Native": siReact,
  FastAPI: siFastapi,
  Flask: siFlask,
  "MERN Stack": siMongodb,
  "HTML / CSS": siHtml5,
  Frappe: siFrappe,
  PostgreSQL: siPostgresql,
  Redis: siRedis,
  Celery: siCelery,
  Docker: siDocker,
  Temporal: siTemporal,
  MySQL: siMysql,
  Git: siGit,
  Arduino: siArduino,
  "Raspberry Pi": siRaspberrypi,
  Blender: siBlender,
};

// Generic skills with no brand logo get a simple drawn icon instead.
const drawn = {
  "Signal Processing": (
    <path d="M1 12h3l2-6 3 12 3-15 3 18 3-12 2 3h3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  ),
  SQL: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </g>
  ),
};

const ease = [0.19, 1, 0.22, 1];
const list = { hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

function Pill({ name }) {
  const icon = logos[name];
  return (
    <motion.span variants={item} className="skill-pill cursor-hover" style={{ "--brand": icon ? `#${icon.hex}` : "var(--maroon)" }}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {icon ? <path d={icon.path} /> : drawn[name]}
      </svg>
      {name}
    </motion.span>
  );
}

export default function Skills() {
  return (
    <div id="skills" className="section">
      <div className="wrap">
        <SectionHead num="02" kicker="Skills" lines={[<>Tools I <em>work with</em></>]} />
        <div className="skill-cards">
          {skillGroups.map((g, gi) => {
            const dark = gi === 1;
            return (
              <motion.div
                key={g.title}
                className={`${dark ? "card-dark" : "card"} skill-card${dark ? " is-dark" : ""}`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={list}
              >
                <motion.div className="skill-card-head" variants={item}>
                  <span className="skill-card-num">{String(gi + 1).padStart(2, "0")}</span>
                  <h3 className="skill-card-title">{g.title}</h3>
                  <span className="skill-card-count">{g.items.length}</span>
                </motion.div>
                <div className="skill-pills">
                  {g.items.map((name) => (
                    <Pill key={name} name={name} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
