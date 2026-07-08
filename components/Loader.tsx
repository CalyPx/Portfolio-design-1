"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIntro } from "@/components/IntroContext";

// Ends on नमस्ते — the one greeting that's actually his.
const GREETINGS = ["Hello", "Bonjour", "Hola", "سلام", "नमस्ते"];

const STEP_MS = 300;
const DARK = "#0b0f0e";
const LIGHT = "#ffffff";

// Rendered as a sibling of FixedUI (in Providers), not inside the page
// content wrapper — that wrapper is its own stacking context at z-10 in
// layout.tsx, which would otherwise cap this z-[95] below FixedUI's nav
// (z-75/80) regardless of the number used here. `started` in Home derives
// from IntroContext instead of a callback, since this no longer lives
// inside Home's tree.
export default function Loader() {
  const { setGreetingActive } = useIntro();
  const [visible, setVisible] = useState(true);
  const [idx, setIdx] = useState(0);
  const [wiping, setWiping] = useState(false);
  const wipeRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.body.style.overflow = "";
    window.__lenis?.start();
    setGreetingActive(false);
    setVisible(false);
  };

  // Full choreography plays on every load/reload. Reduced motion always skips.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      finish();
      return;
    }
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cycle greetings, then trigger the wipe
  useEffect(() => {
    if (!visible || wiping || finishedRef.current) return;
    const t = setTimeout(() => {
      if (idx < GREETINGS.length - 1) {
        setIdx((i) => i + 1);
      } else {
        setWiping(true);
      }
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [visible, wiping, idx]);

  // Clip-path circle expanding from center, wiping straight into the hero.
  useEffect(() => {
    if (!wiping || !wipeRef.current) return;
    setGreetingActive(false);
    const tween = gsap.fromTo(
      wipeRef.current,
      { scale: 0, xPercent: -50, yPercent: -50 },
      {
        scale: 1,
        xPercent: -50,
        yPercent: -50,
        duration: 0.85,
        ease: "power3.inOut",
        onComplete: finish,
      }
    );
    return () => {
      tween.kill();
    };
  }, [wiping]);

  // Safety valve: never leave the page stuck behind the intro.
  useEffect(() => {
    const t = setTimeout(finish, 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const pct = wiping
    ? 100
    : Math.round((idx / Math.max(GREETINGS.length - 1, 1)) * 100);

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: DARK }}
      aria-hidden="true"
    >
      <motion.span
        key={idx}
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="font-display text-[clamp(3rem,12vw,9rem)] font-bold leading-none"
        style={{ color: LIGHT }}
      >
        {GREETINGS[idx]}
      </motion.span>

      {/* ticking percentage counter, bottom-left */}
      <span
        className="absolute bottom-8 left-6 font-display text-sm font-bold tracking-[0.2em] tabular-nums md:bottom-10 md:left-10 md:text-base"
        style={{ color: LIGHT, opacity: 0.75 }}
      >
        {String(pct).padStart(3, "0")}%
      </span>

      {/* progress rail, bottom edge */}
      <div
        className="absolute inset-x-0 bottom-0 h-[3px]"
        style={{ backgroundColor: LIGHT, opacity: 0.15 }}
      >
        <div
          className="h-full"
          style={{
            width: `${pct}%`,
            backgroundColor: LIGHT,
            transition: "width 0.28s ease",
          }}
        />
      </div>

      <span
        className="absolute bottom-8 right-6 text-sm font-medium uppercase tracking-[0.3em] md:bottom-10 md:right-10"
        style={{ color: LIGHT, opacity: 0.75 }}
      >
        Rohit Poudel
      </span>

      {/* expanding reveal circle in the page background color */}
      <div
        ref={wipeRef}
        className="absolute left-1/2 top-1/2 h-[250vmax] w-[250vmax] rounded-full"
        style={{
          backgroundColor: "var(--bg)",
          transform: "translate(-50%, -50%) scale(0)",
        }}
      />
    </div>
  );
}
