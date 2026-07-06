"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface IntroContextValue {
  greetingActive: boolean;
  setGreetingActive: (v: boolean) => void;
}

// Defaults to true so FixedUI stays hidden on first paint, before the
// Loader's own effect has a chance to run and confirm whether the intro
// is actually playing (vs. already seen this session).
const IntroContext = createContext<IntroContextValue>({
  greetingActive: true,
  setGreetingActive: () => {},
});

export function useIntro() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [greetingActive, setGreetingActive] = useState(true);
  return (
    <IntroContext.Provider value={{ greetingActive, setGreetingActive }}>
      {children}
    </IntroContext.Provider>
  );
}
