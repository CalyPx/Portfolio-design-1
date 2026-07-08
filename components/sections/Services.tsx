"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
    desc: "Design systems, kinetic interaction, interfaces that hold up outside a perfect demo. This is the frontend side I keep coming back to and keep getting better at.",
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
    desc: "APIs, data models, deploys, and the occasional microcontroller. This is the plumbing that keeps a project from falling over, and I'm drawn to the unglamorous parts that make everything else work.",
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
    desc: "LLM routing, vision pipelines, and classical ML. I'm still learning where a real model quietly beats a clever prompt, and picking tools for the constraint, not the leaderboard.",
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

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  useSectionAccent(ref, "sky");

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  // Single pin for the whole trio: headline, description, index counter and
  // toolkit ruler all crossfade in place while the section holds the
  // viewport, instead of each panel pinning and scrolling past the next.
  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const wordEls = Array.from(el.querySelectorAll<HTMLElement>(".svc-word"));
        const descEls = Array.from(el.querySelectorAll<HTMLElement>(".svc-desc"));
        const rulerEls = Array.from(el.querySelectorAll<HTMLElement>(".svc-ruler"));
        const indexEls = Array.from(el.querySelectorAll<HTMLElement>(".svc-index"));
        if (!wordEls.length || !rulerEls.length) return;

        const rulerParts = rulerEls.map((r) => ({
          stems: Array.from(r.querySelectorAll<HTMLElement>(".svc-stem")),
          labels: Array.from(r.querySelectorAll<HTMLElement>(".svc-label")),
          diamond: r.querySelector<HTMLElement>(".svc-diamond"),
          rail: r,
        }));

        gsap.set(wordEls, { autoAlpha: 0, yPercent: 55 });
        gsap.set(descEls, { autoAlpha: 0, y: 24 });
        gsap.set(rulerEls, { autoAlpha: 0 });
        gsap.set(indexEls, { autoAlpha: 0 });
        rulerParts.forEach((p) => {
          gsap.set(p.stems, { scaleY: 0, transformOrigin: "bottom center" });
          gsap.set(p.labels, { autoAlpha: 0 });
          if (p.diamond) gsap.set(p.diamond, { x: 0 });
        });

        gsap.set(wordEls[0], { autoAlpha: 1, yPercent: 0 });
        gsap.set(indexEls[0], { autoAlpha: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: `+=${PANELS.length * 800}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // panel 0's own reveal, right as the pin engages
        tl.to(descEls[0], { autoAlpha: 1, y: 0, duration: 0.3 }, 0.1)
          .to(rulerEls[0], { autoAlpha: 1, duration: 0.2 }, 0.1)
          .to(
            rulerParts[0].stems,
            { scaleY: 1, duration: 0.35, stagger: 0.07, ease: "power2.out" },
            0.2
          )
          .to(rulerParts[0].labels, { autoAlpha: 1, duration: 0.25, stagger: 0.07 }, 0.3)
          .to(
            rulerParts[0].diamond,
            { x: () => rulerParts[0].rail.clientWidth - 16, ease: "none", duration: 1 },
            0.1
          )
          .to({}, { duration: 0.6 }); // hold panel 0

        PANELS.forEach((_, i) => {
          if (i === 0) return;
          const label = `panel-${i}`;
          tl.addLabel(label)
            .to(wordEls[i - 1], { autoAlpha: 0, yPercent: -55, duration: 0.4 }, label)
            .to(descEls[i - 1], { autoAlpha: 0, y: -24, duration: 0.3 }, "<")
            .to(rulerEls[i - 1], { autoAlpha: 0, duration: 0.3 }, "<")
            .to(indexEls[i - 1], { autoAlpha: 0, duration: 0.2 }, "<")
            .to(wordEls[i], { autoAlpha: 1, yPercent: 0, duration: 0.4 }, "<0.15")
            .to(indexEls[i], { autoAlpha: 1, duration: 0.2 }, "<")
            .to(descEls[i], { autoAlpha: 1, y: 0, duration: 0.3 }, "<0.1")
            .to(rulerEls[i], { autoAlpha: 1, duration: 0.2 }, "<")
            .to(
              rulerParts[i].stems,
              { scaleY: 1, duration: 0.35, stagger: 0.07, ease: "power2.out" },
              "<0.05"
            )
            .to(rulerParts[i].labels, { autoAlpha: 1, duration: 0.25, stagger: 0.07 }, "<0.1")
            .to(
              rulerParts[i].diamond,
              { x: () => rulerParts[i].rail.clientWidth - 16, ease: "none", duration: 1 },
              "<"
            )
            .to({}, { duration: 0.6 }); // hold
        });
      }
    );

    return () => mm.revert();
  }, []);

  // Decorative dot cluster drifts on mouse-move (parallax) across the whole
  // pinned block, rather than per panel.
  useEffect(() => {
    const el = pinRef.current;
    const dotsEl = dotsRef.current;
    if (!el || !dotsEl) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dots = Array.from(dotsEl.children) as HTMLElement[];
    const movers = dots.map((dot, i) => ({
      x: gsap.quickTo(dot, "x", { duration: 0.6, ease: "power3.out" }),
      y: gsap.quickTo(dot, "y", { duration: 0.6, ease: "power3.out" }),
      factor: (i + 1) * 10,
    }));

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const rx = (e.clientX - rect.left) / rect.width - 0.5;
      const ry = (e.clientY - rect.top) / rect.height - 0.5;
      movers.forEach((m) => {
        m.x(rx * m.factor * 2);
        m.y(ry * m.factor * 2);
      });
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const stacked = (
    <div className={`space-y-24 px-4 py-24 ${reduced ? "" : "md:hidden"}`}>
      {PANELS.map((panel, i) => (
        <motion.div
          key={panel.word}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="transition-accent text-[13px] font-medium uppercase tracking-[0.3em]">
            <span className="text-accent-ink" aria-hidden="true">
              {"◇ "}
            </span>
            What I Do · 0{i + 1}/03
          </p>
          <h3 className="mt-4 font-display text-[clamp(2.6rem,11vw,5rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
            {panel.word}
          </h3>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
            {panel.desc}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {panel.tools.map((tool) => (
              <span
                key={tool.name}
                className="text-[11px] font-medium uppercase tracking-[0.18em] opacity-70"
              >
                <span className="transition-accent text-accent-ink" aria-hidden="true">
                  {"◇ "}
                </span>
                {tool.name}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section ref={ref} id="services" className="relative">
      {stacked}

      {!reduced && (
        <div
          ref={pinRef}
          className="relative hidden h-screen flex-col overflow-hidden px-4 py-24 md:flex md:px-8"
        >
          <p className="transition-accent shrink-0 text-[13px] font-medium uppercase tracking-[0.3em]">
            <span className="text-accent-ink" aria-hidden="true">
              {"◇ "}
            </span>
            What I Do ·{" "}
            <span className="relative inline-grid align-baseline">
              {PANELS.map((panel, i) => (
                <span key={panel.word} className="svc-index col-start-1 row-start-1">
                  0{i + 1}
                </span>
              ))}
            </span>
            /03
          </p>

          <div className="relative flex min-h-0 flex-1 flex-col justify-center">
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

            <h3 className="grid font-display text-[clamp(3.4rem,11vw,10rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
              {PANELS.map((panel) => (
                <span
                  key={panel.word}
                  className="svc-word col-start-1 row-start-1 will-change-transform"
                >
                  {panel.word}
                </span>
              ))}
            </h3>

            <div className="relative mt-8 grid max-w-2xl text-lg leading-relaxed opacity-80 md:text-xl">
              {PANELS.map((panel) => (
                <p
                  key={panel.word}
                  className="svc-desc col-start-1 row-start-1"
                >
                  {panel.desc}
                </p>
              ))}
            </div>
          </div>

          {/* composed ruler: fixed x-positions, rising ticks, sliding diamond —
              one stacked per panel, crossfaded by the timeline above */}
          <div className="relative h-44 w-full shrink-0">
            {PANELS.map((panel) => {
              const n = panel.tools.length;
              return (
                <div key={panel.word} className="svc-ruler absolute inset-0">
                  <div className="absolute inset-x-0 bottom-10 h-px bg-fg/30" />
                  <div
                    className="absolute inset-x-0 bottom-10 h-2.5"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, color-mix(in srgb, var(--fg) 30%, transparent) 0 1px, transparent 1px 14px)",
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="svc-diamond transition-accent absolute bottom-10 left-0 h-3 w-3 -translate-y-1/2 rotate-45 bg-accent"
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
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
