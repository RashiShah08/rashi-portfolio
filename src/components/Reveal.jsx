import { motion } from "framer-motion";

export default function Reveal({ children, delay = 0, y = 40, curtain = true, className = "", once = true, style, ...rest }) {
  // A fully clipped element never reports as intersecting, so the curtain starts with a sliver open.
  const hidden = { opacity: 0, y, ...(curtain && { clipPath: "inset(0% 0% 90% 0% round 28px)" }) };
  const shown = {
    opacity: 1,
    y: 0,
    ...(curtain && { clipPath: "inset(0% 0% 0% 0% round 28px)", transitionEnd: { clipPath: "none" } }),
  };

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once, amount: 0.01 }}
      transition={{ duration: 1.1, delay, ease: [0.19, 1, 0.22, 1] }}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
