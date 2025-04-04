import { useEffect, useState, useRef } from 'react'
import sticker from './assets/sticker2.png'

export interface WheelComponentProps {
  segments: string[]
  segColors: string[]
  winningSegment: string
  onFinished: (segment: string) => void
  primaryColor?: string
  contrastColor?: string
  buttonText?: string
  isOnlyOnce?: boolean
  size?: number
  upDuration?: number
  downDuration?: number
  fontFamily?: string
  fontSize?: string
  outlineWidth?: number,
  status?: 'idle' | 'ready' | 'registering',
  onRegister: () => void
}

const WheelComponent = ({
  segments,
  segColors,
  onFinished,
  primaryColor = '#1C1C26',
  contrastColor = '#f3f5f8',
  isOnlyOnce = true,
  size = window.innerHeight / 2 - 40,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = 'proxima-nova',
  fontSize = '3em',
  status = 'idle',
  onRegister,
}: WheelComponentProps) => {
  const wheelId = useRef(`wheel-${Math.random().toString(36).substring(2)}`)
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const stickerCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const dimension = (size + 20) * 2
  const centerX = size + 20
  const centerY = size + 20

  const [isFinished, setFinished] = useState(false)
  const [angleCurrent, setAngleCurrent] = useState(0)
  const [currentSegment, setCurrentSegment] = useState('')
  const isStarted = useRef(false)
  const timerHandle = useRef(0)
  const spinStart = useRef(0)
  const frames = useRef(0)

  const upTime = segments.length * upDuration
  const downTime = segments.length * downDuration
  const maxSpeed = Math.PI / segments.length
  const PI2 = Math.PI * 2

  useEffect(() => {
    drawWheel()
    drawSticker()
  }, [])

  const spin = () => {
    if (timerHandle.current === 0) {
      isStarted.current = true
      spinStart.current = Date.now()
      frames.current = 0
      timerHandle.current = window.setInterval(onTimerTick, segments.length)
    }
  }

  const register = () => {
    onRegister()
  }

  const onTimerTick = () => {
    frames.current++
    const now = Date.now()
    const elapsed = now - spinStart.current
    let angleDelta = 0
    let finished = false

    if (elapsed < upTime) {
      const progress = elapsed / upTime
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2)
    } else if (elapsed < upTime + downTime) {
      const progress = (elapsed - upTime) / downTime
      angleDelta = maxSpeed * Math.cos((progress * Math.PI) / 2)
    } else {
      finished = true
    }

    setAngleCurrent(prev => {
      const newAngle = (prev + angleDelta) % PI2
      drawWheel(newAngle)
      if (finished) {
        setFinished(true)
        clearInterval(timerHandle.current)
        timerHandle.current = 0
        onFinished(currentSegment)
      }
      return newAngle
    })
  }

  const drawWheel = (angle = angleCurrent) => {
    const canvas = baseCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, dimension, dimension)

    let lastAngle = angle
    ctx.lineWidth = 0
    ctx.strokeStyle = "#324a6d"
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = '1em ' + fontFamily

    for (let i = 1; i <= segments.length; i++) {
      const segAngle = PI2 * (i / segments.length) + angle
      drawSegment(ctx, i - 1, lastAngle, segAngle)
      lastAngle = segAngle
    }

    drawNeedle(ctx, angle)

    ctx.beginPath()
    ctx.arc(centerX, centerY, size, 0, PI2)
    ctx.closePath()
    ctx.lineWidth = 5
    ctx.strokeStyle = '#324a6d'
    ctx.stroke()
  }

  const drawSegment = (ctx: CanvasRenderingContext2D, index: number, start: number, end: number) => {
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, size, start, end, false)
    ctx.lineTo(centerX, centerY)
    ctx.closePath()
    ctx.fillStyle = segColors[index % segColors.length]
    ctx.fill()
    ctx.stroke()

    ctx.translate(centerX, centerY)
    ctx.rotate((start + end) / 2)
    ctx.fillStyle = contrastColor
    ctx.font = `bold ${fontSize} ${fontFamily}`
    ctx.fillText(segments[index].substring(0, 21), size / 2 + 20, 0)
    ctx.restore()
  }

  const drawNeedle = (ctx: CanvasRenderingContext2D, angle: number) => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#324a6d"
    ctx.fillStyle = "#324a6d"
    ctx.beginPath()
    ctx.moveTo(centerX + 30, centerY - 140)
    ctx.lineTo(centerX - 30, centerY - 140)
    ctx.lineTo(centerX, centerY - 200)
    ctx.closePath()
    ctx.fill()

    const change = angle + Math.PI / 2
    let i = segments.length - Math.floor((change / PI2) * segments.length) - 1
    if (i < 0) i += segments.length
    setCurrentSegment(segments[i])
    if (isStarted.current) {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = primaryColor
      ctx.font = 'bold 1.5em ' + fontFamily
      ctx.fillText(segments[i], centerX + 10, centerY + size + 50)
    }
  }

  const drawSticker = () => {
    const canvas = stickerCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = sticker
    img.onload = () => {
      const imgSize = 300
      ctx.clearRect(0, 0, dimension, dimension)
      ctx.beginPath()
      ctx.arc(centerX, centerY, 150, 0, PI2)
      ctx.closePath()
      ctx.fillStyle = '#1C1C26'
      ctx.fill()
      ctx.drawImage(img, centerX - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize)
      ctx.lineWidth = 1
      ctx.strokeStyle = '#324a6d'
      ctx.stroke()
    }
  }

  const wheelStatus = () => {
    if (status === 'idle') {
      return {
        opacity: 1,
        transform: 'none',
        pointerEvents: 'all',
      }
    } else if (status === 'ready') {
      return {
        opacity: 1,
        transform: 'none',
        pointerEvents: 'all',
      }
    } else if (status === 'registering') {
      return {
        opacity: 0.5,
        transform: 'translateX(200px)',
        pointerEvents: 'none',
      }
    }
  }

  return (
    <div
      id={wheelId.current}
      style={{
        position: 'relative',
        width: dimension,
        height: dimension,
        transition: 'all 0.5s ease-in-out',
        ...wheelStatus() as React.CSSProperties,
      }}
      onClick={() => !isFinished || !isOnlyOnce ? status === 'idle' ? register() : spin() : null}
    >
      <canvas
        ref={baseCanvasRef}
        width={dimension}
        height={dimension}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
      />
      <canvas
        ref={stickerCanvasRef}
        width={dimension}
        height={dimension}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}
      />
    </div>
  )
}

export default WheelComponent
