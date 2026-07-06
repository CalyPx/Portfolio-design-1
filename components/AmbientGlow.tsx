"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

interface Blob {
  size: number;
  top: string;
  left: string;
  factor: number;
  opacity: number;
}

const BLOBS: Blob[] = [
  { size: 640, top: "-8%", left: "8%", factor: 26, opacity: 0.35 },
  { size: 520, top: "38%", left: "72%", factor: -18, opacity: 0.3 },
  { size: 460, top: "78%", left: "18%", factor: 20, opacity: 0.28 },
];

/**
 * Fixed, blurred accent-colored blobs that drift slowly on their own and
 * nudge toward the cursor — a soft light source behind the whole site that
 * always matches the current section's accent (via --accent custom prop).
 */
export default function AmbientGlow() {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const els = blobRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    const drifts = els.map((el, i) =>
      gsap.to(el, {
        x: () => gsap.utils.random(-60, 60),
        y: () => gsap.utils.random(-50, 50),
        duration: () => gsap.utils.random(14, 20),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.6,
      })
    );

    if (!window.matchMedia("(pointer: fine)").matches) {
      return () => drifts.forEach((t) => t.kill());
    }

    const movers = els.map((el, i) => ({
      x: gsap.quickTo(el, "--mx", { duration: 1.1, ease: "power2.out" }),
      y: gsap.quickTo(el, "--my", { duration: 1.1, ease: "power2.out" }),
      factor: BLOBS[i].factor,
    }));

    const onMove = (e: MouseEvent) => {
      const rx = e.clientX / window.innerWidth - 0.5;
      const ry = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => {
        m.x(rx * m.factor);
        m.y(ry * m.factor);
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      drifts.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {BLOBS.map((b, i) => (
        <div
          key={i}
          ref={(el) => {
            blobRefs.current[i] = el;
          }}
          className="transition-accent absolute rounded-full will-change-transform"
          style={
            {
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
              opacity: b.opacity,
              background:
                "radial-gradient(circle, var(--accent) 0%, transparent 72%)",
              filter: "blur(70px)",
              transform:
                "translate(calc(var(--mx, 0) * 1px), calc(var(--my, 0) * 1px))",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
