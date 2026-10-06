import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/my-tasks', label: 'Mes tâches' },
  { to: '/boards', label: 'Boards' },
  { to: '/settings', label: 'Paramètres' },
]

export default function Sidebar() {
  return (
    <aside className="bg-slate-900 text-slate-300 md:w-60 md:min-h-screen p-4">
      <div className="hidden md:flex items-center gap-2 mb-8 px-2">
        <span className="grid place-items-center w-8 h-8 rounded-lg bg-green-600 text-white font-bold">T</span>
        <p className="text-xl font-semibold text-white">Taskly</p>
      </div>
      <nav className="flex md:flex-col gap-1 overflow-x-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap border-l-2 ${
                isActive
                  ? 'bg-white/10 text-white border-green-500'
                  : 'border-transparent hover:bg-white/5 hover:text-white'
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
