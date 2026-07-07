"use client";

import { useIntro } from "@/components/IntroContext";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Approach from "@/components/sections/Approach";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const { greetingActive } = useIntro();

  return (
    <main>
      <Hero started={!greetingActive} />
      <About />
      <Approach />
      <Services />
      <Works />
      <Contact />
    </main>
  );
}
