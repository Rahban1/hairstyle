import { describe, expect, it } from 'vitest'
import {
  extractReplicateOutputUrl,
  formatReplicateGenerationError,
} from './analyzePipeline'

describe('extractReplicateOutputUrl', () => {
  it('returns a direct string output as a URL', () => {
    expect(extractReplicateOutputUrl('https://example.com/image.jpg')).toBe(
      'https://example.com/image.jpg',
    )
  })

  it('returns the first URL from array outputs', () => {
    expect(
      extractReplicateOutputUrl([
        'https://example.com/image.jpg',
        'https://example.com/image-2.jpg',
      ]),
    ).toBe('https://example.com/image.jpg')
  })
})

describe('formatReplicateGenerationError', () => {
  it('turns insufficient-credit errors into actionable Replicate guidance', () => {
    const message = formatReplicateGenerationError(
      new Error(
        'Request failed with status 402 Payment Required: {"title":"Insufficient credit"}',
      ),
    )

    expect(message).toContain('Replicate returned 402 Insufficient credit')
    expect(message).toContain('REPLICATE_API_TOKEN')
    expect(message).toContain('wait a few minutes')
  })

  it('keeps unauthorized-token guidance specific', () => {
    const message = formatReplicateGenerationError(
      new Error('401 Unauthorized: Unauthenticated'),
    )

    expect(message).toBe(
      'Replicate rejected REPLICATE_API_TOKEN. Replace it with a valid token and restart the dev server.',
    )
  })
})
