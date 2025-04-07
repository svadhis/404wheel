import { useState } from "react"
import { GameStatus } from "./App"

export type RegisterData = {
  name: string
  email: string
  age: '7-' | '8-11' | '12-15' | '16+'
}

const Register = ({ status = 'idle' }: { status?: GameStatus }) => {
  const [form, setForm] = useState<RegisterData>({
    name: '',
    email: '',
    age: '7-'
  })

  const [isFormValid, setIsFormValid] = useState(false)

  // function save to save the form data in local storage
  function save() {
    localStorage.setItem('form', JSON.stringify(form))
    setIsFormValid(true)
  }

  return (
    <div className={`${status === 'idle' && 'hidden'} flex flex-col items-center justify-center text-xl space-y-4 p-24 bg-white text-g404-bleu border`}>
      <span className="text-3xl font-bold poppins-regular">Informations</span>
      <div></div>
      <form autoComplete="off" className="flex flex-col space-y-4">
        <label className="text-xl text-gray-600 ml-2">Votre nom et prénom</label>
        <input
          type="text"
          // placeholder="Votre nom et prénom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-gray-300 p-2 rounded"
          required
        />
        <div></div>
        <label className="text-xl text-gray-600 ml-2">Votre email</label>
        <input
          type="email"
          // placeholder="Votre email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-gray-300 p-2 rounded"
          required
        />
        <div></div>
        <label className="text-xl text-gray-600 ml-2">L'âge de votre enfant</label>
        <select
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value as '7-' | '8-11' | '12-15' | '16+' })}
          className="border border-gray-300 p-2 rounded"
          required
        >
          <option value="7-">7 ans et moins</option>
          <option value="8-11">8 à 11 ans</option>
          <option value="12-15">12 à 15 ans</option>
          <option value="16+">16 ans et plus</option>
        </select>
        <div></div>
        <button type="button" onClick={save} className="bg-blue-500 text-white p-2 rounded">
          Participer
        </button>
        <div></div>
        <p>Vos informations seront utilisées pour vous contacter en cas de gain.</p>
      </form>
      {isFormValid && <p className="text-green-500">Inscription réussie !</p>}
    </div>
  )
}

export default Register