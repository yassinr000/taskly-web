import Modal from './Modal'
import NotesSection from './NotesSection'
import FilesSection from './FilesSection'
import ChecklistSection from './ChecklistSection'
import { PRIORITY_LABELS, STATUS_LABELS, formatDate } from '../utils/tasks'

export default function TaskDetailModal({ task, board, onClose }) {
  return (
    <Modal title={task.title} onClose={onClose} wide>
      <div className="space-y-6">
        <div className="text-sm text-slate-600 space-y-1">
          {task.description && <p className="whitespace-pre-wrap">{task.description}</p>}
          <p>
            Statut : <strong>{STATUS_LABELS[task.status]}</strong> · Priorité :{' '}
            <strong>{PRIORITY_LABELS[task.priority]}</strong> · Échéance :{' '}
            <strong>{formatDate(task.due_date)}</strong>
            {task.assignee && <> · Assignée à : <strong>{task.assignee.name}</strong></>}
          </p>
        </div>
        <ChecklistSection task={task} />
        <NotesSection task={task} board={board} />
        <FilesSection task={task} board={board} />
      </div>
    </Modal>
  )
}
