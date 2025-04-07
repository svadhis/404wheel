// import WheelComponent from 'react-wheel-of-prizes'
// import 'react-wheel-of-prizes/dist/index.css'
import WheelComponent from './Wheel'
// import QRCode from "react-qr-code";
import './App.css'
import Advert from './Advert';
import Register, { RegisterData } from './Register';
import { useState } from 'react';
// import qr from './assets/qr.png'

type Participation = RegisterData & {
  result?: string
}

export type GameStatus = 'idle' | 'ready' | 'registering'

const App = () => {
  // const [last, setLast] = useState('')
  const [participation, setParticipation] = useState<Participation | null>(null)
  const [status, setStatus] = useState<GameStatus>('idle')

  function participate() {
    setStatus('registering')
  }

  const segments = [
    '       - 20 %',
    '       - 50 %',
    '       - 20 %',
    '       - 50 %',
    '       - 20 %',
    '       - 50 %',
    '       - 20 %',
    '       - 50 %',
    '       - 20 %',
    '       - 100 %',
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
  const onFinished = (winner: string) => {
    console.log(winner)
  }
  return (
    <div className="bg-white h-screen w-screen overflow-hidden flex flex-row space-x-12 justify-between items-center py-8 px-24 relative">
      <Advert status={status} onParticipate={participate} />
      {/* <img src={qr} alt="" className="w-32 self-end" /> */}
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
        upDuration={100}
        downDuration={500}
        fontFamily='Arial'
        onRegister={() => {
          console.log('registering')
        }}
      />
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
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500">
        <Register status={status} />
      </div>
    </div>
  )
}

export default App
