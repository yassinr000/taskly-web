// Transforme une erreur Axios en { message, fields }.
// fields contient un message par champ pour les erreurs 422 :
// { email: 'The email has already been taken.' }
export function parseError(error, fallback = 'Une erreur est survenue. Réessaie.') {
  if (!error.response) {
    return { message: "Impossible de joindre le serveur. Vérifie que l'API tourne.", fields: {} }
  }
  const data = error.response.data
  const fields = {}
  if (data?.errors) {
    for (const [name, messages] of Object.entries(data.errors)) {
      fields[name] = messages[0]
    }
  }
  return { message: data?.message || fallback, fields }
}
