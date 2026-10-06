import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import Field from '../components/Field'
import { parseError } from '../utils/errors'

function BoardForm({ board, onSaved, onClose }) {
  const editing = Boolean(board.id)
  const [name, setName] = useState(board.name || '')
  const [description, setDescription] = useState(board.description || '')
  const [fields, setFields] = useState({})
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setFields({})
    try {
      if (editing) await api.put(`/boards/${board.id}`, { name, description })
      else await api.post('/boards', { name, description })
      onSaved()
    } catch (err) {
      const parsed = parseError(err)
      setError(parsed.message)
      setFields(parsed.fields)
    }
  }

  return (
    <Modal title={editing ? 'Modifier le board' : 'Nouveau board'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error && Object.keys(fields).length === 0 && <p className="text-red-600 text-sm">{error}</p>}
        <Field label="Nom" value={name} onChange={(e) => setName(e.target.value)} error={fields.name} required />
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full border border-slate-300 rounded-lg p-2"
          />
        </label>
        <button className="w-full bg-green-600 text-white rounded-lg p-2 hover:bg-green-700">
          Enregistrer
        </button>
      </form>
    </Modal>
  )
}

export default function Boards() {
  const { user } = useAuth()
  const [boards, setBoards] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null = fermé, {} = création, board = modification

  const load = () =>
    api
      .get('/boards')
      .then((r) => setBoards(r.data))
      .catch(() => setError('Impossible de charger les boards.'))

  useEffect(() => {
    load()
  }, [])

  const remove = async (board) => {
    if (!window.confirm(`Supprimer le board « ${board.name} » et toutes ses tâches ?`)) return
    try {
      await api.delete(`/boards/${board.id}`)
      load()
    } catch (err) {
      setError(parseError(err).message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Boards</h1>
        <button onClick={() => setEditing({})} className="bg-green-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-green-700">
          + Nouveau board
        </button>
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {!boards && !error && <p>Chargement...</p>}
      {boards && boards.length === 0 && (
        <p className="text-slate-500">Tu n'as encore aucun board. Crée le premier avec le bouton ci-dessus.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards?.map((b) => (
          <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-2">
            <Link to={`/boards/${b.id}`} className="text-lg font-semibold text-green-700 hover:underline">
              {b.name}
            </Link>
            <p className="text-sm text-slate-500 flex-1">{b.description || 'Pas de description'}</p>
            <p className="text-xs text-slate-500">
              {b.tasks_count} tâche(s) · propriétaire : {b.owner?.name}
            </p>
            {b.owner_id === user.id && (
              <div className="flex gap-3 text-sm">
                <button onClick={() => setEditing(b)} className="text-blue-600 hover:underline">Modifier</button>
                <button onClick={() => remove(b)} className="text-red-600 hover:underline">Supprimer</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <BoardForm
          board={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            load()
          }}
        />
      )}
    </div>
  )
}
