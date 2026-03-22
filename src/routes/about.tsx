import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  return (
    <main className="page-wrap px-4 py-16 md:py-24 min-h-screen max-w-4xl mx-auto flex flex-col items-center">
      <header className="text-center mb-16 max-w-3xl fade-in">
        <h1 className="text-3xl md:text-5xl lg:text-6xl mb-6 tracking-tight">
          How We Analyze Your Face
        </h1>
        <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed font-sans max-w-2xl mx-auto">
          Most hairstyle advice puts you in a box — oval, square, round. But your face is more complex than one word. Here's what we actually measure and why it matters for your hair.
        </p>
      </header>
      
      <div className="w-full fade-in flex flex-col gap-8 md:gap-12">
        <section className="clinical-border clinical-bg p-6 md:p-12">
          <h2 className="text-xl md:text-2xl mb-4 md:mb-6 font-serif">1. Face Proportions</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-sans max-w-3xl">
            We measure the balance between your forehead, nose, and chin. If your forehead is compact, styles that expose it work better. If it's larger, fringe or textured tops create balance. This is about creating visual harmony — not hiding features, but framing them right.
          </p>
        </section>

        <section className="clinical-border clinical-bg p-6 md:p-12">
          <h2 className="text-xl md:text-2xl mb-4 md:mb-6 font-serif">2. Symmetry</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-sans max-w-3xl">
            Perfectly symmetrical faces can pull off clean, structured styles. If your face has natural asymmetry (most do), messy or textured cuts actually work in your favor — they diffuse focus and create visual interest that complements your features.
          </p>
        </section>

        <section className="clinical-border clinical-bg p-6 md:p-12">
          <h2 className="text-xl md:text-2xl mb-4 md:mb-6 font-serif">3. Face Length</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-sans max-w-3xl">
            Long faces need styles that add width — think flat, side-swept looks. Shorter or compressed faces need height on top. It's about creating proportions that feel balanced, not stretched or squished.
          </p>
        </section>

        <section className="clinical-border clinical-bg p-6 md:p-12">
          <h2 className="text-xl md:text-2xl mb-4 md:mb-6 font-serif">4. Jawline</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-sans max-w-3xl">
            Strong, angular jaws look great with short, clean cuts that show them off. Softer jawlines are complemented by textured length that adds structure. Your jawline is often your best feature — the right cut either highlights it or gives you the structure you're looking for.
          </p>
        </section>

        <div className="bg-[var(--text-main)] h-px w-full my-6 opacity-20"></div>
        
        <section className="text-center">
          <h2 className="text-xl md:text-2xl font-serif mb-4 text-[var(--text-main)]">Why This Works</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed font-sans max-w-2xl mx-auto">
            When you upload a photo, our AI measures these four factors in seconds. Instead of putting you in a generic category, we look at your unique combination of features. The result? Advice that actually fits your face — not a template.
          </p>
        </section>
      </div>
    </main>
  )
}
