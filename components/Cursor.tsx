"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { ViewCaseRing } from "@/components/CaseTransition";

type CursorMode = "default" | "hover" | "view" | "hidden";

const BASE = 46;
const VIEW = 110;

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLSpanElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  // null (not any real mode) so the very first pointer event always applies
  const modeRef = useRef<CursorMode | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current!;
    const base = baseRef.current!;
    const plus = plusRef.current!;
    const view = viewRef.current!;

    const xTo = gsap.quickTo(wrap, "x", { duration: 0.16, ease: "power3.out" });
    const yTo = gsap.quickTo(wrap, "y", { duration: 0.16, ease: "power3.out" });

    const applyMode = (mode: CursorMode) => {
      if (mode === modeRef.current) return;
      modeRef.current = mode;

      if (mode === "hidden") {
        gsap.to(wrap, { autoAlpha: 0, duration: 0.2 });
        return;
      }
      gsap.to(wrap, { autoAlpha: 1, duration: 0.2 });

      gsap.to(base, {
        scale: mode === "hover" ? 1.35 : mode === "default" ? 1 : 0.15,
        autoAlpha: mode === "view" ? 0 : 1,
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to(plus, {
        autoAlpha: mode === "hover" ? 1 : 0,
        scale: mode === "hover" ? 1 : 0.5,
        duration: 0.25,
      });
      gsap.to(view, {
        autoAlpha: mode === "view" ? 1 : 0,
        scale: mode === "view" ? 1 : 0.6,
        duration: 0.28,
        ease: "power3.out",
      });
    };

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement | null;
      const marked = target?.closest?.("[data-cursor]") as HTMLElement | null;
      const mode = (marked?.dataset.cursor as CursorMode) || null;

      if (mode) {
        applyMode(mode);
      } else if (
        target?.closest?.("a, button, input, textarea, select, [role='button']")
      ) {
        applyMode("hover");
      } else {
        applyMode("default");
      }
    };

    const onLeave = () => applyMode("hidden");
    const onEnter = (e: MouseEvent) => {
      gsap.set(wrap, { x: e.clientX, y: e.clientY });
      modeRef.current = null; // force the reveal below to run
      applyMode("default");
    };

    // Reveal at whatever position the mouse already occupies, without
    // waiting for a mousemove event that may not fire for a while.
    document.addEventListener("pointermove", onEnter, { once: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      document.removeEventListener("pointermove", onEnter);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0"
      aria-hidden="true"
    >
      {/* layered base: solid circle + offset inner circle */}
      <div
        ref={baseRef}
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: BASE,
          height: BASE,
          left: -BASE / 2,
          top: -BASE / 2,
          backgroundColor: "var(--fg)",
        }}
      >
        <span
          className="absolute rounded-full"
          style={{
            width: BASE * 0.62,
            height: BASE * 0.62,
            left: BASE * 0.12,
            top: BASE * 0.1,
            backgroundColor: "var(--bg)",
            opacity: 0.92,
          }}
        />
        <span
          ref={plusRef}
          className="relative select-none text-2xl font-light leading-none opacity-0"
          style={{ color: "var(--fg)", mixBlendMode: "difference" }}
        >
          +
        </span>
      </div>

      {/* curved VIEW CASE label for project rows */}
      <div
        ref={viewRef}
        className="transition-accent absolute rounded-full bg-accent p-1 opacity-0"
        style={{ width: VIEW, height: VIEW, left: -VIEW / 2, top: -VIEW / 2, color: "#0b0f0e" }}
      >
        <ViewCaseRing />
        <span className="absolute inset-0 flex items-center justify-center text-xl">
          →
        </span>
      </div>
    </div>
  );
}
