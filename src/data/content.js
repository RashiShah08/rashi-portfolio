export const nav = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#timeline", label: "Journey" },
  { href: "#contact", label: "Contact" },
];

export const stats = [
  { value: 6, suffix: "", label: "Projects Shipped" },
  { value: 2, suffix: "", label: "Internships" },
];

export const skillGroups = [
  {
    title: "ML & Data",
    items: ["Scikit-learn", "TensorFlow / Keras", "NumPy", "Pandas", "OpenCV", "Signal Processing"],
  },
  {
    title: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "SQL", "C", "C++", "Java"],
  },
  {
    title: "Web & Full-Stack",
    items: ["React", "React Native", "FastAPI", "Flask", "MERN Stack", "HTML / CSS", "Frappe"],
  },
  {
    title: "Backend & Infra",
    items: ["PostgreSQL", "Redis", "Celery", "Docker", "Temporal", "MySQL"],
  },
  {
    title: "Tools & Hardware",
    items: ["Git", "Arduino", "Raspberry Pi", "Blender"],
  },
];

export const projects = [
  {
    title: "The Record Atlas",
    meta: "Web App · 2025–26",
    description:
      "An interactive atlas of 47 record-breaking places — world landmarks and every Indian state and union territory — plotted at their real coordinates. Includes Ctrl+K search, shareable links, and a guide I wrote from scratch that answers questions and cites the records it used, with no API keys.",
    tech: ["Python", "FastAPI", "JavaScript", "Leaflet.js", "TF-IDF Search"],
    github: "https://github.com/RashiShah08/Interactive-Geo-Explorer",
    demo: "https://the-record-atlas.vercel.app/",
    demoLabel: "Live Demo",
    preview: {
      type: "site",
      url: "https://the-record-atlas.vercel.app/",
      image: "previews/record-atlas.png",
      alt: "The Record Atlas home screen, with a world map and its two atlases",
    },
  },
  {
    title: "Checkera",
    meta: "Desktop App · 2026",
    description:
      "A floating to-do widget for Windows and macOS. It syncs tasks with Google Calendar, sends reminders, adds tasks from anywhere with global hotkeys, and hides itself during screen sharing — all while keeping your data on your own computer.",
    tech: ["Python", "pywebview", "JavaScript", "Google Calendar API"],
    github: "https://github.com/RashiShah08/desktop-todo",
    preview: {
      type: "app",
      image: "previews/checkera.png",
      alt: "Checkera's task list, showing today's tasks with categories, due times and subtasks",
    },
  },
  {
    title: "Brainwave-to-Text",
    meta: "EEG Signal Classification · 2024",
    description:
      "An end-to-end EEG classification pipeline — signal ingestion, feature extraction, neural pattern classification — mapping cognitive states to text at ~92% accuracy. Built solo, from signal theory to a working model.",
    tech: ["Python", "Machine Learning", "Signal Processing"],
    github: "#",
    demo: "#",
    demoLabel: "Live Demo",
  },
  {
    title: "ArtVista",
    meta: "Sponsored Client Project · 2024–25",
    description:
      "A full-stack AR commerce platform for a live client, with a recommender system that personalises painting suggestions per user — turning a static catalogue into a discovery-driven storefront. Sole developer end to end.",
    tech: ["HTML / CSS / JS", "Python", "AR", "ML"],
    github: "#",
    demo: "#",
    demoLabel: "Live Demo",
  },
  {
    title: "Blood Donation Management",
    meta: "1st Runner-Up, Ignite IT 7.0 · 2024",
    description:
      "A complete donor-matching system built in 24 hours — real-time availability search, donor-recipient matching, emergency coordination workflows. Owned backend and frontend solo, zero cut corners.",
    tech: ["Full-Stack Development"],
    github: "#",
    demo: "#",
    demoLabel: "Live Demo",
  },
  {
    title: "Spiking Neural Networks",
    meta: "Technical Review Paper · 2024",
    description:
      "A technical review spanning SNN architectures, neuron models, encoding methods, and neuromorphic hardware like Intel Loihi — currently in prep for journal submission.",
    tech: ["Neuromorphic Computing", "AI Research"],
    github: "#",
    demo: "#",
    demoLabel: "Read Paper",
  },
];

export const timeline = [
  {
    date: "2026 – Present",
    kind: "Education",
    title: "Engineering, DJ Sanghvi College of Engineering",
    description: "Continuing my engineering studies in Mumbai after completing my diploma.",
  },
  {
    date: "Mar 2023",
    kind: "Education",
    title: "10th Grade, ICSE",
    description: "NSM School, Mumbai — Percentage: 94%",
  },
  {
    date: "2022 – Jun 2026",
    kind: "Education",
    title: "Diploma in Computer Engineering",
    description:
      "SVKM's Shri Bhagubhai Mafatlal Polytechnic and College of Engineering, Mumbai — Aggregate: 96.47%",
  },
  {
    date: "2024",
    kind: "Achievement",
    title: "1st Runner-Up — Ignite IT 7.0",
    description:
      "Built the Blood Donation Management System solo in a 24-hour hackathon, ranking 1st Runner-Up against the full field.",
  },
  {
    date: "Jun 2025",
    kind: "Experience",
    title: "Operations Intern",
    description:
      "3Folks Media, Mumbai — built a vetted pipeline of 277+ creators, wrote reel concepts, and translated scripts English-to-Hindi for client campaigns.",
  },
  {
    date: "Dec 2025 – Jun 2026",
    kind: "Experience",
    title: "Full-Stack Development Intern",
    description:
      "Agkiya Technology and Consulting LLP, Mumbai — own 6+ end-to-end modules on an AI-powered business platform: inventory, quotations, dashboards, and automated documents, with PostgreSQL, Redis, Celery, Temporal, and Docker underneath.",
  },
  {
    date: "Ongoing",
    kind: "Leadership",
    title: "Design & Documentation Leadership",
    description:
      "Design Head, Spectrum 3.0 · Documentation Head, Spectrum Hackathon · Volunteer, Spectrum 2.0 & Enigma.",
  },
];

export const timelineColumns = [
  {
    title: "Education & Wins",
    items: ["Engineering, DJ Sanghvi College of Engineering", "Diploma in Computer Engineering", "1st Runner-Up — Ignite IT 7.0", "10th Grade, ICSE"],
  },
  {
    title: "Experience & Leadership",
    items: ["Full-Stack Development Intern", "Operations Intern", "Design & Documentation Leadership"],
  },
].map((col) => ({ ...col, items: col.items.map((t) => timeline.find((x) => x.title === t)) }));

export const contact = {
  email: "rashishah0803@gmail.com",
  linkedin: "linkedin.com/in/rashicshah",
  linkedinUrl: "https://linkedin.com/in/rashicshah",
  github: "github.com/RashiShah08",
  githubUrl: "https://github.com/RashiShah08",
};
