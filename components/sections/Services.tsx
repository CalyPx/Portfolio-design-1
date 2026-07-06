"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useSectionAccent } from "@/components/AccentContext";

interface Tool {
  name: string;
  stem: number; // tick height in px
}

interface Panel {
  word: string;
  desc: string;
  tools: Tool[];
}

const PANELS: Panel[] = [
  {
    word: "INTERFACES.",
    desc: "Frontends that feel engineered, not decorated. Design systems, kinetic interaction, and maps people actually read — built to hold up on a ward office's five-year-old Android as well as it does in a demo.",
    tools: [
      { name: "Next.js", stem: 96 },
      { name: "React", stem: 56 },
      { name: "Tailwind", stem: 78 },
      { name: "Framer Motion", stem: 44 },
      { name: "Leaflet.js", stem: 66 },
    ],
  },
  {
    word: "SYSTEMS.",
    desc: "The plumbing that lets a hackathon build survive contact with production: APIs, data models, deploys, and the occasional microcontroller. Boring on purpose, fast where it counts.",
    tools: [
      { name: "FastAPI", stem: 92 },
      { name: "PostgreSQL", stem: 60 },
      { name: "Supabase", stem: 80 },
      { name: "Docker", stem: 46 },
      { name: "ESP32 / Arduino", stem: 70 },
    ],
  },
  {
    word: "INTELLIGENCE.",
    desc: "The layer that turns a form into a product: LLM routing, vision pipelines, and classical ML where it quietly beats a prompt. Models chosen for the constraint, not the leaderboard.",
    tools: [
      { name: "XGBoost", stem: 88 },
      { name: "scikit-learn", stem: 52 },
      { name: "PyTorch", stem: 74 },
      { name: "Groq / Llama", stem: 96 },
      { name: "Gemini Vision", stem: 60 },
      { name: "UMAP / HDBSCAN", stem: 42 },
    ],
  },
];

const DOT_STYLES = [
  { size: 38, className: "bg-accent transition-accent", x: 0, y: 0 },
  { size: 26, className: "bg-fg/25", x: 30, y: -18 },
  { size: 18, className: "bg-fg/50", x: -22, y: 24 },
  { size: 30, className: "bg-accent/50 transition-accent", x: 50, y: 16 },
];

