# Chirp — MERN Stack Social Media App

A mini social media Twitter-style app built with the MERN stack (MongoDB, Express, React, Node.js).

- **`backend/`** — Express + MongoDB (Mongoose) REST API, deployed independently on Vercel.
- **`frontend/`** — React (Vite) single-page app, deployed independently on Vercel, calls the backend over
  `VITE_API_URL`.

**Live demo:** [https://chirp-app-smama.vercel.app](https://chirp-app-smama.vercel.app)

## Features

- Signup/login (JWT authentication)
- Home feed with create/delete posts
- Image upload on posts
- Like, repost, and comment (with emoji picker)
- Follow/unfollow users
- Profile page with avatar upload
- Followers / following modal
- Fully responsive — desktop layout with a sticky sidebar, and a mobile layout with a bottom navigation bar
  (Twitter/X style)

## Project structure

```
chirp-mern/
├── backend/     ← Express API (deployed separately on Vercel)
└── frontend/    ← React (Vite) app (deployed separately on Vercel)
```

## Local development

Run backend and frontend separately during development, in two terminals:

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

## Deployment (two separate apps on Vercel)

The frontend and backend are deployed as **two independent Vercel projects** from the same GitHub repo.

**Backend:**
1. New Vercel project → import the repo → set **Root Directory** to `backend`.
2. Add a `backend/vercel.json` so Vercel routes all requests to the Express app (using the `@vercel/node`
   builder).
3. Set environment variables in the Vercel dashboard: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` (the deployed
   frontend's URL, used for CORS).
4. In MongoDB Atlas → Network Access, allow access from anywhere (`0.0.0.0/0`) so Vercel's serverless functions
   can connect.

**Frontend:**
1. New Vercel project → import the same repo → set **Root Directory** to `frontend`, framework preset **Vite**.
2. Set environment variable in the Vercel dashboard: `VITE_API_URL` = the deployed backend's URL **including
   the `/api` prefix**, e.g. `https://your-backend.vercel.app/api`.
3. Deploy. Since Vite embeds environment variables at build time, any change to `VITE_API_URL` requires a
   redeploy to take effect.

**After both are deployed:**
- Go back to the backend project and make sure `FRONTEND_URL` matches the frontend's actual Vercel URL exactly
  (no trailing slash), then redeploy the backend so CORS allows requests from the frontend.

## Before you push to GitHub

⚠️ Never commit a `.env` file — both `backend/` and `frontend/` `.gitignore` already exclude it, along with
`node_modules/` and `frontend/dist/`. Set real values (`MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`,
`VITE_API_URL`) only as environment variables in the Vercel dashboard for each project.