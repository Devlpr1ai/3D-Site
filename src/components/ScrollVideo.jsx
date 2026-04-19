import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollVideo({ src, className = '' }) {
  const videoRef = useRef(null)
  const wrapperRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const isHls = /\.m3u8(\?|$)/i.test(src || '')

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    let hls = null
    let scrollTriggerInstance = null
    let currentTarget = 0
    let seekPending = false
    let cancelled = false

    const markLoaded = () => {
      if (!cancelled) setLoaded(true)
    }

    const doSeek = () => {
      if (!video) return
      if (video.seeking) {
        seekPending = true
        return
      }
      seekPending = false
      try {
        video.currentTime = currentTarget
      } catch (e) {
        // ignore
      }
    }

    const onSeeked = () => {
      if (seekPending) doSeek()
    }

    const setupScrollTrigger = () => {
      if (cancelled || scrollTriggerInstance) return
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const duration = video.duration
          if (!duration || isNaN(duration)) return
          currentTarget = self.progress * duration
          doSeek()
        },
      })
      const duration = video.duration
      if (duration && !isNaN(duration)) {
        const initialProgress = scrollTriggerInstance.progress || 0
        currentTarget = Math.max(0.001, initialProgress * duration)
        doSeek()
      }
    }

    const onProgress = () => {
      const duration = video.duration
      if (!duration || isNaN(duration)) return
      const buffered = video.buffered
      if (buffered.length > 0) {
        const bufferedEnd = buffered.end(buffered.length - 1)
        const pct = Math.min(100, (bufferedEnd / duration) * 100)
        setProgress(Math.floor(pct))
      }
    }

    const onLoadedMetadata = () => {
      setupScrollTrigger()
      if (video.readyState >= 2) markLoaded()
    }

    const onError = () => {
      console.error('[ScrollVideo] video error', video.error)
    }

    if (isHls && Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 120,
        maxMaxBufferLength: 600,
        maxBufferSize: 200 * 1024 * 1024,
        startPosition: 0,
        capLevelToPlayerSize: false,
        startLevel: -1,
        autoStartLoad: true,
      })

      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const maxLevel = hls.levels.length - 1
        hls.currentLevel = maxLevel
        hls.startLevel = maxLevel
        setupScrollTrigger()
      })

      hls.on(Hls.Events.FRAG_BUFFERED, onProgress)
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('progress', onProgress)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('canplay', markLoaded)
    video.addEventListener('canplaythrough', markLoaded)
    video.addEventListener('loadeddata', markLoaded)
    video.addEventListener('error', onError)

    if (video.readyState >= 2) {
      onLoadedMetadata()
    }

    const safetyTimer = setTimeout(() => {
      if (!cancelled) markLoaded()
    }, 2000)

    const wrapper = wrapperRef.current
    const onMouseMove = (e) => {
      if (!wrapper) return
      const { innerWidth, innerHeight } = window
      const moveX = (e.clientX - innerWidth / 2) / (innerWidth / 2)
      const moveY = (e.clientY - innerHeight / 2) / (innerHeight / 2)
      gsap.to(wrapper, {
        x: moveX * -30,
        y: moveY * -30,
        duration: 1.5,
        ease: 'power2.out',
      })
    }
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelled = true
      clearTimeout(safetyTimer)
      window.removeEventListener('mousemove', onMouseMove)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('progress', onProgress)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('canplay', markLoaded)
      video.removeEventListener('canplaythrough', markLoaded)
      video.removeEventListener('loadeddata', markLoaded)
      video.removeEventListener('error', onError)
      if (scrollTriggerInstance) scrollTriggerInstance.kill()
      if (hls) hls.destroy()
    }
  }, [src, isHls])

  return (
    <>
      {!loaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white text-2xl font-sans">
          Loading... {progress}%
        </div>
      )}
      <div
        ref={wrapperRef}
        className="fixed top-0 left-0 w-full h-full z-0 scale-[1.05] origin-center"
      >
        <video
          ref={videoRef}
          className={`w-full h-full object-cover scale-[1.35] ${className}`}
          muted
          playsInline
          preload="auto"
          src={isHls ? undefined : src}
          {...(isHls ? { crossOrigin: 'anonymous' } : {})}
        />
      </div>
    </>
  )
}
