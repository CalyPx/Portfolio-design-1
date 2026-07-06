"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

interface TransitionState {
  x: number;
  y: number;
  href: string;
  color: string;
}

interface TransitionContextValue {
  navigate: (x: number, y: number, href: string, color: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
});

export function useCaseTransition() {
  return useContext(TransitionContext);
}

/** Curved "VIEW CASE" text on a circle, shared by cursor + transition badge */
export function ViewCaseRing({ spin = true }: { spin?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`h-full w-full ${spin ? "animate-[spin_9s_linear_infinite]" : ""}`}
      aria-hidden="true"
    >
      <defs>
        <path
          id="view-case-circle"
          d="M 50,50 m -33,0 a 33,33 0 1,1 66,0 a 33,33 0 1,1 -66,0"
        />
      </defs>
      <text
        fill="currentColor"
        style={{ fontSize: "12.5px", letterSpacing: "3.5px" }}
        className="font-display font-bold uppercase"
      >
        <textPath href="#view-case-circle">VIEW CASE · VIEW CASE ·</textPath>
      </text>
    </svg>
  );
}

export function CaseTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<TransitionState | null>(null);
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");
  const badgeRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<string | null>(null);

  const navigate = useCallback(
    (x: number, y: number, href: string, color: string) => {
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      targetRef.current = href;
      setState({ x, y, href, color });
      setPhase("cover");
    },
    [router]
  );

  // Phase 1: badge scales up from the click point and travels top-right
  // until it covers the viewport, then we push the route.
  useEffect(() => {
    if (phase !== "cover" || !state || !badgeRef.current) return;
    const badge = badgeRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // scale needed for a 140px circle centred near the top-right corner
    // to swallow the whole viewport
    const coverScale = (2.2 * Math.hypot(vw, vh)) / 140;

    const tl = gsap.timeline();
    tl.fromTo(
      badge,
      { x: state.x, y: state.y, scale: 0.2, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(1.6)" }
    ).to(badge, {
      x: vw - 90,
      y: 90,
      scale: coverScale,
      duration: 0.85,
      ease: "power3.in",
      onComplete: () => {
        router.push(state.href);
      },
    });
    return () => {
      tl.kill();
    };
  }, [phase, state, router]);

  // Phase 2: once the new route is mounted underneath, the colored sheet
  // clears with a circular wipe collapsing into the top-right corner.
  useEffect(() => {
    if (phase !== "cover" || !state) return;
    if (pathname !== state.href) return;
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true });
    setPhase("reveal");
  }, [pathname, phase, state]);

  useEffect(() => {
    if (phase !== "reveal" || !sheetRef.current) return;
    const sheet = sheetRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        setState(null);
        setPhase("idle");
      },
    });
    tl.fromTo(
      sheet,
      { clipPath: "circle(160% at calc(100% - 90px) 90px)" },
      {
        clipPath: "circle(0% at calc(100% - 90px) 90px)",
        duration: 0.9,
        ease: "power3.inOut",
        delay: 0.15,
      }
    );
    return () => {
      tl.kill();
    };
  }, [phase]);

  // Safety valve: never leave the screen covered.
  useEffect(() => {
    if (phase === "idle") return;
    const t = setTimeout(() => {
      setState(null);
      setPhase("idle");
    }, 5000);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      {state && (
        <div className="fixed inset-0 z-[90]" aria-hidden="true">
          {phase === "cover" ? (
            <div
              ref={badgeRef}
              className="absolute left-0 top-0 flex h-[140px] w-[140px] items-center justify-center rounded-full opacity-0"
              style={{
                backgroundColor: state.color,
                color: "#0b0f0e",
                marginLeft: -70,
                marginTop: -70,
              }}
            >
              <ViewCaseRing />
              <span className="absolute text-xl" aria-hidden="true">
                →
              </span>
            </div>
          ) : (
            <div
              ref={sheetRef}
              className="absolute inset-0"
              style={{ backgroundColor: state.color }}
            />
          )}
        </div>
      )}
    </TransitionContext.Provider>
  );
}
