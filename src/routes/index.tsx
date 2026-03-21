import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { analyzeFaceFn } from '../functions/analyzeFace'
import { createRazorpayOrderFn } from '../functions/razorpay'
import { Upload, Activity, Crosshair, RefreshCcw, CheckCircle2, Lock, Loader2, Maximize2, X, Download } from 'lucide-react'
import { ActorReferencesGrid } from '../components/ActorReferences'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [base64Image, setBase64Image] = useState<string | null>(null)
  
  // Payment State
  const [isCheckout, setIsCheckout] = useState(false)
  const [isInitializingPayment, setIsInitializingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number>(8900) 
  const [paymentCurrency, setPaymentCurrency] = useState<string>('INR')
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [lastPaymentResponse, setLastPaymentResponse] = useState<any>(null)
  
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result as string
      setImagePreview(base64String)
      setBase64Image(base64String)
      setResult(null) 
      setPaymentError(null)
      setIsCheckout(true)
      setIsInitializingPayment(true)

      try {
        const data = await createRazorpayOrderFn()
        if (data.orderId) {
          setOrderId(data.orderId)
          setPaymentAmount(data.amount)
          setPaymentCurrency(data.currency)
        } else {
          setPaymentError("Gateway failed to generate an Order ID.")
        }
      } catch (err: any) {
        console.error("Failed to initialize payment:", err)
        setPaymentError(err?.message || "Payment gateway unavailable. Please contact support.")
      } finally {
        setIsInitializingPayment(false)
      }
    }
    reader.readAsDataURL(file)
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

  const displayRazorpay = async () => {
    const res = await loadRazorpayScript()

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount: paymentAmount.toString(),
      currency: paymentCurrency,
      name: 'Optimal Hair AI',
      description: 'Objective Facial Assessment - $1 (₹89)',
      image: 'https://cdn-icons-png.flaticon.com/512/10041/10041432.png',
      order_id: orderId,
      handler: function (response: any) {
        // Only trigger analysis upon successful completion of payment
        triggerAnalysis(response)
      },
      prefill: {
        name: 'Guest User',
        email: 'guest@example.com',
      },
      notes: {
        address: 'Optimal Hair AI HQ',
      },
      theme: {
        color: '#111111', 
      },
    }

    const paymentObject = new (window as any).Razorpay(options)
    paymentObject.on('payment.failed', function (response: any) {
      alert(`Payment failed: ${response.error.description}`)
    })
    paymentObject.open()
  }

  const triggerAnalysis = async (paymentResponse: any) => {
    if (!base64Image) return
    setIsCheckout(false)
    setIsAnalyzing(true)
    setLastPaymentResponse(paymentResponse)
    
    try {
      // Send the image ALONG WITH the cryptographically signed payment token
      const data = await analyzeFaceFn({ 
        data: { 
          base64Image,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature
        } 
      })
      setResult(data)
    } catch (err: any) {
      console.error("Analysis or Payment Verification failed:", err)
      alert(err.message || "Payment Verification Failed. Unauthorized Request.")
      resetAssessment()
    } finally {
      setIsAnalyzing(false)
    }
  }

  const retryAnalysis = async () => {
    if (!lastPaymentResponse) return
    setIsAnalyzing(true)
    
    try {
      const data = await analyzeFaceFn({ 
        data: { 
          base64Image,
          razorpay_payment_id: lastPaymentResponse.razorpay_payment_id,
          razorpay_order_id: lastPaymentResponse.razorpay_order_id,
          razorpay_signature: lastPaymentResponse.razorpay_signature
        } 
      })
      setResult(data)
    } catch (err: any) {
      console.error("Retry failed:", err)
      alert(err.message || "Analysis failed. Please try again from the beginning.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAssessment = () => {
    setImagePreview(null)
    setBase64Image(null)
    setResult(null)
    setIsCheckout(false)
    setOrderId(null)
    setPaymentError(null)
    setIsFullscreen(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `optimal-hair-ai-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error("Download failed, opening in new tab instead", err)
      window.open(url, '_blank')
    }
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

      {/* UPLOAD STATE */}
      {!imagePreview && (
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          aria-label="Upload portrait for facial analysis"
          className={`w-full max-w-2xl border p-10 sm:p-16 md:p-24 text-center transition-all duration-300 ease-out cursor-pointer group fade-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-main)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg-base)] ${
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
                {isDragging ? 'Drop Image Here' : 'Submit Portrait'}
              </span>
              <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
                Drag and drop, or click to browse. Ensure the face is clearly visible with neutral lighting.
              </p>
            </div>
          </div>
        </button>
      )}

      {/* ANALYSIS STATE */}
      {imagePreview && (
        <div className="w-full fade-in grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mt-4">
          
          {/* LEFT: IMAGE SUBJECT */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:sticky lg:top-24">
            <div className="w-full clinical-border p-2 bg-[var(--surface)] relative group">
              <div className="relative overflow-hidden w-full bg-black/5 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                <img 
                  src={imagePreview} 
                  alt="Portrait subject awaiting analysis" 
                  className={`w-full max-h-[50vh] lg:max-h-[70vh] object-contain grayscale-[20%] contrast-125 transition-transform duration-700 ease-out ${isCheckout ? 'blur-sm scale-105' : ''}`}
                />
                
                {/* CHECKOUT OVERLAY (BLUR) */}
                {isCheckout && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-white z-10 transition-all duration-500 ease-in-out">
                    <Lock size={48} strokeWidth={1} className="opacity-70" />
                  </div>
                )}

                {/* SCANNING OVERLAY */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-[var(--bg-base)]/80 backdrop-blur-sm flex flex-col items-center justify-center border border-[var(--border-color)] m-2 z-10 transition-all duration-500 ease-in-out">
                    <Activity className="animate-pulse mb-6 text-[var(--text-main)]" size={32} strokeWidth={1.5} />
                    <span className="label-caps tracking-[0.2em] text-[var(--text-main)] animate-pulse">
                      Analyzing Proportions
                    </span>
                    <div className="mt-8 w-48 h-px bg-[var(--border-color)] overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full bg-[var(--text-main)] w-1/3 animate-[pulse_1.5s_ease-in-out_infinite]" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="button"
              disabled={isAnalyzing}
              onClick={resetAssessment}
              className="group flex items-center justify-center gap-3 label-caps text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all duration-300 text-center w-full py-4 clinical-border clinical-bg hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-main)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
            >
              <RefreshCcw size={14} className="group-hover:-rotate-90 transition-transform duration-500" strokeWidth={1.5} />
              Reset Assessment
            </button>
          </div>

          {/* RIGHT: DATA & RESULTS */}
          <div className="flex flex-col h-full w-full gap-6 md:gap-8 mt-2 lg:mt-0">
            
            {/* CHECKOUT STATE */}
            {isCheckout && (
              <div className="fade-in flex flex-col items-center justify-center clinical-border bg-[var(--surface)]/50 p-6 sm:p-8 min-h-[300px] md:min-h-[400px] h-full">
                <div className="w-full max-w-sm flex flex-col gap-6">
                  <header className="text-center border-b border-[var(--border-color)] pb-6 mb-4">
                    <Lock size={28} strokeWidth={1} className="mx-auto mb-4 text-[var(--text-main)]" />
                    <h2 className="text-2xl font-serif text-[var(--text-main)] mb-2">Unlock Assessment</h2>
                    <p className="text-sm text-[var(--text-muted)]">A ₹89 INR charge (≈$1.00 USD) is required to initialize the computational algorithms.</p>
                  </header>

                  {isInitializingPayment && (
                    <div className="py-12 flex flex-col items-center justify-center gap-4">
                      <Loader2 size={24} className="animate-spin text-[var(--text-muted)]" />
                      <span className="label-caps opacity-60">Connecting to Gateway...</span>
                    </div>
                  )}

                  {!isInitializingPayment && paymentError && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 border border-[var(--error)] bg-[var(--error)]/10 text-[var(--error)] text-xs rounded-none text-center leading-relaxed font-medium">
                        <p className="font-bold uppercase tracking-wider mb-2 text-[10px]">Payment System Offline</p>
                        <p>{paymentError}</p>
                      </div>
                    </div>
                  )}

                  {!isInitializingPayment && !paymentError && orderId && (
                    <div className="fade-in">
                      <button 
                        onClick={displayRazorpay}
                        className="w-full clinical-button bg-[var(--text-main)] text-[var(--bg-base)] py-4 hover:opacity-80 transition-opacity flex items-center justify-center gap-3"
                      >
                        <Lock size={16} strokeWidth={1.5} />
                        Pay with Razorpay (₹89)
                      </button>
                      <p className="text-center text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-4">
                        100% Secure Checkout. Supports UPI, Cards, NetBanking.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ANALYZING STATE */}
            {isAnalyzing && (
              <div className="h-full min-h-[400px] clinical-border p-8 flex flex-col gap-10 justify-center bg-[var(--surface)]/30">
                {[
                  'Extracting facial thirds', 
                  'Mapping symmetrical variance', 
                  'Measuring vertical orientation', 
                  'Calculating jaw projection',
                  'Cryptographic payment verified'
                ].map((step, idx) => (
                  <div key={idx} className="w-full relative">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-xs uppercase tracking-wider text-[var(--text-main)] font-medium opacity-80">{step}</span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono animate-pulse">
                        {idx === 4 ? "Verified" : "Processing"}
                      </span>
                    </div>
                    <div className="h-px w-full bg-[var(--border-color)] overflow-hidden relative">
                       <div 
                         className="absolute top-0 left-0 h-full bg-[var(--text-main)] transition-all duration-[2000ms] ease-out" 
                         style={{ 
                           width: idx === 4 ? '100%' : '100%', 
                           transformOrigin: 'left',
                           animation: idx === 4 ? 'none' : `scaleX 2s ease-out infinite alternate`,
                           animationDelay: `${idx * 0.2}s`
                         }}
                       />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RESULT STATE */}
            {result && !isAnalyzing && !isCheckout && (
              <div className="fade-in flex flex-col gap-8">
                {/* Protocol section */}
                <section className="clinical-border bg-[var(--bg-base)] overflow-hidden group">
                  <div className="p-4 border-b border-[var(--border-color)] clinical-bg flex items-center gap-3">
                    <CheckCircle2 size={16} strokeWidth={1.5} className="text-[var(--text-main)]" />
                    <span className="label-caps text-[var(--text-main)]">Aesthetic Protocol</span>
                  </div>
                  <div className="p-6 md:p-8 lg:p-10 transition-colors duration-500 hover:bg-[var(--surface)]/50">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-5 leading-snug font-serif text-[var(--text-main)]">
                      {result.recommendation}
                    </h2>
                    <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                      {result.explanation}
                    </p>
                  </div>
                </section>

                {/* Metrics Table */}
                <section className="clinical-border bg-[var(--bg-base)]">
                  <div className="p-4 border-b border-[var(--border-color)] clinical-bg">
                    <span className="label-caps">Geometric Markers</span>
                  </div>
                  <div className="px-4 sm:px-6 md:px-8 py-2">
                    <div className="metric-row group">
                      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-main)]">Upper Third</span>
                      <span className="font-serif text-[var(--text-main)] capitalize text-right text-sm sm:text-base">
                        {result.analysis.upperThird.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="metric-row group">
                      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-main)]">Symmetry</span>
                      <span className="font-serif text-[var(--text-main)] capitalize text-right text-sm sm:text-base">
                        {result.analysis.symmetry}
                      </span>
                    </div>
                    <div className="metric-row group">
                      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-main)]">Vertical Axis</span>
                      <span className="font-serif text-[var(--text-main)] capitalize text-right text-sm sm:text-base">
                        {result.analysis.verticalLength}
                      </span>
                    </div>
                    <div className="metric-row group border-b-0">
                      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-main)]">Jaw Structure</span>
                      <span className="font-serif text-[var(--text-main)] capitalize text-right text-sm sm:text-base">
                        {result.analysis.jawProjection.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Simulated Output */}
                <section className="clinical-border flex flex-col bg-[var(--bg-base)]">
                  <div className="p-4 border-b border-[var(--border-color)] clinical-bg flex justify-between items-center">
                    <span className="label-caps">Simulated Outcome</span>
                    {result.generatedImageUrl && (
                      <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Generated
                      </span>
                    )}
                  </div>
                  <div className="p-6 md:p-8 text-center bg-[var(--surface)]/30">
                    {result.generatedImageUrl ? (
                      <div 
                        onClick={() => setIsFullscreen(true)}
                        className="overflow-hidden clinical-border bg-[var(--surface)] relative group cursor-pointer"
                      >
                        <img 
                          src={result.generatedImageUrl} 
                          alt="AI simulated outcome" 
                          className="w-full h-auto grayscale-[10%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 ease-out flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out flex items-center gap-2 bg-white text-black px-4 py-2 rounded-sm text-xs uppercase tracking-widest font-semibold">
                            <Maximize2 size={14} /> View Protocol
                          </div>
                        </div>
                      </div>
                    ) : result.generatedImageError ? (
                      <div className="py-12 flex flex-col items-center gap-4">
                        <div className="p-3 rounded-full bg-[var(--surface)] border border-[var(--border-color)]">
                          <Crosshair size={20} strokeWidth={1.5} className="text-[var(--text-muted)] opacity-60" />
                        </div>
                        <p className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed">
                          {result.generatedImageError}
                        </p>
                        <button 
                          onClick={retryAnalysis}
                          disabled={isAnalyzing}
                          className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--text-main)] hover:text-[var(--text-muted)] transition-colors disabled:opacity-50"
                        >
                          <RefreshCcw size={12} className={isAnalyzing ? 'animate-spin' : ''} />
                          {isAnalyzing ? 'Retrying...' : 'Try Again'}
                        </button>
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center gap-4">
                        <div className="p-3 rounded-full bg-[var(--surface)] border border-[var(--border-color)]">
                          <Crosshair size={20} strokeWidth={1.5} className="text-[var(--text-muted)] opacity-60" />
                        </div>
                        <p className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed">
                          Premium diffusion rendering requires active API connection. Add your configuration to generate the final simulation.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Actor Reference Examples */}
                {result.referenceExamples && result.referenceExamples.length > 0 && (
                  <ActorReferencesGrid examples={result.referenceExamples} />
                )}

              </div>
            )}
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE MODAL */}
      {isFullscreen && result?.generatedImageUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 fade-in cursor-default"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Top Actions */}
          <div className="absolute top-0 right-0 w-full p-6 flex justify-end gap-4 z-50">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleDownload(result.generatedImageUrl)
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-sm transition-colors text-xs uppercase tracking-widest font-medium border border-white/20"
            >
              <Download size={16} /> Save Image
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setIsFullscreen(false)
              }}
              className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-sm transition-colors border border-white/20"
              aria-label="Close Fullscreen"
            >
              <X size={20} />
            </button>
          </div>

          {/* Expanded Image */}
          <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <img 
              src={result.generatedImageUrl} 
              alt="Expanded Simulated Outcome" 
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm ring-1 ring-white/10"
            />
          </div>
          
          <p className="absolute bottom-8 text-white/50 text-xs uppercase tracking-[0.2em] font-medium animate-pulse">
            Optimal Hair Protocol Generated
          </p>
        </div>
      )}

    </main>
  )
}
