// Sur téléphone, la fenêtre sort du bas de l'écran ; sur ordinateur, elle est centrée.
export default function Modal({ title, onClose, wide = false, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'} max-h-[92vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold break-words min-w-0">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 -m-1" aria-label="Fermer">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
