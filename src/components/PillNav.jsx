import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import './PillNav.css'

gsap.registerPlugin(ScrollToPlugin)

const ITEMS = [
  { label: 'HOME', action: 'home' },
  { label: 'ABOUT', action: 'about' },
  { label: 'SERVICES', action: 'services' },
  { label: 'CONTACT', action: 'contact' },
]

function PillItem({ label, onClick }) {
  const pillRef = useRef(null)
  const circleRef = useRef(null)
  const labelRef = useRef(null)
  const labelHoverRef = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => {
    const pill = pillRef.current
    const circle = circleRef.current
    const lbl = labelRef.current
    const lblH = labelHoverRef.current
    if (!pill || !circle) return

    const layout = () => {
      const w = pill.offsetWidth
      const h = pill.offsetHeight
      const R = (w * w / 4 + h * h) / (2 * h)
      const D = 2 * R + 2
      const delta = R - Math.sqrt(R * R - w * w / 4) + 1
      circle.style.width = `${D}px`
      circle.style.height = `${D}px`
      circle.style.bottom = `-${delta}px`
      circle.style.left = '50%'
      circle.style.marginLeft = `-${R + 1}px`
      circle.style.transformOrigin = `50% ${D - delta}px`

      const tl = gsap.timeline({ paused: true })
      tl.to(circle, { scale: 3, duration: 0.5, ease: 'power2.out' }, 0)
      tl.to(lbl, { yPercent: -100, duration: 0.5, ease: 'power2.out' }, 0)
      tl.fromTo(
        lblH,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.5, ease: 'power2.out' },
        0
      )
      tlRef.current = tl
    }

    layout()
    window.addEventListener('resize', layout)
    return () => window.removeEventListener('resize', layout)
  }, [])

  const onEnter = () => {
    const tl = tlRef.current
    if (!tl) return
    gsap.to(tl, { time: tl.duration(), duration: 0.3, ease: 'power2.out', overwrite: true })
  }
  const onLeave = () => {
    const tl = tlRef.current
    if (!tl) return
    gsap.to(tl, { time: 0, duration: 0.2, ease: 'power2.out', overwrite: true })
  }

  return (
    <li>
      <button
        ref={pillRef}
        className="pill"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        <span ref={circleRef} className="hover-circle" />
        <span className="label-stack">
          <span ref={labelRef} className="pill-label">{label}</span>
          <span ref={labelHoverRef} className="pill-label-hover" style={{ transform: 'translateY(100%)' }}>{label}</span>
        </span>
      </button>
    </li>
  )
}

export default function PillNav() {
  const logoRef = useRef(null)
  const itemsRef = useRef(null)
  const logoSvgRef = useRef(null)
  const popoverRef = useRef(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const logo = logoRef.current
    const items = itemsRef.current
    if (logo) {
      gsap.fromTo(logo, { scale: 0 }, { scale: 1, duration: 0.6, ease: 'power3.out' })
    }
    if (items) {
      gsap.fromTo(
        items,
        { width: 0 },
        { width: 'auto', duration: 0.6, ease: 'power3.out' }
      )
    }
  }, [])

  useEffect(() => {
    const pop = popoverRef.current
    if (!pop) return
    if (mobileOpen) {
      pop.style.visibility = 'visible'
      gsap.fromTo(
        pop,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      )
    } else {
      gsap.to(pop, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          pop.style.visibility = 'hidden'
        },
      })
    }
  }, [mobileOpen])

  const onLogoEnter = () => {
    if (!logoSvgRef.current) return
    gsap.to(logoSvgRef.current, { rotate: 360, duration: 0.2, ease: 'power2.out' })
  }
  const onLogoLeave = () => {
    if (!logoSvgRef.current) return
    gsap.set(logoSvgRef.current, { rotate: 0 })
  }

  const handleAction = (action) => {
    if (action === 'home') {
      gsap.to(window, { duration: 3, scrollTo: 0, ease: 'power3.inOut' })
    } else if (action === 'about') {
      gsap.to(window, {
        duration: 3,
        scrollTo: document.body.scrollHeight,
        ease: 'power3.inOut',
      })
    }
    setMobileOpen(false)
  }

  const LogoSVG = (
    <svg
      ref={logoSvgRef}
      width="24"
      height="24"
      viewBox="0 0 100 100"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m50,50c0,18.2,14.77,32.98,32.97,32.98,0-18.2-14.77-32.98-32.97-32.98Z" />
      <path d="m17.02,82.98c18.2,0,32.98-14.77,32.98-32.98-18.2,0-32.98,14.77-32.98,32.98Z" />
      <path d="m82.98,17.02c-18.2,0-32.97,14.77-32.97,32.97,18.2,0,32.97-14.77,32.97-32.97Z" />
      <path d="m17.02,17.02c0,18.2,14.77,32.97,32.98,32.97,0-18.2-14.77-32.97-32.98-32.97Z" />
    </svg>
  )

  return (
    <div className="pill-nav-container">
      <nav className="pill-nav">
        <button
          ref={logoRef}
          className="pill-logo"
          onMouseEnter={onLogoEnter}
          onMouseLeave={onLogoLeave}
          onClick={() => handleAction('home')}
          aria-label="Logo"
        >
          <span className="logo-svg-container">{LogoSVG}</span>
        </button>

        <div ref={itemsRef} className="pill-nav-items desktop-only">
          <ul className="pill-list">
            {ITEMS.map((item) => (
              <PillItem
                key={item.label}
                label={item.label}
                onClick={() => handleAction(item.action)}
              />
            ))}
          </ul>
        </div>

        <div className="mobile-only" style={{ position: 'relative' }}>
          <button
            className="mobile-menu-button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <span
              className="hamburger-line"
              style={{
                transform: mobileOpen ? 'rotate(45deg) translateY(3px)' : 'none',
                transition: 'transform 0.25s ease',
              }}
            />
            <span
              className="hamburger-line"
              style={{
                transform: mobileOpen ? 'rotate(-45deg) translateY(-3px)' : 'none',
                transition: 'transform 0.25s ease',
              }}
            />
          </button>
          <div ref={popoverRef} className="mobile-menu-popover">
            <ul className="mobile-menu-list">
              {ITEMS.map((item) => (
                <li key={item.label}>
                  <button
                    className="mobile-menu-link"
                    onClick={() => handleAction(item.action)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
