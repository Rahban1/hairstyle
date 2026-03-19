import { describe, expect, it } from 'vitest'
import { selectClosestGeneratedImageAspectRatio } from './imageAspectRatio'

describe('selectClosestGeneratedImageAspectRatio', () => {
  it('keeps square uploads square', () => {
    expect(selectClosestGeneratedImageAspectRatio(1200, 1200)).toBe('1:1')
  })

  it('maps portrait uploads to the portrait output ratio', () => {
    expect(selectClosestGeneratedImageAspectRatio(1080, 1440)).toBe('2:3')
  })

  it('maps landscape uploads to the landscape output ratio', () => {
    expect(selectClosestGeneratedImageAspectRatio(1600, 900)).toBe('3:2')
  })

  it('falls back safely when dimensions are missing', () => {
    expect(selectClosestGeneratedImageAspectRatio(undefined, 900)).toBe('1:1')
    expect(selectClosestGeneratedImageAspectRatio(0, 900)).toBe('1:1')
  })
})
