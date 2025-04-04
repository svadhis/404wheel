import logo from './assets/logo.svg'

const Advert = () => {
  return (
    <div className="text-g404-violet text-center text-2xl font-bold flex flex-col items-center space-y-16 w-164">
      <div></div>
      <div className="flex flex-col items-center space-y-4">
        <h1>Tente ta chance avec</h1>
        <img src={logo} alt="" className="w-128" />
      </div>
      <p className="text-g404-bleu text-left text-4xl">Gagne des réductions exclusives pour des ateliers enfants autour du numérique</p>
      <div className="participate bg-g404-violet text-white w-84 h-28 flex justify-center items-center rounded-2xl border-4 border-g404-bleu">PARTICIPER</div>
      <div></div>
    </div>
  )
}

export default Advert