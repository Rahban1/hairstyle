const HEIC_MIME_TYPES = new Set([
  'image/heic',
  'image/heif',
  'image/heic-sequence',
  'image/heif-sequence',
])

const PASSTHROUGH_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
])

const MAX_ANALYSIS_IMAGE_DIMENSION = 1600
const MAX_ANALYSIS_IMAGE_BYTES = 2_500_000
const NORMALIZED_IMAGE_QUALITY = 0.9

type FileLike = Pick<File, 'name' | 'type'>

export type PreparedUploadedImage = {
  base64Image: string
  previewUrl: string
  mimeType: string
  width: number
  height: number
}

export function isHeicLikeFile(file: FileLike): boolean {
  const mimeType = file.type.toLowerCase()
  return HEIC_MIME_TYPES.has(mimeType) || /\.(heic|heif)$/i.test(file.name)
}

export function requiresClientNormalization(file: FileLike): boolean {
  const mimeType = file.type.toLowerCase()

  if (isHeicLikeFile(file)) {
    return true
  }

  if (!mimeType) {
    return false
  }

  return !PASSTHROUGH_IMAGE_MIME_TYPES.has(mimeType)
}

export function buildNormalizedFileName(fileName: string, extension = 'jpg'): string {
  const stem = fileName.replace(/\.[^.]+$/, '') || 'portrait'
  return `${stem}.${extension}`
}

export function scaleDimensionsWithinBounds(
  width: number,
  height: number,
  maxDimension = MAX_ANALYSIS_IMAGE_DIMENSION,
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height }
  }

  const scale = Math.min(maxDimension / width, maxDimension / height)

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

export async function prepareUploadedImage(file: File): Promise<PreparedUploadedImage> {
  if (!file.type.startsWith('image/') && !isHeicLikeFile(file)) {
    throw new Error('Please upload a valid image file.')
  }

  let normalizedFile = file

  if (isHeicLikeFile(file)) {
    normalizedFile = await convertHeicToJpeg(file)
  }

  if (
    requiresClientNormalization(file) ||
    normalizedFile.size > MAX_ANALYSIS_IMAGE_BYTES
  ) {
    normalizedFile = await convertBrowserImageToJpeg(normalizedFile)
  }

  const { width, height } = await loadImageDimensions(normalizedFile)
  const base64Image = await readFileAsDataUrl(normalizedFile)

  return {
    base64Image,
    previewUrl: base64Image,
    mimeType: normalizedFile.type || 'image/jpeg',
    width,
    height,
  }
}

async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2anyModule = await import('heic2any')
  const converted = await heic2anyModule.default({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.92,
  })

  const convertedBlob = Array.isArray(converted) ? converted[0] : converted

  if (!(convertedBlob instanceof Blob)) {
    throw new Error('The uploaded HEIC photo could not be converted.')
  }

  return new File([convertedBlob], buildNormalizedFileName(file.name), {
    type: 'image/jpeg',
  })
}

async function convertBrowserImageToJpeg(file: File): Promise<File> {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImageElement(objectUrl)
    const canvas = document.createElement('canvas')
    const sourceWidth = image.naturalWidth || image.width
    const sourceHeight = image.naturalHeight || image.height
    const { width, height } = scaleDimensionsWithinBounds(
      sourceWidth,
      sourceHeight,
    )

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('The image processing canvas could not be created.')
    }

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    const convertedBlob = await canvasToBlob(
      canvas,
      'image/jpeg',
      NORMALIZED_IMAGE_QUALITY,
    )

    return new File([convertedBlob], buildNormalizedFileName(file.name), {
      type: 'image/jpeg',
    })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('The uploaded image could not be read.'))
        return
      }

      resolve(reader.result)
    }

    reader.onerror = () => {
      reject(new Error('The uploaded image could not be read.'))
    }

    reader.readAsDataURL(file)
  })
}

async function loadImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImageElement(objectUrl)

    return {
      width: image.naturalWidth || image.width,
      height: image.naturalHeight || image.height,
    }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The uploaded image could not be decoded.'))
    image.src = src
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('The uploaded image could not be converted.'))
        return
      }

      resolve(blob)
    }, type, quality)
  })
}
