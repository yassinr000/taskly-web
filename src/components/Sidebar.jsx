import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/my-tasks', label: 'Mes tâches' },
  { to: '/boards', label: 'Boards' },
  { to: '/settings', label: 'Paramètres' },
]

export default function Sidebar() {
  return (
    <aside className="bg-white border-b md:border-b-0 md:border-r border-slate-200 md:w-56 md:min-h-screen p-4">
      <p className="hidden md:block text-2xl font-bold text-green-600 mb-4">Taskly</p>
      <nav className="flex md:flex-col gap-1 overflow-x-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                isActive ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
