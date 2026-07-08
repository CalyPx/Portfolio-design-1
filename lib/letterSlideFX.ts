"use client";

import { gsap, prefersReducedMotion } from "@/lib/gsap";

interface Options {
  /** Attach a mouseenter listener per letter. Default true. */
  hover?: boolean;
  /** Also trigger the same slide on random letters, unprompted. Default false. */
  ambient?: boolean;
  /** [min, max] ms between ambient triggers. */
  ambientDelay?: [number, number];
  canSkip?: () => boolean;
}

// One of 4 axis-aligned directions, picked fresh on every trigger so the
// letters never read as a single repeating pattern.
const DIRS = [
  { x: 0, y: -1 }, // up
  { x: 0, y: 1 }, // down
  { x: -1, y: 0 }, // left
  { x: 1, y: 0 }, // right
];

interface Letter {
  el: HTMLElement;
  box: HTMLElement;
  animating: boolean;
}

/**
 * "Slide through" letter effect: the letter slides out in a random
 * direction while an identical clone slides in from the opposite
 * direction to take its place — same glyph, so the swap reads as the
 * letter sliding through itself, not a crossfade. The letter's box never
 * moves or resizes; only the glyph inside it travels, clipped by that
 * box's overflow-hidden.
 *
 * Can run on hover (per-letter mouseenter), ambient (random letters fire
 * on their own on a randomized timer), or both — Hero's name uses hover
 * only, Approach's accent words use both.
 */
export function attachLetterSlideFX(
  container: HTMLElement,
  innerSelector: string,
  options: Options = {}
) {
  if (prefersReducedMotion()) return () => {};

  const {
    hover = true,
    ambient = false,
    ambientDelay = [900, 2600],
    canSkip,
  } = options;
  const canHover =
    typeof window === "undefined" || window.matchMedia("(pointer: fine)").matches;

  const letters: Letter[] = Array.from(
    container.querySelectorAll<HTMLElement>(innerSelector)
  ).map((el) => {
    const box = el.parentElement as HTMLElement;
    box.style.position = "relative";
    return { el, box, animating: false };
  });

  const trigger = (letter: Letter) => {
    if (canSkip?.() || letter.animating) return;
    letter.animating = true;

    const { el, box } = letter;
    const dir = DIRS[Math.floor(Math.random() * DIRS.length)];
    const clone = el.cloneNode(true) as HTMLElement;
    clone.setAttribute("aria-hidden", "true");
    clone.style.position = "absolute";
    clone.style.left = "0";
    clone.style.top = "0";
    box.appendChild(clone);
    gsap.set(clone, { xPercent: -dir.x * 100, yPercent: -dir.y * 100 });

    gsap.to(el, {
      xPercent: dir.x * 100,
      yPercent: dir.y * 100,
      duration: 0.5,
      ease: "power3.inOut",
    });
    gsap.to(clone, {
      xPercent: 0,
      yPercent: 0,
      duration: 0.5,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(el, { xPercent: 0, yPercent: 0 });
        clone.remove();
        letter.animating = false;
      },
    });
  };

  const cleanups: Array<() => void> = [];

  if (hover && canHover) {
    for (const letter of letters) {
      const onEnter = () => trigger(letter);
      letter.box.addEventListener("mouseenter", onEnter);
      cleanups.push(() => letter.box.removeEventListener("mouseenter", onEnter));
    }
  }

  if (ambient && letters.length) {
    let timeoutId: ReturnType<typeof setTimeout>;
    const [min, max] = ambientDelay;
    const scheduleNext = () => {
      timeoutId = setTimeout(tick, min + Math.random() * (max - min));
    };
    const tick = () => {
      if (!canSkip?.()) {
        const idle = letters.filter((l) => !l.animating);
        if (idle.length) {
          trigger(idle[Math.floor(Math.random() * idle.length)]);
        }
      }
      scheduleNext();
    };
    scheduleNext();
    cleanups.push(() => clearTimeout(timeoutId));
  }

  return () => cleanups.forEach((fn) => fn());
}
