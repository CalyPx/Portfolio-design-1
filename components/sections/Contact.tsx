"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useSectionAccent } from "@/components/AccentContext";

const EMAIL = "rohitpoudel020@gmail.com";
const TOPICS = ["Hackathon", "Research / Academic", "Freelance"];
const CHANNELS = ["Email", "WhatsApp"];

function PillGroup({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <span
      role="radiogroup"
      aria-label={label}
      className="inline-flex flex-wrap items-center gap-3 align-middle"
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
            className={`transition-accent rounded-full border px-6 py-2.5 font-body text-base tracking-wide transition-all duration-300 md:text-lg ${
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

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const lettersRef = useRef<HTMLSpanElement>(null);
  useSectionAccent(ref, "sky");

  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [message, setMessage] = useState("");

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
    const subject = `${topic} — ${name || "hello"} via portfolio`;
    const body = [
      `Hey Rohit! My name is ${name || "…"} and I'm from ${from || "…"}.`,
      `Let's talk about ${topic}.`,
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
      className="relative flex min-h-screen flex-col px-4 pt-28 md:px-8"
    >
      <p className="transition-accent mb-14 text-[13px] font-medium uppercase tracking-[0.3em]">
        <span className="text-accent" aria-hidden="true">
          {"◇ "}
        </span>
        Contact
      </p>

      <div className="max-w-6xl space-y-10 font-display text-[clamp(1.8rem,4.2vw,3.8rem)] font-medium leading-[1.55]">
        <p>
          Hey Rohit! My name is{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="your name"
            aria-label="Your name"
            className="madlib-input w-[9ch]"
          />{" "}
          and I&rsquo;m from{" "}
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="somewhere"
            aria-label="Where you are from"
            className="madlib-input w-[10ch]"
          />
          .
        </p>
        <p className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <span>Let&rsquo;s talk about</span>
          <PillGroup
            options={TOPICS}
            value={topic}
            onChange={setTopic}
            label="Topic"
          />
          <span>.</span>
        </p>
        <p className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <span>
            Reach me at{" "}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@mail.com"
              aria-label="Your email or phone"
              className="madlib-input w-[13ch]"
            />{" "}
            via
          </span>
          <PillGroup
            options={CHANNELS}
            value={channel}
            onChange={setChannel}
            label="Preferred channel"
          />
          <span>.</span>
        </p>
        <p>
          In short,{" "}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="what's on your mind"
            aria-label="Your message, in short"
            className="madlib-input w-[min(26ch,60vw)]"
          />
          .
        </p>
      </div>

      <div className="flex flex-1 items-center">
        <button
          type="button"
          onClick={send}
          onMouseEnter={jitter}
          data-cursor="hover"
          className="group my-16 flex w-fit items-center gap-8 text-left font-display text-[clamp(3.2rem,10.5vw,9.5rem)] font-bold uppercase leading-none"
          aria-label="Send message by email"
        >
          <span ref={lettersRef} aria-hidden="true" className="flex">
            {sendLabel.split("").map((ch, i) => (
              <span key={i} className="inline-block will-change-transform">
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
          <span
            aria-hidden="true"
            className="transition-accent inline-block text-accent transition-transform duration-500 ease-out group-hover:translate-x-6 group-hover:-rotate-45"
          >
            →
          </span>
        </button>
      </div>

      <p className="text-base opacity-60 md:text-lg">
        or just email me at{" "}
        <a
          href={`mailto:${EMAIL}`}
          className="transition-accent underline decoration-accent underline-offset-4"
          data-cursor="hover"
        >
          {EMAIL}
        </a>
      </p>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-fg/15 py-8 text-xs uppercase tracking-[0.2em] opacity-50">
        <span>© 2026 Rohit Poudel</span>
        <span>Kathmandu · 27.7172° N, 85.3240° E</span>
        <span>Team VagaBond</span>
      </footer>
    </section>
  );
}
