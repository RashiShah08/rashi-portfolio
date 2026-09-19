export const nav = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#timeline", label: "Journey" },
  { href: "#contact", label: "Contact" },
];

export const stats = [
  { value: 4, suffix: "", label: "Projects Shipped" },
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
    meta: "Web App · 2025-26",
    description:
      "An interactive atlas of 47 record-breaking places - world landmarks and every Indian state and union territory - plotted at their real coordinates. Includes Ctrl+K search, shareable links, and a guide I wrote from scratch that answers questions and cites the records it used, with no API keys.",
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
      "A floating to-do widget for Windows and macOS. It syncs tasks with Google Calendar, sends reminders, adds tasks from anywhere with global hotkeys, and hides itself during screen sharing - all while keeping your data on your own computer.",
    tech: ["Python", "pywebview", "JavaScript", "Google Calendar API"],
    github: "https://github.com/RashiShah08/desktop-todo",
    preview: {
      type: "app",
      image: "previews/checkera.png",
      alt: "Checkera's task list, showing today's tasks with categories, due times and subtasks",
    },
  },
  {
    title: "BloodConnect",
    meta: "Web App · Ignite IT 7.0 Runner-Up",
    description:
      "Connects hospitals that urgently need blood with nearby donors who can give. A hospital posts a request and compatible donors within a few kilometres get an email. A donor takes an 11-question health check, pledges a unit and follows live directions to the hospital. The hospital sees their arrival time but never their exact location. I started it at a hackathon and later rebuilt it to be secure, with more than 400 tests.",
    tech: ["Python", "Flask", "PostgreSQL", "Leaflet.js", "Gmail API", "Playwright"],
    github: "https://github.com/RashiShah08/Blood-Donation",
    demo: "https://bloodconnectapp.vercel.app/",
    demoLabel: "Live Demo",
    preview: {
      type: "site",
      url: "https://bloodconnectapp.vercel.app/",
      image: "previews/bloodconnect.png",
      alt: "BloodConnect home page: “Someone near you needs your blood group today”, beside a map of a donor on the way to a hospital",
    },
  },
  {
    title: "Cortical Decoder",
    meta: "EEG Machine Learning · 2024-26",
    description:
      "Reads 64-channel EEG recordings and works out which movement a person was imagining - left fist, right fist, both fists or both feet. I compared nine decoders, from classical Riemannian methods to neural networks, across 105 people and report the real numbers: about 64% on left vs right, where guessing gets 50%. The live page replays a recording on a 3D brain as it decodes.",
    tech: ["Python", "scikit-learn", "PyTorch", "MNE", "Flask", "Three.js"],
    github: "https://github.com/RashiShah08/brainwave-to-text",
    demo: "https://brainwave-to-text.onrender.com/live",
    demoLabel: "Live Demo",
    preview: {
      type: "site",
      url: "https://brainwave-to-text.onrender.com/live",
      image: "previews/brainwave.png",
      alt: "The Cortical Decoder live page: a 3D brain between the replay controls and the decoder's evidence panel",
      loading: "Waking the server - the free host sleeps when idle, so this can take up to a minute…",
    },
  },
];

export const timeline = [
  {
    date: "2026 - Present",
    kind: "Education",
    title: "Engineering, DJ Sanghvi College of Engineering",
    description: "Continuing my engineering studies in Mumbai after completing my diploma.",
  },
  {
    date: "Mar 2023",
    kind: "Education",
    title: "10th Grade, ICSE",
    description: "NSM School, Mumbai - Percentage: 94%",
  },
  {
    date: "2022 - Jun 2026",
    kind: "Education",
    title: "Diploma in Computer Engineering",
    description:
      "SVKM's Shri Bhagubhai Mafatlal Polytechnic and College of Engineering, Mumbai - Aggregate: 96.47%",
  },
  {
    date: "Jun 2025",
    kind: "Experience",
    title: "Operations Intern",
    description:
      "3Folks Media, Mumbai - built a vetted pipeline of 277+ creators, wrote reel concepts, and translated scripts English-to-Hindi for client campaigns.",
  },
  {
    date: "Dec 2025 - Jun 2026",
    kind: "Experience",
    title: "Full-Stack Development Intern",
    description:
      "Agkiya Technology and Consulting LLP, Mumbai - own 6+ end-to-end modules on an AI-powered business platform: inventory, quotations, dashboards, and automated documents, with PostgreSQL, Redis, Celery, Temporal, and Docker underneath.",
  },
  {
    date: "2022 - 2026",
    kind: "Leadership",
    title: "Student Committees",
    description:
      "During my diploma I was part of the student committees that host our college's events - Design Head for Spectrum 3.0, Documentation Head for the Spectrum Hackathon, and a volunteer at Spectrum 2.0 and Enigma.",
  },
];

export const timelineColumns = [
  {
    title: "Education",
    items: ["Engineering, DJ Sanghvi College of Engineering", "Diploma in Computer Engineering", "10th Grade, ICSE"],
  },
  {
    title: "Experience & Leadership",
    items: ["Full-Stack Development Intern", "Operations Intern", "Student Committees"],
  },
].map((col) => ({ ...col, items: col.items.map((t) => timeline.find((x) => x.title === t)) }));

export const contact = {
  email: "rashishah0803@gmail.com",
  linkedin: "linkedin.com/in/rashicshah",
  linkedinUrl: "https://linkedin.com/in/rashicshah",
  github: "github.com/RashiShah08",
  githubUrl: "https://github.com/RashiShah08",
};
