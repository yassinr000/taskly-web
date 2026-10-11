import { useState } from 'react'
import api from '../api/axios'
import Modal from './Modal'
import Field from './Field'
import { parseError } from '../utils/errors'
import { PRIORITY_LABELS, STATUSES, STATUS_LABELS } from '../utils/tasks'

export default function TaskFormModal({ board, task, onSaved, onClose }) {
  const editing = Boolean(task.id)
  const [form, setForm] = useState({
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'todo',
    priority: task.priority || 'medium',
    due_date: task.due_date || '',
    assigned_to: task.assigned_to || '',
  })
  const [fields, setFields] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setFields({})
    setSaving(true)
    // Un champ vide doit devenir null pour que l'API l'accepte.
    const payload = { ...form, due_date: form.due_date || null, assigned_to: form.assigned_to || null }
    try {
      if (editing) await api.put(`/tasks/${task.id}`, payload)
      else await api.post(`/boards/${board.id}/tasks`, payload)
      onSaved()
    } catch (err) {
      const parsed = parseError(err)
      setError(parsed.message)
      setFields(parsed.fields)
    } finally {
      setSaving(false)
    }
  }

  const selectClass = 'mt-1 w-full border border-slate-300 rounded-lg p-2 bg-white'

  return (
    <Modal title={editing ? 'Modifier la tâche' : 'Nouvelle tâche'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error && Object.keys(fields).length === 0 && <p className="text-red-600 text-sm">{error}</p>}

        <Field label="Titre" value={form.title} onChange={set('title')} error={fields.title} required />

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            className="mt-1 w-full border border-slate-300 rounded-lg p-2"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Statut</span>
            <select value={form.status} onChange={set('status')} className={selectClass}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Priorité</span>
            <select value={form.priority} onChange={set('priority')} className={selectClass}>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Date limite" type="date" value={form.due_date} onChange={set('due_date')} error={fields.due_date} />
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Assignée à</span>
            <select value={form.assigned_to} onChange={set('assigned_to')} className={selectClass}>
              <option value="">Personne</option>
              {board.members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            {fields.assigned_to && <span className="text-sm text-red-600">{fields.assigned_to}</span>}
          </label>
        </div>

        <button disabled={saving} className="w-full bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 disabled:opacity-60">
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </Modal>
  )
}
