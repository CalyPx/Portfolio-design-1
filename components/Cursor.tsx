"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { ViewCaseRing } from "@/components/CaseTransition";

type CursorMode = "default" | "hover" | "view" | "magnify" | "hidden";

const BASE = 46;
const VIEW = 110;
const MAG = 170;
const MAG_RADIUS = MAG / 2;

const COPIED_STYLE_PROPS: (keyof CSSStyleDeclaration)[] = [
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  "textTransform",
  "whiteSpace",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
];

const TRAIL = [
  { size: 11, color: "#9dbe8d", lag: 0.32 },
  { size: 9, color: "#e8a33d", lag: 0.46 },
  { size: 7, color: "#7fb5d5", lag: 0.62 },
];

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLSpanElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  // The magnify lens is built from two independent, untransformed layers so
  // it stays a solid disc rather than fighting compositing: a colored circle
  // backdrop, and a clipped white-text clone of the hovered copy sitting
  // exactly on top of the original, revealed only inside that circle.
  const magCircleRef = useRef<HTMLDivElement>(null);
  const magTextRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  // null (not any real mode) so the very first pointer event always applies
  const modeRef = useRef<CursorMode | null>(null);
  const magTargetRef = useRef<HTMLElement | null>(null);

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
    const magCircle = magCircleRef.current!;
    const magText = magTextRef.current!;

    const xTo = gsap.quickTo(wrap, "x", { duration: 0.16, ease: "power3.out" });
    const yTo = gsap.quickTo(wrap, "y", { duration: 0.16, ease: "power3.out" });
    const magXTo = gsap.quickTo(magCircle, "left", {
      duration: 0.16,
      ease: "power3.out",
    });
    const magYTo = gsap.quickTo(magCircle, "top", {
      duration: 0.16,
      ease: "power3.out",
    });

    // trailing accent dots — springy, deliberately lagging behind
    const trailMovers = trailRefs.current.map((dot, i) => {
      const cfg = TRAIL[i];
      return dot
        ? {
            x: gsap.quickTo(dot, "x", { duration: cfg.lag, ease: "power2.out" }),
            y: gsap.quickTo(dot, "y", { duration: cfg.lag, ease: "power2.out" }),
          }
        : null;
    });

    const buildMagText = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      magText.innerHTML = el.innerHTML;
      magText.style.left = `${rect.left}px`;
      magText.style.top = `${rect.top}px`;
      magText.style.width = `${rect.width}px`;
      magText.style.height = `${rect.height}px`;
      for (const prop of COPIED_STYLE_PROPS) {
        (magText.style as unknown as Record<string, string>)[prop as string] =
          cs[prop] as string;
      }
      gsap.set(magText, { autoAlpha: 1 });
    };

    const positionMagText = (e: MouseEvent, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      magText.style.clipPath = `circle(${MAG_RADIUS}px at ${relX}px ${relY}px)`;
    };

    const clearMagText = () => {
      gsap.set(magText, { autoAlpha: 0 });
      magText.innerHTML = "";
      magTargetRef.current = null;
    };

    const applyMode = (mode: CursorMode) => {
      if (mode === modeRef.current) return;
      const prevMode = modeRef.current;
      modeRef.current = mode;
      if (prevMode === "magnify" && mode !== "magnify") clearMagText();

      if (mode === "hidden") {
        gsap.to(wrap, { autoAlpha: 0, duration: 0.2 });
        gsap.to(magCircle, { autoAlpha: 0, duration: 0.2 });
        return;
      }
      gsap.to(wrap, { autoAlpha: 1, duration: 0.2 });

      gsap.to(base, {
        scale: mode === "hover" ? 1.35 : mode === "default" ? 1 : 0.15,
        autoAlpha: mode === "view" || mode === "magnify" ? 0 : 1,
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
      gsap.to(magCircle, {
        autoAlpha: mode === "magnify" ? 1 : 0,
        scale: mode === "magnify" ? 1 : 0.5,
        duration: 0.28,
        ease: "power3.out",
      });
    };

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      magXTo(e.clientX - MAG_RADIUS);
      magYTo(e.clientY - MAG_RADIUS);
      trailMovers.forEach((m) => {
        m?.x(e.clientX);
        m?.y(e.clientY);
      });

      const target = e.target as HTMLElement | null;
      const marked = target?.closest?.("[data-cursor]") as HTMLElement | null;
      const mode = (marked?.dataset.cursor as CursorMode) || null;

      if (mode === "magnify" && marked) {
        if (magTargetRef.current !== marked) {
          buildMagText(marked);
          magTargetRef.current = marked;
        }
        positionMagText(e, marked);
        applyMode("magnify");
      } else if (mode) {
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
      gsap.set(magCircle, {
        left: e.clientX - MAG_RADIUS,
        top: e.clientY - MAG_RADIUS,
      });
      trailRefs.current.forEach((dot) => {
        if (dot) gsap.set(dot, { x: e.clientX, y: e.clientY });
      });
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
    <>
      {/* trailing accent dots */}
      {TRAIL.map((dot, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="pointer-events-none fixed left-0 top-0 z-[99] rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            marginLeft: -dot.size / 2,
            marginTop: -dot.size / 2,
            backgroundColor: dot.color,
          }}
          aria-hidden="true"
        />
      ))}

      {/* magnify lens backdrop: solid accent circle, with the white text
          clone sitting on top of it */}
      <div
        ref={magCircleRef}
        className="transition-accent pointer-events-none fixed z-[98] rounded-full bg-accent opacity-0"
        style={{ width: MAG, height: MAG }}
        aria-hidden="true"
      />

      {/* magnify lens: white clone of the hovered copy, clipped to a circle
          that tracks the cursor within that element — so only the text
          under the lens shows in white, everything else stays as-is */}
      <div
        ref={magTextRef}
        className="pointer-events-none fixed z-[99] overflow-hidden text-white opacity-0"
        aria-hidden="true"
      />

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
    </>
  );
}
