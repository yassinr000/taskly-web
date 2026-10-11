import { PRIORITY_LABELS, STATUS_LABELS, formatDate, isOverdue } from './tasks'

const pad = (n, len = 2) => String(n).padStart(len, '0')

// Les polices PDF standard ne connaissent que le Latin-1 : on remplace le reste (emojis, etc.).
const clean = (value) =>
  String(value ?? '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u202f\u00a0]/g, ' ')
    .replace(/[^\x20-\x7E\xA1-\xFF]/g, '?')

// Exemple : TSK-20261011-0001-153045 (date, numéro d'utilisateur, heure).
export function makeReference(user, date = new Date()) {
  const day = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const time = `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  return `TSK-${day}-${pad(user.id, 4)}-${time}`
}

const INK = [30, 41, 59]
const MUTED = [100, 116, 139]
const ACCENT = [79, 70, 229]
const LINE = [226, 232, 240]
const RED = [220, 38, 38]

// Construit le PDF (toujours sur fond blanc, même si le site est en thème sombre).
export async function buildReceipt({ user, stats, tasks, now = new Date() }) {
  // Chargé seulement au clic : la librairie PDF n'alourdit pas le reste du site.
  const [{ jsPDF }, autoTableModule] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  const autoTable = autoTableModule.autoTable || autoTableModule.default

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 40
  const reference = makeReference(user, now)
  doc.setProperties({ title: `Reçu Taskly ${reference}`, author: 'Taskly' })

  const text = (value, x, y, options) => doc.text(clean(value), x, y, options)
  const heading = (value, y) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...INK)
    text(value, M, y)
  }

  // En-tête
  doc.setFillColor(...ACCENT)
  doc.roundedRect(M, 36, 30, 30, 6, 6, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  text('T', M + 15, 57, { align: 'center' })
  doc.setTextColor(...INK)
  doc.setFontSize(20)
  text('Taskly', M + 40, 58)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(...MUTED)
  text("Reçu d'activité", W - M, 50, { align: 'right' })
  text(reference, W - M, 65, { align: 'right' })
  doc.setDrawColor(...LINE)
  doc.line(M, 84, W - M, 84)

  // Utilisateur
  heading('Utilisateur', 112)
  const memberSince = user.created_at ? formatDate(String(user.created_at).slice(0, 10)) : '-'
  const info = [
    ['Nom', user.name],
    ['Email', user.email],
    ['Membre depuis', memberSince],
    ['Généré le', now.toLocaleString('fr-FR')],
  ]
  info.forEach(([label, value], i) => {
    const y = 134 + i * 18
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...MUTED)
    text(label, M, y)
    doc.setTextColor(...INK)
    text(value, M + 100, y)
  })

  // Résumé
  heading('Résumé', 226)
  const boxes = [
    ['Actives', stats.my_tasks, INK],
    ['À faire', stats.todo, INK],
    ['En cours', stats.in_progress, INK],
    ['Terminées', stats.completed, INK],
    ['En retard', stats.overdue, stats.overdue > 0 ? RED : INK],
  ]
  const gap = 8
  const boxW = (W - 2 * M - gap * (boxes.length - 1)) / boxes.length
  boxes.forEach(([label, value, color], i) => {
    const x = M + i * (boxW + gap)
    doc.setDrawColor(...LINE)
    doc.roundedRect(x, 236, boxW, 54, 6, 6, 'S')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(...color)
    text(String(value), x + 12, 264)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...MUTED)
    text(label, x + 12, 280)
  })

  // Tâches
  heading(`Tâches assignées (${tasks.length})`, 322)
  const lateRows = tasks.map(isOverdue)
  const rows = tasks.map((t) => [
    clean(t.title),
    clean(t.board?.name || '-'),
    STATUS_LABELS[t.status] || t.status,
    PRIORITY_LABELS[t.priority] || t.priority,
    formatDate(t.due_date),
  ])
  autoTable(doc, {
    startY: 332,
    head: [['Tâche', 'Board', 'Statut', 'Priorité', 'Échéance']],
    body: rows.length
      ? rows
      : [[{ content: 'Aucune tâche assignée.', colSpan: 5, styles: { halign: 'center', textColor: MUTED } }]],
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 6, textColor: INK, lineColor: LINE, lineWidth: 0.5 },
    headStyles: { fillColor: ACCENT, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 1: { cellWidth: 100 }, 2: { cellWidth: 70 }, 3: { cellWidth: 60 }, 4: { cellWidth: 70 } },
    margin: { left: M, right: M, bottom: 60 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4 && lateRows[data.row.index]) {
        data.cell.styles.textColor = RED
        data.cell.styles.fontStyle = 'bold'
      }
    },
  })

  // Mention de fin
  let endY = (doc.lastAutoTable?.finalY ?? 332) + 24
  if (endY > H - 80) {
    doc.addPage()
    endY = M
  }
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  text('Document généré automatiquement. Il liste uniquement les tâches qui vous sont assignées.', M, endY)

  // Pied de page sur chaque page
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i)
    doc.setDrawColor(...LINE)
    doc.line(M, H - 42, W - M, H - 42)
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    text(`Taskly - ${reference}`, M, H - 28)
    text(`Page ${i} / ${pages}`, W - M, H - 28, { align: 'right' })
  }

  return { doc, reference }
}

export async function downloadReceipt(data) {
  const { doc, reference } = await buildReceipt(data)
  doc.save(`recu-taskly-${reference}.pdf`)
}
