import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { parseError } from '../utils/errors'

export default function MembersPanel({ board, onChanged }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isOwner = board.owner_id === user.id
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const invite = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      const res = await api.post(`/boards/${board.id}/members`, { email })
      setMessage(res.data.message)
      setEmail('')
      onChanged()
    } catch (err) {
      const parsed = parseError(err)
      setError(parsed.fields.email || parsed.message)
    }
  }

  const remove = async (member) => {
    const self = member.id === user.id
    const question = self ? 'Quitter ce board ?' : `Retirer ${member.name} du board ?`
    if (!window.confirm(question)) return
    try {
      await api.delete(`/boards/${board.id}/members/${member.id}`)
      if (self) navigate('/boards')
      else onChanged()
    } catch (err) {
      setError(parseError(err).message)
    }
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-4">
      <h2 className="font-semibold mb-3">Membres ({board.members.length})</h2>

      <ul className="space-y-2 mb-4">
        {board.members.map((m) => {
          const memberIsOwner = m.id === board.owner_id
          const canRemove = !memberIsOwner && (isOwner || m.id === user.id)
          return (
            <li key={m.id} className="flex items-center justify-between text-sm">
              <span>
                {m.name} <span className="text-slate-500">({m.email})</span>
                {memberIsOwner && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Propriétaire
                  </span>
                )}
              </span>
              {canRemove && (
                <button onClick={() => remove(m)} className="text-red-600 hover:underline">
                  {m.id === user.id ? 'Quitter' : 'Retirer'}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      {isOwner && (
        <form onSubmit={invite} className="flex flex-wrap gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email du membre à inviter"
            className="flex-1 min-w-48 border border-slate-300 rounded-lg p-2 text-sm"
            required
          />
          <button className="bg-green-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-green-700">
            Inviter
          </button>
        </form>
      )}
      {message && <p className="text-sm text-green-700 mt-2">{message}</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </section>
  )
}
