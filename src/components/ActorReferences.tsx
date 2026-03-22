import { useState } from 'react'
import type { RecommendedStyleExample } from '../domain/faceAnalysis'

interface ActorReferenceCardProps {
  example: RecommendedStyleExample
}

export function ActorReferenceCard({ example }: ActorReferenceCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (imageError) {
    return (
      <div className="clinical-border bg-[var(--surface)]/50 p-4 flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="p-3 rounded-full bg-[var(--bg-base)] border border-[var(--border-color)] mb-3">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            className="text-[var(--text-muted)]"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          {example.name}
        </p>
        <p className="text-[10px] text-[var(--text-muted)] mt-1">
          {example.description}
        </p>
      </div>
    )
  }

  return (
    <a 
      href={example.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="clinical-border bg-[var(--surface)] overflow-hidden group block hover:border-[var(--text-main)] transition-colors"
    >
      <div className="aspect-[3/4] bg-[var(--bg-base)] relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]">
            <div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[var(--text-main)] rounded-full animate-spin" />
          </div>
        )}
        <img 
          src={example.imageUrl}
          alt={`${example.name} - ${example.description}`}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          width="300"
          height="400"
          onError={() => setImageError(true)}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
        />
      </div>
      <div className="p-3 border-t border-[var(--border-color)]">
        <p className="text-xs font-medium text-[var(--text-main)] truncate">
          {example.name}
        </p>
        <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
          {example.description}
        </p>
      </div>
    </a>
  )
}

interface ActorReferencesGridProps {
  examples: RecommendedStyleExample[]
}

export function ActorReferencesGrid({ examples }: ActorReferencesGridProps) {
  if (!examples || examples.length === 0) return null

  return (
    <section className="clinical-border bg-[var(--bg-base)] overflow-hidden">
      <div className="p-4 border-b border-[var(--border-color)] clinical-bg">
        <span className="label-caps">Reference Examples</span>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {examples.slice(0, 3).map((example, index) => (
            <ActorReferenceCard key={index} example={example} />
          ))}
        </div>
        <p className="text-[10px] text-[var(--text-muted)] text-center mt-4 uppercase tracking-wider">
          Click any image to view source
        </p>
      </div>
    </section>
  )
}
