import { describe, expect, it } from 'vitest'
import { buildPrimaryHairstylePlan, buildRecommendedStyles } from './styleReferences'

describe('buildRecommendedStyles', () => {
  it('returns one populated reference card per analysis dimension', () => {
    const styles = buildRecommendedStyles({
      upperThird: 'small_narrow',
      symmetry: 'asymmetrical',
      verticalLength: 'long',
      jawProjection: 'soft',
    })

    expect(styles.map((style) => style.id)).toEqual([
      'upward-volume',
      'textured-asymmetry',
      'horizontal-emphasis',
      'textured-side-length',
    ])

    expect(styles).toHaveLength(4)

    for (const style of styles) {
      expect(style.examples).toHaveLength(3)

      for (const example of style.examples) {
        expect(example.imageUrl).toMatch(/^https:\/\/upload\.wikimedia\.org\//)
        expect(example.sourceUrl).toMatch(/^https:\/\/en\.wikipedia\.org\/wiki\//)
      }
    }
  })

  it('switches to balanced variants when proportions are already neutral', () => {
    const styles = buildRecommendedStyles({
      upperThird: 'balanced',
      symmetry: 'symmetrical',
      verticalLength: 'balanced',
      jawProjection: 'angular_projected',
    })

    expect(styles.map((style) => style.id)).toEqual([
      'flow-slick-middle-part',
      'symmetrical-precision',
      'balanced-versatile',
      'short-cuts',
    ])
  })

  it('creates one clear primary hairstyle plan for the renderer and protocol UI', () => {
    const plan = buildPrimaryHairstylePlan({
      upperThird: 'balanced',
      symmetry: 'symmetrical',
      verticalLength: 'balanced',
      jawProjection: 'soft',
    })

    expect(plan.recommendation).toBe('Clean middle part')
    expect(plan.explanation).toContain('Best match: Clean middle part.')
    expect(plan.protocolSteps).toEqual([
      'Ask for a clean middle part with medium texture.',
      'Keep the front clean with a natural part and relaxed texture.',
      'Keep the height moderate so the haircut stays easy and balanced.',
      'Keep the shape neat and balanced, with a clean finish.',
      'Do not cut the sides too tight; leave some soft width through the temples and sides.',
    ])
    expect(plan.renderPrompt).toContain('clean middle part')
    expect(plan.renderPrompt).toContain('single hairstyle only')
    expect(plan.referenceExamples.map((example) => example.name)).toEqual([
      'Cillian Murphy',
      'Keanu Reeves',
      'Brad Pitt',
    ])
  })
})
