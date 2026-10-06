import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import usePolling from '../hooks/usePolling'
import StatCard from '../components/StatCard'
import Donut from '../components/Donut'
import { formatDate } from '../utils/tasks'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  // Charge les chiffres maintenant, puis toutes les 30 secondes.
  usePolling(() => {
    api
      .get('/dashboard')
      .then((r) => {
        setStats(r.data)
        setError('')
      })
      .catch(() => setError('Impossible de charger le dashboard.'))
  }, 30000)

  if (!stats) return <p className={error ? 'text-red-600' : ''}>{error || 'Chargement...'}</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bienvenue, {user.name} 👋</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Mes tâches" value={stats.my_tasks} />
        <StatCard label="En cours" value={stats.in_progress} color="text-blue-600" />
        <StatCard label="Terminées" value={stats.completed} color="text-green-600" />
        <StatCard label="En retard" value={stats.overdue} color="text-red-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="font-semibold mb-4">Répartition des tâches</h2>
          <Donut todo={stats.todo} inProgress={stats.in_progress} done={stats.completed} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="font-semibold mb-2">À venir</h2>
          {stats.upcoming.length === 0 && (
            <p className="text-sm text-slate-500">Aucune échéance à venir.</p>
          )}
          <ul className="space-y-1">
            {stats.upcoming.map((t) => (
              <li key={t.id} className="text-sm">
                {t.title} <span className="text-slate-500">: {formatDate(t.due_date)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
