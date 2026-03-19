import { Effect } from "effect"
import Replicate from "replicate"
import { FaceAnalysis, AnalysisResult } from "../domain/faceAnalysis"
import {
  FIREWORKS_INFERENCE_API_URL,
  formatFireworksConfigError,
  getFireworksVisionModel,
} from "./fireworks"
import { buildPrimaryHairstylePlan, buildRecommendedStyles } from "./styleReferences"
import { selectClosestGeneratedImageAspectRatio } from "../utils/imageAspectRatio"

const REPLICATE_IMAGE_MODEL = "google/nano-banana-pro"

const FACE_ANALYSIS_JSON_SCHEMA = {
  type: "object",
  properties: {
    upperThird: {
      type: "string",
      enum: ["small_narrow", "large_wide", "balanced"],
    },
    symmetry: {
      type: "string",
      enum: ["asymmetrical", "symmetrical"],
    },
    verticalLength: {
      type: "string",
      enum: ["long", "short", "balanced"],
    },
    jawProjection: {
      type: "string",
      enum: ["angular_projected", "soft"],
    },
  },
  required: ["upperThird", "symmetry", "verticalLength", "jawProjection"],
} as const

/**
 * Service that uses Fireworks' hosted Kimi 2.5 vision model to analyze the photo and extract exact geometric properties
 * required by our objective hair algorithm.
 */
const performVisionAnalysis = (base64Image: string): Effect.Effect<FaceAnalysis, Error, never> => Effect.tryPromise({
  try: async () => {
    const fireworksVisionModel = getFireworksVisionModel()

    if (!process.env.FIREWORKS_API_KEY) {
      throw new Error(
        "FIREWORKS_API_KEY is missing. Add it to your environment to use Kimi 2.5 analysis.",
      )
    }

    const imageUrl = base64Image.startsWith("data:image")
      ? base64Image
      : `data:image/jpeg;base64,${base64Image}`

    const response = await fetch(FIREWORKS_INFERENCE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
      },
      body: JSON.stringify({
        model: fireworksVisionModel,
        temperature: 0.2,
        max_tokens: 256,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "face_analysis",
            schema: FACE_ANALYSIS_JSON_SCHEMA,
          },
        },
        messages: [
          {
            role: "system",
            content:
              "You are an expert facial geometry analyst and professional hair stylist. Return only JSON that matches the requested schema.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  `Analyze the provided portrait and classify exactly four objective traits.
1. upperThird: "small_narrow", "large_wide", or "balanced"
2. symmetry: "asymmetrical" or "symmetrical"
3. verticalLength: "long", "short", or "balanced"
4. jawProjection: "angular_projected" or "soft"

Use only the supplied schema values and return valid JSON.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        formatFireworksConfigError(response.status, errorBody, fireworksVisionModel),
      )
    }

    const payload = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string | null
        }
      }>
    }

    const resultText = payload.choices?.[0]?.message?.content?.trim()

    if (!resultText) {
      throw new Error("Fireworks returned an empty analysis response.")
    }

    const analysis = JSON.parse(resultText) as FaceAnalysis
    return analysis
  },
  catch: (error) =>
    new Error(
      `Vision analysis failed with ${getFireworksVisionModel()}: ${error instanceof Error ? error.message : String(error)}`,
    ),
})

type RecommendationOutput = Omit<
  AnalysisResult,
  "generatedImageUrl" | "generatedImageError"
> & {
  renderPrompt: string
}

type SourceImageDimensions = {
  width?: number
  height?: number
}

/**
 * Translates the mathematical features into the objectively optimal hairstyle recommendation.
 */
const generateRecommendation = (
  analysis: FaceAnalysis,
): Effect.Effect<RecommendationOutput, never, never> =>
  Effect.sync(() => {
    const styleRecommendations = buildRecommendedStyles(analysis)
    const primaryPlan = buildPrimaryHairstylePlan(analysis)

    return {
      analysis,
      recommendation: primaryPlan.recommendation,
      explanation: primaryPlan.explanation,
      protocolSteps: primaryPlan.protocolSteps,
      referenceExamples: primaryPlan.referenceExamples,
      recommendedStyles: styleRecommendations.map(
        ({ recommendationText: _recommendationText, explanationText: _explanationText, ...style }) =>
          style,
      ),
      renderPrompt: primaryPlan.renderPrompt,
    }
  })

