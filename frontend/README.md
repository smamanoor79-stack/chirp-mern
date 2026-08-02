# Chirp Frontend (React + Vite)

## Local setup

```
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev
```

## Environment variables

| Variable        | Description                                    |
|-----------------|-------------------------------------------------|
| `VITE_API_URL`  | Base URL of the deployed backend API, e.g. `https://chirp-backend.onrender.com/api` |

## Deploy on Vercel

1. Push this `frontend/` folder to its own GitHub repo (or a subfolder — Vercel lets you set a Root Directory).
2. On [vercel.com](https://vercel.com) → **Add New** → **Project** → import the repo.
3. Settings:
   - **Root Directory**: `frontend` (if it's a subfolder)
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable `VITE_API_URL` = your Render backend URL + `/api` (e.g. `https://chirp-backend.onrender.com/api`).
5. Deploy. Vercel gives you a URL like `https://chirp.vercel.app`.
6. Go back to the backend's environment variables on Render and set `FRONTEND_URL` to this Vercel URL, then redeploy the backend so CORS allows it.
