export default function StatCard({ label, value, color = 'text-slate-800' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
