"use client";

import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Wires up a per-letter (or per-word) hover slide: on mouseenter, the
 * element kicks away from wherever the cursor entered it, at a randomized
 * angle and distance so neighboring letters never slide in lockstep, then
 * springs back. Returns a cleanup function.
 */
export function attachSlideHover(
  container: HTMLElement,
  selector: string,
  options: { minDist?: number; maxDist?: number; canSkip?: () => boolean } = {}
) {
  if (prefersReducedMotion()) return () => {};
  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
    return () => {};
  }

  const { minDist = 14, maxDist = 30, canSkip } = options;
  const targets = Array.from(container.querySelectorAll<HTMLElement>(selector));
  const cleanups: (() => void)[] = [];

  targets.forEach((el) => {
    const onEnter = (e: MouseEvent) => {
      if (canSkip?.()) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // push away from the cursor's entry point, scattered by a random
      // cone so the same swipe never sends every letter the same way
      let angle = Math.atan2(e.clientY - cy, e.clientX - cx) + Math.PI;
      angle += (Math.random() - 0.5) * (Math.PI / 1.6);

      const dist = gsap.utils.random(minDist, maxDist);
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist * 0.65;

      // no rotation: these elements often sit inside an overflow-hidden
      // mask (for the initial reveal-from-below animation), and a rotated
      // box clips unpredictably against a straight-edged mask, producing
      // ugly overlap with neighboring text — a plain slide clips cleanly.
      gsap.killTweensOf(el);
      gsap.to(el, {
        x,
        y,
        duration: 0.22,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
          });
        },
      });
    };
    el.addEventListener("mouseenter", onEnter);
    cleanups.push(() => el.removeEventListener("mouseenter", onEnter));
  });

  return () => cleanups.forEach((fn) => fn());
}
