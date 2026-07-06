"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useSectionAccent } from "@/components/AccentContext";
import { useMagnetic } from "@/lib/useMagnetic";

const EMAIL = "rohitpoudel020@gmail.com";
const TOPICS = ["Hackathon", "Research / Academic", "Freelance"];
const CHANNELS = ["Email", "WhatsApp"];

const BLOB_COLORS = [
  "var(--accent-sage)",
  "var(--accent-amber)",
  "var(--accent-sky)",
  "var(--accent)",
];

function PillGroup({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <span
      role="radiogroup"
      aria-label={label}
      className="inline-flex flex-wrap items-center gap-2.5 align-middle"
    >
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt)}
            data-cursor="hover"
            className={`transition-accent whitespace-nowrap rounded-full border px-5 py-2 font-body text-base tracking-wide transition-all duration-300 md:text-lg ${
              selected
                ? "border-transparent bg-accent text-dark"
                : "border-fg/30 hover:border-accent"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </span>
  );
}

/** Small colored blobs that pop in over the button letters on hover — an
    ink-blot flourish, distinct per hover since positions randomize each time. */
function useSendBlobs(hostRef: React.RefObject<HTMLElement | null>) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    if (prefersReducedMotion()) return;
    const wrap = wrapRef.current;
    const host = hostRef.current;
    if (!wrap || !host) return;
    const w = host.offsetWidth;
    const h = host.offsetHeight;
    const dots = Array.from(wrap.children) as HTMLElement[];
    dots.forEach((dot, i) => {
      const left = gsap.utils.random(0.05, 0.85) * w;
      const top = gsap.utils.random(0.1, 0.75) * h;
      gsap.killTweensOf(dot);
      gsap.set(dot, { left, top });
      gsap.fromTo(
        dot,
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 0.85,
          duration: 0.35,
          delay: i * 0.05,
          ease: "back.out(2)",
        }
      );
      gsap.to(dot, {
        y: -10,
        duration: 1.1,
        delay: i * 0.05,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  };

  const onLeave = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const dots = Array.from(wrap.children) as HTMLElement[];
    dots.forEach((dot) => {
      gsap.killTweensOf(dot);
      gsap.to(dot, { scale: 0, autoAlpha: 0, duration: 0.25, ease: "power2.in" });
    });
  };

  return {
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    node: (
      <div
        ref={wrapRef}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        {BLOB_COLORS.map((color, i) => (
          <span
            key={i}
            className="absolute rounded-full opacity-0"
            style={{
              width: 16 + i * 6,
              height: 16 + i * 6,
              backgroundColor: color,
              filter: "blur(1px)",
              mixBlendMode: "multiply",
            }}
          />
        ))}
      </div>
    ),
  };
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const lettersRef = useRef<HTMLSpanElement>(null);
  const sendBtnRef = useMagnetic<HTMLButtonElement>(0.25, 140);
  useSectionAccent(ref, "sky");

  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [message, setMessage] = useState("");

  const blobs = useSendBlobs(sendBtnRef);

  const jitter = () => {
    if (prefersReducedMotion() || !lettersRef.current) return;
    const letters = lettersRef.current.querySelectorAll("span");
    gsap.to(letters, {
      y: () => gsap.utils.random(-12, 12),
      x: () => gsap.utils.random(-4, 4),
      duration: 0.16,
      stagger: 0.014,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(letters, {
          y: 0,
          x: 0,
          duration: 0.45,
          stagger: 0.012,
          ease: "elastic.out(1, 0.4)",
        });
      },
    });
  };

  const send = () => {
    const subject = `${topic || "hello"} — ${name || "hello"} via portfolio`;
    const body = [
      `Hey Rohit! My name is ${name || "…"} and I'm from ${from || "…"}.`,
      `Let's talk about ${topic || "…"}.`,
      `Reach me at ${email || "…"} via ${channel}.`,
      `In short, ${message || "…"}`,
    ].join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const sendLabel = "Send message";

  return (
    <section
      ref={ref}
      id="contact"
      className="relative flex min-h-screen flex-col justify-between px-4 pb-10 pt-28 md:px-8"
    >
      <p className="transition-accent text-[13px] font-medium uppercase tracking-[0.3em]">
        <span className="text-accent" aria-hidden="true">
          {"◇ "}
        </span>
        Contact
      </p>

      <div className="max-w-6xl space-y-8 font-body text-[clamp(2.5rem,3.1vw,3.5rem)] font-normal leading-[1.4]">
        <p className="flex flex-wrap items-center gap-x-2 md:flex-nowrap md:whitespace-nowrap">
          <span>Hey Rohit! My name is</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="your name"
            aria-label="Your name"
            className="madlib-input w-[9ch]"
          />
          <span>and I&rsquo;m from</span>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="somewhere"
            aria-label="Where you are from"
            className="madlib-input w-[10ch]"
          />
          <span>.</span>
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span>Let&rsquo;s talk about</span>
          <PillGroup
            options={TOPICS}
            value={topic}
            onChange={setTopic}
            label="Topic"
          />
          <span>.</span>
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="flex flex-wrap items-center gap-x-2">
            <span>Reach me at</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@mail.com"
              aria-label="Your email or phone"
              className="madlib-input w-[13ch]"
            />
            <span>via</span>
          </span>
          <PillGroup
            options={CHANNELS}
            value={channel}
            onChange={setChannel}
            label="Preferred channel"
          />
          <span>.</span>
        </p>
        <p className="flex flex-wrap items-center gap-x-2">
          <span>In short,</span>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="what's on your mind"
            aria-label="Your message, in short"
            className="madlib-input w-[min(26ch,60vw)]"
          />
          <span>.</span>
        </p>
      </div>

      <button
        ref={sendBtnRef}
        type="button"
        onClick={send}
        onMouseEnter={() => {
          jitter();
          blobs.onMouseEnter();
        }}
        onMouseLeave={blobs.onMouseLeave}
        data-cursor="hover"
        className="group relative flex w-fit items-center gap-6 text-left font-body text-[clamp(2.6rem,7.5vw,5.5rem)] font-normal leading-none"
        aria-label="Send message by email"
      >
        {blobs.node}
        <span ref={lettersRef} aria-hidden="true" className="relative z-10 flex">
          {sendLabel.split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block will-change-transform"
              style={ch === " " ? { whiteSpace: "pre" } : undefined}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </span>
        <span
          aria-hidden="true"
          className="transition-accent relative z-10 inline-block text-accent transition-transform duration-500 ease-out group-hover:translate-x-3 group-hover:-translate-y-3"
        >
          ↗
        </span>
      </button>

      <p className="text-center text-base opacity-60 md:text-lg">
        or just email me at{" "}
        <a
          href={`mailto:${EMAIL}`}
          className="transition-accent underline decoration-accent underline-offset-4"
          data-cursor="hover"
        >
          {EMAIL}
        </a>
      </p>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-fg/15 py-5 text-xs uppercase tracking-[0.2em] opacity-50">
        <span>© 2026 Rohit Poudel</span>
        <span>Kathmandu · 27.7172° N, 85.3240° E</span>
        <span>Team VagaBond</span>
      </footer>
    </section>
  );
}
