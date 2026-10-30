# Promptora — project status

Last updated: 31 October 2026

## Phase checklist

| Phase | Status | Notes |
| --- | --- | --- |
| 1 — Interactive frontend | Complete | Explore, detail, studio, saved |
| 2 — Backend + admin + DB | **In progress / usable** | Express + Prisma SQLite, admin CRUD, uploads |
| 3 — Live generation | Not started | Provider adapters |
| 4 — Launch prep | Not started | SSR, Docker MySQL, etc. |

## How to run

```bash
# Terminal 1
cd server && npm run db:setup && npm run dev

# Terminal 2
cd client && npm run dev
```

Admin: `admin@admin.local` / `admin123`

## Photos

Seed prompts use illustrative Lorem Picsum URLs. Replace any preview in **Admin → Edit → Upload image**.
