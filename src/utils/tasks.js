// Date du jour au format AAAA-MM-JJ, à l'heure locale.
export const todayStr = () => new Date().toLocaleDateString('en-CA')

// Une tâche est en retard si elle a une échéance passée et n'est pas terminée.
export function isOverdue(task) {
  return Boolean(task.due_date) && task.status !== 'done' && task.due_date < todayStr()
}

// 2026-10-04 devient 04/10/2026.
export function formatDate(value) {
  if (!value) return '—'
  return new Date(value + 'T00:00:00').toLocaleDateString('fr-FR')
}

export const STATUSES = ['todo', 'in_progress', 'done']
export const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' }
export const PRIORITY_LABELS = { low: 'Basse', medium: 'Moyenne', high: 'Haute' }
export const PRIORITY_STYLES = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
}
