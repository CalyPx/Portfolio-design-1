"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Attach to a text element's ref: on hover, characters scramble through
 * random letters and lock into the real text left-to-right, decoder-style.
 */
export function useScramble(text: string) {
  const ref = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const run = () => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const len = text.length;
    const duration = 480;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const revealCount = Math.floor(progress * len);
      let out = "";
      for (let i = 0; i < len; i++) {
        if (text[i] === " ") {
          out += " ";
        } else if (i < revealCount) {
          out += text[i];
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      el.textContent = out;
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        el.textContent = text;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  return { ref, onMouseEnter: run };
}
