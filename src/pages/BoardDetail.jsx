import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import TaskCard from '../components/TaskCard'
import TaskFormModal from '../components/TaskFormModal'
import MembersPanel from '../components/MembersPanel'
import TaskDetailModal from '../components/TaskDetailModal'
import { STATUSES, STATUS_LABELS } from '../utils/tasks'

export default function BoardDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [board, setBoard] = useState(null)
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')
  const [formTask, setFormTask] = useState(null) // null = fermé, {} = création, task = modification
  const [detailTask, setDetailTask] = useState(null) // la tâche dont on affiche le détail

  const loadBoard = useCallback(() => api.get(`/boards/${id}`).then((r) => setBoard(r.data)), [id])
  const loadTasks = useCallback(() => api.get(`/boards/${id}/tasks`).then((r) => setTasks(r.data)), [id])
  const reload = useCallback(() => Promise.all([loadBoard(), loadTasks()]), [loadBoard, loadTasks])

  useEffect(() => {
    reload().catch((err) =>
      setError(err.response?.status === 403 ? "Tu n'as pas accès à ce board." : 'Impossible de charger le board.')
    )
  }, [reload])

  const changeStatus = async (task, status) => {
    try {
      await api.put(`/tasks/${task.id}`, { status })
      loadTasks()
    } catch {
      setError('Impossible de changer le statut.')
    }
  }

  const removeTask = async (task) => {
    if (!window.confirm(`Supprimer la tâche « ${task.title} » ?`)) return
    try {
      await api.delete(`/tasks/${task.id}`)
      loadTasks()
    } catch {
      setError('Impossible de supprimer la tâche.')
    }
  }

  if (error && !board) {
    return (
      <div>
        <p className="text-red-600 mb-2">{error}</p>
        <Link to="/boards" className="text-green-600 hover:underline">← Retour aux boards</Link>
      </div>
    )
  }
  if (!board) return <p>Chargement...</p>

  const canDelete = (task) => task.created_by === user.id || board.owner_id === user.id

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/boards" className="text-sm text-green-600 hover:underline">← Boards</Link>
          <h1 className="text-2xl font-bold">{board.name}</h1>
          {board.description && <p className="text-slate-500">{board.description}</p>}
        </div>
        <button onClick={() => setFormTask({})} className="bg-green-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-green-700">
          + Nouvelle tâche
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid md:grid-cols-3 gap-4">
        {STATUSES.map((status) => {
          const column = tasks.filter((t) => t.status === status)
          return (
            <section key={status} className="bg-slate-100 rounded-xl p-3 space-y-3">
              <h2 className="font-semibold text-sm text-slate-600">
                {STATUS_LABELS[status]} ({column.length})
              </h2>
              {column.length === 0 && <p className="text-sm text-slate-400">Aucune tâche</p>}
              {column.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  canDelete={canDelete(task)}
                  onOpen={setDetailTask}
                  onStatus={changeStatus}
                  onEdit={setFormTask}
                  onDelete={removeTask}
                />
              ))}
            </section>
          )
        })}
      </div>

      <MembersPanel board={board} onChanged={reload} />

      {formTask && (
        <TaskFormModal
          board={board}
          task={formTask}
          onClose={() => setFormTask(null)}
          onSaved={() => {
            setFormTask(null)
            loadTasks()
          }}
        />
      )}

      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          board={board}
          onClose={() => setDetailTask(null)}
        />
      )}
    </div>
  )
}
