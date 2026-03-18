import { GameStatus } from "./App"
import { LOW_DISCOUNT, HIGH_DISCOUNT, GOODIE, JACKPOT, Prize } from "./constants"

const Result = ({ status = 'idle', prize }: { status?: GameStatus, prize: Prize }) => {
  const winSection = {
    [JACKPOT]: (
      <div className="text-g404-bleu text-4xl">
        <div>
          <span>Vous avez gagné </span>
          <span className="text-g404-violet poppins-black text-4xl">un atelier découverte de votre choix GRATUIT !</span>
        </div>
      </div>
    ),
    [LOW_DISCOUNT]: (
      <div className="text-g404-bleu text-4xl">
        <span>Vous avez gagné </span>
        <span className="text-g404-violet poppins-black text-4xl">25 % de réduction</span>
        <span> valables sur l'un de nos ateliers découverte</span>
      </div>
    ),
    [HIGH_DISCOUNT]: (
      <div className="text-g404-bleu text-4xl">
        <span>Vous avez gagné </span>
        <span className="text-g404-violet poppins-black text-4xl">50 % de réduction</span>
        <span> valables sur l'un de nos ateliers découverte</span>
      </div>
    ),
    [GOODIE]: (
      <div className="text-g404-bleu text-4xl">
        <span className="text-g404-violet poppins-black text-4xl">Vous avez gagné un GOODIE ! </span>
      </div>
    ),
  }

  return (
    <div className={`${status === 'result' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all ease-in-out shadow-2xl flex flex-col items-center justify-center text-xl space-y-4 p-16 bg-white text-g404-bleu border`}>
      <div className="text-g404-bleu text-4xl">
        <span className="text-g404-violet poppins-black text-5xl">Bravo !</span>
      </div>
      <div className="h-8"></div>
      <div className="text-g404-bleu text-4xl">
        {winSection[prize]}
      </div>
      <div className="text-g404-bleu text-2xl">
        <span>Dirigez-vous vers l'un de nos hôtes pour récupérer votre prix.</span>
      </div>
      <div className="h-8"></div>
      <div className="text-g404-violet poppins-bold text-4xl">
        <span>Bonne visite et à bientôt !</span>
      </div>
    </div>
  )
}

export default Result