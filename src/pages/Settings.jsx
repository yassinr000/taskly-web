import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Field from '../components/Field'
import { parseError } from '../utils/errors'

export default function Settings() {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user.name)
  const [profileFields, setProfileFields] = useState({})
  const [profileMessage, setProfileMessage] = useState('')

  const emptyPw = { current_password: '', password: '', password_confirmation: '' }
  const [pw, setPw] = useState(emptyPw)
  const [pwFields, setPwFields] = useState({})
  const [pwMessage, setPwMessage] = useState('')
  const [pwError, setPwError] = useState('')

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileFields({})
    setProfileMessage('')
    try {
      const res = await api.put('/profile', { name })
      updateUser(res.data)
      setProfileMessage('Profil mis à jour.')
    } catch (err) {
      setProfileFields(parseError(err).fields)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setPwFields({})
    setPwMessage('')
    setPwError('')
    try {
      const res = await api.put('/password', pw)
      setPwMessage(res.data.message)
      setPw(emptyPw)
    } catch (err) {
      const parsed = parseError(err)
      setPwFields(parsed.fields)
      if (Object.keys(parsed.fields).length === 0) setPwError(parsed.message)
    }
  }

  const setPwField = (name) => (e) => setPw({ ...pw, [name]: e.target.value })

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <form onSubmit={saveProfile} className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        <h2 className="font-semibold">Profil</h2>
        <p className="text-sm text-slate-500">Email : {user.email}</p>
        <Field label="Nom" value={name} onChange={(e) => setName(e.target.value)} error={profileFields.name} required />
        {profileMessage && <p className="text-sm text-green-700">{profileMessage}</p>}
        <button className="bg-green-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-green-700">Enregistrer</button>
      </form>

      <form onSubmit={savePassword} className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        <h2 className="font-semibold">Mot de passe</h2>
        <Field label="Mot de passe actuel" type="password" value={pw.current_password} onChange={setPwField('current_password')} error={pwFields.current_password} required />
        <Field label="Nouveau mot de passe (8 caractères minimum)" type="password" value={pw.password} onChange={setPwField('password')} error={pwFields.password} required />
        <Field label="Confirmer le nouveau mot de passe" type="password" value={pw.password_confirmation} onChange={setPwField('password_confirmation')} required />
        {pwError && <p className="text-sm text-red-600">{pwError}</p>}
        {pwMessage && <p className="text-sm text-green-700">{pwMessage}</p>}
        <button className="bg-green-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-green-700">Changer le mot de passe</button>
      </form>
    </div>
  )
}
