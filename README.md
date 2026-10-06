# Taskly Web

Interface React de Taskly (Vite, Tailwind CSS, Axios, React Router).

## Prérequis
Node.js 20.19+ (ou 22 LTS) et l'API Taskly en marche.

## Lancer en local
```
npm install
cp .env.example .env      # puis règle VITE_API_URL si besoin
npm run dev
```
Le site est sur http://localhost:5173. `VITE_API_URL` doit pointer vers l'API,
par exemple `http://127.0.0.1:8000/api`. Après un changement de `.env`, relance `npm run dev`.

## Déployer (Vercel ou Netlify)
Le site est statique : `npm run build` produit le dossier `dist`.

| Réglage | Valeur |
|---|---|
| Commande de build | `npm run build` |
| Dossier publié | `dist` |
| Variable d'environnement | `VITE_API_URL` = `https://TON-API/api` (adresse publique de l'API, avec `/api`) |

`vercel.json` et `public/_redirects` redirigent toutes les adresses vers `index.html` :
sans eux, recharger la page `/boards/3` donnerait une erreur 404.

⚠️ `VITE_API_URL` est intégrée **au moment du build** : si tu la changes, relance un déploiement.

Dernière étape : dans l'API, mets l'adresse publique du site dans `FRONTEND_URL`
(sans `/` final), sinon le navigateur bloque les requêtes (CORS).

## Scripts
| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Version de production (dossier `dist`) |
| `npm run preview` | Teste la version de production en local |
| `npm run lint` | Analyse du code |
