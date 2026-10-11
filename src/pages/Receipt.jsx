import { useEffect, useState } from 'react'
import api from '../api/axios'
import Icon from '../components/Icon'
import StatCard from '../components/StatCard'
import { ListSkeleton, Skeleton, Spinner, StatsSkeleton } from '../components/Skeleton'
import { downloadReceipt } from '../utils/receiptPdf'
import { PRIORITY_LABELS, STATUS_LABELS, formatDate, isOverdue } from '../utils/tasks'

export default function Receipt() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.get('/me'), api.get('/dashboard'), api.get('/my-tasks')])
      .then(([me, dashboard, tasks]) => {
        if (!cancelled) setData({ user: me.data, stats: dashboard.data, tasks: tasks.data })
      })
      .catch(() => {
        if (!cancelled) setError('Impossible de charger tes données.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const download = async () => {
    setError('')
    setGenerating(true)
    try {
      await downloadReceipt(data)
    } catch {
      setError('Impossible de générer le PDF. Réessaie dans un instant.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reçu d'activité</h1>
          <p className="text-slate-500 max-w-xl">
            Un PDF avec tes informations, un résumé et la liste des tâches qui te sont assignées.
          </p>
        </div>
        <button
          onClick={download}
          disabled={!data || generating}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-60"
        >
          {generating ? <Spinner /> : <Icon name="download" size={16} />}
          {generating ? 'Génération...' : 'Télécharger le PDF'}
        </button>
      </div>

      {error && <p className="text-red-600" role="alert">{error}</p>}

      {!data && !error && (
        <div role="status" aria-busy="true">
          <span className="sr-only">Chargement...</span>
          <Skeleton className="h-24 mb-6" />
          <StatsSkeleton count={5} />
          <ListSkeleton rows={4} />
        </div>
      )}

      {data && (
        <>
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="font-semibold mb-3">Utilisateur</h2>
            <dl className="grid sm:grid-cols-[9rem_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-slate-500">Nom</dt>
              <dd className="font-medium break-words">{data.user.name}</dd>
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium break-all">{data.user.email}</dd>
              <dt className="text-slate-500">Membre depuis</dt>
              <dd className="font-medium">
                {data.user.created_at ? formatDate(String(data.user.created_at).slice(0, 10)) : '—'}
              </dd>
            </dl>
          </section>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label="Actives" value={data.stats.my_tasks} />
            <StatCard label="À faire" value={data.stats.todo} />
            <StatCard label="En cours" value={data.stats.in_progress} color="text-blue-600" />
            <StatCard label="Terminées" value={data.stats.completed} color="text-green-600" />
            <StatCard label="En retard" value={data.stats.overdue} color="text-red-600" />
          </div>

          <section>
            <h2 className="font-semibold mb-2">Tâches assignées ({data.tasks.length})</h2>
            {data.tasks.length === 0 && <p className="text-slate-500">Aucune tâche ne t'est assignée.</p>}
            <ul className="space-y-2">
              {data.tasks.map((t) => (
                <li key={t.id} className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium break-words">{t.title}</p>
                    <p className="text-sm text-slate-500">
                      {t.board?.name} · Priorité {PRIORITY_LABELS[t.priority]?.toLowerCase()}
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
          </section>
        </>
      )}
    </div>
  )
}
