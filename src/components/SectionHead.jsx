import { motion } from "framer-motion";
import SplitText from "./SplitText";

export default function SectionHead({ num, kicker, lines }) {
  return (
    <div className="section-head">
      <div>
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}
        >
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16, letterSpacing: 0, color: "oklch(0.33 0.09 22 / 0.55)" }}>{num}</span>
          <span style={{ width: 28, height: 1.5, background: "var(--line)" }} />
          {kicker}
        </motion.div>
        <SplitText lines={lines} style={{ fontSize: "var(--fs-h2)", lineHeight: 1.05 }} />
      </div>
    </div>
  );
}
