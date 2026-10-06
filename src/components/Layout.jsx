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
        <header className="flex items-center justify-end gap-4 bg-white border-b border-slate-200 px-6 py-3">
          <NotificationBell />
          <span className="text-sm text-slate-600">{user.name}</span>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">
            Déconnexion
          </button>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
