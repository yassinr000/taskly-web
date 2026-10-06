import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  STATUSES,
  STATUS_LABELS,
  formatDate,
  isOverdue,
} from '../utils/tasks'

export default function TaskCard({ task, canDelete, onOpen, onStatus, onEdit, onDelete }) {
  const overdue = isOverdue(task)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 space-y-2">
      <button onClick={() => onOpen(task)} className="font-medium text-left hover:underline">
        {task.title}
      </button>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        {task.due_date && (
          <span className={overdue ? 'text-red-600 font-semibold' : 'text-slate-500'}>
            {overdue ? 'En retard : ' : '⏰ '}
            {formatDate(task.due_date)}
          </span>
        )}
        {task.assignee && <span className="text-slate-500">👤 {task.assignee.name}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={task.status}
          onChange={(e) => onStatus(task, e.target.value)}
          className="text-xs border border-slate-300 rounded p-1"
          aria-label="Statut"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button onClick={() => onEdit(task)} className="text-xs text-blue-600 hover:underline">
          Modifier
        </button>
        {canDelete && (
          <button onClick={() => onDelete(task)} className="text-xs text-red-600 hover:underline">
            Supprimer
          </button>
        )}
      </div>
    </div>
  )
}
