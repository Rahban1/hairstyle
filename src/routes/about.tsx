import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  return (
    <main className="page-wrap px-4 py-16 md:py-24 min-h-screen max-w-4xl mx-auto flex flex-col items-center">
      <header className="text-center mb-16 max-w-3xl fade-in">
        <h1 className="text-3xl md:text-5xl lg:text-6xl mb-6 tracking-tight">
          Aesthetic Methodology
        </h1>
        <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed font-sans max-w-2xl mx-auto">
          The traditional paradigm of selecting hairstyles based on generic face shapes (e.g. oval, square, diamond) is demonstrably flawed and mathematically unspecific. Our system relies on four primary structural indices.
        </p>
      </header>
      
      <div className="w-full fade-in flex flex-col gap-12">
        <section className="clinical-border clinical-bg p-8 md:p-12">
          <h2 className="text-2xl mb-6 font-serif">1. Facial Thirds</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed font-sans max-w-3xl">
            The proportions of your upper, middle, and lower thirds dictate perceived attractiveness more than any other proportional feature. Exposing a compact third or covering a wider third corrects visual imbalances.
          </p>
        </section>

        <section className="clinical-border clinical-bg p-8 md:p-12">
          <h2 className="text-2xl mb-6 font-serif">2. Symmetrical Variance</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed font-sans max-w-3xl">
            Highly balanced faces can pull off symmetrical styles, while asymmetrical faces benefit from messy, textured, irregular volume to diffuse focus and prevent the eye from locking onto structural unevenness.
          </p>
        </section>

        <section className="clinical-border clinical-bg p-8 md:p-12">
          <h2 className="text-2xl mb-6 font-serif">3. Vertical Orientation</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed font-sans max-w-3xl">
            Long faces require horizontal emphasis (flat, side-swept), while short/compressed faces require vertical emphasis (volume on top) to create mathematical proportion.
          </p>
        </section>

        <section className="clinical-border clinical-bg p-8 md:p-12">
          <h2 className="text-2xl mb-6 font-serif">4. Jaw Projection</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed font-sans max-w-3xl">
            Angular, prominent jaws are beautifully highlighted by short buzz cuts, while softer jaws are better complemented by textured length.
          </p>
        </section>

        <div className="bg-[var(--text-main)] h-px w-full my-6 opacity-20"></div>
        
        <section className="text-center">
          <h2 className="text-xl md:text-2xl font-serif mb-4 text-[var(--text-main)]">Algorithmic Precision</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed font-sans max-w-2xl mx-auto">
            When a portrait is submitted, our vision models extract exact geometric proportions. By evaluating your features against these four criteria, we calculate the objectively optimal style to balance and enhance facial harmony. 
          </p>
        </section>
      </div>
    </main>
  )
}
