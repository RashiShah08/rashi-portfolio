import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { stats } from "../data/content";
import Counter from "./Counter";
import Magnetic from "./Magnetic";
import Monogram from "./Monogram";
import Brainwave, { exciteWaves } from "./Brainwave";
import SplitText from "./SplitText";
import { PinIcon, ArrowIcon } from "./Icons";

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
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 110, damping: 18 });
  const sy = useSpring(my, { stiffness: 110, damping: 18 });
  const monoX = useTransform(sx, [-0.5, 0.5], [-22, 22]);
  const monoY = useTransform(sy, [-0.5, 0.5], [-16, 16]);
  const waveX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const readoutRef = useRef(null);
  const lastPoint = useRef(null);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);

    const point = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    const prev = lastPoint.current;
    if (prev) {
      const pxPerMs = Math.hypot(point.x - prev.x, point.y - prev.y) / Math.max(8, point.t - prev.t);
      exciteWaves(Math.min(0.25, pxPerMs * 0.08));
    }
    lastPoint.current = point;
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
    lastPoint.current = null;
  };

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
            I turn ideas into working software &mdash; full-stack apps and ML pipelines.
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
          </div>
        </motion.div>

        <motion.div
          {...pop(0.15)}
          className="card hero-photo"
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          onPointerCancel={handleLeave}
          style={{
            position: "relative",
            overflow: "hidden",
            touchAction: "pan-y",
            background: "linear-gradient(170deg, oklch(0.95 0.018 78), var(--cream-2) 55%, oklch(0.87 0.028 76))",
          }}
        >
          <motion.div style={{ position: "absolute", left: "50%", top: "45%", marginLeft: -110, marginTop: -110, x: monoX, y: monoY }}>
            <Monogram size={220} ring delay={0.6} />
          </motion.div>

          <motion.div style={{ position: "absolute", left: -20, right: -20, bottom: 84, x: waveX, opacity: 0.55 }}>
            <Brainwave height={80} seed={3} strokeWidth={1.4} readoutRef={readoutRef} />
          </motion.div>

          <div
            style={{
              position: "absolute",
              top: 22,
              left: 22,
              background: "var(--maroon)",
              color: "var(--cream)",
              borderRadius: 999,
              padding: "10px 18px",
              fontFamily: "Sora",
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "var(--depth-dark)",
            }}
          >
            <PinIcon style={{ width: 15, height: 15 }} />
            Mumbai, India
          </div>

          <div className="signal-bar">
            <span>Photo placeholder</span>
            <span className="signal-readout" title="Move across this card to excite the signal">
              <span className="signal-dot" />
              <span ref={readoutRef}>11.7 Hz · alpha</span>
            </span>
          </div>
        </motion.div>
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
