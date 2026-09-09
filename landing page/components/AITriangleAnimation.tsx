"use client"

import { useEffect, useRef } from "react"

type ShapeType = "circle" | "triangle" | "square" | "diamond"

interface Particle {
  gridX: number
  gridY: number
  opacity: number
  targetOpacity: number
  size: number
  targetSize: number
  flickerSpeed: number
  scale: number
  targetScale: number
  gridCol: number
  gridRow: number
  edgeWeight: number
}

interface PathSegment {
  x: number
  y: number
}

interface Connection {
  startIndex: number
  endIndex: number
  progress: number
  speed: number
  opacity: number
  path: PathSegment[]
}

const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shape: ShapeType) => {
  ctx.beginPath()

  switch (shape) {
    case "circle":
      ctx.arc(x, y, size, 0, Math.PI * 2)
      break

    case "triangle":
      ctx.moveTo(x, y - size)
      ctx.lineTo(x - size, y + size)
      ctx.lineTo(x + size, y + size)
      ctx.closePath()
      break

    case "square":
      ctx.rect(x - size, y - size, size * 2, size * 2)
      break

    case "diamond":
      ctx.moveTo(x, y - size)
      ctx.lineTo(x + size, y)
      ctx.lineTo(x, y + size)
      ctx.lineTo(x - size, y)
      ctx.closePath()
      break
  }

  ctx.fill()
}

