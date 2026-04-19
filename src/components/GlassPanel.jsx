import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BRANDS = ['VOICEFLOW', 'ZENDESK', 'PENDO', 'GLIDE', 'CANVA']

export default function GlassPanel() {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const wrapper = wrapperRef.current
    const panel = panelRef.current
    if (!container || !wrapper || !panel) return

    const slide = gsap.fromTo(
      wrapper,
      { y: '100%' },
      {
        y: '0%',
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      }
    )

    const onMouseMove = (e) => {
      const rect = panel.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const moveX = (e.clientX - cx) / (rect.width / 2)
      const moveY = (e.clientY - cy) / (rect.height / 2)
      gsap.to(panel, {
        x: moveX * 20,
        y: moveY * 20,
        rotationY: moveX * 4,
        rotationX: -moveY * 4,
        ease: 'power3.out',
        duration: 1,
      })
    }
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (slide.scrollTrigger) slide.scrollTrigger.kill()
      slide.kill()
    }
  }, [])

  const marqueeRow = (
    <div className="flex items-center gap-16 shrink-0 px-8">
      {BRANDS.map((brand, i) => (
        <span
          key={i}
          className="text-white opacity-40 hover:opacity-100 transition-opacity duration-300 uppercase font-sans font-semibold text-sm tracking-widest"
        >
          {brand}
        </span>
      ))}
    </div>
  )

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 w-full h-screen flex items-center justify-center px-4"
    >
      <div
        ref={wrapperRef}
        className="w-full max-w-[1250px] h-[900px] max-h-[85vh] pointer-events-auto"
        style={{ perspective: '1000px' }}
      >
        <div
          ref={panelRef}
          className="w-full h-full flex flex-col justify-between rounded-3xl relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.16)',
            backdropFilter: 'blur(160px)',
            WebkitBackdropFilter: 'blur(160px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center">
            <p className="font-serif italic text-white/70 text-base md:text-lg mb-4 md:mb-6">
              About Us
            </p>
            <h2 className="font-serif text-white text-4xl md:text-6xl lg:text-[96px] leading-[1.1] lg:leading-[92.6px] tracking-tight w-full max-w-[1000px] mx-auto">
              We transform sterile concrete into thriving{' '}
              <span className="italic">urban</span> jungles. Our innovative designs bring wild{' '}
              <span className="italic">nature</span> back to modern cities. Experience the{' '}
              <span className="italic">bloom</span>
            </h2>
          </div>

          <div className="border-t border-white/10 py-6 overflow-hidden">
            <div className="flex w-max animate-marquee">
              {marqueeRow}
              {marqueeRow}
              {marqueeRow}
              {marqueeRow}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
