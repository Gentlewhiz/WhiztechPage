import { allProjects } from '../data/projects'
import { ProjectSphere } from './ProjectSphere'

export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-bg px-5 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-28 md:-mt-14 md:rounded-t-[60px]"
    >
      <div className="mx-auto max-w-6xl">
      <ProjectSphere headingId="work-title">
        <h2
          id="work-title"
          className="text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
        >
          My projects
        </h2>
      </ProjectSphere>
      <p className="mx-auto mt-6 max-w-[40rem] text-center text-lg leading-relaxed text-muted">
        Every image is a real screenshot of something I built. Select a card to see what the
        project does, how it works, and the code behind it.
      </p>

      {/* Shown only when JavaScript is off, when the sphere cannot work. */}
      <ul className="projects-fallback mt-10 divide-y divide-line border-y border-line">
        {allProjects.map((project) => (
          <li key={project.id} className="py-6">
            <h3 className="text-lg font-medium">{project.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
              {project.summary ?? project.practised}
            </p>
            <p className="mt-2 flex gap-5 text-[0.9375rem]">
              <a href={project.live} className="link">
                Live<span className="sr-only"> site for {project.title}</span>
              </a>
              <a href={project.source} className="link">
                Code<span className="sr-only"> for {project.title}</span>
              </a>
            </p>
          </li>
        ))}
      </ul>
      </div>
    </section>
  )
}
