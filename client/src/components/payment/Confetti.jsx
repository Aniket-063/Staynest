import { useEffect, useRef } from 'react'

const COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa']

function randomBetween(a, b) { return a + Math.random() * (b - a) }

export default function Confetti() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const pieces = Array.from({ length: 120 }, () => ({
      x:       randomBetween(0, canvas.width),
      y:       randomBetween(-canvas.height, 0),
      w:       randomBetween(6, 14),
      h:       randomBetween(8, 16),
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: randomBetween(0, Math.PI * 2),
      vx:      randomBetween(-1.5, 1.5),
      vy:      randomBetween(2, 5),
      vr:      randomBetween(-0.05, 0.05),
      opacity: randomBetween(0.7, 1),
    }))

    let animId
    let done = false
    const startTime = Date.now()

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let allGone = true

      for (const p of pieces) {
        p.x        += p.vx
        p.y        += p.vy
        p.rotation += p.vr
        if (p.y < canvas.height + 20) allGone = false

        ctx.save()
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle   = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }

      if (!allGone && Date.now() - startTime < 4000) {
        animId = requestAnimationFrame(draw)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    animId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  )
}