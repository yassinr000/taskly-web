// Écrans de chargement : des blocs gris qui pulsent, de la forme du contenu à venir.
export function Skeleton({ className = '' }) {
  return <div className={`sk ${className}`} />
}

function Live({ children }) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Chargement...</span>
      {children}
    </div>
  )
}

const card = 'bg-white rounded-xl shadow-sm border border-slate-200 p-4'

export function StatsSkeleton({ count = 4 }) {
  return (
    <div className={`grid grid-cols-2 ${count === 5 ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-4 mb-6`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={card}>
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-8 w-12" />
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <Live>
      <Skeleton className="h-8 w-64 mb-6" />
      <StatsSkeleton />
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`${card} flex items-center gap-6`}>
          <Skeleton className="w-32 h-32 !rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className={`${card} space-y-3`}>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </Live>
  )
}

export function BoardsSkeleton() {
  return (
    <Live>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`${card} space-y-3`}>
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </Live>
  )
}

export function ListSkeleton({ rows = 5 }) {
  return (
    <Live>
      <div className="space-y-2">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className={`${card} !p-3 flex items-center justify-between gap-4`}>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </Live>
  )
}

export function BoardDetailSkeleton() {
  return (
    <Live>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-56" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[2, 2, 1].map((n, c) => (
            <div key={c} className="bg-slate-100 rounded-xl p-3 space-y-3">
              <Skeleton className="h-4 w-24" />
              {Array.from({ length: n }, (_, i) => (
                <div key={i} className={`${card} !p-3 space-y-3`}>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Live>
  )
}

// Petit rond qui tourne, pour les boutons et les envois de fichiers.
export function Spinner() {
  return (
    <span
      className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
      aria-hidden="true"
    />
  )
}
