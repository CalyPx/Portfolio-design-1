import { ACCENTS, type Project } from "@/lib/projects";

/** Abstract product mock — a stylized browser frame in accent tints */
export default function ProjectMock({ project }: { project: Project }) {
  const accent = ACCENTS[project.accent];
  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-fg/20 bg-bg shadow-2xl">
      <div className="flex items-center gap-2 border-b border-fg/15 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-fg/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-fg/25" />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
        <span className="ml-4 rounded-full bg-fg/10 px-4 py-1 text-[10px] tracking-widest opacity-70">
          {project.slug}.app
        </span>
      </div>
      <div className="grid grid-cols-[70px_1fr] gap-4 p-5 md:grid-cols-[110px_1fr] md:p-7">
        <div className="space-y-3">
          <div className="h-7 w-7 rounded-full" style={{ backgroundColor: accent }} />
          {[0.5, 0.35, 0.45, 0.3].map((o, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-fg"
              style={{ opacity: o * 0.4, width: `${60 + i * 10}%` }}
            />
          ))}
        </div>
        <div className="space-y-4">
          <div
            className="h-8 w-2/3 rounded-md"
            style={{ backgroundColor: accent, opacity: 0.85 }}
          />
          <div className="h-2.5 w-full rounded-full bg-fg/15" />
          <div className="h-2.5 w-5/6 rounded-full bg-fg/15" />
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[0.25, 0.5, 0.35].map((o, i) => (
              <div
                key={i}
                className="h-20 rounded-lg md:h-28"
                style={{ backgroundColor: accent, opacity: o }}
              />
            ))}
          </div>
          <div className="h-2.5 w-4/6 rounded-full bg-fg/15" />
        </div>
      </div>
    </div>
  );
}
