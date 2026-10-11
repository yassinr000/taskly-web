// Thème : « light », « dark » ou « system » (suit l'appareil). Le choix est mémorisé.
const KEY = 'taskly-theme'
export const MODES = ['light', 'dark', 'system']

export function getMode() {
  try {
    const saved = localStorage.getItem(KEY)
    return MODES.includes(saved) ? saved : 'system'
  } catch {
    return 'system'
  }
}

export const systemPrefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches

export function applyMode(mode) {
  const dark = mode === 'dark' || (mode === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b1220' : '#f8fafc')
}

export function setMode(mode) {
  try {
    localStorage.setItem(KEY, mode)
  } catch {
    /* stockage indisponible : le choix vaut pour cette visite seulement */
  }
  applyMode(mode)
}
