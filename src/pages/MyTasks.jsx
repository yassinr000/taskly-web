import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { STATUS_LABELS, formatDate, isOverdue } from '../utils/tasks'

const FILTERS = [
  { key: 'all', label: 'Toutes', params: {} },
  { key: 'todo', label: 'To Do', params: { status: 'todo' } },
  { key: 'in_progress', label: 'In Progress', params: { status: 'in_progress' } },
  { key: 'done', label: 'Done', params: { status: 'done' } },
  { key: 'overdue', label: 'En retard', params: { overdue: 1 } },
]

export default function MyTasks() {
  const [filter, setFilter] = useState(FILTERS[0])
  const [tasks, setTasks] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setTasks(null)
    setError('')
    api
      .get('/my-tasks', { params: filter.params })
      .then((r) => setTasks(r.data))
      .catch(() => setError('Impossible de charger tes tâches.'))
  }, [filter])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mes tâches</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm border ${
              filter.key === f.key
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {!tasks && !error && <p>Chargement...</p>}
      {tasks && tasks.length === 0 && (
        <p className="text-slate-500">Aucune tâche ne correspond à ce filtre.</p>
      )}

      <ul className="space-y-2">
        {tasks?.map((t) => (
          <li key={t.id} className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium">{t.title}</p>
              <p className="text-sm text-slate-500">
                Board :{' '}
                <Link to={`/boards/${t.board_id}`} className="text-green-600 hover:underline">
                  {t.board?.name}
                </Link>
              </p>
            </div>
            <div className="text-sm flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-full bg-slate-100">{STATUS_LABELS[t.status]}</span>
              <span className={isOverdue(t) ? 'text-red-600 font-semibold' : 'text-slate-500'}>
                {formatDate(t.due_date)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
