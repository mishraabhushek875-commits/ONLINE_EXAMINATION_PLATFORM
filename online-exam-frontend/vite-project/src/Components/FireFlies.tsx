'use client'

import { useEffect, useRef } from 'react'

const COLORS = [
  { color: '#ff2200', shadow: '0 0 6px #ff2200, 0 0 12px #ff4400' },
  { color: '#0055ff', shadow: '0 0 6px #0055ff, 0 0 12px #2277ff' },
  { color: '#00cc44', shadow: '0 0 6px #00cc44, 0 0 12px #00ff55' },
  { color: '#ff8c00', shadow: '0 0 6px #ff8c00, 0 0 12px #ffaa00' },
]

export default function FirefliesBackground({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const timeouts: ReturnType<typeof setTimeout>[] = []

    function createFirefly() {
      if (!container) return
      const el = document.createElement('div')

      const c = COLORS[Math.floor(Math.random() * COLORS.length)]
      const size = Math.random() * 4 + 2
      const startX = Math.random() * 100
      const startY = Math.random() * 100
      const tx = (Math.random() - 0.5) * 200
      const ty = (Math.random() - 0.5) * 200
      const duration = Math.random() * 5 + 4
      const delay = Math.random() * 5

      el.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        background: ${c.color};
        box-shadow: ${c.shadow};
        left: ${startX}%;
        top: ${startY}%;
        filter: blur(1px);
        animation: firefly-float ${duration}s ${delay}s linear forwards;
        --tx: ${tx}px;
        --ty: ${ty}px;
        pointer-events: none;
      `

      container.appendChild(el)

      const t = setTimeout(() => {
        el.remove()
        createFirefly()
      }, (duration + delay) * 1000)

      timeouts.push(t)
    }

    for (let i = 0; i < 60; i++) createFirefly()

    return () => {
      timeouts.forEach(clearTimeout)
      container.querySelectorAll('div').forEach(el => el.remove())
    }
  }, [])

  return (
    <>
      {/* Fireflies fixed background */}
      <div
        ref={containerRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}
      />

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </>
  )
}