"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { useIntro } from "@/components/IntroContext";

const SECTIONS = [
  { hash: "#top", label: "Home" },
  { hash: "#about", label: "About" },
  { hash: "#approach", label: "Approach" },
  { hash: "#services", label: "What I Do" },
  { hash: "#works", label: "Projects" },
  { hash: "#contact", label: "Contact" },
];

/** Fixed vertical dot rail, right edge — tracks scroll position across the
    named sections and lets you jump straight to one. */
export default function SectionDots() {
  const { greetingActive } = useIntro();
  const pathname = usePathname();
  const [active, setActive] = useState(0);
  const onHome = pathname === "/";

  useEffect(() => {
    if (!onHome) return;
    const triggers = SECTIONS.map((s, i) => {
      const el = document.querySelector(s.hash);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, [onHome]);

  const goTo = (hash: string) => {
    const el = document.querySelector(hash);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  if (!onHome) return null;

  return (
    <nav
      aria-label="Section navigation"
      className={`fixed right-6 top-1/2 z-[80] hidden -translate-y-1/2 flex-col items-end gap-4 transition-opacity duration-300 md:right-9 lg:flex ${
        greetingActive ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {SECTIONS.map((s, i) => (
        <button
          key={s.hash}
          type="button"
          onClick={() => goTo(s.hash)}
          aria-label={`Jump to ${s.label}`}
          aria-current={active === i ? "true" : undefined}
          data-cursor="hover"
          className="group flex items-center gap-3"
        >
          <span
            className={`transition-accent text-[10px] font-medium uppercase tracking-[0.15em] opacity-0 transition-opacity duration-300 group-hover:opacity-70 ${
              active === i ? "text-accent-ink" : ""
            }`}
          >
            {s.label}
          </span>
          <span
            className={`transition-accent block rounded-full border border-fg/40 transition-all duration-300 ${
              active === i
                ? "h-2.5 w-2.5 border-accent bg-accent"
                : "h-1.5 w-1.5 bg-transparent group-hover:border-accent"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
