import { motion } from "framer-motion";
import { contact } from "../data/content";
import { GitHubIcon, LinkedInIcon } from "./Icons";
import Monogram from "./Monogram";

export default function Footer() {
  return (
    <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 28, paddingBottom: 40, flexWrap: "wrap", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Monogram size={58} ring />
        <div>
          <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 600, fontSize: 28, color: "var(--maroon)" }}>Rashi Shah</div>
          <div style={{ fontSize: 13, color: "var(--ink-muted)", fontWeight: 600 }}>&copy; 2026 &middot; Built with intent in Mumbai</div>
          <div className="footer-legal">
            <a href="privacy.html">Privacy</a>
            <span aria-hidden="true">&middot;</span>
            <a href="terms.html">Terms</a>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {[
          { Icon: GitHubIcon, href: contact.githubUrl, label: "GitHub" },
          { Icon: LinkedInIcon, href: contact.linkedinUrl, label: "LinkedIn" },
        ].map(({ Icon, href, label }) => (
          <motion.a
            key={href}
            href={href}
            aria-label={label}
            className="cursor-hover btn3d footer-social"
            whileHover={{ y: -4, rotate: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "var(--maroon)",
              color: "var(--cream)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
