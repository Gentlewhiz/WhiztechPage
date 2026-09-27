import { useRef } from 'react'
import { allProjects } from '../data/projects'
import { growingInto, skillGroups } from '../data/skills'
import { useReveal } from '../hooks/useReveal'

const titleFor = (id) => allProjects.find((project) => project.id === id)?.title ?? id

function Evidence({ skill }) {
  const projects = skill.projects ?? []
  if (skill.link) {
    return (
      <a href={skill.link.href} className="link mt-3 inline-block" target="_blank" rel="noreferrer">
        See my {skill.link.label}
      </a>
    )
  }
  if (!projects.length) return skill.more ? <span className="mt-3 block">{skill.more}.</span> : null
  return (
    <span className="mt-3 block">
      Seen in{' '}
      {projects.map((id, index) => (
        <span key={id}>
          {index > 0 && (index === projects.length - 1 && !skill.more ? ' and ' : ', ')}
          <a href={`#project-${id}`} className="link">
            {titleFor(id)}
          </a>
        </span>
      ))}
      {skill.more && ` ${skill.more}`}.
    </span>
  )
}

/* A light panel on the dark page (and a dark one in light mode): .panel-invert swaps
   the colour tokens, so every utility inside keeps its tested contrast. */
export function Skills() {
  const scope = useRef(null)
  useReveal(scope)
  const skills = skillGroups.flatMap((group) => group.skills.map((skill) => ({ ...skill, group: group.title })))

  return (
    <section
      id="skills"
      ref={scope}
      aria-labelledby="skills-title"
      className="panel-invert relative rounded-t-[40px] px-5 pb-32 pt-20 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <h2
        id="skills-title"
        data-reveal
        className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-[-0.045em] text-text sm:mb-20 md:mb-28"
      >
        Skills
      </h2>

      <dl className="mx-auto max-w-5xl">
        {skills.map((skill, i) => (
          <div
            key={skill.name}
            data-reveal
            data-delay={String((i % 4) * 0.08)}
            className="grid gap-x-10 gap-y-3 border-t border-line py-8 first:border-t-0 sm:py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:py-12"
          >
            <dt>
              <span className="block text-[clamp(2rem,5.4vw,4.75rem)] font-black uppercase leading-[0.95] tracking-[-0.04em]">
                {skill.name}
              </span>
              <span className="mt-2 block text-sm font-medium uppercase tracking-widest text-muted">
                {skill.primary ? 'Main focus' : skill.group}
              </span>
            </dt>
            <dd className="self-end text-[clamp(0.9rem,1.5vw,1.15rem)] font-light leading-relaxed text-muted">
              {skill.detail}
              <Evidence skill={skill} />
            </dd>
          </div>
        ))}
      </dl>

      <div data-reveal className="mx-auto mt-16 max-w-5xl border-t border-line pt-10">
        <h3 className="text-sm font-medium uppercase tracking-widest text-muted">
          Growing into, not yet claimed as expertise
        </h3>
        <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {growingInto.map((item) => (
            <li key={item.name}>
              <span className="text-lg font-semibold tracking-[-0.015em]">{item.name}</span>
              <span className="mt-1 block text-[0.9375rem] leading-relaxed text-muted">
                {item.detail}{' '}
                {item.onThisSite && (
                  <a href="#this-site" className="link">
                    Applied on this site
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
