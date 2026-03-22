import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Sparkles, ArrowRight, Scan, Shield, Zap, ChevronDown } from 'lucide-react'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="relative overflow-hidden bg-[var(--bg-base)]">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--text-main) 1px, transparent 1px),
              linear-gradient(90deg, var(--text-main) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate(${(mousePos.x - 0.5) * -10}px, ${(mousePos.y - 0.5) * -10}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 pt-24"
      >
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-8 md:left-16 w-px h-32 bg-gradient-to-b from-transparent via-[var(--border-color)] to-transparent opacity-50" />
        <div className="absolute bottom-1/4 right-8 md:right-16 w-px h-32 bg-gradient-to-b from-transparent via-[var(--border-color)] to-transparent opacity-50" />
        
        {/* Floating Badge */}
        <div className="absolute top-32 right-8 md:right-24 animate-float hidden lg:block">
          <div className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] bg-[var(--bg-base)]/80 backdrop-blur-sm">
            <Sparkles size={14} className="text-[var(--text-main)]" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)]">AI Powered</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Overline */}
          <div className="inline-flex items-center gap-3 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <div className="w-12 h-px bg-[var(--text-main)]" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)]">Facial Geometry Analysis</span>
            <div className="w-12 h-px bg-[var(--text-main)]" />
          </div>

          {/* Headline */}
           <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] tracking-tight mb-8 text-[var(--text-main)] opacity-0 animate-fade-in-up text-balance" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
             <span className="block">Stop Guessing</span>
             <span className="block italic text-[var(--text-muted)]">Start Knowing</span>
             <span className="block">Your Best Hair</span>
           </h1>

          {/* Subhead */}
          <p className="max-w-xl mx-auto text-sm md:text-base text-[var(--text-muted)] leading-relaxed mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            Upload a photo. Our AI analyzes 4 key facial markers — your proportions, symmetry, face length, and jaw structure. Get a personalized style recommendation based on what actually works for your face. Not generic face shape charts.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <Link
              to="/analyze"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[var(--text-main)] text-[var(--bg-base)] text-xs tracking-[0.2em] uppercase font-medium overflow-hidden transition-[transform,box-shadow] duration-500 hover:shadow-2xl"
            >
              <span className="relative z-10">Analyze My Face</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-[var(--text-muted)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
            
            <button 
              onClick={scrollToFeatures}
              className="inline-flex items-center gap-2 px-6 py-4 text-xs tracking-[0.15em] uppercase text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors duration-300"
            >
              How It Works
              <ChevronDown size={14} className="animate-bounce" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[var(--text-muted)] to-transparent" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-20 md:mb-32">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] block mb-4">How It Works</span>
           <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-main)] max-w-3xl text-pretty">
               Your personalized analysis in <span className="italic">3 simple steps</span>
             </h2>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-color)]">
            {[
              {
                icon: Scan,
                number: '01',
                title: 'Snap & Upload',
                description: 'Take a clear front-facing photo. Neutral lighting works best — just like a passport photo.'
              },
              {
                icon: Shield,
                number: '02',
                title: 'Secure Payment',
                description: 'One-time fee of ₹89 (about $1 USD). We never store your photos. Your privacy matters.'
              },
              {
                icon: Zap,
                number: '03',
                title: 'Get Your Report',
                description: 'Receive your personalized hairstyle recommendation with celebrity examples you can show your barber.'
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group relative bg-[var(--bg-base)] p-8 md:p-12 transition-[background-color] duration-500 hover:bg-[var(--surface)]"
              >
                {/* Number */}
                <span className="absolute top-8 right-8 text-6xl font-serif text-[var(--border-color)] group-hover:text-[var(--text-muted)] transition-colors duration-500">
                  {feature.number}
                </span>
                
                {/* Icon */}
                <div className="mb-8">
                  <feature.icon size={28} strokeWidth={1} className="text-[var(--text-main)]" />
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl md:text-2xl mb-4 text-[var(--text-main)]">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 w-0 h-px bg-[var(--text-main)] group-hover:w-full transition-[width] duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section id="method" className="relative py-32 md:py-48 px-6 md:px-12 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Left Content */}
            <div>
              <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] block mb-4">The Science</span>
           <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-main)] mb-8 text-pretty">
                 Why generic advice <span className="italic">lets you down</span>
               </h2>
              <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
                <p>
                  You've seen the charts — "oval faces should try this, square faces should try that." But your face is more than a shape. It's a unique combination of proportions that no category can capture.
                </p>
                <p>
                  We analyze four measurements that actually matter: the balance between your forehead, nose, and chin; how symmetrical your features are; whether your face is longer or wider; and the angle of your jawline. These four factors determine which styles will enhance your natural structure and which will fight against it.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-[var(--border-color)]">
                {[
                  { value: '4', label: 'Key Measurements' },
                  { value: '<1s', label: 'Analysis Time' },
                  { value: '100%', label: 'Personalized' }
                ].map((stat, idx) => (
                  <div key={idx}>
                    <div className="font-serif text-3xl md:text-4xl text-[var(--text-main)] mb-2">
                      {stat.value}
                    </div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="aspect-[4/5] bg-[var(--bg-base)] border border-[var(--border-color)] relative overflow-hidden">
                {/* Geometric Overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 500">
                  <line x1="200" y1="0" x2="200" y2="500" stroke="var(--text-main)" strokeWidth="1" />
                  <line x1="0" y1="166" x2="400" y2="166" stroke="var(--text-main)" strokeWidth="1" />
                  <line x1="0" y1="333" x2="400" y2="333" stroke="var(--text-main)" strokeWidth="1" />
                  <ellipse cx="200" cy="250" rx="150" ry="200" fill="none" stroke="var(--text-main)" strokeWidth="1" />
                </svg>
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full border border-[var(--border-color)] flex items-center justify-center">
                      <Scan size={32} strokeWidth={1} className="text-[var(--text-main)]" />
                    </div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] max-w-xs mx-auto">
                      Facial geometry visualization
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Element */}
              <div className="absolute -bottom-6 -left-6 bg-[var(--text-main)] text-[var(--bg-base)] p-6 max-w-xs">
                <p className="text-xs leading-relaxed">
                  "Finally, advice that actually makes sense for my face. Showed the results to my barber and got the best haircut of my life."
                </p>
                <p className="text-[10px] tracking-[0.15em] uppercase mt-4 opacity-60">
                  — Rahul, Bangalore
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] block mb-6">Ready to see your best look?</span>
           <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl text-[var(--text-main)] mb-8 text-balance">
             One photo. One dollar. <span className="italic">Zero regret</span>
           </h2>
          <p className="text-[var(--text-muted)] mb-12 max-w-lg mx-auto">
            Think about how much you've spent on haircuts that didn't work. For less than the cost of a coffee, get a recommendation you can use for years.
          </p>
          
          <Link
            to="/analyze"
            className="group inline-flex items-center gap-4 px-10 py-5 bg-[var(--text-main)] text-[var(--bg-base)] text-xs tracking-[0.2em] uppercase font-medium overflow-hidden transition-[transform,box-shadow] duration-500 hover:shadow-2xl"
          >
            <span>Start Analysis</span>
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>

          <p className="mt-8 text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)]">
            89 INR One-Time Payment
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 md:px-12 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[var(--text-muted)] text-xs tracking-[0.15em] uppercase">
            © 2024 Optimal Hair AI
          </div>
          <div className="flex items-center gap-8 text-[10px] tracking-[0.15em] uppercase text-[var(--text-muted)]">
            <Link to="/about" className="hover:text-[var(--text-main)] transition-colors">Methodology</Link>
            <Link to="/analyze" className="hover:text-[var(--text-main)] transition-colors">Assessment</Link>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}
