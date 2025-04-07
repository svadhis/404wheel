import { GameStatus } from "./App"

const Result = ({ status = 'idle', discount }: { status?: GameStatus, discount: number }) => {
  return (
    <div className={`${status === 'result' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all ease-in-out shadow-2xl flex flex-col items-center justify-center text-xl space-y-4 p-24 bg-white text-g404-bleu border`}>
      <div className="text-g404-bleu text-4xl">
        <span className="text-g404-violet poppins-black text-5xl">Bravo !</span>
      </div>
      <div className="h-8"></div>
      <div className="text-g404-bleu text-4xl">
        <span>Vous avez gagné </span>
        <span className="text-g404-violet poppins-black text-x4l">{discount} % de réduction</span>
        <span> sur votre prochain atelier !</span>
      </div>
      <div className="text-g404-bleu text-4xl">
        <span>Vous recevrez votre bon de réduction dans les 24 heures par email.</span>
      </div>
      <div className="h-8"></div>
      <div className="text-g404-violet poppins-bold text-4xl">
        <span>Bonne visite et à bientôt !</span>
      </div>
    </div>
  )
}

export default Result