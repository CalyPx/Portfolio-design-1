"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scrollToTop } from "@/components/SmoothScroll";
import { useIntro } from "@/components/IntroContext";
import { useMagnetic } from "@/lib/useMagnetic";
import { useScramble } from "@/lib/useScramble";
import { attachSlideHover } from "@/lib/letterSlide";

const MENU_ITEMS = [
  { label: "Home", hash: "#top" },
  { label: "Approach", hash: "#approach" },
  { label: "Services", hash: "#services" },
  { label: "Selected Works", hash: "#works" },
  { label: "How I Work", hash: "#process" },
  { label: "Contact", hash: "#contact" },
];

function ScrambleMenuItem({
  item,
  index,
  onSelect,
}: {
  item: { label: string; hash: string };
  index: number;
  onSelect: (hash: string) => void;
}) {
  const { ref, onMouseEnter } = useScramble(item.label);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    return attachSlideHover(el, ".slide-letter", { minDist: 8, maxDist: 16 });
  }, []);

  return (
    <motion.button
      ref={btnRef}
      type="button"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.08 + index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(item.hash)}
      onMouseEnter={onMouseEnter}
      data-cursor="hover"
      className="group flex w-fit items-baseline gap-4 text-left font-display text-[clamp(2.2rem,6vw,4.5rem)] font-bold uppercase leading-[1.1]"
    >
      <span className="slide-letter transition-accent text-sm text-accent" aria-hidden="true">
        0{index + 1}
      </span>
      <span
        ref={ref}
        className="slide-letter transition-colors duration-300 group-hover:text-accent"
      >
        {item.label}
      </span>
    </motion.button>
  );
}

export default function FixedUI() {
  const { greetingActive } = useIntro();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useMagnetic<HTMLButtonElement>(0.35, 70);
  const logoRef = useMagnetic<HTMLAnchorElement>(0.3, 60);
  const topBtnRef = useMagnetic<HTMLButtonElement>(0.4, 60);
  const themeBtnRef = useMagnetic<HTMLButtonElement>(0.4, 60);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "dark") setTheme("dark");
  }, []);

  // The wordmark stays hidden on first load and only appears once the
  // Hero's pinned scroll animation flies R/P into it — except on mobile
  // and reduced-motion, where that pin never runs, so reveal immediately.
  useEffect(() => {
    const logo = document.getElementById("site-logo");
    if (!logo) return;
    const skipPin =
      !window.matchMedia("(min-width: 768px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    logo.style.opacity = skipPin ? "1" : "0";
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const goTo = (hash: string) => {
    setMenuOpen(false);
    const el = document.querySelector(hash);
    if (el) {
      if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { duration: 1.2 });
      else el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/${hash}`;
    }
  };

  return (
    <>
      {/* Soft scrim behind the fixed top bar so scrolling page content —
          section labels, headlines — never visually collides with the
          MENU button or wordmark sitting on top of it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[75] h-28 bg-gradient-to-b from-bg/90 via-bg/40 to-transparent md:h-32"
      />

      {/* MENU — top left. Hidden while the intro's greeting words are
          still cycling, so nothing but the greeting itself is on screen. */}
      <button
        ref={menuBtnRef}
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        data-cursor="hover"
        className={`fixed left-5 top-6 z-[80] flex items-center gap-4 transition-opacity duration-300 md:left-9 md:top-8 ${
          greetingActive ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <span className="flex flex-col gap-[6px]" aria-hidden="true">
          <span className="block h-[3px] w-9 bg-fg md:w-10" />
          <span className="block h-[3px] w-9 bg-fg md:w-10" />
        </span>
        <span className="text-base font-bold uppercase tracking-[0.15em] md:text-lg">
          Menu
        </span>
      </button>

      {/* Wordmark — top right */}
      <Link
        ref={logoRef}
        href="/"
        id="site-logo"
        aria-label="Rohit Poudel — home"
        className="fixed right-6 top-5 z-[80] font-display text-4xl font-bold leading-none md:right-10 md:top-7"
        data-cursor="hover"
      >
        <span id="logo-r" className="inline-block">
          R
        </span>
        <span id="logo-p" className="transition-accent inline-block text-accent">
          P
        </span>
      </Link>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[85] flex flex-col justify-center bg-bg px-6 md:px-12"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              data-cursor="hover"
              className="absolute left-5 top-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] md:left-9 md:top-8"
            >
              <span className="relative block h-5 w-7" aria-hidden="true">
                <span className="absolute left-0 top-1/2 block h-[2px] w-7 rotate-45 bg-fg" />
                <span className="absolute left-0 top-1/2 block h-[2px] w-7 -rotate-45 bg-fg" />
              </span>
              Close
            </button>

            <nav className="flex flex-col gap-2">
              {MENU_ITEMS.map((item, i) => (
                <ScrambleMenuItem
                  key={item.hash}
                  item={item}
                  index={i}
                  onSelect={goTo}
                />
              ))}
            </nav>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-sm uppercase tracking-[0.2em] opacity-60"
            >
              rohitpoudel020@gmail.com · Kathmandu, Nepal
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme toggle + scroll-to-top — bottom right. Same intro gating
          as the MENU button above. */}
      <div
        className={`fixed bottom-6 right-6 z-[80] flex flex-col items-center gap-3 transition-opacity duration-300 md:bottom-8 md:right-10 ${
          greetingActive ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <button
          ref={topBtnRef}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          data-cursor="hover"
          className={`transition-accent flex h-11 w-11 items-center justify-center rounded-full border border-fg/25 bg-bg/60 backdrop-blur transition-all duration-500 hover:border-accent ${
            showTop
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 12V2M7 2L2.5 6.5M7 2l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          ref={themeBtnRef}
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          data-cursor="hover"
          className="transition-accent flex h-11 w-11 items-center justify-center rounded-full border border-fg/25 bg-bg/60 backdrop-blur hover:border-accent"
        >
          {theme === "light" ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12.5 8.9A5.6 5.6 0 0 1 6.1 2.5a5.6 5.6 0 1 0 6.4 6.4Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="7.5"
                cy="7.5"
                r="3"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M7.5 0.8v1.8M7.5 12.4v1.8M0.8 7.5h1.8M12.4 7.5h1.8M2.8 2.8l1.3 1.3M10.9 10.9l1.3 1.3M12.2 2.8l-1.3 1.3M4.1 10.9l-1.3 1.3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
