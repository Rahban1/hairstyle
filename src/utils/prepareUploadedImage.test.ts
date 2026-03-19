import { describe, expect, it } from 'vitest'
import {
  buildNormalizedFileName,
  isHeicLikeFile,
  requiresClientNormalization,
  scaleDimensionsWithinBounds,
} from './prepareUploadedImage'

describe('prepareUploadedImage helpers', () => {
  it('detects HEIC files by mime type or extension', () => {
    expect(isHeicLikeFile({ name: 'portrait.HEIC', type: '' } as File)).toBe(true)
    expect(isHeicLikeFile({ name: 'portrait.jpg', type: 'image/heif' } as File)).toBe(true)
    expect(isHeicLikeFile({ name: 'portrait.jpg', type: 'image/jpeg' } as File)).toBe(false)
  })

  it('only skips normalization for passthrough web-safe image formats', () => {
    expect(requiresClientNormalization({ name: 'portrait.jpg', type: 'image/jpeg' } as File)).toBe(false)
    expect(requiresClientNormalization({ name: 'portrait.webp', type: 'image/webp' } as File)).toBe(false)
    expect(requiresClientNormalization({ name: 'portrait.heic', type: 'image/heic' } as File)).toBe(true)
    expect(requiresClientNormalization({ name: 'portrait.gif', type: 'image/gif' } as File)).toBe(true)
  })

  it('creates stable jpeg output names', () => {
    expect(buildNormalizedFileName('portrait.heic')).toBe('portrait.jpg')
    expect(buildNormalizedFileName('portrait.profile.png')).toBe('portrait.profile.jpg')
    expect(buildNormalizedFileName('portrait', 'jpeg')).toBe('portrait.jpeg')
  })

  it('shrinks oversized images while preserving aspect ratio', () => {
    expect(scaleDimensionsWithinBounds(3200, 2400)).toEqual({
      width: 1600,
      height: 1200,
    })
    expect(scaleDimensionsWithinBounds(1200, 3200)).toEqual({
      width: 600,
      height: 1600,
    })
    expect(scaleDimensionsWithinBounds(800, 600)).toEqual({
      width: 800,
      height: 600,
    })
  })
})
