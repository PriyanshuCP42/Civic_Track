# Deployment Guide

This project is deployed as two services:

- Frontend: Vercel
- Backend API and Socket.IO server: Render Web Service

## Backend on Render

Create a Render Web Service from the same GitHub repository.

Recommended settings:

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

Render provides a `PORT` environment variable automatically. The backend reads `PORT` first, then falls back to `API_PORT`, then `8787` for local development.

Set these Render environment variables:

| Variable | Example | Notes |
| --- | --- | --- |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
| `CLERK_SECRET_KEY` | `sk_test_...` or `sk_live_...` | Backend Clerk secret key |
| `CORS_ORIGINS` | `https://your-vercel-app.vercel.app` | Comma-separated frontend origins allowed to call the API |

After Render deploys, test:

```text
https://your-render-service.onrender.com/health
```

Expected response:

```json
{ "ok": true }
```

## Frontend on Vercel

Recommended settings:

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

In Vercel project settings, add these environment variables:

| Variable | Example | Notes |
| --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | Frontend Clerk publishable key |
| `VITE_API_ORIGIN` | `https://your-render-service.onrender.com` | Render backend origin, without `/api/v1` |
| `VITE_SOCKET_URL` | `https://your-render-service.onrender.com` | Optional; if empty, the app uses `VITE_API_ORIGIN` |

Redeploy Vercel after changing environment variables. Vite reads `VITE_*` variables at build time, so old deployments will not automatically pick up new values.

## Local Development

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev:api
```

Local Vite requests still work through the proxy in `frontend/vite.config.js`, so `VITE_API_ORIGIN` can stay empty locally.

## Important Security Note

Never commit real `.env` values. If a secret was ever pushed to GitHub, rotate it in Clerk and MongoDB Atlas before deploying.
