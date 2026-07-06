"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import Hero from "@/components/sections/Hero";
import Approach from "@/components/sections/Approach";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import HowIWork from "@/components/sections/HowIWork";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main>
      <Loader onDone={() => setStarted(true)} />
      <Hero started={started} />
      <Approach />
      <Services />
      <Works />
      <HowIWork />
      <Contact />
    </main>
  );
}
