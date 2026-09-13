import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const lead = "I'm Rashi — a computer engineer from Mumbai with a creative streak I never really switch off.";

const paragraphs = [
  "I completed my Diploma in Computer Engineering at SVKM's Shri Bhagubhai Mafatlal Polytechnic and College of Engineering, and I'm now continuing my engineering studies at DJ Sanghvi College of Engineering.",
  "Away from the screen you'll usually find me dancing, designing something, or chasing whatever creative idea has caught my attention. That same instinct follows me into college life — I led design for Spectrum 3.0, headed documentation for the Spectrum Hackathon, and volunteered at Spectrum 2.0 and Enigma.",
  "Where I'm headed: the point where machine learning meets real products — software that's thoughtful, a little beautiful, and simple enough for anyone to use.",
];

const side = [
  { eyebrow: "Now studying", title: "DJ Sanghvi College of Engineering", body: "Mumbai", dark: true },
  { eyebrow: "Diploma · Completed", title: "Computer Engineering", body: "SVKM's SBMPCE, Mumbai", big: "96.47%" },
  { eyebrow: "Off the clock", title: "Dancing · Design · Creating", body: "Anything creative, really" },
];

export default function About() {
  return (
    <div id="about" className="section">
      <div className="wrap">
        <SectionHead num="01" kicker="Who I am" lines={[<>About <em>me</em></>]} />

        <div className="about-bento">
          <Reveal className="card about-text" style={{ padding: "clamp(24px,2.8vw,44px)", display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: "clamp(22px,1.7vw,28px)", lineHeight: 1.3, color: "var(--ink)" }}>{lead}</p>
            <div style={{ width: 48, height: 2, background: "var(--gold)", margin: "2px 0" }} />
            {paragraphs.map((p) => (
              <p key={p} style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: "clamp(18px,1.2vw,20px)", lineHeight: 1.6, color: "var(--ink-muted)", maxWidth: "62ch" }}>
                {p}
              </p>
            ))}
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 600, fontSize: 24, color: "var(--maroon)" }}>— Rashi</p>
          </Reveal>

          {side.map((c, i) => (
            <Reveal
              key={c.title}
              delay={0.08 * (i + 1)}
              className={c.dark ? "card-dark" : "card"}
              style={{ padding: "22px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14 }}
            >
              <div>
                <div className="eyebrow" style={{ marginBottom: 8, color: c.dark ? "var(--gold)" : undefined }}>
                  {c.eyebrow}
                </div>
                <div style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 22, lineHeight: 1.2, marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.5, opacity: 0.8 }}>{c.body}</div>
              </div>
              {c.big && <div style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: "clamp(36px,2.6vw,46px)", lineHeight: 1, color: "var(--maroon)" }}>{c.big}</div>}
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
