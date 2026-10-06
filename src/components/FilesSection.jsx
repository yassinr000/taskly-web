import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { parseError } from '../utils/errors'

export default function FilesSection({ task, board }) {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const load = useCallback(
    () => api.get(`/tasks/${task.id}/attachments`).then((r) => setFiles(r.data)),
    [task.id]
  )

  useEffect(() => {
    load().catch(() => setError('Impossible de charger les fichiers.'))
  }, [load])

  const upload = async (e) => {
    const file = e.target.files[0]
    e.target.value = '' // permet de renvoyer le même fichier ensuite
    if (!file) return
    setError('')
    setUploading(true)
    const data = new FormData()
    data.append('file', file)
    try {
      await api.post(`/tasks/${task.id}/attachments`, data)
      load()
    } catch (err) {
      setError(parseError(err).fields.file || parseError(err).message)
    } finally {
      setUploading(false)
    }
  }

  // Le téléchargement est protégé par le token : on passe par Axios, pas par un simple lien.
  const download = async (file) => {
    try {
      const res = await api.get(`/attachments/${file.id}/download`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const link = document.createElement('a')
      link.href = url
      link.download = file.original_name
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Téléchargement impossible.')
    }
  }

  const remove = async (file) => {
    if (!window.confirm(`Supprimer « ${file.original_name} » ?`)) return
    try {
      await api.delete(`/attachments/${file.id}`)
      load()
    } catch (err) {
      setError(parseError(err).message)
    }
  }

  return (
    <section>
      <h3 className="font-semibold mb-2">Fichiers ({files.length})</h3>
      <ul className="space-y-1 mb-3">
        {files.map((f) => (
          <li key={f.id} className="flex items-center justify-between text-sm bg-slate-50 rounded-lg p-2">
            <button onClick={() => download(f)} className="text-blue-600 hover:underline text-left">
              📎 {f.original_name}
            </button>
            {(f.user_id === user.id || board.owner_id === user.id) && (
              <button onClick={() => remove(f)} className="text-red-600 hover:underline">
                Supprimer
              </button>
            )}
          </li>
        ))}
      </ul>
      <input type="file" onChange={upload} disabled={uploading} className="text-sm" />
      <p className="text-xs text-slate-500 mt-1">5 Mo maximum. PDF, images, Word, Excel, texte.</p>
      {uploading && <p className="text-sm text-slate-500">Envoi en cours...</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </section>
  )
}
