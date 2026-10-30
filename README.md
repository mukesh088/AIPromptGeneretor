# Promptora

AI prompt discovery platform with React frontend + Express/SQLite admin API.

## Why photos were missing

Phase 1 used **CSS gradient placeholders** (no real image files). The app now loads **real preview photos** (illustrative stock via Lorem Picsum) and you can **upload your own images** in Admin.

## Run both apps

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
