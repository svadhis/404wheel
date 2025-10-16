import { useEffect, useState, useRef } from 'react'
// import sticker from './assets/stickerqr.png'
import { GameStatus } from './App'
import { motion } from "motion/react"


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
  // upDuration?: number
  // downDuration?: number
  fontFamily?: string
  fontSize?: string
  outlineWidth?: number,
  status?: GameStatus,
  onParticipate: () => void,
  onStart: () => void,
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const WheelComponent = ({
  segments,
  segColors,
  onFinished,
  primaryColor = '#1C1C26',
  contrastColor = '#f3f5f8',
  isOnlyOnce = true,
  size = window.innerHeight / 2 - 40,
  // upDuration = 100,
  // downDuration = 1000,
  fontFamily = 'proxima-nova',
  fontSize = '6.5em',
  status = 'idle',
  onParticipate,
  onStart,
}: WheelComponentProps) => {
  const wheelId = useRef(`wheel-${Math.random().toString(36).substring(2)}`)
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const stickerCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [canvasSize, setCanvasSize] = useState(size)
  const dimension = (canvasSize + 20) * 2
  const centerX = canvasSize + 20
  const centerY = canvasSize + 20

  const [isFinished, setFinished] = useState(false)
  const [angleCurrent, setAngleCurrent] = useState(0)
  const [currentSegment, setCurrentSegment] = useState('')
  const isStarted = useRef(false)
  // const timerHandle = useRef(0)
  // const spinStart = useRef(0)
  // const frames = useRef(0)

  // const upTime = segments.length * upDuration
  // const downTime = segments.length * downDuration
  // const maxSpeed = Math.PI / segments.length
  const PI2 = Math.PI * 2

  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isOffscreenReady, setOffscreenReady] = useState(false)

  useEffect(() => {
    if (isOffscreenReady) {
      drawWheel(0)
    }
  }, [isOffscreenReady])

  const createOffscreenCanvas = () => {
    const canvas = document.createElement('canvas')
    canvas.width = dimension
    canvas.height = dimension
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    drawStaticWheel(ctx) // <- voilà où tu veux ton ctx
    offscreenCanvasRef.current = canvas
    setOffscreenReady(true)
  }


  useEffect(() => {
    createOffscreenCanvas()
    drawSticker()
  }, []) // Appel initial

  useEffect(() => {
    if (!isOffscreenReady) return
    createOffscreenCanvas()
    drawSticker()
    drawWheel()
  }, [canvasSize, status])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const newSize = window.innerHeight / 2 - 40
      setCanvasSize(newSize)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])


  const drawStaticWheel = (ctx: CanvasRenderingContext2D) => {
    let lastAngle = 0
    ctx.lineWidth = 0
    ctx.strokeStyle = "#324a6d"
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = `bold ${fontSize} ${fontFamily}`

    for (let i = 1; i <= segments.length; i++) {
      const segAngle = PI2 * (i / segments.length)
      drawSegment(ctx, i - 1, lastAngle, segAngle)
      lastAngle = segAngle
    }

    ctx.beginPath()
    ctx.arc(centerX, centerY, size, 0, PI2)
    ctx.closePath()
    ctx.lineWidth = 5
    ctx.strokeStyle = '#324a6d'
    ctx.stroke()
  }


  // const targetAngleRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)

  const spin = () => {
    if (isStarted.current) return

    function getRandomDigit(): number {
      const rand = Math.random();

      if (rand < 0.70) {
        const evens = [0, 2, 4, 6, 8];
        return evens[Math.floor(Math.random() * evens.length)];
      } else if (rand < 0.98) {
        const odds = [1, 3, 5, 7];
        return odds[Math.floor(Math.random() * odds.length)];
      } else {
        return 9;
      }
    }

    const targetIndex = getRandomDigit()

    console.log('targetIndex', targetIndex)

    isStarted.current = true
    onStart()

    const spins = 10 // nombre de tours complets avant d’arriver
    const segmentAngle = PI2 / segments.length
    const needleOffset = Math.PI / 2
    const stopAngle = PI2 - (targetIndex * segmentAngle) - needleOffset - segmentAngle / 2

    const finalAngle = spins * PI2 + stopAngle
    const duration = 4000 // durée en ms

    const startAngle = angleCurrent
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)

      const newAngle = startAngle + (finalAngle - startAngle) * eased
      setAngleCurrent(newAngle % PI2)
      drawWheel(newAngle % PI2)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        cancelAnimationFrame(animationFrameRef.current!)
        animationFrameRef.current = null
        setFinished(true)
        isStarted.current = false
      }
    }

    requestAnimationFrame(animate)
  }


  const register = () => {
    onParticipate()
  }

  // const onTimerTick = () => {
  //   frames.current++
  //   const now = Date.now()
  //   const elapsed = now - spinStart.current
  //   console.log(elapsed)
  //   let angleDelta = 0
  //   let finished = false

  //   if (elapsed < upTime) {
  //     const progress = elapsed / upTime
  //     angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2)
  //   } else if (elapsed < upTime + downTime) {
  //     const progress = (elapsed - upTime) / downTime
  //     angleDelta = maxSpeed * Math.cos((progress * Math.PI) / 2)
  //   } else {
  //     finished = true
  //   }

  //   setAngleCurrent(prev => {
  //     const newAngle = (prev + angleDelta) % PI2
  //     drawWheel(newAngle)
  //     if (finished) {
  //       setFinished(true)
  //       clearInterval(timerHandle.current)
  //       timerHandle.current = 0
  //     }
  //     return newAngle
  //   })
  // }

  useEffect(() => {
    if (isFinished) {
      onFinished(currentSegment)
      setFinished(false)
    }
  }, [isFinished])

  const drawWheel = (angle = angleCurrent) => {
    const canvas = baseCanvasRef.current
    const staticCanvas = offscreenCanvasRef.current
    if (!canvas || !staticCanvas || !isOffscreenReady) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, dimension, dimension)

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angle)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(staticCanvas, 0, 0)
    ctx.restore()

    drawNeedle(ctx, angle)
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
    ctx.fillText('       - ' + segments[index].substring(0, 21) + ' %', size / 2 + 20, 0)
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

    const change = (angle + Math.PI / 2) % PI2
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

    const imgName = status === 'ready' ? 'stickerlancement1' : status === 'playing' ? 'stickerluck' : 'stickerqr'

    const img = new Image()
    img.src = `${import.meta.env.BASE_URL}assets/${imgName}.png`
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
        // transform: 'translateX(100px)',
        pointerEvents: 'none',
      }
    } else if (status === 'playing') {
      return {
        opacity: 1,
        transform: 'none',
        pointerEvents: 'none',
      }
    } else if (status === 'result') {
      return {
        opacity: 0.5,
        transform: 'none',
        pointerEvents: 'none',
      }
    }
  }

  return (
    <motion.div
      animate={status === 'ready' ? { scale: [1, 1.05, 1] } : { scale: 1}}
      transition={{
        duration: 2,
        repeat: status === 'ready' ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      <div
        id={wheelId.current}
        style={{
          position: 'relative',
          width: dimension,
          height: dimension,
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
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
    </motion.div>
  )
}

export default WheelComponent
