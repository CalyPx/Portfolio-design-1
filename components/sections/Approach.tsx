"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useSectionAccent } from "@/components/AccentContext";

interface Word {
  text: string;
  accent?: boolean;
}

const STATEMENT: Word[] = [
  { text: "REAL" },
  { text: "PROBLEMS" },
  { text: "IN" },
  { text: "NEPAL" },
  { text: "DESERVE" },
  { text: "REAL" },
  { text: "PRODUCTS", accent: true },
  { text: "—" },
  { text: "BUILT" },
  { text: "TO" },
  { text: "SHIP,", accent: true },
  { text: "GROUNDED" },
  { text: "ENOUGH" },
  { text: "TO" },
  { text: "BE" },
  { text: "RESEARCH.", accent: true },
];

export default function Approach() {
  const ref = useRef<HTMLElement>(null);
  useSectionAccent(ref, "amber");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    // Desktop: pinned — the statement assembles word by word while the
    // section holds the viewport, then releases.
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const words = el.querySelectorAll<HTMLElement>(".reveal-word");
        gsap.set(words, { yPercent: 110 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=800",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });
        tl.to(words, {
          yPercent: 0,
          ease: "none",
          stagger: 0.35,
          duration: 1,
        }).to({}, { duration: 0.4 }); // brief hold the finished statement
      }
    );

    // Mobile: plain scrubbed reveal, no pin
    mm.add(
      "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      () => {
        const words = el.querySelectorAll<HTMLElement>(".reveal-word");
        gsap.set(words, { yPercent: 110 });
        gsap.to(words, {
          yPercent: 0,
          ease: "none",
          stagger: 0.35,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "center 55%",
            scrub: 0.6,
          },
        });
      }
    );

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: el, start: "top 75%" },
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="approach"
      className="relative flex min-h-screen flex-col justify-start px-4 pb-24 pt-28 md:px-8 md:pt-36"
    >
      <p className="transition-accent mb-12 text-[13px] font-medium uppercase tracking-[0.3em]">
        <span className="text-accent" aria-hidden="true">
          {"◇ "}
        </span>
        Approach &amp; Vision
      </p>
      <h2 className="font-display text-[clamp(2.4rem,7.4vw,7.5rem)] font-bold uppercase leading-[1.04] tracking-tight">
        {STATEMENT.map((w, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span
                className={`reveal-word inline-block will-change-transform ${
                  w.accent ? "transition-accent text-accent" : ""
                }`}
              >
                {w.text}
              </span>
            </span>{" "}
          </span>
        ))}
      </h2>
    </section>
  );
}