/**
 * Uses Replicate's GPT Image 1.5 model to edit the uploaded portrait with one
 * primary recommended hairstyle while keeping the subject recognizable.
 */
const generateTransformedImage = (
  base64Image: string,
  renderPrompt: string,
  sourceImageDimensions?: SourceImageDimensions,
): Effect.Effect<{ generatedImageUrl: string | null; generatedImageError: string | null }, never, never> => Effect.tryPromise({
  try: async () => {
    if (!process.env.REPLICATE_API_TOKEN) {
      return {
        generatedImageUrl: null,
        generatedImageError:
          'REPLICATE_API_TOKEN is missing. Add a valid Replicate token to enable hairstyle renders.',
      }
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
      useFileOutput: false,
    })

    const base64Data = base64Image.startsWith('data:')
      ? base64Image.split(';base64,')[1] || ''
      : base64Image

    const inputImage = Buffer.from(base64Data, 'base64')

    const prompt =
      `Edit the provided portrait so the same person has one hairstyle only: ${renderPrompt}. ` +
      "Preserve the same face identity, face shape, skin tone, camera angle, and framing. " +
      "Keep it photorealistic with natural hair texture and soft professional portrait lighting."

    const aspectRatio = selectClosestGeneratedImageAspectRatio(
      sourceImageDimensions?.width,
      sourceImageDimensions?.height,
    )

    const output = await replicate.run(
      REPLICATE_IMAGE_MODEL,
      {
        input: {
          prompt,
          input_images: [inputImage],
          input_fidelity: "high",
          number_of_images: 1,
          aspect_ratio: aspectRatio,
          output_format: "webp",
        },
      },
    )

    const generatedImageUrl = extractReplicateOutputUrl(output)

    if (generatedImageUrl) {
      return {
        generatedImageUrl,
        generatedImageError: null,
      }
    }

    return {
      generatedImageUrl: null,
      generatedImageError: 'Replicate completed without returning an output image URL.',
    }
  },
  catch: (error) => new Error(formatReplicateGenerationError(error))
}).pipe(
  Effect.catchAll((error) => {
    console.error("Image generation failed:", error)
    return Effect.succeed({
      generatedImageUrl: null,
      generatedImageError: error.message,
    })
  })
)

export function extractReplicateOutputUrl(output: unknown): string | null {
  if (typeof output === 'string') {
    return output
  }

  if (Array.isArray(output) && output.length > 0) {
    const firstOutput = output[0]

    if (typeof firstOutput === 'string') {
      return firstOutput
    }

    if (
      typeof firstOutput === 'object' &&
      firstOutput !== null &&
      'url' in firstOutput &&
      typeof firstOutput.url === 'function'
    ) {
      return String(firstOutput.url())
    }
  }

  if (
    typeof output === 'object' &&
    output !== null &&
    'url' in output &&
    typeof output.url === 'function'
  ) {
    return String(output.url())
  }

  return null
}

export function formatReplicateGenerationError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('402 Payment Required') || message.includes('Insufficient credit')) {
    return 'Replicate returned 402 Insufficient credit for the simulated outcome. Add billing credit to the Replicate account behind REPLICATE_API_TOKEN, wait a few minutes, then try again.'
  }

  if (message.includes('401 Unauthorized') || message.includes('Unauthenticated')) {
    return 'Replicate rejected REPLICATE_API_TOKEN. Replace it with a valid token and restart the dev server.'
  }

  return `Replicate image generation failed: ${message}`
}

/**
 * The full effect pipeline for analyzing a user's uploaded photo.
 */
export const analyzePhotoPipeline = (
  base64Image: string,
  sourceImageDimensions?: SourceImageDimensions,
): Effect.Effect<AnalysisResult, Error, never> => 
  Effect.gen(function* () {
    // 1. Perform REAL vision analysis (or fallback if no key)
    const analysis = yield* performVisionAnalysis(base64Image)
    
    // 2. Generate the recommendation based on objective rules
    const partialResult = yield* generateRecommendation(analysis)
    const { renderPrompt, ...resultWithoutPrompt } = partialResult

    // 3. Generate the transformed photo using the calculated optimal hairstyle
    const generatedImage = yield* generateTransformedImage(
      base64Image,
      renderPrompt,
      sourceImageDimensions,
    )

    return {
      ...resultWithoutPrompt,
      ...generatedImage,
    }
  })
