import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Field from '../components/Field'
import ThemeToggle from '../components/ThemeToggle'
import { Spinner } from '../components/Skeleton'
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
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-green-600 font-bold">T</span>
          <span className="text-xl font-semibold">Taskly</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Organisez le travail de votre équipe, simplement.</h2>
          <p className="mt-4 text-slate-400 max-w-md">Boards, tâches, notes, fichiers et notifications au même endroit.</p>
        </div>
        <p className="text-sm text-slate-500">© 2026 Taskly</p>
      </div>
      <div className="relative flex items-center justify-center bg-slate-50 p-6">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <form onSubmit={submit} className="w-full max-w-sm space-y-5" style={{ animation: 'rise .4s ease-out both' }}>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Connexion</h1>
            <p className="text-sm text-slate-500 mt-1">Accédez à votre espace de travail.</p>
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3" role="alert">{error}</p>}
          <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Field label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg p-2.5 font-medium hover:bg-green-700 disabled:opacity-60"
          >
            {loading && <Spinner />}
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <p className="text-sm text-center text-slate-600">
            Pas de compte ? <Link to="/register" className="text-green-600 font-medium hover:underline">S'inscrire</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
