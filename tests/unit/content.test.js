import { describe, expect, it } from 'vitest'
import { archiveProjects, featuredProjects } from '../../src/data/projects'
import { skillGroups } from '../../src/data/skills'

const isHttps = (url) => new URL(url).protocol === 'https:'

describe('project content', () => {
  it('gives every featured project a unique id and the fields the page renders', () => {
    const ids = featuredProjects.map((project) => project.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const project of featuredProjects) {
      expect(project.title).toBeTruthy()
      expect(project.summary).toBeTruthy()
      expect(project.highlights.length).toBeGreaterThan(0)
      expect(project.stack.length).toBeGreaterThan(0)
      expect(isHttps(project.live)).toBe(true)
      expect(isHttps(project.source)).toBe(true)
    }
  })

  it('describes every screenshot with alt text and real dimensions', () => {
    for (const shot of featuredProjects.flatMap((project) => project.shots)) {
      expect(shot.alt.length).toBeGreaterThan(15)
      expect(shot.width).toBeGreaterThan(0)
      expect(shot.height).toBeGreaterThan(0)
      expect(['desktop', 'mobile']).toContain(shot.kind)
    }
  })

  it('says what is missing when a project has no screenshot yet', () => {
    for (const project of featuredProjects.filter((p) => p.shots.length === 0)) {
      expect(project.missingShot).toBeTruthy()
    }
  })

  it('links every archive project to a live site and its source', () => {
    for (const project of archiveProjects) {
      expect(isHttps(project.live)).toBe(true)
      expect(isHttps(project.source)).toBe(true)
    }
  })

  it('only points skills at projects that exist on the page', () => {
    const ids = new Set(featuredProjects.map((project) => project.id))
    for (const skill of skillGroups.flatMap((group) => group.skills)) {
      for (const id of skill.projects ?? []) expect(ids).toContain(id)
    }
  })
})
