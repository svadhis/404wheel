import { useEffect, useRef, useState } from "react"
import { GameStatus } from "./App"
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';



export type RegisterData = {
  name: string
  email: string
  phone: string
  age: '6-10' | '10-16' | '16-18' | 'autres'
}

const Register = ({ status = 'idle', onReady }: { status?: GameStatus, onReady: (participation: RegisterData) => void }) => {
  const [form, setForm] = useState<RegisterData>({
    name: '',
    email: '',
    phone: '',
    age: '6-10'
  })

  const [error, setError] = useState<string>('')

  const [selectedInput, setSelectedInput] = useState<string>('')

  const [layoutName, setLayoutName] = useState('default')

  const [capsLock, setCapsLock] = useState(false)

  const [isAccepted, setIsAccepted] = useState(false)

  const checkboxRef = useRef<HTMLInputElement>(null)

  const [isFormValid, setIsFormValid] = useState(false)

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
      } else if (selectedInput === 'phone') {
        setForm({ ...form, phone: form.phone.slice(0, -1) })
      }
    } else if (button === '{shift}') {
      setCapsLock(false)
      handleShift()
    } else if (button === '{lock}') {
      setCapsLock(!capsLock)
      handleShift()
    } else if (button === '{space}') {
      if (selectedInput === 'name') {
        setForm({ ...form, name: form.name + ' ' })
      } else if (selectedInput === 'email') {
        setForm({ ...form, email: form.email + ' ' })
      } else if (selectedInput === 'phone') {
        setForm({ ...form, phone: form.phone + ' ' })
      }
    } else {
      // Handle other keys
      if (selectedInput === 'name') {
        setForm({ ...form, name: form.name + button })
      } else if (selectedInput === 'email') {
        setForm({ ...form, email: form.email + button })
      } else if (selectedInput === 'phone') {
        setForm({ ...form, phone: form.phone + button })
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

  const isValidEmail = (email: string) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    return emailRegex.test(email)
  }

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    return phoneRegex.test(phone)
  }

  function save() {
    if (!form.name || !form.email || !form.phone) {
      setError('Veuillez remplir tous les champs')
      return
    }

    if (!isValidEmail(form.email)) {
      setError('Veuillez entrer un email valide')
      return
    }

    if (!isValidPhone(form.phone)) {
      setError('Veuillez entrer un numéro de téléphone valide')
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
        phone: '',
        age: '6-10'
      })
      setIsAccepted(false)
      setError('')
    }
  }, [status])

  useEffect(() => {
    if (form.name && isValidEmail(form.email) && isValidPhone(form.phone) && isAccepted) {
      setIsFormValid(true)
    } else {
      setIsFormValid(false)
    }
  }, [form, isAccepted])

  return (
    <div className={`${status === 'registering' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all w-256 ease-in-out shadow-2xl flex flex-col items-center justify-center text-xl space-y-4 p-16 bg-white text-g404-bleu border`}>
      <span className="text-3xl poppins-bold">INFORMATIONS</span>
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
        <div className="flex justify-between space-x-4">
          <div className="flex flex-col flex-grow space-y-2">
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
          </div>
          <div className="flex flex-col flex-grow space-y-2">
            <label className="text-xl text-gray-600 ml-2">Votre numéro de téléphone</label>
            <input
              type="tel"
              // placeholder="Votre numéro de téléphone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              onFocus={() => setSelectedInput('phone')}
              className="border border-gray-300 p-2 rounded"
              required
            />
          </div>
        </div>
        <div></div>
        <label className="text-xl text-gray-600 ml-2">L'âge de votre enfant</label>
        <select
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value as '6-10' | '10-16' | '16-18' | 'autres' })}
          className="border border-gray-300 p-2 rounded"
          required
        >
          <option value="6-10">6 à 10 ans</option>
          <option value="10-16">10 à 16 ans</option>
          <option value="16-18">16 à 18 ans</option>
          <option value="autres">Autres</option>
        </select>
        <div></div>
        <div></div>
        <div className="flex items-center space-x-6">
        <label className="inline-flex items-center cursor-pointer">
          <input
            ref={checkboxRef}
            type="checkbox"
            className="peer hidden"
            checked={isAccepted}
            onChange={(e) => setIsAccepted(e.target.checked)}
          />
          <div className="w-8 h-8 border-2 border-gray-300 rounded-md peer-checked:bg-g404-violet peer-checked:border-g404-violet"></div>
        </label>
        <label htmlFor="consent" className="text-gray-600">J'autorise Garage404 à enregistrer mes données personnelles pour me contacter et m'envoyer des offres promotionnelles.</label>
        </div>
        <div></div>
        <div onClick={() => isFormValid ? save() : null} className={`${isFormValid ? 'opacity-100' : 'opacity-50'} bg-g404-violet text-white rounded-xl text-center p-4 poppins-bold`}>
          PARTICIPER
        </div>
        <div></div>
        {/* <p>Votre code de réduction vous sera envoyé par mail à la fin de l'évènement.</p> */}
        <p className="text-sm">
          Nous collectons vos données pour améliorer notre service, personnaliser vos offres et vous envoyer votre coupon de réduction. La base légale est votre consentement explicite. Responsable de traitement : Garage404. Destinataires : aucune tierce partie. Vos droits (accès, rectification, etc.) peuvent être exercés en contactant notre DPO à contact@garage404.com. Conservation : 2 ans.
        </p>
      </form>
      <div className={`transform transition-all w-full mt-8 ${selectedInput ? 'translate-y-0' : 'translate-y-96'} ease-in-out`}>
        <Keyboard
          // onChange={onChange}
          onKeyPress={onKeyPress}
          layoutName={layoutName}
          layout={{
            'default': [
              '' + ' 1 2 3 4 5 6 7 8 9 0 ° + {bksp}',
              '{tab} a z e r t y u i o p ^ $',
              '{lock} q s d f g h j k l m ù * {enter}',
              '{shift} w x c v b n , ; : ! {shift}',
              '.com @ {space}',
              'gmail.com orange.fr free.fr sfr.fr bbox.fr'
            ],
            'shift': [
              '² & é " \' ( - è _ ç à ) = {bksp}',
              '{tab} A Z E R T Y U I O P ¨ £',
              '{lock} Q S D F G H J K L M % µ {enter}',
              '{shift} W X C V B N ? . / § {shift}',
              '.com @ {space}',
              'gmail.com orange.fr free.fr sfr.fr bbox.fr'
            ]
          }}
          numpad: true
          display={{
            '{bksp}': '⇦',
            '{enter}': '⏎',
            '{shift}': '⇧',
            '{lock}': '⇪',
            '{tab}': '↹',
            '{space}': 'Espace'
          }}
        />
      </div>
    </div>
  )
}

export default Register