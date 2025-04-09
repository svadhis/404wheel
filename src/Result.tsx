import { GameStatus } from "./App"

const Result = ({ status = 'idle', discount, reset }: { status?: GameStatus, discount: number, reset: () => void }) => {
  return (
    <div className={`${status === 'result' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all ease-in-out shadow-2xl flex flex-col items-center justify-center text-xl space-y-4 p-16 bg-white text-g404-bleu border`}>
      <div className="text-g404-bleu text-4xl">
        <span className="text-g404-violet poppins-black text-5xl">Bravo !</span>
      </div>
      <div className="h-8"></div>
      <div className="text-g404-bleu text-4xl">
        <span>Vous avez gagné </span>
        <span className="text-g404-violet poppins-black text-4xl">{discount} % de réduction</span>
        <span> valables sur l'un de nos atelier vacances !</span>
      </div>
      <div className="text-g404-bleu text-3xl">
        <span>Votre coupon vous sera envoyé par mail à la fin de l'événement.</span>
      </div>
      <div className="h-8"></div>
      <div className="text-g404-violet poppins-bold text-4xl">
        <span>Bonne visite et à bientôt !</span>
      </div>
    </div>
  )
}

export default Result