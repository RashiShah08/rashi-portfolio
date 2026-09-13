import { useEffect, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Loader from "./components/Loader";

export default function App() {
  const [ready, setReady] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e) => {
      const card = e.target.closest?.(".card, .card-dark");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
      card.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (ready) return;
    const t = setTimeout(() => setReady(true), 1900);
    return () => clearTimeout(t);
  }, [ready]);

  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine) return;

    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true });
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });

    const onClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor || anchor.getAttribute("href") === "#") return;
      const el = document.querySelector(anchor.getAttribute("href"));
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -90 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [ready]);

  return (
    <>
      <AnimatePresence>{!ready && <Loader key="loader" />}</AnimatePresence>
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "var(--maroon)",
          transformOrigin: "0%",
          scaleX: progress,
          zIndex: 300,
        }}
      />
      <CustomCursor />
      {ready && (
        <>
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Timeline />
          <Contact />
          <Footer />
        </>
      )}
    </>
  );
}
