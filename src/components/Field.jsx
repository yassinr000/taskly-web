// Un champ de formulaire avec son libellé et son message d'erreur.
export default function Field({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        {...props}
        className={`mt-1 w-full border rounded-lg p-2.5 bg-white ${error ? 'border-red-500' : 'border-slate-300'}`}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </label>
  )
}
