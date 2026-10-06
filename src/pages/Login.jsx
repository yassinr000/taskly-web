import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Field from '../components/Field'
import { parseError } from '../utils/errors'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(parseError(err, 'Erreur de connexion').message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-green-600">Taskly</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button
          disabled={loading}
          className="w-full bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        <p className="text-sm text-center">
          Pas de compte ? <Link to="/register" className="text-green-600">S'inscrire</Link>
        </p>
      </form>
    </div>
  )
}
