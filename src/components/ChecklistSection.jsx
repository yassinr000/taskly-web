import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'
import { parseError } from '../utils/errors'

export default function ChecklistSection({ task }) {
  const [items, setItems] = useState([])
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(
    () => api.get(`/tasks/${task.id}/checklist`).then((r) => setItems(r.data)),
    [task.id]
  )

  useEffect(() => {
    load().catch(() => setError('Impossible de charger la checklist.'))
  }, [load])

  const add = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post(`/tasks/${task.id}/checklist`, { label })
      setLabel('')
      load()
    } catch (err) {
      setError(parseError(err).fields.label || parseError(err).message)
    }
  }

  const toggle = async (item) => {
    try {
      await api.put(`/checklist/${item.id}`, { done: !item.done })
      load()
    } catch (err) {
      setError(parseError(err).message)
    }
  }

  const remove = async (item) => {
    try {
      await api.delete(`/checklist/${item.id}`)
      load()
    } catch (err) {
      setError(parseError(err).message)
    }
  }

  const doneCount = items.filter((i) => i.done).length

  return (
    <section>
      <h3 className="font-semibold mb-2">
        Checklist {items.length > 0 && `(${doneCount}/${items.length})`}
      </h3>
      <ul className="space-y-1 mb-3">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={i.done} onChange={() => toggle(i)} />
            <span className={`flex-1 ${i.done ? 'line-through text-slate-400' : ''}`}>{i.label}</span>
            <button onClick={() => remove(i)} className="text-red-600 hover:underline text-xs">
              Supprimer
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="flex gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nouvel élément..."
          className="flex-1 border border-slate-300 rounded-lg p-2 text-sm"
          required
        />
        <button className="bg-green-600 text-white rounded-lg px-3 text-sm hover:bg-green-700">Ajouter</button>
      </form>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </section>
  )
}
