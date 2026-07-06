"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { ACCENTS, type AccentName } from "@/lib/projects";
import { ScrollTrigger } from "@/lib/gsap";

interface AccentContextValue {
  accent: AccentName;
  setAccent: (name: AccentName) => void;
}

const AccentContext = createContext<AccentContextValue>({
  accent: "sage",
  setAccent: () => {},
});

export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccentState] = useState<AccentName>("sage");

  const setAccent = useCallback((name: AccentName) => {
    setAccentState(name);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", ACCENTS[accent]);
  }, [accent]);

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent() {
  return useContext(AccentContext);
}

/**
 * Registers a ScrollTrigger that flips the global accent while the
 * given section occupies the middle of the viewport.
 */
export function useSectionAccent(
  ref: RefObject<HTMLElement | null>,
  name: AccentName
) {
  const { setAccent } = useAccent();
  const nameRef = useRef(name);
  nameRef.current = name;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 55%",
      end: "bottom 45%",
      onToggle: (self) => {
        if (self.isActive) setAccent(nameRef.current);
      },
    });
    return () => st.kill();
  }, [ref, setAccent]);
}
