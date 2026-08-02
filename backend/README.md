# Chirp Backend (Express + MongoDB API)

Standalone REST API for Chirp. No frontend is served here — this only responds to `/api/*`.

## Local setup

```
npm install
cp .env.example .env   # fill in your real values
npm run dev
```

## Environment variables

| Variable      | Description                                              |
|---------------|-----------------------------------------------------------|
| `PORT`        | Port to run on (Render sets this automatically)           |
| `MONGO_URI`   | MongoDB Atlas connection string                            |
| `JWT_SECRET`  | Random secret used to sign auth tokens                     |
| `FRONTEND_URL`| Deployed frontend URL (for CORS), e.g. `https://chirp.vercel.app` |

⚠️ Rotate your MongoDB password and generate a new `JWT_SECRET` before deploying — never commit `.env`.

## Deploy on Render

1. Push this `backend/` folder to its own GitHub repo (or a subfolder — Render lets you set a Root Directory).
2. On [render.com](https://render.com) → **New +** → **Web Service** → connect the repo.
3. Settings:
   - **Root Directory**: `backend` (if it's a subfolder)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the environment variables above under **Environment**.
5. Deploy. Render gives you a URL like `https://chirp-backend.onrender.com` — use this as `VITE_API_URL` in the frontend.
6. Once the frontend is deployed on Vercel, come back and set `FRONTEND_URL` to the Vercel URL so CORS allows it.

Note: Render's free tier spins down after inactivity — the first request after idle can take ~30-50s to wake up.
