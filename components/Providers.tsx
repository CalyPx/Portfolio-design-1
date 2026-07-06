"use client";

import type { ReactNode } from "react";
import { AccentProvider } from "@/components/AccentContext";
import { CaseTransitionProvider } from "@/components/CaseTransition";
import { IntroProvider } from "@/components/IntroContext";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import FixedUI from "@/components/FixedUI";
import SectionDots from "@/components/SectionDots";
import Loader from "@/components/Loader";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <IntroProvider>
      <AccentProvider>
        <CaseTransitionProvider>
          <SmoothScroll />
          <Cursor />
          <FixedUI />
          <SectionDots />
          <Loader />
          {children}
        </CaseTransitionProvider>
      </AccentProvider>
    </IntroProvider>
  );
}
