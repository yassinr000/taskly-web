import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Field from '../components/Field'
import ThemeToggle from '../components/ThemeToggle'
import { Spinner } from '../components/Skeleton'
import { parseError } from '../utils/errors'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [fields, setFields] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setFields({})
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      const parsed = parseError(err)
      setError(parsed.message)
      setFields(parsed.fields)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-green-600">Créer un compte</h1>
        {error && Object.keys(fields).length === 0 && <p className="text-red-600 text-sm">{error}</p>}
        <Field label="Nom" value={form.name} onChange={set('name')} error={fields.name} required />
        <Field label="Email" type="email" value={form.email} onChange={set('email')} error={fields.email} required />
        <Field label="Mot de passe (8 caractères minimum)" type="password" value={form.password} onChange={set('password')} error={fields.password} required />
        <Field label="Confirmer le mot de passe" type="password" value={form.password_confirmation} onChange={set('password_confirmation')} required />
        <button
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 disabled:opacity-60"
        >
          {loading && <Spinner />}
          {loading ? 'Création...' : "S'inscrire"}
        </button>
        <p className="text-sm text-center">
          Déjà un compte ? <Link to="/login" className="text-green-600">Se connecter</Link>
        </p>
      </form>
    </div>
  )
}
