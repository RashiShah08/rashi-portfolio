import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { timelineColumns } from "../data/content";

function Column({ col, colIndex }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <div className="card" style={{ padding: "26px 26px 10px" }}>
      <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, marginBottom: 18 }}>{col.title}</div>
      <div ref={ref} style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 6, top: 8, bottom: 24, width: 2, background: "var(--line)" }} />
        <motion.div
          style={{
            position: "absolute",
            left: 6,
            top: 8,
            bottom: 24,
            width: 2,
            background: "var(--maroon)",
            scaleY: progress,
            transformOrigin: "top",
          }}
        />
        {col.items.map((t, i) => (
          <Reveal key={t.title} delay={colIndex * 0.08 + i * 0.06} y={16}>
            <motion.div
              className="cursor-hover"
              whileHover={{ x: 6 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", gap: 18, paddingBottom: 22 }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "var(--maroon)",
                  flex: "none",
                  marginTop: 3,
                  boxShadow: "0 0 0 4px var(--cream)",
                  position: "relative",
                }}
              />
              <div>
                <div className="eyebrow" style={{ marginBottom: 5, fontSize: 11.5 }}>
                  {t.date} &middot; {t.kind}
                </div>
                <h3 style={{ fontSize: 17, marginBottom: 5 }}>{t.title}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.55 }}>{t.description}</p>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Timeline() {
  return (
    <div id="timeline" className="section">
      <div className="wrap">
        <SectionHead num="04" kicker="The journey so far" lines={[<>The <em>journey</em></>]} />
        <div className="tl-cols">
          {timelineColumns.map((col, i) => (
            <Column key={col.title} col={col} colIndex={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
