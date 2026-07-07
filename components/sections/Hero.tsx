"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useSectionAccent } from "@/components/AccentContext";
import { attachSlideHover } from "@/lib/letterSlide";

const TAGS = [
  "AI INTEGRATION",
  "FULL-STACK",
  "COMPUTER VISION",
  "CIVIC-TECH",
  "DATA PIPELINES",
  "SELF-TAUGHT",
];

// like the reference: plain first line, two accent letters in the surname
const NAME_LINES = [
  { text: "ROHIT", accents: [] as number[], align: "self-start" },
  { text: "POUDEL", accents: [1, 5], align: "self-end" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

interface HeroProps {
  started: boolean;
}

export default function Hero({ started }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  // Live scroll progress of the pin, not a one-shot "entered" flag: the
  // hero is the first section, so ScrollTrigger's "top top" start already
  // matches at scrollY 0 and onEnter fires immediately on load — a boolean
  // toggled by onEnter/onLeaveBack would latch true forever and permanently
  // block the hover below. Progress is 0 at rest, so gate on that instead.
  const pinProgressRef = useRef(0);
  useSectionAccent(ref, "sage");

  // Pinned scroll choreography: the name dissolves letter by letter while
  // the leading R and P travel into the fixed "RP." wordmark and stay there.
  useEffect(() => {
    const section = ref.current;
    const name = nameRef.current;
    const sub = subRef.current;
    if (!section || !name || !sub) return;
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const letters = Array.from(
          name.querySelectorAll<HTMLElement>(".hero-letter")
        );
        const leadR = name.querySelector<HTMLElement>("#hero-lead-r");
        const leadP = name.querySelector<HTMLElement>("#hero-lead-p");
        const logoR = document.getElementById("logo-r");
        const logoP = document.getElementById("logo-p");
        const wordmark = document.getElementById("site-logo");
        if (!leadR || !leadP || !logoR || !logoP || !wordmark) return;
        const others = letters.filter((l) => l !== leadR && l !== leadP);

        gsap.set([leadR, leadP], { transformOrigin: "0 0" });

        const flyTo = (letter: HTMLElement, target: HTMLElement) => ({
          x: () => {
            const from = letter.getBoundingClientRect();
            const to = target.getBoundingClientRect();
            return to.left - from.left;
          },
          y: () => {
            const from = letter.getBoundingClientRect();
            const to = target.getBoundingClientRect();
            return to.top - from.top;
          },
          scale: () => {
            const from = letter.getBoundingClientRect();
            const to = target.getBoundingClientRect();
            return Math.max(to.height / Math.max(from.height, 1), 0.02);
          },
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1400",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => (pinProgressRef.current = self.progress),
          },
        });

        tl.to(sub, { autoAlpha: 0, y: -50, duration: 0.3, ease: "power2.in" }, 0)
          .to(
            others,
            {
              autoAlpha: 0,
              y: () => gsap.utils.random(-80, 80),
              x: () => gsap.utils.random(-50, 50),
              duration: 0.45,
              stagger: { each: 0.035, from: "random" },
              ease: "power2.in",
            },
            0.05
          )
          .to(leadR, { ...flyTo(leadR, logoR), duration: 0.9, ease: "power2.inOut" }, 0.5)
          .to(leadP, { ...flyTo(leadP, logoP), duration: 0.9, ease: "power2.inOut" }, 0.5)
          .to(wordmark, { autoAlpha: 1, duration: 0.15 }, 1.28)
          .to(leadP, { autoAlpha: 0, duration: 0.12 }, "<")
          .to(leadR, { autoAlpha: 0, duration: 0.12 }, 1.32)
          .to({}, { duration: 0.2 });
      }
    );

    return () => mm.revert();
  }, []);

  // Slide-on-hover: each letter kicks away from wherever the cursor enters
  // it, at a randomized angle so neighboring letters never move in the
  // same direction, then springs back — a scattered, tactile reaction
  // instead of one uniform ripple.
  useEffect(() => {
    const container = nameRef.current;
    if (!container) return;
    return attachSlideHover(container, ".hero-letter-inner", {
      minDist: 20,
      maxDist: 42,
      canSkip: () => pinProgressRef.current > 0.01,
    });
  }, []);

  // The per-letter mask (.hero-letter) is overflow-hidden so the initial
  // reveal-from-below animation stays clipped to one line height. Once
  // that entrance finishes, release the clip — otherwise the hover slide
  // above gets cut off against that same tight mask.
  useEffect(() => {
    if (!started) return;
    const container = nameRef.current;
    if (!container) return;
    const t = setTimeout(() => {
      container.querySelectorAll<HTMLElement>(".hero-letter").forEach((el) => {
        el.style.overflow = "visible";
      });
    }, 1100);
    return () => clearTimeout(t);
  }, [started]);

  const marqueeItems = [...TAGS, ...TAGS];

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex h-screen flex-col overflow-hidden pt-16 md:pt-20"
    >
      <h1
        ref={nameRef}
        className="flex flex-col px-4 font-display text-[clamp(4.25rem,16.5vw,16rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em] md:px-10"
      >
        {NAME_LINES.map((line, li) => (
          <span key={line.text} className={`block ${line.align}`}>
            {line.text.split("").map((ch, i) => {
              const id =
                i === 0 ? (li === 0 ? "hero-lead-r" : "hero-lead-p") : undefined;
              const accentClass = line.accents.includes(i)
                ? "transition-accent text-accent"
                : "";

              // Every letter — including the R of ROHIT and P of POUDEL —
              // goes through the same reveal. The ids are kept only for the
              // later scroll-triggered fly-to-wordmark interaction below.
              return (
                <span
                  key={i}
                  id={id}
                  className={`hero-letter inline-block overflow-hidden will-change-transform ${accentClass}`}
                >
                  <motion.span
                    className="hero-letter-inner inline-block will-change-transform"
                    initial={{ y: "110%" }}
                    animate={started ? { y: "0%" } : {}}
                    transition={{
                      duration: 0.7,
                      ease: EASE,
                      delay: started ? 0.03 * i : 0,
                    }}
                  >
                    {ch}
                  </motion.span>
                </span>
              );
            })}
          </span>
        ))}
      </h1>

      <div ref={subRef} className="flex flex-1 flex-col">
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={started ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          data-cursor="magnify"
          className="mt-4 mb-8 self-end px-4 text-right font-display text-[clamp(1rem,1.9vw,1.5rem)] font-bold uppercase leading-relaxed md:mb-10 md:px-10"
        >
          Developer &amp; AI enthusiast building intelligent apps
          <br />
          and learning as I go, through self-study, hackathons, and competitions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="marquee-paused mt-auto mb-14 w-full overflow-hidden border-y-2 border-fg py-5 md:mb-20"
          aria-label={TAGS.join(", ")}
        >
          <div
            className="marquee-track items-center"
            style={{ "--marquee-duration": "26s" } as React.CSSProperties}
          >
            {marqueeItems.map((tag, i) => (
              <span
                key={i}
                className="transition-accent flex shrink-0 items-center font-display text-2xl font-bold uppercase tracking-[0.08em] text-accent md:text-3xl"
              >
                <span>{tag}</span>
                <span className="mx-10" aria-hidden="true">
                  {i % 2 === 0 ? "◇" : "◆"}
                </span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
