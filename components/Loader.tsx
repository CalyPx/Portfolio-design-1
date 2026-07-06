"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIntro } from "@/components/IntroContext";

const GREETINGS = ["Hello", "Bonjour", "Hallo", "Ola", "नमस्ते", "سلام"];

const STEP_MS = 380;
const DARK = "#0b0f0e";
const LIGHT = "#ffffff";

export default function Loader({ onDone }: { onDone: () => void }) {
  const { setGreetingActive } = useIntro();
  const [visible, setVisible] = useState(true);
  const [idx, setIdx] = useState(0);
  const [wiping, setWiping] = useState(false);
  const wipeRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.body.style.overflow = "";
    window.__lenis?.start();
    setGreetingActive(false);
    onDoneRef.current();
    setVisible(false);
  };

  // Plays on every load, including reloads — not just once per tab session.
  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Respect prefers-reduced-motion: skip the choreography, just reveal.
  useEffect(() => {
    if (!visible || !prefersReducedMotion()) return;
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Cycle greetings, then trigger the wipe
  useEffect(() => {
    if (!visible || wiping || prefersReducedMotion()) return;
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
    onDoneRef.current();
    const tween = gsap.fromTo(
      wipeRef.current,
      { scale: 0, xPercent: -50, yPercent: -50 },
      {
        scale: 1,
        xPercent: -50,
        yPercent: -50,
        duration: 0.85,
        ease: "power3.inOut",
        onComplete: () => {
          finishedRef.current = true;
          document.body.style.overflow = "";
          window.__lenis?.start();
          setVisible(false);
        },
      }
    );
    return () => {
      tween.kill();
    };
  }, [wiping]);

  // Safety valve: never leave the page stuck behind the intro.
  useEffect(() => {
    const t = setTimeout(finish, 8000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const darkStep = idx % 2 === 0;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: darkStep ? DARK : LIGHT,
        transition: "background-color 0.25s ease",
      }}
      aria-hidden="true"
    >
      <motion.span
        key={idx}
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="font-display text-[clamp(3rem,12vw,9rem)] font-bold leading-none"
        style={{ color: darkStep ? LIGHT : DARK }}
      >
        {GREETINGS[idx]}
      </motion.span>
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
