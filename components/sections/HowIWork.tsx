"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useSectionAccent } from "@/components/AccentContext";

interface Step {
  word: string;
  heading: string;
  copy: string;
}

const STEPS: Step[] = [
  {
    word: "DISCOVER",
    heading: "Listen first.",
    copy: "Sit with the people who actually have the problem. Define what done means before writing a line of code.",
  },
  {
    word: "DEFINE",
    heading: "Scope is a design tool.",
    copy: "Cut to the single flow that proves the idea works. Everything else goes on the someday list, on purpose.",
  },
  {
    word: "BUILD",
    heading: "Understand it or don't ship it.",
    copy: "If I can't rebuild the core without AI or the internet, I don't understand it yet — that's the standard.",
  },
  {
    word: "SHIP",
    heading: "Polished beats demo, every time.",
    copy: "Deploy early, test on real devices and real connections, and fix the seams nobody shows on stage.",
  },
  {
    word: "REFLECT",
    heading: "Every build ends with a retro.",
    copy: "What broke, what I'd cut sooner, and which parts are grounded enough to become research.",
  },
];

// Choreography for the two overlapping circles, one pose per step
const GHOST_POSES = [
  { x: -240, y: -50, scale: 1 },
  { x: 190, y: 70, scale: 0.75 },
  { x: -110, y: 160, scale: 1.15 },
  { x: 230, y: -130, scale: 0.9 },
  { x: 0, y: 30, scale: 1.25 },
];

const ACCENT_POSES = [
  { x: 130, y: 90, scale: 1 },
  { x: -190, y: -60, scale: 1.2 },
  { x: 170, y: -150, scale: 0.8 },
  { x: -220, y: 110, scale: 1.05 },
  { x: 10, y: -20, scale: 0.7 },
];

export default function HowIWork() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  useSectionAccent(ref, "amber");

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const words = el.querySelectorAll<HTMLElement>(".hiw-word");
        const infos = el.querySelectorAll<HTMLElement>(".hiw-info");
        const ghost = ghostRef.current;
        const accent = accentRef.current;
        if (!ghost || !accent) return;

        gsap.set(words, { autoAlpha: 0, yPercent: 55 });
        gsap.set(infos, { autoAlpha: 0, y: 24 });
        gsap.set(words[0], { autoAlpha: 1, yPercent: 0 });
        gsap.set(infos[0], { autoAlpha: 1, y: 0 });
        gsap.set(ghost, GHOST_POSES[0]);
        gsap.set(accent, ACCENT_POSES[0]);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: `+=${STEPS.length * 850}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        STEPS.forEach((_, i) => {
          if (i === 0) return;
          tl.to(
            words[i - 1],
            { autoAlpha: 0, yPercent: -55, duration: 0.45 },
            `step-${i}`
          )
            .to(infos[i - 1], { autoAlpha: 0, y: -24, duration: 0.35 }, "<")
            .to(ghost, { ...GHOST_POSES[i], duration: 0.7 }, "<")
            .to(accent, { ...ACCENT_POSES[i], duration: 0.7 }, "<")
            .to(
              words[i],
              { autoAlpha: 1, yPercent: 0, duration: 0.45 },
              "<0.18"
            )
            .to(infos[i], { autoAlpha: 1, y: 0, duration: 0.35 }, "<0.1")
            .to({}, { duration: 0.35 }); // hold on each step
        });
      }
    );

    return () => mm.revert();
  }, []);

  const stacked = (
    <div className={`space-y-24 px-4 py-24 ${reduced ? "" : "md:hidden"}`}>
      {STEPS.map((step, i) => (
        <motion.div
          key={step.word}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="transition-accent font-display text-base font-bold text-accent">
            {`0${i + 1}/0${STEPS.length}`}
          </p>
          <h3 className="mt-2 font-display text-6xl font-bold uppercase leading-none">
            {step.word}
          </h3>
          <p className="mt-5 font-display text-xl font-bold">{step.heading}</p>
          <p className="mt-2 max-w-md text-base leading-relaxed opacity-70">
            {step.copy}
          </p>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section ref={ref} id="process" className="relative">
      {stacked}

      {!reduced && (
        <div
          ref={pinRef}
          className="relative hidden h-screen items-center overflow-hidden md:flex"
        >
          <p className="transition-accent absolute left-8 top-24 text-[13px] font-medium uppercase tracking-[0.3em] md:top-28">
            <span className="text-accent" aria-hidden="true">
              {"◇ "}
            </span>
            How I Work
          </p>

          {/* left: circles + crossfading word */}
          <div className="relative flex h-full w-3/5 items-center justify-center">
            <div
              ref={ghostRef}
              className="absolute aspect-square rounded-full bg-fg/10 will-change-transform"
              style={{ width: "min(62vh, 44vw)" }}
              aria-hidden="true"
            />
            <div
              ref={accentRef}
              className="transition-accent absolute aspect-square rounded-full bg-accent will-change-transform"
              style={{ width: "min(46vh, 33vw)", opacity: 0.9 }}
              aria-hidden="true"
            />
            <div className="relative h-[1.1em] w-full text-center font-display text-[clamp(4rem,11vw,11.5rem)] font-bold uppercase leading-none">
              {STEPS.map((step) => (
                <span
                  key={step.word}
                  className="hiw-word absolute inset-x-0 will-change-transform"
                >
                  {step.word}
                </span>
              ))}
            </div>
          </div>

          {/* right: counter, heading, copy */}
          <div className="relative h-64 w-2/5 pr-14">
            {STEPS.map((step, i) => (
              <div key={step.word} className="hiw-info absolute inset-0">
                <p className="transition-accent font-display text-lg font-bold tracking-widest text-accent">
                  {`0${i + 1}/0${STEPS.length}`}
                </p>
                <h3 className="mt-4 font-display text-3xl font-bold lg:text-4xl">
                  {step.heading}
                </h3>
                <p
                  className="mt-5 max-w-md text-base leading-relaxed opacity-75 lg:text-lg"
                  data-cursor="magnify"
                >
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
