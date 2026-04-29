# CivicTrack

CivicTrack is a civic complaint management system with three clear code areas:

- `frontend/`: React/Vite single page app
- `backend/`: Express API, auth middleware, services, routes, and Socket.IO
- `database/`: MongoDB connection and Mongoose models

## Project Structure

```text
Civic_Track/
├── frontend/
│   ├── index.html
│   ├── public/
│   ├── vite.config.js
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── domain/
│       ├── hooks/
│       ├── pages/
│       ├── routes/
│       └── utils/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│   ├── policies/
│   ├── errors/
│   └── utils/
├── database/
│   ├── connect.js
│   └── models/
└── uml_diagrams/
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev:api
```

Start the frontend:

```bash
npm run dev
```

## Build

```bash
npm run build
```

The frontend builds to the root `dist/` folder for Vercel.

## Useful Docs

- `SYSTEM_DESIGN.md`: full architecture and design explanation
- `SYSTEM_DESIGN_CODE_MAP.md`: where each design principle is used in code
- `DEPLOYMENT.md`: Vercel frontend and Render backend deployment steps
