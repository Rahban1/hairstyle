import { createFileRoute } from '@tanstack/react-router'
import { startTransition, useRef, useState } from 'react'
import { analyzeFaceFn } from '../functions/analyzeFace'
import type { AnalysisResult } from '../domain/faceAnalysis'
import {
  Upload,
  Crosshair,
  RefreshCcw,
  CheckCircle2,
  ImageIcon,
  ArrowUpRight,
} from 'lucide-react'
import { prepareUploadedImage } from '../utils/prepareUploadedImage'

export const Route = createFileRoute('/')({ component: Home })

function getSimulationStatus(result: AnalysisResult) {
  if (result.generatedImageError) {
    return {
      title: 'Simulation unavailable',
      description: result.generatedImageError,
      note: 'The recommended look preview now uses Replicate OpenAI GPT Image 1.5 with your uploaded portrait as a reference. If generation fails, check the Replicate token and billing behind REPLICATE_API_TOKEN.',
    }
  }

  return {
    title: 'Simulation pending',
    description: 'Your hairstyle render will appear here once generation completes.',
    note: null,
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  if (typeof error === 'string' && error.trim()) {
    return error
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.trim()
  ) {
    return error.message
  }

  return 'Analysis could not be completed. Upload a clear, front-facing portrait and try again.'
}

function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFrameAspectRatio, setImageFrameAspectRatio] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const simulationStatus = result ? getSimulationStatus(result) : null
  const previewFrameStyle = imageFrameAspectRatio
    ? { aspectRatio: imageFrameAspectRatio }
    : undefined

  const handleFile = async (file: File) => {
    setErrorMessage(null)
    setIsAnalyzing(true)

    try {
      const preparedImage = await prepareUploadedImage(file)

      startTransition(() => {
        setImagePreview(preparedImage.previewUrl)
        setImageFrameAspectRatio(preparedImage.width / preparedImage.height)
        setResult(null)
      })

      const data = await analyzeFaceFn({
        data: {
          base64Image: preparedImage.base64Image,
          sourceWidth: preparedImage.width,
          sourceHeight: preparedImage.height,
        },
      })

      setResult(data)
    } catch (err) {
      console.error('Analysis failed:', err)
      setResult(null)
      setErrorMessage(getErrorMessage(err))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  return (
    <main className="page-wrap px-4 py-16 md:py-24 min-h-screen max-w-5xl mx-auto flex flex-col items-center selection:bg-[var(--text-main)] selection:text-[var(--bg-base)]">
      
      {/* HEADER SECTION */}
      <header className="text-center mb-16 max-w-3xl fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight text-[var(--text-main)]">
          Objective Facial Assessment
        </h1>
        <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed font-sans max-w-xl mx-auto">
          Discard generic face shape charts. Our algorithmic system evaluates your unique facial thirds, symmetrical deviations, and structural proportions to synthesize the mathematically optimal hairstyle.
        </p>
      </header>

      {/* HIDDEN INPUT */}
      <input 
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* UPLOAD STATE - Enhanced A11y & Drag/Drop */}
      {!imagePreview && (
        <div className="w-full max-w-2xl fade-in">
          <button 
            type="button"
            disabled={isAnalyzing}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            aria-label="Upload portrait for facial analysis"
            className={`w-full border p-16 md:p-24 text-center transition-all duration-300 ease-out cursor-pointer group disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-main)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg-base)] ${
              isDragging 
                ? 'border-solid border-[var(--text-main)] bg-[var(--surface)] scale-[1.02]' 
                : 'border-dashed border-[var(--border-color)] clinical-bg hover:border-[var(--text-main)] hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-5">
              <div className="p-4 rounded-full bg-[var(--bg-base)] border border-[var(--border-color)] group-hover:scale-110 transition-transform duration-300 ease-out shadow-sm">
                <Upload size={24} strokeWidth={1.5} className="text-[var(--text-main)]" />
              </div>
              <div>
                <span className="label-caps block mb-2 text-[var(--text-main)] group-hover:text-black dark:group-hover:text-white transition-colors">
                  {isAnalyzing
                    ? 'Preparing Portrait'
                    : isDragging
                      ? 'Drop Image Here'
                      : 'Submit Portrait'}
                </span>
                <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
                  {isAnalyzing
                    ? 'Normalizing the upload and starting analysis.'
                    : 'Drag and drop, or click to browse. Ensure the face is clearly visible with neutral lighting.'}
                </p>
              </div>
            </div>
          </button>

          {errorMessage && (
            <div
              role="alert"
              className="mt-4 border border-[var(--border-color)] bg-[var(--surface)] px-5 py-4 text-left text-sm text-[var(--text-muted)]"
            >
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* ANALYSIS STATE */}
      {imagePreview && (
        <div className="w-full fade-in flex flex-col gap-8 mt-4">
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 items-stretch">
            <article className="clinical-border bg-[var(--bg-base)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border-color)] clinical-bg flex items-center justify-between gap-3">
                <span className="label-caps text-[var(--text-main)]">Current Photo</span>
                <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
                  Source
                </span>
              </div>
              <div className="p-3 md:p-4 bg-[var(--surface)]/30">
                <div className="relative w-full overflow-hidden bg-black/5" style={previewFrameStyle}>
                  <img
                    src={imagePreview}
                    alt="Current uploaded portrait"
                    className="block h-full w-full object-contain grayscale-[12%] contrast-110 transition-transform duration-700 ease-out"
                  />
                  {isAnalyzing && (
                    <div className="absolute left-4 bottom-4 border border-[var(--border-color)] bg-[var(--bg-base)]/90 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--text-main)] backdrop-blur-sm">
                      Analyzing structure
                    </div>
                  )}
                </div>
              </div>
            </article>

            <article className="clinical-border bg-[var(--bg-base)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border-color)] clinical-bg flex items-center justify-between gap-3">
                <span className="label-caps text-[var(--text-main)]">Recommended Look</span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-muted)] text-right">
                  {result?.recommendation ?? 'AI preview'}
                </span>
              </div>
              <div className="p-3 md:p-4 bg-[var(--surface)]/30">
                {result?.generatedImageUrl ? (
                  <div className="relative w-full overflow-hidden bg-black/5" style={previewFrameStyle}>
                    <img
                      src={result.generatedImageUrl}
                      alt={`AI generated preview of ${result.recommendation}`}
                      className="block h-full w-full object-contain transition-transform duration-700 ease-out"
                    />
                    <div className="absolute left-4 top-4 border border-[var(--border-color)] bg-[var(--bg-base)]/92 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-[var(--text-main)] backdrop-blur-sm">
                      {result.recommendation}
                    </div>
                  </div>
                ) : isAnalyzing ? (
                  <div
                    className="clinical-border p-8 flex flex-col justify-center gap-8 bg-[var(--surface)]/60"
                    style={previewFrameStyle}
                  >
                    <div>
                      <span className="label-caps text-[var(--text-main)]">Building your best hairstyle</span>
                      <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
                        One hairstyle is being selected first, then the AI preview is generated from that single recommendation.
                      </p>
                    </div>
                    {[
                      'Choosing the best haircut shape',
                      'Setting the front and side balance',
                      'Preparing the AI hairstyle preview',
                    ].map((step, idx) => (
                      <div key={step} className="w-full">
                        <div className="flex justify-between items-end mb-3">
                          <span className="text-xs uppercase tracking-wider text-[var(--text-main)] opacity-80">{step}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono animate-pulse">Working</span>
                        </div>
                        <div className="h-px w-full bg-[var(--border-color)] overflow-hidden relative">
                          <div
                            className="absolute top-0 left-0 h-full bg-[var(--text-main)] transition-all duration-[2000ms] ease-out"
                            style={{
                              width: '100%',
                              transformOrigin: 'left',
                              animation: 'scaleX 2s ease-out infinite alternate',
                              animationDelay: `${idx * 0.2}s`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="min-h-[420px] clinical-border bg-[var(--surface)]/60 flex flex-col items-center justify-center gap-4 px-8 text-center">
                    <div className="p-3 rounded-full bg-[var(--bg-base)] border border-[var(--border-color)]">
                      <Crosshair size={22} strokeWidth={1.5} className="text-[var(--text-muted)] opacity-60" />
                    </div>
                    <p className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--text-muted)] max-w-xs leading-relaxed">
                      {simulationStatus?.title ?? 'Waiting for recommendation'}
                    </p>
                    <p className="max-w-md text-sm md:text-base text-[var(--text-main)] leading-relaxed">
                      {simulationStatus?.description ?? 'Your AI hairstyle preview will show up here after the recommendation is ready.'}
                    </p>
                    {simulationStatus?.note && (
                      <p className="max-w-md text-xs text-[var(--text-muted)] leading-relaxed">
                        {simulationStatus.note}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </article>
          </section>

          {errorMessage && !isAnalyzing && (
            <div
              role="alert"
              className="clinical-border bg-[var(--surface)] px-6 py-5 text-sm text-[var(--text-muted)]"
            >
              {errorMessage}
            </div>
          )}

          <section className="clinical-border bg-[var(--bg-base)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)] clinical-bg flex items-center gap-3">
              <CheckCircle2 size={16} strokeWidth={1.5} className="text-[var(--text-main)]" />
              <span className="label-caps text-[var(--text-main)]">Aesthetic Protocol</span>
            </div>

            {result && !isAnalyzing ? (
              <div className="p-8 md:p-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)] mb-4">
                    Best hairstyle for you
                  </p>
                  <h2 className="text-3xl lg:text-4xl leading-tight font-serif text-[var(--text-main)]">
                    {result.recommendation}
                  </h2>
                  <p className="mt-5 text-sm md:text-base text-[var(--text-muted)] leading-relaxed max-w-2xl">
                    {result.explanation}
                  </p>
                </div>

                <div className="clinical-border bg-[var(--surface)]/55 p-6 md:p-7">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)] mb-5">
                    Tell your barber
                  </p>
                  <ul className="space-y-4 text-sm md:text-[15px] text-[var(--text-main)] leading-relaxed">
                    {result.protocolSteps.map((step) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-[var(--text-main)]" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="p-8 md:p-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                <div className="space-y-4">
                  <div className="h-3 w-32 bg-[var(--border-color)]/70 animate-pulse" />
                  <div className="h-10 w-full max-w-xl bg-[var(--border-color)]/60 animate-pulse" />
                  <div className="h-5 w-full max-w-2xl bg-[var(--border-color)]/50 animate-pulse" />
                  <div className="h-5 w-full max-w-xl bg-[var(--border-color)]/50 animate-pulse" />
                </div>
                <div className="clinical-border bg-[var(--surface)]/55 p-6 md:p-7 space-y-4">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="h-4 w-full bg-[var(--border-color)]/55 animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-[var(--text-muted)] bg-[var(--surface)]/20">
                Upload a portrait to get one clear hairstyle recommendation and a matching AI preview.
              </div>
            )}
          </section>

          <section className="clinical-border bg-[var(--bg-base)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)] clinical-bg flex items-center gap-3">
              <ImageIcon size={16} strokeWidth={1.5} className="text-[var(--text-main)]" />
              <span className="label-caps text-[var(--text-main)]">Reference Images</span>
            </div>

            {result && !isAnalyzing ? (
              <div className="p-8 md:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)] mb-4">
                      Celebrity reference cuts
                    </p>
                    <h2 className="text-3xl lg:text-4xl leading-tight font-serif text-[var(--text-main)]">
                      {result.recommendation}
                    </h2>
                    <p className="mt-5 text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                      Real-world examples with a similar silhouette, front direction, and overall finish so you can compare the target haircut before heading to the barber.
                    </p>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-muted)] md:text-right">
                    Tap any reference to open the source
                  </p>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  {result.referenceExamples.map((example, index) => (
                    <a
                      key={`${result.recommendation}-${example.name}`}
                      href={example.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group clinical-border overflow-hidden bg-[var(--surface)]/45 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-main)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                        <img
                          src={example.imageUrl}
                          alt={`${example.name} wearing a hairstyle reference similar to ${result.recommendation}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                          <span className="border border-white/40 bg-black/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-sm">
                            Ref {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="border border-white/20 bg-black/35 p-2 text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            <ArrowUpRight size={14} strokeWidth={1.5} />
                          </span>
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                          <p className="text-lg font-medium tracking-[0.01em]">{example.name}</p>
                        </div>
                      </div>

                      <div className="border-t border-[var(--border-color)] px-4 py-4">
                        <p className="text-sm text-[var(--text-main)] leading-relaxed">
                          {example.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="p-8 md:p-10">
                <div className="space-y-4 max-w-2xl">
                  <div className="h-3 w-40 bg-[var(--border-color)]/70 animate-pulse" />
                  <div className="h-10 w-full max-w-lg bg-[var(--border-color)]/60 animate-pulse" />
                  <div className="h-5 w-full max-w-2xl bg-[var(--border-color)]/50 animate-pulse" />
                </div>
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="clinical-border overflow-hidden bg-[var(--surface)]/45"
                    >
                      <div className="aspect-[4/5] bg-[var(--border-color)]/55 animate-pulse" />
                      <div className="space-y-3 border-t border-[var(--border-color)] px-4 py-4">
                        <div className="h-4 w-32 bg-[var(--border-color)]/60 animate-pulse" />
                        <div className="h-4 w-full bg-[var(--border-color)]/50 animate-pulse" />
                        <div className="h-4 w-5/6 bg-[var(--border-color)]/50 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-[var(--text-muted)] bg-[var(--surface)]/20">
                Upload a portrait to get a hairstyle recommendation, celebrity haircut references, and a matching AI preview.
              </div>
            )}
          </section>

          <button
            type="button"
            disabled={isAnalyzing}
            onClick={() => {
              setImagePreview(null)
              setImageFrameAspectRatio(null)
              setResult(null)
              setErrorMessage(null)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
            className="group flex items-center justify-center gap-3 label-caps text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all duration-300 text-center w-full py-4 clinical-border clinical-bg hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-main)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
          >
            <RefreshCcw size={14} className="group-hover:-rotate-90 transition-transform duration-500" strokeWidth={1.5} />
            Reset Assessment
          </button>
        </div>
      )}
    </main>
  )
}
