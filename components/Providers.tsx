"use client";

import type { ReactNode } from "react";
import { AccentProvider } from "@/components/AccentContext";
import { CaseTransitionProvider } from "@/components/CaseTransition";
import { IntroProvider } from "@/components/IntroContext";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import FixedUI from "@/components/FixedUI";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <IntroProvider>
      <AccentProvider>
        <CaseTransitionProvider>
          <SmoothScroll />
          <Cursor />
          <FixedUI />
          {children}
        </CaseTransitionProvider>
      </AccentProvider>
    </IntroProvider>
  );
}
