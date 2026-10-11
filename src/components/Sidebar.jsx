import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const links = [
  { to: '/', label: 'Dashboard', icon: 'home', end: true },
  { to: '/my-tasks', label: 'Mes tâches', icon: 'tasks' },
  { to: '/boards', label: 'Boards', icon: 'boards' },
  { to: '/receipt', label: 'Reçu', icon: 'receipt' },
  { to: '/settings', label: 'Paramètres', icon: 'settings' },
]

// Sur ordinateur : menu à gauche. Sur téléphone : barre fixe en bas de l'écran.
// Les couleurs en [...] ne changent pas avec le thème : ce menu reste sombre dans les deux thèmes.
export default function Sidebar() {
  return (
    <aside className="fixed bottom-0 inset-x-0 z-40 bg-slate-900 text-slate-400 border-t border-[rgba(255,255,255,.08)] pb-[env(safe-area-inset-bottom)] md:static md:w-60 md:min-h-screen md:p-4 md:border-t-0">
      <div className="hidden md:flex items-center gap-2 mb-8 px-2">
        <span className="grid place-items-center w-8 h-8 rounded-lg bg-green-600 text-white font-bold">T</span>
        <p className="text-xl font-semibold text-[#fff]">Taskly</p>
      </div>
      <nav aria-label="Navigation principale" className="flex md:flex-col md:gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex flex-1 md:flex-none flex-col md:flex-row items-center justify-center md:justify-start gap-0.5 md:gap-3 px-1 py-2 md:px-3 md:py-2.5 text-[11px] md:text-sm font-medium whitespace-nowrap border-t-2 md:border-t-0 md:border-l-2 md:rounded-lg ${
                isActive
                  ? 'bg-[rgba(255,255,255,.1)] text-[#fff] border-green-500'
                  : 'border-transparent hover:text-[#fff] md:hover:bg-[rgba(255,255,255,.05)]'
              }`
            }
          >
            <Icon name={l.icon} size={20} />
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