function ServicePanel({ panel, index }: { panel: Panel; index: number }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  // Pinned scrub: headline rises, stems grow off the rail, diamond slides
  // across the top rail as the panel scrubs.
  useEffect(() => {
    const panelEl = panelRef.current;
    const head = headRef.current;
    const desc = descRef.current;
    const ruler = rulerRef.current;
    const diamond = diamondRef.current;
    if (!panelEl || !head || !desc || !ruler || !diamond) return;
    const mm = gsap.matchMedia();

    const stems = ruler.querySelectorAll<HTMLElement>(".svc-stem");
    const labels = ruler.querySelectorAll<HTMLElement>(".svc-label");

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.set(stems, { scaleY: 0, transformOrigin: "bottom center" });
        gsap.set(labels, { autoAlpha: 0 });
        gsap.set(head, { yPercent: 110 });
        gsap.set(desc, { autoAlpha: 0, y: 40 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panelEl,
            start: "top top",
            end: "+=1100",
            pin: true,
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(head, { yPercent: 0, duration: 0.45, ease: "power2.out" }, 0)
          .to(desc, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.2)
          .to(
            stems,
            { scaleY: 1, duration: 0.35, stagger: 0.07, ease: "power2.out" },
            0.3
          )
          .to(labels, { autoAlpha: 1, duration: 0.25, stagger: 0.07 }, 0.4)
          .to(
            diamond,
            {
              x: () => ruler.clientWidth - 16,
              ease: "none",
              duration: 1.3,
            },
            0
          )
          .to({}, { duration: 0.25 });
      }
    );

    // Mobile / reduced motion: everything visible, gentle fade-in, no pin
    mm.add(
      "(max-width: 767px), (prefers-reduced-motion: reduce)",
      () => {
        gsap.set([stems, labels, desc], { clearProps: "all" });
        gsap.set(head, { yPercent: 0 });
        gsap.fromTo(
          panelEl,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: { trigger: panelEl, start: "top 75%" },
          }
        );
      }
    );

    return () => mm.revert();
  }, []);

  // Dots drift on mouse-move (parallax)
  useEffect(() => {
    const panelEl = panelRef.current;
    const dotsEl = dotsRef.current;
    if (!panelEl || !dotsEl) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dots = Array.from(dotsEl.children) as HTMLElement[];
    const movers = dots.map((dot, i) => ({
      x: gsap.quickTo(dot, "x", { duration: 0.6, ease: "power3.out" }),
      y: gsap.quickTo(dot, "y", { duration: 0.6, ease: "power3.out" }),
      factor: (i + 1) * 10,
    }));

    const onMove = (e: MouseEvent) => {
      const rect = panelEl.getBoundingClientRect();
      const rx = (e.clientX - rect.left) / rect.width - 0.5;
      const ry = (e.clientY - rect.top) / rect.height - 0.5;
      movers.forEach((m) => {
        m.x(rx * m.factor * 2);
        m.y(ry * m.factor * 2);
      });
    };
    panelEl.addEventListener("mousemove", onMove, { passive: true });
    return () => panelEl.removeEventListener("mousemove", onMove);
  }, []);

  const n = panel.tools.length;

  return (
    <div
      ref={panelRef}
      className="relative flex min-h-screen flex-col justify-center px-4 py-24 md:px-8"
    >
      <p className="transition-accent absolute left-4 top-10 text-[13px] font-medium uppercase tracking-[0.3em] md:left-8">
        <span className="text-accent" aria-hidden="true">
          {"◇ "}
        </span>
        Services &amp; Toolkit — 0{index + 1}/03
      </p>

      <div className="relative">
        {/* drifting dot cluster near the headline */}
        <div
          ref={dotsRef}
          className="pointer-events-none absolute -top-14 right-[8%] hidden md:block"
          aria-hidden="true"
        >
          {DOT_STYLES.map((d, i) => (
            <span
              key={i}
              className={`absolute rounded-full ${d.className}`}
              style={{ width: d.size, height: d.size, left: d.x, top: d.y }}
            />
          ))}
        </div>

        <h3 className="overflow-hidden font-display text-[clamp(3.4rem,13vw,13rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
          <span ref={headRef} className="block will-change-transform">
            {panel.word}
          </span>
        </h3>

        <p
          ref={descRef}
          data-cursor="magnify"
          className="mt-8 max-w-2xl text-lg leading-relaxed opacity-80 md:text-xl"
        >
          {panel.desc}
        </p>
      </div>

      {/* composed ruler: fixed x-positions, rising ticks, sliding diamond */}
      <div ref={rulerRef} className="relative mt-28 hidden h-44 w-full md:block">
        {/* top rail + minor ticks */}
        <div className="absolute inset-x-0 bottom-10 h-px bg-fg/30" />
        <div
          className="absolute inset-x-0 bottom-10 h-2.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, color-mix(in srgb, var(--fg) 30%, transparent) 0 1px, transparent 1px 14px)",
          }}
          aria-hidden="true"
        />
        {/* diamond marker that slides along the rail */}
        <div
          ref={diamondRef}
          className="transition-accent absolute bottom-10 left-0 h-3 w-3 -translate-y-1/2 rotate-45 bg-accent"
          aria-hidden="true"
        />
        {panel.tools.map((tool, i) => (
          <div
            key={tool.name}
            className="absolute bottom-10"
            style={{ left: `${n === 1 ? 50 : 4 + (92 * i) / (n - 1)}%` }}
          >
            <span
              className="svc-stem absolute bottom-0 left-0 block w-px bg-fg/70"
              style={{ height: tool.stem }}
              aria-hidden="true"
            />
            <span
              className="svc-label absolute left-0 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] opacity-70"
              style={{ bottom: tool.stem + 12 }}
            >
              {tool.name}
            </span>
          </div>
        ))}
      </div>

      {/* mobile: composed but compact, no scroll */}
      <div className="mt-14 flex flex-wrap gap-x-6 gap-y-3 md:hidden">
        {panel.tools.map((tool) => (
          <span
            key={tool.name}
            className="text-[11px] font-medium uppercase tracking-[0.18em] opacity-70"
          >
            <span className="transition-accent text-accent" aria-hidden="true">
              {"◇ "}
            </span>
            {tool.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  useSectionAccent(ref, "sky");

  return (
    <section ref={ref} id="services" className="relative">
      {PANELS.map((panel, i) => (
        <ServicePanel key={panel.word} panel={panel} index={i} />
      ))}
    </section>
  );
}
