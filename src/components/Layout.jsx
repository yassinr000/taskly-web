import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'
import Icon from './Icon'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen md:flex bg-slate-50 text-slate-800">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between md:justify-end gap-3 md:gap-4 bg-white/90 backdrop-blur border-b border-slate-200 px-4 md:px-6 pb-2.5 md:pb-3 pt-[calc(0.625rem+env(safe-area-inset-top))] md:pt-3">
          <div className="md:hidden flex items-center gap-2">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-green-600 text-white font-bold">T</span>
            <span className="font-semibold">Taskly</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            <NotificationBell />
            <div className="hidden sm:flex items-center gap-2">
              <span className="grid place-items-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-semibold" aria-hidden="true">
                {user.name?.[0]?.toUpperCase()}
              </span>
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
            </div>
            <button onClick={logout} aria-label="Déconnexion" className="text-slate-500 hover:text-red-600">
              <span className="md:hidden"><Icon name="logout" size={20} /></span>
              <span className="hidden md:inline text-sm">Déconnexion</span>
            </button>
          </div>
        </header>
        <main className="p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:p-8 md:pb-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
