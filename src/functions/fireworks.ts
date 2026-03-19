export const FIREWORKS_CONTROL_API_URL = 'https://api.fireworks.ai/v1'
export const FIREWORKS_INFERENCE_API_URL =
  'https://api.fireworks.ai/inference/v1/chat/completions'
export const DEFAULT_FIREWORKS_VISION_MODEL =
  'accounts/fireworks/models/kimi-k2p5'

const FIREWORKS_MODEL_PATH_PATTERN = /^accounts\/([^/]+)\/models\/([^/]+)$/

export function getFireworksVisionModel(): string {
  return process.env.FIREWORKS_VISION_MODEL || DEFAULT_FIREWORKS_VISION_MODEL
}

export function parseFireworksModelPath(
  modelName: string,
): { accountId: string; modelId: string } | null {
  const match = modelName.match(FIREWORKS_MODEL_PATH_PATTERN)

  if (!match) {
    return null
  }

  return {
    accountId: match[1],
    modelId: match[2],
  }
}

export function extractFireworksErrorMessage(bodyText: string): string {
  try {
    const payload = JSON.parse(bodyText) as {
      error?: {
        message?: string
      }
    }

    return payload.error?.message || bodyText
  } catch {
    return bodyText
  }
}

export function formatFireworksConfigError(
  status: number,
  bodyText: string,
  modelName: string,
): string {
  const apiMessage = extractFireworksErrorMessage(bodyText)

  if (status === 401) {
    return 'Fireworks rejected FIREWORKS_API_KEY. Replace it with a valid key and restart the dev server.'
  }

  if (status === 404) {
    return `Fireworks could not find ${modelName}. Check FIREWORKS_VISION_MODEL.`
  }

  return `Fireworks returned ${status}: ${apiMessage}`
}
