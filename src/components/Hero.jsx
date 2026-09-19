import { motion } from "framer-motion";
import { stats } from "../data/content";
import Counter from "./Counter";
import Magnetic from "./Magnetic";
import SplitText from "./SplitText";
import { ArrowIcon, DownloadIcon, PinIcon } from "./Icons";
import { openResume } from "./Resume";

const ease = [0.22, 1, 0.36, 1];
const pop = (delay) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease },
});

const btn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  height: 56,
  padding: "0 30px",
  borderRadius: 999,
  fontFamily: "Sora",
  fontSize: 15,
  fontWeight: 600,
};

export default function Hero() {
  return (
    <div id="home" className="wrap hero">
      <div className="hero-top">
        <motion.div
          {...pop(0.05)}
          className="card hero-intro"
          style={{ padding: "clamp(28px,3.4vw,56px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}
        >
          <span className="eyebrow">Computer Engineer</span>
          <SplitText
            as="h1"
            inView={false}
            delay={0.35}
            lines={["Hi, I'm", <em key="name">Rashi Shah.</em>]}
            style={{ fontSize: "var(--fs-display)", lineHeight: 1 }}
          />
          <p style={{ fontSize: "var(--fs-lead)", lineHeight: 1.65, color: "var(--ink-muted)", maxWidth: "42ch" }}>
            I turn ideas into working software - full-stack apps and ML pipelines.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 6 }}>
            <Magnetic as="a" href="#projects" className="btn3d" style={{ ...btn, background: "var(--maroon)", color: "var(--cream)" }}>
              View Projects <ArrowIcon style={{ width: 16, height: 16 }} />
            </Magnetic>
            <Magnetic
              as="a"
              href="#contact"
              style={{ ...btn, background: "transparent", color: "var(--maroon)", border: "2px solid var(--maroon)" }}
            >
              Contact Me
            </Magnetic>
            <button type="button" className="ulink hero-resume cursor-hover" onClick={openResume}>
              <DownloadIcon style={{ width: 16, height: 16 }} /> Resume
            </button>
          </div>
        </motion.div>

        <motion.figure {...pop(0.15)} className="card hero-photo">
          <img src="rashi.jpg" alt="Rashi Shah, smiling, in a white shirt and beige trousers" width="1200" height="1600" fetchPriority="high" />
          <figcaption className="hero-photo-chip">
            <PinIcon style={{ width: 15, height: 15 }} />
            Mumbai, India
          </figcaption>
        </motion.figure>
      </div>

      <div className="hero-stats">
        <motion.div
          {...pop(0.25)}
          className="card-dark hero-current"
          style={{ padding: "30px 32px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ position: "relative", width: 10, height: 10 }}>
              <motion.span
                animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "oklch(0.8 0.15 145)" }}
              />
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "oklch(0.8 0.15 145)" }} />
            </span>
            <span className="eyebrow" style={{ color: "var(--gold)" }}>
              Currently
            </span>
          </div>
          <div style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: "var(--fs-h3)", lineHeight: 1.15 }}>Engineering Student</div>
          <div style={{ fontSize: 14, opacity: 0.75 }}>DJ Sanghvi College of Engineering, Mumbai</div>
        </motion.div>

        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            {...pop(0.32 + i * 0.07)}
            className="card"
            style={{ padding: "28px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18 }}
          >
            <span style={{ fontFamily: "var(--serif)", fontSize: "var(--fs-stat)", fontWeight: 600, color: "var(--maroon)", lineHeight: 1 }}>
              <Counter value={s.value} suffix={s.suffix} decimals={s.suffix === "%" ? 2 : 0} />
            </span>
            <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-muted)", fontWeight: 700 }}>
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
