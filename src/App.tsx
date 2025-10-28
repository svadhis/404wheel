// import WheelComponent from 'react-wheel-of-prizes'
// import 'react-wheel-of-prizes/dist/index.css'
import WheelComponent from './Wheel'
// import QRCode from "react-qr-code";
import './App.css'
import Advert from './Advert';
import Register, { RegisterData } from './Register';
import { useEffect, useState } from 'react';
import Result from './Result';
import { useLongPress } from 'use-long-press';
import { DISCOUNT, GOODIE, JACKPOT, Prize } from './constants';
import { copyData } from './utils';
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
  const [result, setResult] = useState<Prize>(GOODIE)
  const [code, setCode] = useState('')

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

  const segments: Prize[] = [
    DISCOUNT,
    GOODIE,
    DISCOUNT,
    GOODIE,
    DISCOUNT,
    GOODIE,
    DISCOUNT,
    GOODIE,
    DISCOUNT,
    JACKPOT,
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

  const onFinished = (winner: Prize) => {
    const form = { ...participation!, result: winner, date: new Date().toLocaleString() }
    setParticipation(form)
    setResult(winner)
    setStatus('result')

    const participants = JSON.parse(localStorage.getItem('participations') || '[]') as Participation[]

    // add participation in local storage
    localStorage.setItem('participations', JSON.stringify([...participants, form]))
  }

  const reset = () => {
    setStatus('idle')
    setResult(GOODIE)
  }

  // const refresh = () => {
  //   window.location.reload()
  // }

  const fullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }

  const leftHandlers = useLongPress(reset, { threshold: 1000 });
  const rightHandlers = useLongPress(fullscreen, { threshold: 1000 });

  function generateCode() {
    const raw = localStorage.getItem("participations");
    if (!raw) return "";

    const participations = JSON.parse(raw);
    if (!Array.isArray(participations) || participations.length === 0) return "";

    // Normaliser les noms de résultats
    const mapResultToLetter = (result: Prize) => {
      switch (result) {
        case JACKPOT:
          return "A";
        case DISCOUNT:
          return "B";
        case GOODIE:
          return "C";
        default:
          return "?";
      }
    };

    // Obtenir les 3 dernières participations
    const lastThree = participations.slice(-3);

    // Pour compter le nombre de fois qu’un prix a été gagné jusqu’à ce moment
    const countOccurrencesBefore = (result: Prize, index: number) => {
      return participations.slice(0, index + 1).filter(p => p.result === result).length;
    };

    // Génération des 3 codes
    const codes = lastThree.map((p) => {
      const index = participations.indexOf(p) + 1; // position globale (1-based)
      const initials = p.name
        ? p.name
            .split(" ")
            .map((word: string) => word[0]?.toUpperCase() || "")
            .join("")
        : "??";

      const resultCount = countOccurrencesBefore(p.result, participations.indexOf(p));
      const letter = mapResultToLetter(p.result);

      return `${index}${initials}${resultCount}${letter}`;
    });

    return codes.join("-");
  }

  useEffect(() => {
    if (status === 'result') {
      const timer = setTimeout(() => {
        reset()
      }, 20000)

      return () => clearTimeout(timer)
    }

    // generate code
    const generatedCode = generateCode();
    setCode(generatedCode);
  }, [status])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // if (event.key === "Backspace") {
      //   reset();
      // }
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
          winningSegment={GOODIE}
          onFinished={(winner: Prize) => onFinished(winner)}
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
      <div className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <Register status={status} onReady={getReady} />
      </div>
      <div className="flex flex-col space-y-24 items-center pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <Result key={result} status={status} prize={result} />
        <div onClick={reset} className={`${status === 'result' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} bg-g404-violet w-48 text-white rounded-xl text-center p-4 poppins-bold`}>
          RETOUR
        </div>
      </div>
      <div className="absolute top-0 left-0 z-50 w-36 h-36 bg-transparent" {...leftHandlers()}></div>
      <div className="absolute top-0 right-0 z-50 w-36 h-36 bg-transparent" {...rightHandlers()}></div>
      <div className="absolute bottom-1 right-2 text-right text-black">{ code }</div>
    </div>
  )
}

export default App
