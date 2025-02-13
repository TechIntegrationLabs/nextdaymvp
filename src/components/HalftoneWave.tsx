"use client"
import { useEffect, useRef } from "react"

export default function HalftoneWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0
    let mouseX = 0
    let mouseY = 0
    let prevMouseX = 0
    let prevMouseY = 0
    let mouseSpeed = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawHalftoneWave = () => {
      const baseGridSize = 8
      const rows = Math.ceil(canvas.height / baseGridSize)
      const cols = Math.ceil(canvas.width / baseGridSize)

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const centerX = x * baseGridSize
          const centerY = y * baseGridSize
          const distanceFromCenter = Math.sqrt(
            Math.pow(centerX - canvas.width / 2, 2) + Math.pow(centerY - canvas.height / 2, 2),
          )
          const maxDistance = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2))
          const normalizedDistance = distanceFromCenter / maxDistance

          // Add sine wave frequency pattern
          const frequencyFactor = Math.sin(normalizedDistance * 10 - time * 0.5) * 0.5 + 1.5
          const waveOffset = Math.sin(normalizedDistance * 8 * frequencyFactor - time) * 0.3 + 0.7

          // Vary the grid size based on the frequency factor
          const gridSize = baseGridSize * (1 + Math.sin(frequencyFactor) * 0.2)
          const size = gridSize * waveOffset * 0.6

          ctx.beginPath()
          ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${waveOffset * 0.7})`
          ctx.fill()
        }
      }
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawHalftoneWave()

      // Update time based on mouse speed
      time += mouseSpeed * 0.01

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (event: MouseEvent) => {
      prevMouseX = mouseX
      prevMouseY = mouseY
      mouseX = event.clientX
      mouseY = event.clientY

      // Calculate mouse speed as the distance between current and previous positions
      const dx = mouseX - prevMouseX
      const dy = mouseY - prevMouseY
      mouseSpeed = Math.sqrt(dx * dx + dy * dy)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-black -z-10" />
}
