import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollFloat.css'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollFloat({ children }) {
  const containerRef = useRef(null)

  const text = typeof children === 'string' ? children : ''
  const lines = text.split('\n')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chars = container.querySelectorAll('.char')
    if (!chars.length) return

    const tween = gsap.fromTo(
      chars,
      {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        transformOrigin: '50% 0%',
      },
      {
        opacity: 0,
        yPercent: 250,
        scaleY: 1.2,
        scaleX: 0.9,
        stagger: 0.05,
        ease: 'power2.inOut',
        duration: 1,
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=1000',
          scrub: 1.5,
        },
      }
    )

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill()
      tween.kill()
    }
  }, [text])

  return (
    <div
      ref={containerRef}
      className="scroll-float-text font-dirtyline text-white"
      style={{
        fontSize: 'clamp(4rem, 15vw, 317px)',
        lineHeight: 0.85,
        letterSpacing: '0%',
      }}
    >
      {lines.map((line, li) => {
        const words = line.split(' ')
        return (
          <span key={li} style={{ display: 'block' }}>
            {words.map((word, wi) => (
              <span key={wi}>
                <span
                  style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                >
                  {Array.from(word).map((ch, ci) => (
                    <span key={ci} className="char">
                      {ch}
                    </span>
                  ))}
                </span>
                {wi < words.length - 1 && (
                  <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />
                )}
              </span>
            ))}
          </span>
        )
      })}
    </div>
  )
}
