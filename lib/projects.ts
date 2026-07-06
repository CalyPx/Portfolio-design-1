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
    displayName: "SUNUWA — सुनुवाइ",
    category: "Civic Tech · AI Routing",
    year: "2026",
    accent: "sage",
    award: "Runner-up · CivicCode Hackathon 2026",
    tagline: "A civic complaint routing platform that gets citizen grievances to the right desk, not the nearest drawer.",
    problem:
      "Complaints to local government in Nepal die in transit. A citizen reports a broken water line at the ward office, the paper gets logged in a register, and whether it ever reaches the drinking-water division depends on who is at the desk that day. There is no routing logic, no deduplication, and no way for the citizen to know what happened next.",
    approach:
      "Treat complaint routing as a classification-plus-clustering problem. An LLM layer (Groq-hosted Llama for speed, Gemini for the harder multilingual cases) classifies each complaint against the actual departmental structure of the municipality, while an ML clustering pass groups near-duplicate reports so ten complaints about the same pothole become one ticket with ten reporters — signal, not noise.",
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
      "I'd design the offline-first flow before the dashboard. Ward offices lose connectivity constantly, and the version we demoed quietly assumed a stable connection — the real product has to queue and sync.",
  },
  {
    slug: "bacha",
    number: "02",
    name: "Bāchā",
    displayName: "BĀCHĀ",
    category: "Gov-Tech · Vision AI",
    year: "2026",
    accent: "amber",
    award: "Codefest · Bagmati Province 2026",
    tagline: "A Citizen Charter compliance checker that turns a government's own promises into enforceable claims.",
    problem:
      "Every government office in Nepal publishes a Citizen Charter — a legal promise of which service is delivered in how many days for what fee. Almost nobody reads them, and when an office blows past its own deadline, citizens don't know they are legally entitled to compensation, let alone how to claim it.",
    approach:
      "Use vision AI to make the charter itself machine-readable. Photograph the charter on the office wall, let Gemini Vision extract the service matrix — service, timeline, fee, responsible officer — and then track a citizen's actual service request against the promise. When the office is out of compliance, generate the compensation claim document automatically.",
    built: [
      "A Gemini Vision pipeline that parses photographed Citizen Charters, including mixed Nepali/English layouts and low-quality wall photos",
      "A service tracker where a citizen logs their request date and the app computes the legal deadline from the parsed charter",
      "An automatic claim generator that produces a correctly formatted compensation application citing the charter clause that was violated",
    ],
    stack: ["Gemini Vision", "Next.js", "FastAPI"],
    result:
      "Built and demoed at Codefest, Bagmati Province, 2026. The vision pipeline parsed real charters photographed at provincial offices — skewed angles, glare and all — and produced claim documents that a legal reviewer at the event confirmed were correctly structured.",
    differently:
      "I'd spend a day with an administrative-law practitioner before writing the claim templates instead of after. We reverse-engineered the format from samples, and validating it earlier would have saved a rebuild of the generator.",
  },
  {
    slug: "quakesafe",
    number: "03",
    name: "QuakeSafe Nepal",
    displayName: "QUAKESAFE",
    category: "ML · Risk Modeling",
    year: "2025",
    accent: "sky",
    tagline: "Earthquake damage prediction for Nepali buildings — XGBoost trained on 260,000 real structures.",
    problem:
      "Nepal sits on one of the most active fault systems on Earth, and the 2015 Gorkha earthquake damage data — structural surveys of hundreds of thousands of buildings — mostly sits in archives. Municipalities planning retrofits have no practical tool to ask: which buildings in my ward are most likely to fail?",
    approach:
      "Train a gradient-boosted model on the post-Gorkha structural survey dataset — 260,000 buildings with construction type, materials, age, geometry, and observed damage grade — and expose it as a fast API so a planner can score a building from a short questionnaire instead of a full engineering survey.",
    built: [
      "A feature pipeline over the 260k-building Gorkha damage dataset, handling the messy categorical encoding of real survey data",
      "An XGBoost damage-grade classifier reaching 74% accuracy across damage categories, with feature importance exposed so predictions are explainable",
      "A FastAPI service and simple assessment form that returns a risk grade and the top structural factors driving it",
    ],
    stack: ["XGBoost", "scikit-learn", "FastAPI", "Pandas"],
    result:
      "74% accuracy on held-out buildings across damage grades — strong for tabular structural data where even engineers disagree on borderline cases. The explainability layer mattered most in feedback: planners trusted a prediction that said why.",
    differently:
      "I'd calibrate the model's confidence, not just its accuracy. A planner acting on a 74%-accurate model needs to know which predictions are the shaky ones, and calibration curves should have shipped in v1.",
  },
  {
    slug: "harvo",
    number: "04",
    name: "Harvo",
    displayName: "HARVO",
    category: "Marketplace · Voice AI",
    year: "2025",
    accent: "sage",
    tagline: "A farmer-to-vendor marketplace with a Nepali voice interface and AI spoilage scoring.",
    problem:
      "Smallholder farmers in Nepal lose margin twice: to middlemen who set opaque prices, and to spoilage while produce waits for a buyer. The farmers most affected are often the least comfortable with text-heavy apps — a form-based marketplace solves the wrong problem.",
    approach:
      "Make voice the primary interface, in Nepali. A farmer speaks a listing — crop, quantity, harvest date — and the app structures it. On the buyer side, an AI spoilage score estimated from crop type, harvest date, and storage conditions turns 'how fresh is this really?' into a number both sides can price against.",
    built: [
      "A Nepali voice UI for listing produce, so creating a listing is a 20-second conversation rather than a form",
      "An AI spoilage-scoring model that estimates remaining shelf life and flags listings that need urgent sale, nudging time-sensitive pricing",
      "A vendor-side marketplace with direct contact between farmer and buyer — no intermediary pricing layer",
    ],
    stack: ["Next.js", "FastAPI", "Speech-to-Text (Nepali)", "PostgreSQL"],
    result:
      "A working marketplace where the full farmer journey — list by voice, get matched, agree on price — runs end to end in Nepali. The spoilage score changed buyer behavior in testing: urgent listings moved first, which is exactly the incentive the market needed.",
    differently:
      "I'd test the voice flow with actual farmers earlier. Our first prompt designs assumed standard Nepali; real users code-switch and use crop names that vary by district, and the vocabulary layer had to be rebuilt around that.",
  },
  {
    slug: "sajhadoctor",
    number: "05",
    name: "SajhaDoctor",
    displayName: "SAJHADOCTOR",
    category: "Telehealth · Access",
    year: "2025",
    accent: "amber",
    tagline: "A bilingual telehealth platform built for rural Nepal, where the nearest doctor is a bus ride away.",
    problem:
      "For much of rural Nepal, seeing a doctor means a day of travel and a day of lost wages — so treatable conditions wait until they are emergencies. Telehealth platforms exist, but they assume English, fast connections, and health-system literacy that excludes the people who need them most.",
    approach:
      "Design for the constraint, not around it. Fully bilingual (Nepali first, English second), lightweight enough for weak connections, and structured so a first-time user who has never had a remote consultation can get from symptom to appointment without help.",
    built: [
      "A bilingual consultation flow — symptom intake, doctor matching, and appointment booking — with every screen written in plain-language Nepali first",
      "A low-bandwidth mode that degrades gracefully: text-first consultations when video won't hold, with async follow-up",
      "A doctor-side dashboard for managing rural consultations and prescribing with local pharmacy availability in mind",
    ],
    stack: ["Next.js", "FastAPI", "Supabase", "WebRTC"],
    result:
      "A complete consultation loop running in both languages. The design decision that mattered most was the humblest one: text-first fallback made the platform usable on connections where every video-first competitor simply fails.",
    differently:
      "I'd involve a practicing rural health worker from week one. The intake questions we wrote were medically reasonable but ordered wrong for how patients actually describe symptoms — a nurse reordered them in ten minutes.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
