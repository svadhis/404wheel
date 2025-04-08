import { useEffect, useState } from "react"
import { GameStatus } from "./App"
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

export type RegisterData = {
  name: string
  email: string
  age: '7-' | '8-11' | '12-15' | '16+'
}

const Register = ({ status = 'idle', onReady }: { status?: GameStatus, onReady: (participation: RegisterData) => void }) => {
  const [form, setForm] = useState<RegisterData>({
    name: '',
    email: '',
    age: '7-'
  })

  const [error, setError] = useState<string>('')

  const [selectedInput, setSelectedInput] = useState<string>('')

  const [layoutName, setLayoutName] = useState('default')

  const [capsLock, setCapsLock] = useState(false)

  // const onChange = (input: string) => {
  //   console.log("Input changed", input);
  //   if (selectedInput === 'name') {
  //     setForm({ ...form, name: input })
  //   } else if (selectedInput === 'email') {
  //     setForm({ ...form, email: input })
  //   }
  // }

  const onKeyPress = (button: string) => {
    console.log("Button pressed", button);
    if (button === '{enter}') {
      save()
    } else if (button === '{bksp}') {
      if (selectedInput === 'name') {
        setForm({ ...form, name: form.name.slice(0, -1) })
      } else if (selectedInput === 'email') {
        setForm({ ...form, email: form.email.slice(0, -1) })
      }
    } else if (button === '{shift}') {
      setCapsLock(false)
      handleShift()
    } else if (button === '{lock}') {
      setCapsLock(!capsLock)
      handleShift()
    } else {
      // Handle other keys
      if (selectedInput === 'name') {
        setForm({ ...form, name: form.name + button })
      } else if (selectedInput === 'email') {
        setForm({ ...form, email: form.email + button })
      }
    }

    if (!capsLock && button !== '{shift}' && button !== '{lock}') {
      setLayoutName('default')
    }
  }

  const handleShift = () => {
    const layout = layoutName;
    setLayoutName(layout === "default" ? "shift" : "default");
  };

  function save() {
    if (!form.name || !form.email) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setError('')
    setSelectedInput('')
    onReady(form)
  }

  useEffect(() => {
    if (status === 'idle') {
      setForm({
        name: '',
        email: '',
        age: '7-'
      })
    }
  }, [status])

  return (
    <div className={`${status === 'registering' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all w-256 ease-in-out shadow-2xl flex flex-col items-center justify-center text-xl space-y-4 p-16 bg-white text-g404-bleu border`}>
      <span className="text-3xl font-bold poppins-regular">Informations</span>
      <div></div>
      {error && <p className="text-red-500">{error}</p>}
      <form autoComplete="off" className="flex flex-col space-y-4">
        <label className="text-xl text-gray-600 ml-2">Votre nom et prénom</label>
        <input
          type="text"
          // placeholder="Votre nom et prénom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onFocus={() => setSelectedInput('name')}
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
          onFocus={() => setSelectedInput('email')}
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
      <div className={`transform transition-all w-full mt-8 ${selectedInput ? 'translate-y-0' : 'translate-y-96'} ease-in-out`}>
        <Keyboard
          // onChange={onChange}
          onKeyPress={onKeyPress}
          layoutName={layoutName}
          layout={{
            'default': [
              '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
              '{tab} q w e r t y u i o p [ ] \\',
              '{lock} a s d f g h j k l ; \' {enter}',
              '{shift} z x c v b n m , . / {shift}',
              '.com @ {space}',
              'gmail.com orange.fr free.fr sfr.fr bbox.fr'
            ],
            'shift': [
              '~ ! @ # $ % ^ &amp; * ( ) _ + {bksp}',
              '{tab} Q W E R T Y U I O P { } |',
              '{lock} A S D F G H J K L : " {enter}',
              '{shift} Z X C V B N M &lt; &gt; ? {shift}',
              '.com @ {space}',
              'gmail.com orange.fr free.fr sfr.fr bbox.fr'
            ]
          }}
        />
      </div>
    </div>
  )
}

export default Register