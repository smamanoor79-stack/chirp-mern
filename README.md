# Chirp — MERN Stack Social Media App

A mini social media twitter style app built with MERN Stack.

- **`backend/`** — Express + MongoDB (Mongoose) REST API, and also serves the built React frontend as static files.
- **`frontend/`** — React (Vite) single-page app, calls the backend over `VITE_API_URL` in development. In
  production it's built (`npm run build`) and served directly by the backend — so both live in one deployed app.

## Features

Signup/login (JWT), home feed, create/delete posts, image upload on posts, like, repost, comment (with emoji picker), follow/unfollow, profile with avatar upload, followers/ following modal
Fully responsive — desktop layout with a sticky sidebar, and a mobile layout with a bottom navigation bar
(Twitter/X style).

## Project structure

chirp-mern/
├── backend/ ← Express API + serves frontend/dist in production
└── frontend/ ← React (Vite) app

## Local development

Run backend and frontend separately during development:

```bash
# backend
cd backend
npm install
npm run dev

# frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Frontend dev server runs on `http://localhost:5173` and talks to the backend on `http://localhost:5000/api`
(set via `VITE_API_URL` in `frontend/.env`, or it defaults to `http://localhost:5000/api`).

## Deployment (single app on Bonto)

1. Build the frontend: `cd frontend && npm run build` — this creates `frontend/dist`.
2. The backend serves that build automatically (`express.static` + catch-all route in `server.js`), so only
   **one** app needs to be deployed.
3. On Bonto: set root directory to `backend`, build command to
   `cd frontend && npm install && npm run build && cd ../backend && npm install`, and start command to
   `node server.js`.
4. Set environment variables on the Bonto dashboard (never commit them): `MONGO_URI`, `JWT_SECRET`.
5. In MongoDB Atlas → Network Access, allow access from anywhere (`0.0.0.0/0`) so Bonto can connect.

## Before you push to GitHub

⚠️ Never commit a `.env` file — both `backend/` and root `.gitignore` already exclude it, along with
`node_modules/` and `frontend/dist/`. Set real values (`MONGO_URI`, `JWT_SECRET`) only as environment variables
on Bonto.