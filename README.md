# Promptora

AI prompt discovery platform with React frontend + Express/SQLite admin API.

## Hostinger (Node.js app)

This repo is set up as **one Node.js app**: Express serves the API and the built React UI.

### hPanel settings

| Setting | Value |
| --- | --- |
| App type | `express` (or Node.js) |
| Node version | **20** or **22** |
| Root directory | `.` (repo root) |
| Entry file | `server/src/index.js` |
| Build script | `build` |
| Start / run | `start` → `node server/src/index.js` |

### What Hostinger runs

```bash
npm install   # also installs server + client + prisma generate
npm run build # builds client → client/dist
npm start     # Express on PORT (API + web)
```

### Environment variables (hPanel → Node.js → Environment)

Copy from `server/.env.example`. Minimum:

```
DATABASE_URL=file:./dev.db
NODE_ENV=production
JWT_SECRET=use-a-long-random-string
SESSION_SECRET=use-another-long-random-string
ADMIN_EMAIL=admin@admin.local
ADMIN_PASSWORD=change-me
CLIENT_ORIGIN=
```

`CLIENT_ORIGIN` can stay empty when the site is served by this same app (same origin).

SQLite DB file: `server/prisma/dev.db` (included). Uploads: `server/uploads/`.

### Upload options

1. **Zip the project** (exclude `node_modules`, `client/dist`, `.git`) and deploy as Node.js in hPanel, **or**
2. Connect the GitHub repo and deploy branch `main` as type `nodejs`.

Do **not** upload only the `client/` folder — Hostinger must start the Express entry file above.

## Local development

### 1) API + database

```bash
cd server
npm install
npm run db:setup
npm run dev
```

API: http://localhost:4000  
Admin user: `admin@admin.local` / `admin123`

### 2) Frontend

```bash
cd client
npm install
npm run dev
```

App: http://localhost:5173

`client/.env` should contain:

```
VITE_API_BASE_URL=http://localhost:4000
VITE_USE_API=true
```

### Production locally (same as Hostinger)

```bash
npm install
npm run build
npm start
```

Then open http://localhost:4000

## How to add prompts, images, categories

1. Open http://localhost:5173/login  
2. Sign in with `admin@admin.local` / `admin123`  
3. Go to **Profile → Open demo admin** or visit http://localhost:5173/admin  
4. **Prompts tab**
   - **+ New prompt** → fill title + prompt text  
   - Upload a preview image (or paste an image URL)  
   - Set status to **published** → Save  
5. **Categories tab**
   - Create a category, then assign it when editing a prompt  

Uploads are stored in `server/uploads/` and served at `/uploads/...`.

## Database

- Local DB: SQLite file `server/prisma/dev.db` (no MySQL/Docker required)
- Schema: `server/prisma/schema.prisma`
- Reset + reseed: `cd server && npm run db:setup`

To move to MySQL later, change the Prisma `provider` to `mysql` and set `DATABASE_URL`.

## Scripts

| Where | Command | Purpose |
| --- | --- | --- |
| server | `npm run dev` | API with reload |
| server | `npm run db:setup` | Create tables + seed 60 prompts |
| client | `npm run dev` | Vite UI |
| client | `npm run build` | Production build |

## Feature status

| Feature | Status |
| --- | --- |
| Gallery photos | Yes (stock + your uploads) |
| Admin CRUD prompts | Yes (API) |
| Admin categories | Yes |
| Image upload | Yes |
| SQLite database | Yes |
| Live AI generation | Still demo / Phase 3 |
