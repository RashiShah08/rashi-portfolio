import { useId } from "react";
import { motion } from "framer-motion";

export default function Monogram({ size = 44, ring = false, fill = "var(--maroon)", ink = "var(--cream)", delay = 0 }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <motion.div
      initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: size,
        height: size,
        flex: "none",
        filter: "drop-shadow(0 10px 14px oklch(0.22 0.07 22 / 0.35))",
      }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
        <defs>
          <radialGradient id={`light${uid}`} cx="34%" cy="26%" r="80%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
          </radialGradient>
          <path id={`arc${uid}`} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill={fill} />
        <circle cx="100" cy="100" r="98" fill={`url(#light${uid})`} />
        <circle cx="100" cy="100" r="89" fill="none" stroke="var(--gold)" strokeOpacity="0.6" strokeWidth="1.4" />
        {ring && (
          <>
            <circle cx="100" cy="100" r="58" fill="none" stroke="var(--gold)" strokeOpacity="0.45" strokeWidth="1" />
            <g style={{ transformOrigin: "100px 100px", animation: "seal-spin 30s linear infinite" }}>
              <text fill="var(--gold)" style={{ fontFamily: "Sora, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3 }}>
                <textPath href={`#arc${uid}`}>RASHI SHAH · COMPUTER ENGINEER · MUMBAI ·</textPath>
              </text>
            </g>
          </>
        )}
        <text
          x="100"
          y={ring ? 117 : 126}
          textAnchor="middle"
          fill={ink}
          style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 600, fontSize: ring ? 48 : 86 }}
        >
          RS
        </text>
      </svg>
    </motion.div>
  );
}
