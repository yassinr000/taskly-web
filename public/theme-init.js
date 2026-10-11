// Applique le thème avant l'affichage de la page, pour éviter un flash blanc.
// Fichier externe (et non un script dans index.html) pour rester compatible avec une future CSP stricte.
(function () {
  try {
    var mode = localStorage.getItem('taskly-theme')
    var dark = mode === 'dark' || (mode !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (dark) {
      document.documentElement.classList.add('dark')
      var meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', '#0b1220')
    }
  } catch {
    /* stockage indisponible : thème clair par défaut */
  }
})()
