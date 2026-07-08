"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSectionAccent } from "@/components/AccentContext";
import { useMagnetic } from "@/lib/useMagnetic";

const BIO =
  "I'm an 18-year-old +2 Science student from Kathmandu. Outside of class I teach myself full-stack development and applied AI, mostly by building things: a hackathon project over a weekend, or something I just wanted to try at home. I'd rather actually understand what I'm building than make it look perfect, then put it in front of people who can use it.";

interface EducationEntry {
  qualification: string;
  school: string;
  gpa: number;
  year: string;
}

const EDUCATION: EducationEntry[] = [
  {
    qualification: "+2 in Science (NEB)",
    school: "Sainik Awasiya Mahavidyalaya",
    gpa: 3.63,
    year: "2025",
  },
  {
    qualification: "Secondary Education Examination (SEE)",
    school: "Sainik Awasiya Mahavidyalaya",
    gpa: 3.85,
    year: "2023",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const wordContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.018 },
  },
};

const wordItem = {
  hidden: { y: "60%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

function EducationRow({ entry }: { entry: EducationEntry }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className="group relative border-b border-fg/15 pb-6 pt-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="transition-accent absolute -left-4 top-0 hidden h-full w-[2px] origin-top bg-accent md:block"
      />
      <motion.div
        initial={false}
        animate={{ x: hovered ? 10 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <p className="font-display text-lg font-bold uppercase leading-snug md:text-xl">
          {entry.qualification}
        </p>
        <p className="mt-2 text-sm opacity-70 md:text-base">{entry.school}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.15em] opacity-50">
          GPA {entry.gpa.toFixed(2)} · {entry.year}
        </p>
      </motion.div>
    </li>
  );
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const cvRef = useMagnetic<HTMLAnchorElement>(0.3, 90);
  useSectionAccent(ref, "sky");

  return (
    <section
      ref={ref}
      id="about"
      className="relative px-4 py-28 md:px-8 md:py-36"
    >
      <h2 className="transition-accent mb-12 text-[13px] font-medium uppercase tracking-[0.3em]">
        <span className="text-accent-ink" aria-hidden="true">
          {"◇ "}
        </span>
        Who I Am
      </h2>

      <div className="grid gap-16 md:grid-cols-[1.2fr_1fr] md:gap-12">
        <div>
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10% 0px" }}
            variants={wordContainer}
            className="max-w-2xl text-2xl leading-relaxed md:text-3xl"
          >
            {BIO.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span variants={wordItem} className="inline-block">
                  {word}
                  {i < BIO.split(" ").length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </motion.p>

          <motion.a
            ref={cvRef}
            href="/Rohit_Poudel_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            className="group relative mt-10 inline-flex w-fit items-center gap-3 text-lg font-bold uppercase tracking-wide"
          >
            Download CV
            <span
              aria-hidden="true"
              className="transition-accent inline-block text-accent-ink transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              ↗
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-100 bg-fg transition-transform duration-300 ease-out group-hover:scale-x-0"
            />
          </motion.a>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="space-y-8"
        >
          <p className="text-[13px] font-medium uppercase tracking-[0.3em] opacity-60">
            Education
          </p>
          <ul className="space-y-6 border-t border-fg/15">
            {EDUCATION.map((entry) => (
              <EducationRow key={entry.qualification} entry={entry} />
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
