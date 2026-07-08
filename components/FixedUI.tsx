"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scrollToTop } from "@/components/SmoothScroll";
import { useIntro } from "@/components/IntroContext";
import { useMagnetic } from "@/lib/useMagnetic";

const GITHUB_URL = "https://github.com/calypx";
const LINKEDIN_URL = "https://www.linkedin.com/in/rohit-poudel-633364310/";

const MENU_ITEMS = [
  { label: "Home", hash: "#top", subtitle: "Back to the top" },
  { label: "About", hash: "#about", subtitle: "Who I am & education" },
  {
    label: "What I Do",
    hash: "#services",
    subtitle: "Interfaces, systems, intelligence",
  },
  {
    label: "Projects",
    hash: "#works",
    subtitle: "Case studies & shipped projects",
  },
  { label: "Contact", hash: "#contact", subtitle: "Say hello" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function MenuItem({
  item,
  index,
  onSelect,
}: {
  item: { label: string; hash: string; subtitle: string };
  index: number;
  onSelect: (hash: string) => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ y: 56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.22 + index * 0.06, duration: 0.6, ease: EASE }}
      onClick={() => onSelect(item.hash)}
      data-cursor="hover"
      className="group flex w-fit flex-col text-left"
    >
      <span className="flex items-baseline gap-5 font-display text-[clamp(3.8rem,8.7vw,6.9rem)] font-black uppercase leading-[1.05] tracking-tight [-webkit-text-stroke:1px_currentColor]">
        <span
          className="text-sm font-bold text-dark/40 transition-colors duration-300 group-hover:text-dark"
          aria-hidden="true"
        >
          0{index + 1}
        </span>
        <span className="relative inline-block">
          <span className="relative inline-block">
            {item.label}
          </span>
          {/* white wipe reveal: a duplicate copy grows in from the top
              edge downward on hover, like a mask retracting */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 inline-block overflow-hidden text-light [clip-path:inset(0_0_100%_0)] transition-[clip-path] duration-500 ease-out group-hover:[clip-path:inset(0_0_0_0)]"
          >
            {item.label}
          </span>
        </span>
      </span>

      {/* subtitle reveals on hover via the CSS grid-rows 0fr->1fr trick,
          so it animates open/closed height smoothly with no JS needed */}
      <span className="grid grid-rows-[0fr] pl-[3.2em] transition-[grid-template-rows] duration-[400ms] ease-out group-hover:grid-rows-[1fr]">
        <span className="overflow-hidden">
          <span className="block pt-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-dark/60 md:text-sm">
            {item.subtitle}
          </span>
        </span>
      </span>
    </motion.button>
  );
}

export default function FixedUI() {
  const { greetingActive } = useIntro();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
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

  // While the menu dialog is open: lock scrolling, close on Escape, and move
  // focus into the dialog (returning it to the MENU button on close).
  useEffect(() => {
    if (!menuOpen) return;
    const menuBtn = menuBtnRef.current;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    const closeBtn = document.querySelector<HTMLButtonElement>(
      "[data-menu-close]"
    );
    closeBtn?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
      menuBtn?.focus();
    };
  }, [menuOpen, menuBtnRef]);

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
    // Deferred: the menu-open effect's cleanup must restart Lenis first,
    // or scrollTo lands on a stopped instance and does nothing.
    requestAnimationFrame(() => {
      const el = document.querySelector(hash);
      if (el) {
        if (window.__lenis)
          window.__lenis.scrollTo(el as HTMLElement, { duration: 1.2 });
        else el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = `/${hash}`;
      }
    });
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
        onClick={(e) => {
          setOrigin({ x: e.clientX, y: e.clientY });
          setMenuOpen(true);
        }}
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
        aria-label="Rohit Poudel, home"
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

      {/* Full-screen menu overlay — reveals via a clip-path circle expanding
          from wherever the MENU button was clicked, rather than a plain
          fade, for a "grows out of the click" feel. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              clipPath: `circle(0% at ${origin.x}px ${origin.y}px)`,
            }}
            animate={{
              clipPath: `circle(150% at ${origin.x}px ${origin.y}px)`,
            }}
            exit={{
              clipPath: `circle(0% at ${origin.x}px ${origin.y}px)`,
            }}
            transition={{ duration: 0.85, ease: EASE }}
            className="transition-accent fixed inset-0 z-[85] flex flex-col justify-between overflow-y-auto px-6 py-16 text-dark md:px-14 md:py-20"
            style={{ backgroundColor: "var(--accent)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              data-menu-close
              data-cursor="hover"
              className="group absolute left-5 top-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] md:left-9 md:top-8"
            >
              <span
                className="relative block h-5 w-7 transition-transform duration-500 ease-out group-hover:rotate-90"
                aria-hidden="true"
              >
                <span className="absolute left-0 top-1/2 block h-[2px] w-7 rotate-45 bg-dark" />
                <span className="absolute left-0 top-1/2 block h-[2px] w-7 -rotate-45 bg-dark" />
              </span>
              <span className="relative">
                Close
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-dark transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </span>
            </button>

            <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-10 py-8 md:grid-cols-[1fr_auto]">
              <nav className="flex flex-col gap-1 md:gap-2">
                {MENU_ITEMS.map((item, i) => (
                  <MenuItem
                    key={item.hash}
                    item={item}
                    index={i}
                    onSelect={goTo}
                  />
                ))}
              </nav>

              {/* right rail — quiet info panel, echoing the eyebrow-label
                  language used across the rest of the site */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
                className="hidden flex-col gap-10 text-right md:flex"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dark/60">
                    Get in touch
                  </p>
                  <a
                    href="mailto:rohitpoudel020@gmail.com"
                    data-cursor="hover"
                    className="group relative mt-3 inline-block font-display text-lg font-bold uppercase tracking-wide"
                  >
                    rohitpoudel020@gmail.com
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-100 bg-dark transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-0"
                    />
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dark/60">
                    Location
                  </p>
                  <p className="mt-3 font-display text-lg font-bold uppercase tracking-wide">
                    Kathmandu, Nepal
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dark/60">
                    Resume
                  </p>
                  <a
                    href="/Rohit_Poudel_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="group relative mt-3 inline-block font-display text-lg font-bold uppercase tracking-wide"
                  >
                    Download CV
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-100 bg-dark transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-0"
                    />
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dark/60">
                    Elsewhere
                  </p>
                  <div className="mt-3 flex flex-col items-end gap-1.5">
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="group relative inline-block w-fit font-display text-lg font-bold uppercase tracking-wide"
                    >
                      GitHub
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-100 bg-dark transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-0"
                      />
                    </a>
                    <a
                      href={LINKEDIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="group relative inline-block w-fit font-display text-lg font-bold uppercase tracking-wide"
                    >
                      LinkedIn
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-100 bg-dark transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-0"
                      />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex shrink-0 items-center justify-between pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dark/60 md:hidden">
                rohitpoudel020@gmail.com · Kathmandu, Nepal
              </p>
              <span />
              {/* circular back button — a second way out of the menu,
                  distinct from "Close": rotates the arrow and fills solid
                  on hover for a satisfying, tactile click target */}
              <motion.button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Back to site"
                data-cursor="hover"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
                className="group hidden h-16 w-16 items-center justify-center rounded-full border-2 border-dark transition-colors duration-300 hover:bg-dark md:flex"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-[400ms] ease-out group-hover:rotate-45"
                >
                  <path
                    d="M4 10h12M10 4l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-dark transition-colors duration-300 group-hover:text-[var(--accent)]"
                  />
                </svg>
              </motion.button>
            </div>
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
