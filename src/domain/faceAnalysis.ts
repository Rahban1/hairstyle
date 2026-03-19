import { Schema } from "effect"

export const UpperThird = Schema.Literal("small_narrow", "large_wide", "balanced")
export type UpperThird = typeof UpperThird.Type

export const Symmetry = Schema.Literal("asymmetrical", "symmetrical")
export type Symmetry = typeof Symmetry.Type

export const VerticalLength = Schema.Literal("long", "short", "balanced")
export type VerticalLength = typeof VerticalLength.Type

export const JawProjection = Schema.Literal("angular_projected", "soft")
export type JawProjection = typeof JawProjection.Type

export const FaceAnalysis = Schema.Struct({
  upperThird: UpperThird,
  symmetry: Symmetry,
  verticalLength: VerticalLength,
  jawProjection: JawProjection,
})
export type FaceAnalysis = typeof FaceAnalysis.Type

export const RecommendedStyleExample = Schema.Struct({
  name: Schema.String,
  description: Schema.String,
  imageUrl: Schema.String,
  sourceUrl: Schema.String,
})
export type RecommendedStyleExample = typeof RecommendedStyleExample.Type

export const RecommendedStyle = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  summary: Schema.String,
  examples: Schema.Array(RecommendedStyleExample),
})
export type RecommendedStyle = typeof RecommendedStyle.Type

export const AnalysisResult = Schema.Struct({
  analysis: FaceAnalysis,
  recommendation: Schema.String,
  explanation: Schema.String,
  protocolSteps: Schema.Array(Schema.String),
  recommendedStyles: Schema.Array(RecommendedStyle),
  referenceExamples: Schema.Array(RecommendedStyleExample),
  generatedImageUrl: Schema.Union(Schema.String, Schema.Null),
  generatedImageError: Schema.Union(Schema.String, Schema.Null),
})
export type AnalysisResult = typeof AnalysisResult.Type
