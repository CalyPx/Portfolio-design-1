export type AccentName = "sage" | "amber" | "sky";

export const ACCENTS: Record<AccentName, string> = {
  sage: "#9dbe8d",
  amber: "#e8a33d",
  sky: "#7fb5d5",
};

export interface Project {
  slug: string;
  number: string;
  name: string;
  displayName: string;
  category: string;
  year: string;
  accent: AccentName;
  award?: string;
  tagline: string;
  problem: string;
  approach: string;
  built: string[];
  stack: string[];
  result: string;
  differently: string;
}

export const projects: Project[] = [
  {
    slug: "sunuwa",
    number: "01",
    name: "Sunuwa",
    displayName: "SUNUWA (सुनुवाइ)",
    category: "Civic Tech · AI Routing",
    year: "2026",
    accent: "sage",
    award: "Runner-up · CivicCode Hackathon 2026",
    tagline: "A civic complaint routing platform that gets citizen grievances to the right desk, not the nearest drawer.",
    problem:
      "Complaints to local government in Nepal die in transit. A citizen reports a broken water line at the ward office, the paper gets logged in a register, and whether it ever reaches the drinking-water division depends on who is at the desk that day. There is no routing logic, no deduplication, and no way for the citizen to know what happened next.",
    approach:
      "Treat complaint routing as a classification-plus-clustering problem. An LLM layer (Groq-hosted Llama for speed, Gemini for the harder multilingual cases) classifies each complaint against the actual departmental structure of the municipality, while an ML clustering pass groups near-duplicate reports so ten complaints about the same pothole become one ticket with ten reporters. Signal, not noise.",
    built: [
      "A citizen-facing portal in Nepali and English where a complaint can be filed in plain language, with photos, in under two minutes",
      "An LLM routing engine that maps free-text complaints to the correct municipal department with a confidence score and human-review fallback",
      "Duplicate clustering over complaint embeddings so repeated reports amplify priority instead of splitting attention",
      "An admin dashboard for ward officials with status tracking that citizens can see, closing the feedback loop",
    ],
    stack: ["Next.js", "FastAPI", "Supabase", "Groq · Llama", "Gemini", "ML Clustering"],
    result:
      "Runner-up at CivicCode Hackathon 2026. The judges' demo ran on real complaint categories from an actual ward's registry structure, and routing held up against deliberately messy, colloquial Nepali input. The clustering layer collapsed a seeded batch of duplicate complaints into single prioritized tickets exactly as designed.",
    differently:
      "I'd design the offline-first flow before the dashboard. Ward offices lose connectivity constantly, and the version we demoed quietly assumed a stable connection. The real product needs to queue and sync instead.",
  },
  {
    slug: "quakesafe",
    number: "02",
    name: "QuakeSafe Nepal",
    displayName: "QUAKESAFE",
    category: "ML · Risk Modeling",
    year: "2025",
    accent: "amber",
    tagline: "Earthquake damage prediction for Nepali buildings, using XGBoost trained on 260,000 real structures.",
    problem:
      "Nepal sits on one of the most active fault systems on Earth, and the 2015 Gorkha earthquake left behind structural survey data on hundreds of thousands of buildings that mostly just sits in archives. Municipalities planning retrofits have no practical tool to ask which buildings in their ward are most likely to fail.",
    approach:
      "Train a gradient-boosted model on the post-Gorkha structural survey dataset (260,000 buildings, with construction type, materials, age, geometry, and observed damage grade), then expose it as a fast API so a planner can score a building from a short questionnaire instead of a full engineering survey.",
    built: [
      "A feature pipeline over the 260k-building Gorkha damage dataset, handling the messy categorical encoding of real survey data",
      "An XGBoost damage-grade classifier reaching 74% accuracy across damage categories, with feature importance exposed so predictions are explainable",
      "A FastAPI service and simple assessment form that returns a risk grade and the top structural factors driving it",
    ],
    stack: ["XGBoost", "scikit-learn", "FastAPI", "Pandas"],
    result:
      "74% accuracy on held-out buildings across damage grades, which is strong for tabular structural data where even engineers disagree on borderline cases. The explainability layer mattered most in feedback: planners trusted a prediction that said why.",
    differently:
      "I'd calibrate the model's confidence, not just its accuracy. A planner acting on a 74%-accurate model needs to know which predictions are the shaky ones, and calibration curves should have shipped in v1.",
  },
  {
    slug: "harvo",
    number: "03",
    name: "Harvo",
    displayName: "HARVO",
    category: "Marketplace · Voice AI",
    year: "2025",
    accent: "sky",
    tagline: "A farmer-to-vendor marketplace with a Nepali voice interface and AI spoilage scoring.",
    problem:
      "Smallholder farmers in Nepal lose margin twice: to middlemen who set opaque prices, and to spoilage while produce waits for a buyer. The farmers most affected are often the least comfortable with text-heavy apps, so a form-based marketplace just solves the wrong problem.",
    approach:
      "Make voice the primary interface, in Nepali. A farmer just speaks a listing (crop, quantity, harvest date) and the app structures it. On the buyer side, an AI spoilage score estimated from crop type, harvest date, and storage conditions turns 'how fresh is this really?' into a number both sides can price against.",
    built: [
      "A Nepali voice UI for listing produce, so creating a listing is a 20-second conversation rather than a form",
      "An AI spoilage-scoring model that estimates remaining shelf life and flags listings that need urgent sale, nudging time-sensitive pricing",
      "A vendor-side marketplace with direct contact between farmer and buyer, with no intermediary pricing layer in between",
    ],
    stack: ["Next.js", "FastAPI", "Speech-to-Text (Nepali)", "PostgreSQL"],
    result:
      "A working marketplace where the full farmer journey (list by voice, get matched, agree on price) runs end to end in Nepali. The spoilage score changed buyer behavior in testing: urgent listings moved first, which is exactly the incentive the market needed.",
    differently:
      "I'd test the voice flow with actual farmers earlier. Our first prompt designs assumed standard Nepali; real users code-switch and use crop names that vary by district, and the vocabulary layer had to be rebuilt around that.",
  },
  {
    slug: "sajhadoctor",
    number: "04",
    name: "SajhaDoctor",
    displayName: "SAJHADOCTOR",
    category: "Telehealth · Access",
    year: "2025",
    accent: "sage",
    tagline: "A bilingual telehealth platform built for rural Nepal, where the nearest doctor is a bus ride away.",
    problem:
      "For much of rural Nepal, seeing a doctor means a day of travel and a day of lost wages, so treatable conditions often wait until they turn into emergencies. Telehealth platforms exist, but they assume English, fast connections, and health-system literacy that excludes the people who need them most.",
    approach:
      "Design for the constraint, not around it. Fully bilingual (Nepali first, English second), lightweight enough for weak connections, and structured so a first-time user who has never had a remote consultation can get from symptom to appointment without help.",
    built: [
      "A bilingual consultation flow (symptom intake, doctor matching, and appointment booking) with every screen written in plain-language Nepali first",
      "A low-bandwidth mode that degrades gracefully: text-first consultations when video won't hold, with async follow-up",
      "A doctor-side dashboard for managing rural consultations and prescribing with local pharmacy availability in mind",
    ],
    stack: ["Next.js", "FastAPI", "Supabase", "WebRTC"],
    result:
      "A complete consultation loop running in both languages. The design decision that mattered most was the humblest one: text-first fallback made the platform usable on connections where every video-first competitor simply fails.",
    differently:
      "I'd involve a practicing rural health worker from week one. The intake questions we wrote were medically reasonable but ordered wrong for how patients actually describe symptoms, and a nurse fixed the order in about ten minutes.",
  },
  {
    slug: "iot-residence",
    number: "05",
    name: "IoT-Based Residence",
    displayName: "SMART RESIDENCE",
    category: "IoT · Home Automation",
    year: "2024",
    accent: "amber",
    tagline: "A fully automated house: rainwater harvesting, solar tracking, fire alerts, and security, all run from one app.",
    problem:
      "Most IoT class projects automate one thing, like a single relay switching a single light. I wanted to see what it actually takes to automate a real house: water, power, safety, and security as one connected system instead of ten disconnected demos.",
    approach:
      "Wire every subsystem into its own sensor-and-actuator loop, then bring all of it under a single Blynk app instead of leaving each one as an isolated prototype. If a system couldn't be checked or triggered from the same dashboard as everything else, it didn't count as done.",
    built: [
      "Automated rainwater harvesting that collects and distributes based on sensor readings, not a manual valve",
      "Smart irrigation that waters on real soil-moisture conditions rather than a fixed timer",
      "A solar-tracking mount that follows the sun through the day to pull more output from the same panel",
      "LPG leak and fire detection that raises an alert before a small problem becomes a dangerous one",
      "An automatic gate and a rain-sensing system that pulls hanging clothes under cover on its own",
      "Laser-beam tripwire security and piezoelectric street lights that harvest energy from footsteps",
      "A Blynk app integration tying every subsystem above into one real-time control and monitoring dashboard",
    ],
    stack: ["Arduino / ESP32", "Blynk", "Sensors (rain, moisture, gas, LDR)", "Relays & Actuators", "Solar Tracking"],
    result:
      "A working prototype where the gate, the fire alarm, the irrigation, and everything else could all be triggered and watched from one phone screen, instead of a breadboard of separate demos that only ever worked one at a time.",
    differently:
      "I'd plan the wiring for serviceability before building it, not after. Debugging eight interlinked subsystems sharing a control board taught me more about cable management than any single line of code.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
