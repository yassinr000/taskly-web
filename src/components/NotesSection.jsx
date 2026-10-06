import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { parseError } from '../utils/errors'

export default function NotesSection({ task, board }) {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(
    () => api.get(`/tasks/${task.id}/notes`).then((r) => setNotes(r.data)),
    [task.id]
  )

  useEffect(() => {
    load().catch(() => setError('Impossible de charger les notes.'))
  }, [load])

  const add = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post(`/tasks/${task.id}/notes`, { content })
      setContent('')
      load()
    } catch (err) {
      setError(parseError(err).fields.content || parseError(err).message)
    }
  }

  const remove = async (note) => {
    if (!window.confirm('Supprimer cette note ?')) return
    try {
      await api.delete(`/notes/${note.id}`)
      load()
    } catch (err) {
      setError(parseError(err).message)
    }
  }

  return (
    <section>
      <h3 className="font-semibold mb-2">Notes ({notes.length})</h3>
      <ul className="space-y-2 mb-3">
        {notes.map((n) => (
          <li key={n.id} className="bg-slate-50 rounded-lg p-2 text-sm">
            <p className="whitespace-pre-wrap">{n.content}</p>
            <p className="text-xs text-slate-500 mt-1">
              {n.user?.name} · {new Date(n.created_at).toLocaleString('fr-FR')}
              {(n.user_id === user.id || board.owner_id === user.id) && (
                <button onClick={() => remove(n)} className="ml-2 text-red-600 hover:underline">
                  Supprimer
                </button>
              )}
            </p>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ajouter une note..."
          className="flex-1 border border-slate-300 rounded-lg p-2 text-sm"
          required
        />
        <button className="bg-green-600 text-white rounded-lg px-3 text-sm hover:bg-green-700">Ajouter</button>
      </form>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </section>
  )
}
