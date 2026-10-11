import { useEffect, useState } from 'react'
import Icon from './Icon'
import { applyMode, getMode, setMode } from '../utils/theme'

const OPTIONS = [
  { key: 'light', label: 'Thème clair', icon: 'sun' },
  { key: 'dark', label: 'Thème sombre', icon: 'moon' },
  { key: 'system', label: "Thème de l'appareil", icon: 'system' },
]

export default function ThemeToggle() {
  const [mode, setCurrent] = useState(getMode)

  // En mode « système », on suit l'appareil quand il change (par exemple au coucher du soleil).
  useEffect(() => {
    if (mode !== 'system') return undefined
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyMode('system')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [mode])

  const choose = (key) => {
    setMode(key)
    setCurrent(key)
  }

  return (
    <div role="group" aria-label="Thème" className="flex rounded-lg border border-slate-200 overflow-hidden">
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => choose(o.key)}
          aria-pressed={mode === o.key}
          title={o.label}
          className={`px-2 py-1.5 ${mode === o.key ? 'bg-green-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Icon name={o.icon} size={15} />
          <span className="sr-only">{o.label}</span>
        </button>
      ))}
    </div>
  )
}
