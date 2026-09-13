import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

export default function Counter({ value, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${v.toFixed(decimals)}${suffix}`;
      }
    });
  }, [spring, suffix, decimals]);

  return <motion.b ref={ref}>0{suffix}</motion.b>;
}
