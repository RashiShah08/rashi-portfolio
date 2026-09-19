import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { resume } from "../data/content";
import { PreviewModal } from "./Preview";

const OPEN_EVENT = "resume:open";

// Any button on the page can open the resume; the one dialog lives in App.
export const openResume = () => window.dispatchEvent(new Event(OPEN_EVENT));

const doc = {
  title: "Resume",
  preview: {
    type: "doc",
    address: resume.file,
    url: resume.file,
    download: resume.file,
    image: resume.image,
    alt: "Rashi Shah's one-page resume: profile, education, skills, projects, experience and leadership",
  },
};

export default function ResumeDialog() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  return <AnimatePresence>{open && <PreviewModal project={doc} onClose={close} />}</AnimatePresence>;
}
