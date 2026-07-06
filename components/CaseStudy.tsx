"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ACCENTS, type Project } from "@/lib/projects";
import { useAccent } from "@/components/AccentContext";
import { useCaseTransition } from "@/components/CaseTransition";

const EASE = [0.16, 1, 0.3, 1] as const;

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="grid gap-4 border-t border-fg/15 py-14 md:grid-cols-[220px_1fr] md:gap-12"
    >
      <p className="transition-accent text-xs font-medium uppercase tracking-[0.3em] text-accent">
        <span aria-hidden="true">{"◇ "}</span>
        {label}
      </p>
      <div className="max-w-2xl text-base leading-relaxed opacity-85 md:text-lg">
        {children}
      </div>
    </motion.div>
  );
}

/** Abstract product mock — a stylized browser frame in accent tints */
function HeroMock({ project }: { project: Project }) {
  const accent = ACCENTS[project.accent];
  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-fg/20 bg-bg shadow-2xl">
      <div className="flex items-center gap-2 border-b border-fg/15 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-fg/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-fg/25" />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
        <span className="ml-4 rounded-full bg-fg/10 px-4 py-1 text-[10px] tracking-widest opacity-70">
          {project.slug}.app
        </span>
      </div>
      <div className="grid grid-cols-[70px_1fr] gap-4 p-5 md:grid-cols-[110px_1fr] md:p-7">
        <div className="space-y-3">
          <div className="h-7 w-7 rounded-full" style={{ backgroundColor: accent }} />
          {[0.5, 0.35, 0.45, 0.3].map((o, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-fg"
              style={{ opacity: o * 0.4, width: `${60 + i * 10}%` }}
            />
          ))}
        </div>
        <div className="space-y-4">
          <div
            className="h-8 w-2/3 rounded-md"
            style={{ backgroundColor: accent, opacity: 0.85 }}
          />
          <div className="h-2.5 w-full rounded-full bg-fg/15" />
          <div className="h-2.5 w-5/6 rounded-full bg-fg/15" />
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[0.25, 0.5, 0.35].map((o, i) => (
              <div
                key={i}
                className="h-20 rounded-lg md:h-28"
                style={{ backgroundColor: accent, opacity: o }}
              />
            ))}
          </div>
          <div className="h-2.5 w-4/6 rounded-full bg-fg/15" />
        </div>
      </div>
    </div>
  );
}

export default function CaseStudy({
  project,
  next,
}: {
  project: Project;
  next: Project;
}) {
  const { setAccent } = useAccent();
  const { navigate } = useCaseTransition();
  const setAccentRef = useRef(setAccent);
  setAccentRef.current = setAccent;

  useEffect(() => {
    setAccentRef.current(project.accent);
  }, [project.accent]);

  return (
    <main className="relative px-4 pb-32 md:px-8">
      {/* hero: giant wordmark bleeding off-screen behind the mock */}
      <div className="relative pt-36 md:pt-44">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          aria-hidden="true"
          className="pointer-events-none absolute -left-[4vw] top-16 select-none whitespace-nowrap font-display text-[clamp(6rem,20vw,22rem)] font-bold uppercase leading-none text-fg/10 md:top-8"
        >
          {project.name} {project.name}
        </motion.p>

        <Link
          href="/"
          data-cursor="hover"
          className="relative z-10 mb-14 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] opacity-70 transition-opacity hover:opacity-100"
        >
          <span aria-hidden="true">←</span> All works
        </Link>

        <motion.div
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="relative z-10"
        >
          <HeroMock project={project} />
        </motion.div>

        {/* title + pills */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          className="relative z-10 mt-16"
        >
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] font-bold uppercase leading-[0.9] tracking-tight">
            {project.displayName}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed opacity-80">
            {project.tagline}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2">
            {[project.category, project.year, ...(project.award ? [project.award] : [])].map(
              (pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-fg/25 px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] opacity-80"
                >
                  {pill}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* case body */}
      <div className="mt-24">
        <Section label="Problem">
          <p data-cursor="magnify">{project.problem}</p>
        </Section>
        <Section label="Approach">
          <p data-cursor="magnify">{project.approach}</p>
        </Section>
        <Section label="What I Built">
          <ul className="space-y-4">
            {project.built.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="transition-accent mt-1 text-accent" aria-hidden="true">
                  ◇
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section label="Stack">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-fg/10 px-4 py-1.5 text-sm tracking-wide"
              >
                {tech}
              </span>
            ))}
          </div>
        </Section>
        <Section label="Result & Impact">
          <p data-cursor="magnify">{project.result}</p>
        </Section>
        <Section label="What I'd Do Differently">
          <p className="transition-accent border-l-2 border-accent pl-5 italic opacity-90">
            {project.differently}
          </p>
        </Section>
      </div>

      {/* next project */}
      <div className="mt-24 border-t border-fg/15 pt-14">
        <p className="text-xs uppercase tracking-[0.3em] opacity-60">
          Next project
        </p>
        <a
          href={`/work/${next.slug}`}
          data-cursor="view"
          onClick={(e) => {
            e.preventDefault();
            navigate(
              e.clientX,
              e.clientY,
              `/work/${next.slug}`,
              ACCENTS[next.accent]
            );
          }}
          className="group mt-4 inline-flex items-center gap-6"
        >
          <span className="text-ghost font-display text-[clamp(2.5rem,8vw,7rem)] font-bold uppercase leading-none tracking-tight">
            {next.displayName}
          </span>
          <span
            aria-hidden="true"
            className="transition-accent text-4xl text-accent transition-transform duration-500 group-hover:translate-x-4 md:text-6xl"
          >
            →
          </span>
        </a>
      </div>
    </main>
  );
}
