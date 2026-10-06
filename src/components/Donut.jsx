// Donut en CSS pur. Les tâches en retard sont déjà comptées dans
// "todo" et "in_progress" : on ne les ajoute jamais ici.
export default function Donut({ todo, inProgress, done }) {
  const total = todo + inProgress + done
  const p1 = total ? (done / total) * 100 : 0
  const p2 = p1 + (total ? (inProgress / total) * 100 : 0)
  const background =
    total === 0
      ? '#e2e8f0'
      : `conic-gradient(#22c55e 0 ${p1}%, #3b82f6 ${p1}% ${p2}%, #f59e0b ${p2}% 100%)`

  const legend = [
    { label: 'Terminées', value: done, color: '#22c55e' },
    { label: 'En cours', value: inProgress, color: '#3b82f6' },
    { label: 'À faire', value: todo, color: '#f59e0b' },
  ]

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32 rounded-full shrink-0" style={{ background }}>
        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center text-xl font-bold">
          {total}
        </div>
      </div>
      <ul className="text-sm space-y-1">
        {legend.map((l) => (
          <li key={l.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
            {l.label} : {l.value}
          </li>
        ))}
      </ul>
    </div>
  )
}
