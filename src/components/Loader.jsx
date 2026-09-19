import { motion } from "framer-motion";
import Monogram from "./Monogram";
import Brainwave from "./Brainwave";

export default function Loader() {
  return (
    <motion.div
      exit={{ y: "-100%" }}
      transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "linear-gradient(165deg, var(--maroon-2), var(--maroon) 50%, var(--maroon-dark))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
      }}
    >
      <Monogram size={124} ring fill="var(--maroon-dark)" />
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 1.3, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
        style={{ width: "min(520px, 80vw)" }}
      >
        <Brainwave height={70} color="var(--cream)" speed={1.6} baseEnergy={0.9} />
      </motion.div>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        style={{ color: "var(--cream)", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 26 }}
      >
        Rashi Shah - Portfolio
      </motion.span>
    </motion.div>
  );
}
