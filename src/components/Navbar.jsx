import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { nav } from "../data/content";
import Magnetic from "./Magnetic";
import { MenuIcon } from "./Icons";
import MobileMenu from "./MobileMenu";
import Monogram from "./Monogram";
import { openResume } from "./Resume";

export default function Navbar() {
  const [active, setActive] = useState("#home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = nav.map((n) => document.querySelector(n.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="wrap" style={{ position: "sticky", top: 16, zIndex: 100 }}>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 80,
          padding: "0 16px 0 18px",
          borderRadius: 999,
          background: "linear-gradient(170deg, var(--maroon-2), var(--maroon) 50%, var(--maroon-dark))",
          boxShadow: "var(--depth-dark)",
        }}
      >
        <a href="#home" style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--cream)" }}>
          <Monogram size={48} fill="var(--maroon-dark)" delay={0.2} />
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 26, fontWeight: 600 }}>Rashi Shah</span>
        </a>

        <nav style={{ display: "flex", alignItems: "center", gap: 14 }} className="navlinks">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="cursor-hover"
              style={{
                position: "relative",
                fontSize: 14,
                fontFamily: "Sora",
                fontWeight: 600,
                color: "var(--cream)",
                padding: "8px 14px",
                opacity: active === item.href ? 1 : 0.72,
              }}
            >
              {item.label}
              {active === item.href && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 999,
                    background: "oklch(0.965 0.014 80 / 0.14)",
                    zIndex: -1,
                  }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
        <Magnetic as="button" type="button" onClick={openResume} className="resume-pill">
          Resume
        </Magnetic>
        <Magnetic
          as="a"
          href="#contact"
          style={{
            height: 46,
            padding: "0 24px",
            borderRadius: 999,
            background: "var(--cream)",
            color: "var(--maroon)",
            display: "none",
            alignItems: "center",
            fontFamily: "Sora",
            fontWeight: 700,
            fontSize: 13.5,
          }}
          className="contact-pill"
        >
          Contact Me
        </Magnetic>
        </div>

        <button
          type="button"
          className="cursor-hover"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          style={{
            display: "none",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "oklch(0.965 0.014 80 / 0.12)",
            color: "var(--cream)",
            alignItems: "center",
            justifyContent: "center",
          }}
          id="mobile-menu-btn"
        >
          <MenuIcon />
        </button>
      </motion.div>

      <MobileMenu open={open} active={active} setOpen={setOpen} />

      <style>{`
        @media (min-width: 1001px) {
          .contact-pill,
          .resume-pill { display: flex !important; }
        }
        /* seven links plus the name and the pill: tighten them before they touch */
        @media (min-width: 1001px) and (max-width: 1180px) {
          .navlinks { gap: 2px !important; }
          .navlinks a { padding: 8px 10px !important; font-size: 13.5px !important; }
        }
        @media (max-width: 1000px) {
          .navlinks { display: none !important; }
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
