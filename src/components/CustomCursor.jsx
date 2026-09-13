import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine) return;

    const pos = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };
    let raf;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      }
      const target = e.target;
      setActive(!!target.closest("a, button, .cursor-hover"));
    };

    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    tick();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: visible ? 1 : 0 }} />
      <div ref={ringRef} className={`cursor-ring ${active ? "active" : ""}`} style={{ opacity: visible ? 1 : 0 }} />
    </>
  );
}
