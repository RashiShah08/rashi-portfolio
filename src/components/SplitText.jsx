import { motion } from "framer-motion";

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1.15, ease: [0.19, 1, 0.22, 1] } },
};

export default function SplitText({ lines, as = "h2", delay = 0, inView = true, style, className }) {
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  const trigger = inView
    ? { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.6 } }
    : { initial: "hidden", animate: "show" };

  return (
    <Tag
      className={className}
      style={style}
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: delay } } }}
    >
      {lines.map((content, i) => (
        <span key={i} style={{ display: "block", overflow: "hidden", padding: "0 0.12em 0.1em 0", margin: "0 -0.12em -0.1em 0" }}>
          <motion.span variants={line} style={{ display: "block" }}>
            {content}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
