import { motion } from "framer-motion";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import { contact } from "../data/content";
import { MailIcon, LinkedInIcon, GitHubIcon } from "./Icons";

const links = [
  { icon: MailIcon, label: contact.email, href: `mailto:${contact.email}` },
  { icon: LinkedInIcon, label: contact.linkedin, href: contact.linkedinUrl },
  { icon: GitHubIcon, label: contact.github, href: contact.githubUrl },
];

export default function Contact() {
  return (
    <div id="contact" className="section">
      <div className="wrap">
        <Reveal
          className="contact-grid"
          style={{
            background: "linear-gradient(165deg, var(--maroon-2), var(--maroon) 45%, var(--maroon-dark))",
            boxShadow: "var(--depth-dark)",
            borderRadius: 36,
            padding: 44,
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 32,
            alignItems: "center",
          }}
        >
          <div>
            <span className="eyebrow" style={{ color: "var(--cream)", opacity: 0.65 }}>
              05 - Get in touch
            </span>
            <h2
              style={{
                fontSize: "var(--fs-h2)",
                marginTop: 14,
                maxWidth: 460,
                lineHeight: 1.1,
                color: "var(--cream)",
              }}
            >
              Let&apos;s build <em style={{ color: "var(--gold)" }}>something</em> together.
            </h2>
            <p style={{ fontSize: 16, color: "var(--cream)", opacity: 0.8, marginTop: 18, maxWidth: 420, lineHeight: 1.6 }}>
              I&apos;m open to internships, collaborations, and interesting problems in ML or full-stack product.
              Reach out &mdash; I reply quickly.
            </p>
            <Magnetic
              as="a"
              href={`mailto:${contact.email}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 54,
                padding: "0 30px",
                borderRadius: 999,
                background: "var(--cream)",
                color: "var(--maroon)",
                fontFamily: "Sora",
                fontWeight: 700,
                fontSize: 15,
                marginTop: 28,
              }}
            >
              Say Hello
            </Magnetic>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {links.map(({ icon: Icon, label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                className="cursor-hover"
                whileHover={{ x: 6, backgroundColor: "oklch(0.965 0.014 80 / 0.2)" }}
                transition={{ duration: 0.2 }}
                style={{
                  background: "oklch(0.965 0.014 80 / 0.12)",
                  borderRadius: 18,
                  padding: "18px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  color: "var(--cream)",
                }}
              >
                <Icon />
                <span style={{ fontSize: 14.5 }}>{label}</span>
              </motion.a>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
