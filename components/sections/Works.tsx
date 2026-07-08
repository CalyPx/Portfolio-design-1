"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { projects, ACCENTS, type Project } from "@/lib/projects";
import { useSectionAccent } from "@/components/AccentContext";
import { useCaseTransition } from "@/components/CaseTransition";
import ProjectMock from "@/components/ProjectMock";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

function WorkRow({
  project,
  onHoverStart,
  onHoverMove,
  onHoverEnd,
}: {
  project: Project;
  onHoverStart: (p: Project) => void;
  onHoverMove: (x: number, y: number) => void;
  onHoverEnd: () => void;
}) {
  const { navigate } = useCaseTransition();
  const accentHex = ACCENTS[project.accent];
  const tickerItems = Array.from({ length: 8 });

  return (
    <motion.li
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <a
        href={`/work/${project.slug}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(e.clientX, e.clientY, `/work/${project.slug}`, accentHex);
        }}
        onMouseEnter={() => onHoverStart(project)}
        onMouseMove={(e) => onHoverMove(e.clientX, e.clientY)}
        onMouseLeave={onHoverEnd}
        data-cursor="view"
        className="group grid grid-cols-[auto_1fr] items-center gap-5 border-t border-fg/15 py-7 md:grid-cols-[auto_1fr_auto] md:gap-10 md:py-0"
        style={
          {
            "--row-accent": accentHex,
            "--row-ink": `color-mix(in oklab, ${accentHex} 55%, var(--fg))`,
          } as React.CSSProperties
        }
        aria-label={`${project.name}, ${project.category}, ${project.year}. View case study.`}
      >
        {/* numbered badge */}
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-fg/30 font-display text-sm font-bold transition-colors duration-300 group-hover:border-[var(--row-ink)] group-hover:text-[var(--row-ink)] md:h-14 md:w-14">
          {project.number}
        </span>

        {/* ghost ticker, fills solid + pauses on hover */}
        <span
          className="relative block overflow-hidden md:py-9"
          aria-hidden="true"
        >
          <span
            className="marquee-track items-baseline"
            style={
              {
                "--marquee-duration": `${18 + project.name.length}s`,
              } as React.CSSProperties
            }
          >
            {tickerItems.map((_, i) => (
              <span
                key={i}
                className="text-ghost shrink-0 whitespace-nowrap pr-8 font-display text-[clamp(2.4rem,6vw,5.2rem)] font-bold uppercase leading-none tracking-tight"
              >
                {project.displayName}
                <span className="pl-8" style={{ WebkitTextStroke: "0px" }}>
                  <span
                    className="inline-block h-[0.14em] w-[0.14em] rotate-45"
                    style={{ backgroundColor: accentHex, opacity: 0.6 }}
                  />
                </span>
              </span>
            ))}
          </span>
        </span>

        {/* category, year, accent dot */}
        <span className="col-start-2 flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] opacity-70 md:col-start-3 md:flex-col md:items-end md:gap-2">
          {project.award && (
            <span
              className="hidden font-medium md:block"
              style={{ color: "var(--row-ink)" }}
            >
              {project.award}
            </span>
          )}
          <span>{project.category}</span>
          <span className="flex items-center gap-2">
            <span>{project.year}</span>
            <span className="h-2.5 w-2.5 rounded-full bg-fg/25 transition-colors duration-300 group-hover:bg-[var(--row-accent)]" />
          </span>
        </span>
      </a>
    </motion.li>
  );
}

export default function Works() {
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const moversRef = useRef<{
    x: (v: number) => void;
    y: (v: number) => void;
  } | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const activeRef = useRef(false);
  useSectionAccent(ref, "sage");

  const ensureMovers = () => {
    if (moversRef.current || !panelRef.current) return moversRef.current;
    const el = panelRef.current;
    moversRef.current = {
      x: gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" }),
    };
    return moversRef.current;
  };

  const handleHoverStart = (project: Project) => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches)
      return;
    setPreviewProject(project);
    const panel = panelRef.current;
    if (!panel) return;
    activeRef.current = true;
    gsap.killTweensOf(panel, "scale,rotate,autoAlpha");
    gsap.fromTo(
      panel,
      { scale: 0.75, rotate: -6, autoAlpha: 0 },
      { scale: 1, rotate: -3, autoAlpha: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
  };

  const handleHoverMove = (x: number, y: number) => {
    if (!activeRef.current) return;
    const m = ensureMovers();
    m?.x(x + 36);
    m?.y(y - 210);
  };

  const handleHoverEnd = () => {
    if (!activeRef.current) return;
    activeRef.current = false;
    const panel = panelRef.current;
    if (!panel) return;
    gsap.killTweensOf(panel, "scale,rotate,autoAlpha");
    gsap.to(panel, {
      scale: 0.75,
      rotate: 6,
      autoAlpha: 0,
      duration: 0.35,
      ease: "power2.in",
    });
  };

  return (
    <section ref={ref} id="works" className="relative px-4 py-32 md:px-8">
      <h2 className="transition-accent mb-14 text-xs font-medium uppercase tracking-[0.3em]">
        <span className="text-accent-ink" aria-hidden="true">
          {"◇ "}
        </span>
        Projects
      </h2>
      <ul className="border-b border-fg/15">
        {projects.map((p) => (
          <WorkRow
            key={p.slug}
            project={p}
            onHoverStart={handleHoverStart}
            onHoverMove={handleHoverMove}
            onHoverEnd={handleHoverEnd}
          />
        ))}
      </ul>

      {/* cursor-following live preview — desktop only, hidden from a11y tree */}
      <div
        ref={panelRef}
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden w-[340px] origin-center opacity-0 will-change-transform md:block"
        aria-hidden="true"
      >
        {previewProject && <ProjectMock project={previewProject} />}
      </div>
    </section>
  );
}
