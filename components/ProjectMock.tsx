import Image from "next/image";
import { ACCENTS, type Project } from "@/lib/projects";

/** Browser-chrome frame around a real product screenshot. Renders a second,
    dark-mode shot instead of a themed re-tint if the project has one. */
export default function ProjectMock({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
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
      <div className="relative aspect-[16/10] w-full bg-fg/5">
        <Image
          src={project.image}
          alt={`${project.name} product screenshot`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 768px"
          className={`object-cover object-top ${
            project.imageDark ? "theme-light-shot" : ""
          }`}
        />
        {project.imageDark && (
          <Image
            src={project.imageDark}
            alt={`${project.name} product screenshot, dark mode`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="theme-dark-shot object-cover object-top"
          />
        )}
      </div>
    </div>
  );
}
