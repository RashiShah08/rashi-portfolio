import { useEffect, useRef } from "react";

// Shared across every wave so hovering any interactive element excites all of them.
let hovering = false;
let listening = false;
let boost = 0;
let lastDecay = 0;

function listen() {
  if (listening) return;
  listening = true;
  document.addEventListener("mouseover", (e) => {
    hovering = !!e.target.closest?.(".cursor-hover, a, button");
  });
}

const W = 1200;
const N = 160;

export default function Brainwave({
  height = 60,
  color = "var(--maroon)",
  strokeWidth = 1.6,
  opacity = 1,
  seed = 0,
  speed = 1,
  baseEnergy = 0.35,
  style,
}) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    listen();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = null;
    let visible = true;
    let t = seed * 13.7;
    let energy = baseEnergy;

    const draw = () => {
      const now = performance.now();
      if (now - lastDecay > 12) {
        boost *= 0.94;
        lastDecay = now;
      }
      const target = Math.max(hovering ? 1 : baseEnergy, baseEnergy + boost);
      energy += (target - energy) * 0.08;
      t += 0.016 * speed * (1 + energy * 0.6);

      let d = "";
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const taper = Math.sin(u * Math.PI);
        const burstPos = ((u * 3 + t * 0.3) % 3) - 1.5;
        const burst = Math.exp(-burstPos * burstPos * 60) * Math.sin(u * 90 + t * 10) * 1.5;
        const v =
          Math.sin(u * 21 + t * 2.8) * 0.34 +
          Math.sin(u * 55 - t * 5.1) * 0.16 +
          Math.sin(u * 8 + t * 1.3) * 0.28 +
          burst;
        const y = height / 2 - v * taper * Math.min(energy, 1.4) * height * 0.42;
        d += `${i ? "L" : "M"}${((u * W) | 0)} ${y.toFixed(1)}`;
      }
      pathRef.current?.setAttribute("d", d);
    };

    const loop = () => {
      if (!visible) {
        raf = null;
        return;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduce) loop();
    });
    io.observe(svgRef.current);

    if (reduce) draw();
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [height, seed, speed, baseEnergy]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height, display: "block", overflow: "visible", ...style }}
    >
      <path
        ref={pathRef}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={opacity}
      />
    </svg>
  );
}
