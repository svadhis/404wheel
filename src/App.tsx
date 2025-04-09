// import WheelComponent from 'react-wheel-of-prizes'
// import 'react-wheel-of-prizes/dist/index.css'
import WheelComponent from './Wheel'
// import QRCode from "react-qr-code";
import './App.css'
import Advert from './Advert';
import Register, { RegisterData } from './Register';
import { useEffect, useState } from 'react';
import Result from './Result';
// import qr from './assets/qr.png'

type Participation = RegisterData & {
  result?: string,
  date?: string,
}

export type GameStatus = 'idle' | 'ready' | 'registering' | 'playing' | 'result'

const App = () => {
  // const [last, setLast] = useState('')
  const [participation, setParticipation] = useState<Participation | null>(null)
  const [status, setStatus] = useState<GameStatus>('idle')
  const [result, setResult] = useState<number>(0)

  function participate() {
    setStatus('registering')
  }

  function getReady(registerData: RegisterData) {
    setParticipation(registerData)
    setStatus('ready')
  }

  function start() {
    setStatus('playing')
  }

  const segments = [
    '20',
    '50',
    '20',
    '50',
    '20',
    '50',
    '20',
    '50',
    '20',
    '100',
  ]
  const segColors = [
    '#8041ba',
    '#00c5be',
    '#8041ba',
    '#00c5be',
    '#8041ba',
    '#00c5be',
    '#8041ba',
    '#00c5be',
    '#8041ba',
    '#d3af37',
  ]

  function copyData() {
    const participants = JSON.parse(localStorage.getItem('participations') || '[]') as Participation[]
    const text = participants.map((p: Participation) => `${p.name} (${p.email}) - ${p.result} - ${p.date}`).join('\n')
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard')
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  const onFinished = (winner: string) => {
    const form = { ...participation!, result: winner, date: new Date().toLocaleString() }
    setParticipation(form)
    setResult(parseInt(winner))
    setStatus('result')

    const participants = JSON.parse(localStorage.getItem('participations') || '[]') as Participation[]

    // add participation in local storage
    localStorage.setItem('participations', JSON.stringify([...participants, form]))
  }

  const reset = () => {
    setStatus('idle')
    setResult(0)
  }

  useEffect(() => {
    if (status === 'result') {
      const timer = setTimeout(() => {
        reset()
      }, 20000)

      return () => clearTimeout(timer)
    }
  }, [status])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        reset();
      }
      if (event.key === "F2") {
        copyData();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Clean up pour éviter les fuites de mémoire
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // define a custom handler function
    // for the contextmenu event
    const handleContextMenu = (e: MouseEvent) => {
      // prevent the right-click menu from appearing
      e.preventDefault()
    }

    // attach the event listener to
    // the document object
    document.addEventListener("contextmenu", handleContextMenu)

    // clean up the event listener when
    // the component unmounts
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [])

  return (
    <div className="bg-white h-screen w-screen overflow-hidden flex flex-row space-x-12 justify-between items-center py-8 px-24 relative select-none">
      <div className={status === 'registering' || status === 'result' ? 'blur-md' : ''}>
        <Advert status={status} onParticipate={participate} />
      </div>
      {/* <img src={qr} alt="" className="w-32 self-end" /> */}
      <div className={status === 'registering' || status === 'result' ? 'blur-md' : ''}>
        <WheelComponent
          status={status}
          segments={segments}
          segColors={segColors}
          winningSegment='won 10'
          onFinished={(winner: string) => onFinished(winner)}
          primaryColor='black'
          contrastColor='white'
          buttonText='Spin'
          isOnlyOnce={false}
          // size={400}
          // upDuration={100}
          // downDuration={500}
          fontFamily='Arial'
          onParticipate={participate}
          onStart={start}
        />
      </div>
      {/* <QRCode
        value={last}
        size={256}
        style={{
          margin: "auto",
          display: "block"
        }}
        viewBox={`0 0 256 256`}
        bgColor="#FFFFFF"
        fgColor="#000000"
        level="L"
      /> */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <Register status={status} onReady={getReady} />
      </div>
      <div className="flex flex-col space-y-24 items-center pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <Result key={result} status={status} discount={result} reset={reset} />
        <div onClick={reset} className={`${status === 'result' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} bg-g404-violet w-48 text-white rounded-xl text-center p-4 poppins-bold`}>
          RETOUR
        </div>
      </div>
      <div className="absolute top-0 left-0 z-50 w-36 h-36 bg-transparent" onClick={reset}>
      </div>
    </div>
  )
}

export default App
