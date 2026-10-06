import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import NotificationBell from './NotificationBell'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen md:flex bg-slate-50 text-slate-800">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-end gap-4 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-3">
          <NotificationBell />
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-semibold" aria-hidden="true">
              {user.name?.[0]?.toUpperCase()}
            </span>
            <span className="text-sm font-medium text-slate-700">{user.name}</span>
          </div>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-red-600">
            Déconnexion
          </button>
        </header>
        <main className="p-4 md:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
