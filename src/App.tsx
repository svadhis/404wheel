// import WheelComponent from 'react-wheel-of-prizes'
// import 'react-wheel-of-prizes/dist/index.css'
import WheelComponent from './Wheel'
// import QRCode from "react-qr-code";
import './App.css'
import Advert from './Advert';
import qr from './assets/qr.png'

const App = () => {
  // const [last, setLast] = useState('')

  const segments = [
    '   - 10 %',
    '   - 20 %',
    '   - 30 %',
    '   - 40 %',
    '   - 50 %',
    '   - 60 %',
    '   - 70 %',
    '   - 80 %',
  ]
  const segColors = [
    '#00c5be',
    '#8041ba',
    '#00c5be',
    '#8041ba',
    '#00c5be',
    '#8041ba',
    '#00c5be',
    '#8041ba',
  ]
  const onFinished = (winner: string) => {
    console.log(winner)
  }
  return (
    <div className="bg-white h-screen w-screen overflow-hidden flex flex-row space-x-12 justify-between items-center py-8 px-16 ">
      <Advert />
      {/* <img src={qr} alt="" className="w-32 self-end" /> */}
      <WheelComponent
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
    </div>
  )
}

export default App