export function AnalyzeAnimation({ shape = "triangle" }: { shape?: ShapeType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const gridInfoRef = useRef({ cols: 0, rows: 0, spacing: 20 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const initializeParticles = () => {
      // Much larger spacing = far fewer particles = no lag
      const spacing = 28
      const cols = Math.ceil(canvas.width / spacing)
      const rows = Math.ceil(canvas.height / spacing)

      gridInfoRef.current = { cols, rows, spacing }

      // Content sits in a centered max-w-6xl (1152px) column — keep that
      // band faint and let particles grow more visible toward the page edges.
      const contentWidth = Math.min(canvas.width, 1152)
      const contentLeft = (canvas.width - contentWidth) / 2
      const contentRight = contentLeft + contentWidth

      particlesRef.current = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const gridX = col * spacing + spacing / 2

          // 0 inside the content column, ramps to 1 at the page edges
          let edgeWeight = 0
          if (gridX <= contentLeft) {
            edgeWeight = contentLeft > 0 ? 1 - gridX / contentLeft : 0
          } else if (gridX >= contentRight) {
            const gutter = canvas.width - contentRight
            edgeWeight = gutter > 0 ? (gridX - contentRight) / gutter : 0
          }

          // Subtle in the center, brighter and larger toward the sides
          const opacity = Math.random() * (0.25 + 0.3 * edgeWeight)
          const size = Math.random() * 1.2 + 0.6 + 0.5 * edgeWeight

          particlesRef.current.push({
            gridX,
            gridY: row * spacing + spacing / 2,
            opacity,
            targetOpacity: opacity,
            size,
            targetSize: size,
            flickerSpeed: Math.random() * 0.03 + 0.01,
            scale: 1,
            targetScale: 1,
            gridCol: col,
            gridRow: row,
            edgeWeight,
          })
        }
      }
    }

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initializeParticles()
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    const createOrthogonalPath = (startParticle: Particle, endParticle: Particle): PathSegment[] => {
      const path: PathSegment[] = []
      const { spacing } = gridInfoRef.current

      let currentCol = startParticle.gridCol
      let currentRow = startParticle.gridRow
      const targetCol = endParticle.gridCol
      const targetRow = endParticle.gridRow

      path.push({ x: startParticle.gridX, y: startParticle.gridY })

      const horizontalFirst = Math.random() > 0.5

      if (horizontalFirst) {
        while (currentCol !== targetCol) {
          currentCol += currentCol < targetCol ? 1 : -1
          path.push({
            x: currentCol * spacing + spacing / 2,
            y: currentRow * spacing + spacing / 2,
          })
        }
        while (currentRow !== targetRow) {
          currentRow += currentRow < targetRow ? 1 : -1
          path.push({
            x: currentCol * spacing + spacing / 2,
            y: currentRow * spacing + spacing / 2,
          })
        }
      } else {
        while (currentRow !== targetRow) {
          currentRow += currentRow < targetRow ? 1 : -1
          path.push({
            x: currentCol * spacing + spacing / 2,
            y: currentRow * spacing + spacing / 2,
          })
        }
        while (currentCol !== targetCol) {
          currentCol += currentCol < targetCol ? 1 : -1
          path.push({
            x: currentCol * spacing + spacing / 2,
            y: currentRow * spacing + spacing / 2,
          })
        }
      }

      return path
    }

    const createConnection = () => {
      if (particlesRef.current.length < 2) return

      const startIndex = Math.floor(Math.random() * particlesRef.current.length)
      let endIndex = Math.floor(Math.random() * particlesRef.current.length)

      while (endIndex === startIndex) {
        endIndex = Math.floor(Math.random() * particlesRef.current.length)
      }

      const path = createOrthogonalPath(particlesRef.current[startIndex], particlesRef.current[endIndex])

      connectionsRef.current.push({
        startIndex,
        endIndex,
        progress: 0,
        speed: Math.random() * 0.005 + 0.004,
        opacity: Math.random() * 0.12 + 0.06,
        path,
      })
    }

    const connectionInterval = setInterval(() => {
      if (connectionsRef.current.length < 4) {
        createConnection()
      }
    }, 1500)

    const animate = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      connectionsRef.current = connectionsRef.current.filter((connection) => {
        const start = particlesRef.current[connection.startIndex]
        const end = particlesRef.current[connection.endIndex]

        if (!start || !end) return false

        connection.progress += connection.speed

        if (connection.progress >= 1) {
          return false
        }

        const totalSegments = connection.path.length - 1
        if (totalSegments <= 0) return false
        const currentSegment = Math.min(Math.floor(connection.progress * totalSegments), totalSegments - 1)
        const segmentProgress = (connection.progress * totalSegments) % 1

        const currentPoint = connection.path[currentSegment]
        const nextPoint = connection.path[currentSegment + 1]
        if (!currentPoint || !nextPoint) return false

        const currentX = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress
        const currentY = currentPoint.y + (nextPoint.y - currentPoint.y) * segmentProgress

        ctx.strokeStyle = `rgba(255, 255, 255, ${connection.opacity * (1 - connection.progress * 0.5)})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(connection.path[0].x, connection.path[0].y)

        for (let i = 1; i <= currentSegment; i++) {
          ctx.lineTo(connection.path[i].x, connection.path[i].y)
        }
        ctx.lineTo(currentX, currentY)
        ctx.stroke()

        const dotSize = 1.5
        ctx.fillStyle = `rgba(255, 255, 255, ${connection.opacity})`
        ctx.beginPath()
        ctx.arc(currentX, currentY, dotSize, 0, Math.PI * 2)
        ctx.fill()

        return true
      })

      // Draw particles
      particlesRef.current.forEach((particle) => {
        if (Math.random() < 0.03) {
          particle.targetOpacity = Math.random() * (0.25 + 0.3 * particle.edgeWeight)
          particle.targetSize = Math.random() * 1.2 + 0.6 + 0.5 * particle.edgeWeight
          particle.targetScale = 1 + Math.random() * 0.08
        }

        particle.opacity += (particle.targetOpacity - particle.opacity) * particle.flickerSpeed
        particle.size += (particle.targetSize - particle.size) * particle.flickerSpeed
        particle.scale += (particle.targetScale - particle.scale) * particle.flickerSpeed

        const finalSize = particle.size * particle.scale

        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        drawShape(ctx, particle.gridX, particle.gridY, finalSize, shape)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      clearInterval(connectionInterval)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [shape])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
  )
}
