export type SupportedGeneratedImageAspectRatio = '1:1' | '3:2' | '2:3'

const SUPPORTED_GENERATED_IMAGE_ASPECT_RATIOS: Array<[
  SupportedGeneratedImageAspectRatio,
  number,
]> = [
  ['1:1', 1],
  ['3:2', 3 / 2],
  ['2:3', 2 / 3],
]

export function selectClosestGeneratedImageAspectRatio(
  width?: number,
  height?: number,
): SupportedGeneratedImageAspectRatio {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    !width ||
    !height ||
    width <= 0 ||
    height <= 0
  ) {
    return '1:1'
  }

  const sourceAspectRatio = width / height

  return SUPPORTED_GENERATED_IMAGE_ASPECT_RATIOS.reduce(
    (closestRatio, candidateRatio) => {
      const [, closestValue] = closestRatio
      const [, candidateValue] = candidateRatio

      return Math.abs(sourceAspectRatio - candidateValue) <
        Math.abs(sourceAspectRatio - closestValue)
        ? candidateRatio
        : closestRatio
    },
  )[0]
}
