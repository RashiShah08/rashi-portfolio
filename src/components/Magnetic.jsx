import { useRef } from "react";
import { motion } from "framer-motion";

export default function Magnetic({ children, strength = 0.35, className = "", as: As = "div", ...rest }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.setProperty("--mx", `${x * strength}px`);
    el.style.setProperty("--my", `${y * strength}px`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  };

  const MotionAs = motion(As);

  return (
    <MotionAs
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`cursor-hover ${className}`}
      style={{
        transform: "translate(var(--mx, 0px), var(--my, 0px))",
        transition: "transform 0.15s ease-out",
      }}
      whileTap={{ scale: 0.96 }}
      {...rest}
    >
      {children}
    </MotionAs>
  );
}
