import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { analyzePhotoPipeline } from './analyzePipeline'

export const analyzeFaceFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { base64Image: string; sourceWidth?: number; sourceHeight?: number }) => {
    if (!data.base64Image) {
      throw new Error('Image data is required')
    }

    if (
      data.sourceWidth !== undefined &&
      (!Number.isFinite(data.sourceWidth) || data.sourceWidth <= 0)
    ) {
      throw new Error('Image width must be a positive number')
    }

    if (
      data.sourceHeight !== undefined &&
      (!Number.isFinite(data.sourceHeight) || data.sourceHeight <= 0)
    ) {
      throw new Error('Image height must be a positive number')
    }

    return data
  })
  .handler(async ({ data }) => {
    // Run our Effect pipeline
    const pipeline = analyzePhotoPipeline(data.base64Image, {
      width: data.sourceWidth,
      height: data.sourceHeight,
    })
    // Execute the effect to get our analysis and recommendation result
    const result = await Effect.runPromise(pipeline)
    return result
  })
