import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import usePolling from '../hooks/usePolling'

export default function NotificationBell() {
  const navigate = useNavigate()
  const [data, setData] = useState({ unread_count: 0, notifications: [] })
  const [open, setOpen] = useState(false)

  const load = () =>
    api
      .get('/notifications')
      .then((r) => setData(r.data))
      .catch(() => {})

  // Même principe que le dashboard : on actualise toutes les 30 secondes.
  usePolling(load, 30000)

  const openNotification = async (n) => {
    if (!n.read_at) await api.post(`/notifications/${n.id}/read`).catch(() => {})
    setOpen(false)
    load()
    if (n.data.board_id) navigate(`/boards/${n.data.board_id}`)
  }

  const readAll = async () => {
    await api.post('/notifications/read-all').catch(() => {})
    load()
  }

  return (
    <div className="md:relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-xl p-1"
        aria-label={`Notifications (${data.unread_count} non lues)`}
      >
        🔔
        {data.unread_count > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
            {data.unread_count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-3 right-3 top-full mt-2 md:left-auto md:right-0 md:w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-40">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
            <span className="font-semibold text-sm">Notifications</span>
            {data.unread_count > 0 && (
              <button onClick={readAll} className="text-xs text-green-600 hover:underline">
                Tout marquer comme lu
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {data.notifications.length === 0 && (
              <li className="p-3 text-sm text-slate-500">Aucune notification.</li>
            )}
            {data.notifications.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => openNotification(n)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${n.read_at ? 'text-slate-500' : 'font-medium'}`}
                >
                  {n.data.message}
                  <span className="block text-xs text-slate-400">
                    {new Date(n.created_at).toLocaleString('fr-FR')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
