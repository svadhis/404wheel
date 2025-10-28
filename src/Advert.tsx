import { GameStatus } from './App'
import logo from './assets/logo.svg'
// import { motion } from "motion/react"

const Advert = ({ status = 'idle', onParticipate }: { status?: GameStatus, onParticipate: () => void }) => {
  const advertStatus = () => {
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
        // transform: 'translateX(-100px)',
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
    <div
      className="poppins-bold text-g404-bleu text-center text-2xl font-bold flex flex-col items-center space-y-16 w-164"
      style={{
        transition: 'all 0.3s ease-in-out',
        ...advertStatus() as React.CSSProperties,
      }}
    >
      <div></div>
      <div className="flex flex-col items-center space-y-4 text-6xl">
        {/* <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Ton texte stylé ici
        </motion.div> */}
        <span><span className="text-g404-violet poppins-black">100 %</span> de chances</span>
        <span>de <span className="text-g404-violet poppins-black">gagner</span> avec</span>
        <img src={logo} alt="" className="w-164" />
      </div>
      <div className="text-g404-bleu text-4xl flex flex-col space-y-2">
        <span>Tente ta chance pour gagner</span>
        <span className="text-g404-violet poppins-black text-5xl">un parcours éducatif</span>
        <span>complet d’un an</span>
        <span className="text-g404-violet poppins-black text-6xl">100% GRATUIT</span>
      </div>
      { status === 'ready' || status === "playing" || status === "result" ? (
        <div className="text-g404-bleu text-4xl">
          <span className="text-g404-violet poppins-black text-6xl">Bonne chance !</span>
        </div>
      ) : (
        <div
          className="participate cursor-pointer bg-g404-violet border-4 border-g404-bleu text-white text-3xl w-42 h-42 flex justify-center items-center rounded-full"
          onClick={status === 'idle' ? onParticipate : undefined}
        >
          JOUER
        </div>
      )}

      {/* <div className="arrow">
        <img src={arrow} alt="" />
      </div> */}
      <div></div>
    </div>
  )
}

export default Advert