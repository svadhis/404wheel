import logo from './assets/logo.svg'

const Advert = () => {
  return (
    <div className="poppins-bold text-g404-bleu text-center text-2xl font-bold flex flex-col items-center space-y-16 w-164">
      <div></div>
      <div className="flex flex-col items-center space-y-4 text-6xl">
        <span>Tente ta <span className="text-g404-violet poppins-black">chance</span></span>
        <span>avec</span>
        <img src={logo} alt="" className="w-164" />
      </div>
      <div className="text-g404-bleu text-4xl flex flex-col space-y-2">
        <span>Gagne des réductions</span>
        <span className="text-g404-violet poppins-black text-5xl">exclusives</span>
        <span>pour des ateliers enfants</span>
        <span>autour du numérique !</span>
      </div>
      <div className="participate bg-g404-violet text-white w-84 h-28 flex justify-center items-center rounded-2xl border-4 border-g404-bleu">PARTICIPER</div>
      <div></div>
    </div>
  )
}

export default Advert