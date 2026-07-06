"use client";

import { useIntro } from "@/components/IntroContext";
import Hero from "@/components/sections/Hero";
import Approach from "@/components/sections/Approach";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import HowIWork from "@/components/sections/HowIWork";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const { greetingActive } = useIntro();

  return (
    <main>
      <Hero started={!greetingActive} />
      <Approach />
      <Services />
      <Works />
      <HowIWork />
      <Contact />
    </main>
  );
}
