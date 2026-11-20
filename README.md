# ITC Forge — Sara's Portfolio

A bilingual (Arabic RTL / English LTR) portfolio with light/dark themes, three hidden secrets, a prize, and an AI assistant.
One codebase, two deliverables:

| | Project 1 | Project 2 |
|---|---|---|
| What | Frontend only (React + JSON data) | Full stack (React + Express + MongoDB + cache + AI) |
| Live | ✏️ link | ✏️ link |
| Switch | `VITE_USE_API` not set | `VITE_USE_API=true` |

## Features
- Home: hero, about, skills (good / learning / planned with proficiency), projects (past / current / future, progress bar, details modal), contact form with validation, availability badge.
- Prize page: 3 hidden secrets → a 50% discount code for the first 100 people (one per email).
- AI assistant (Gemini) that answers about skills and projects, and gives a hint for the third secret.
- Sounds (WebAudio, mutable), RTL/LTR, light/dark, responsive.

## Tech
React 19 + Vite, react-router, TanStack Query (client cache), Express 5, MongoDB (Mongoose), in-memory server cache with `X-Cache` header, Gemini API through the server (key never reaches the browser), Helmet, CORS allow-list, rate limiting.
React hooks used: `useState`, `useEffect`, `useContext` (theme/language), custom hooks (`useFetch`, `useSecrets`).

## Run locally
```bash
# server
cd server
cp .env.example .env        # fill in values
npm install
node src/scripts/seed.js    # fills skills, projects, 100 prize codes
npm run dev

# client (new terminal)
cd client
npm install
# optional: echo VITE_USE_API=true > .env.local   (full-stack mode)
npm run dev
```
In dev, Vite proxies `/api` to `http://localhost:5000` (see `client/vite.config.js`).

## Environment variables
Server (`server/.env`): `PORT`, `MONGO_URI`, `CLIENT_ORIGIN`, `ADMIN_KEY`, `PRIZE_LIMIT`, `GEMINI_KEY`, `GEMINI_MODEL`, `AI_MOCK`, `SECRET_WORDS`, `DAILY_CHAT_LIMIT`, `OWNER_NAME`.
Client: `VITE_USE_API`, `VITE_API_URL` (production API URL).

## API
`GET /api/health` · `GET /api/skills` · `GET /api/projects` · `GET /api/settings` · `POST /api/messages` · `POST /api/chat` · `POST /api/secrets` · `GET /api/claims/status` · `POST /api/claims` · admin (header `x-admin-key`): `GET /api/admin/summary|claims|messages`, `PUT /api/admin/settings`, `POST /api/admin/cache/clear`.

## Prize rules (how it is enforced)
Codes are pre-generated in MongoDB; a code is assigned atomically to one email (Gmail dots/`+` aliases are normalised, unique index at database level). Every request is logged as accepted or rejected with a reason. Secret 3 is verified on the server.

## Structure
```
client/  React app (src/components, pages, hooks, context, translations.js, public/data/*.json)
server/  Express API (src/routes, models, middleware, services, scripts/seed.js)
```
