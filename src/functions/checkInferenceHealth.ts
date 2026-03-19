import { createServerFn } from '@tanstack/react-start'
import {
  FIREWORKS_CONTROL_API_URL,
  formatFireworksConfigError,
  getFireworksVisionModel,
  parseFireworksModelPath,
} from './fireworks'

export type InferenceHealth =
  | {
      status: 'ready'
      message: string
      model: string
    }
  | {
      status: 'error'
      message: string
      model: string
    }

export const checkInferenceHealthFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const model = getFireworksVisionModel()
    const apiKey = process.env.FIREWORKS_API_KEY

    if (!apiKey) {
      return {
        status: 'error',
        message:
          'FIREWORKS_API_KEY is missing. Add it to your environment and restart the dev server.',
        model,
      } satisfies InferenceHealth
    }

    const parsedModel = parseFireworksModelPath(model)

    if (!parsedModel) {
      return {
        status: 'error',
        message:
          'FIREWORKS_VISION_MODEL must use accounts/<account>/models/<model>.',
        model,
      } satisfies InferenceHealth
    }

    try {
      const response = await fetch(
        `${FIREWORKS_CONTROL_API_URL}/accounts/${parsedModel.accountId}/models/${parsedModel.modelId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      )

      if (!response.ok) {
        const errorBody = await response.text()

        return {
          status: 'error',
          message: formatFireworksConfigError(response.status, errorBody, model),
          model,
        } satisfies InferenceHealth
      }

      const payload = (await response.json()) as {
        displayName?: string
        name?: string
      }

      return {
        status: 'ready',
        message: `Fireworks ready. ${payload.displayName || payload.name || model} is reachable.`,
        model,
      } satisfies InferenceHealth
    } catch (error) {
      return {
        status: 'error',
        message: `Could not reach Fireworks: ${error instanceof Error ? error.message : String(error)}`,
        model,
      } satisfies InferenceHealth
    }
  },
)
