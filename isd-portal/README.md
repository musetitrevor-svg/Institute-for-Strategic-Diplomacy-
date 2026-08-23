# ISD Portal — Phase A: Scaffolding & Design System

## Setup

```bash
npm install
cp .env.example .env.local
# edit .env.local with your real Supabase URL + anon key
npm run dev
```

## Folder structure

```
isd-portal/
├── index.html                    Entry HTML shell (nav + hero + director mount points)
├── tailwind.config.js            Design system: colors, fonts, layout tokens
├── vite.config.js
├── postcss.config.js
├── .env.example                  Placeholder env vars — copy to .env.local
├── public/
│   └── assets/                   Director photo, seal, static images
└── src/
    ├── main.js                   App entry — mounts components into index.html
    ├── style.css                 Tailwind layers + editorial utility classes
    ├── config/
    │   ├── constants.js          Static content: director, hero slides, desks, nav
    │   └── supabaseClient.js     Supabase client, env-var protected
    ├── state/
    │   └── store.js              Minimal pub/sub store (currentUser, session)
    ├── services/
    │   ├── authService.js        Phase B: Supabase Auth flows
    │   └── briefsService.js      Phase B: CRUD against `briefs` table (RLS-aware)
    ├── components/
    │   ├── layout/
    │   │   └── Navbar.js
    │   ├── hero/
    │   │   ├── HeroCarousel.js   Minimalist auto-rotating carousel
    │   │   └── DirectorProfile.js  Large, permanent Director section (no modal)
    │   └── desks/
    │       └── DeskGrid.js       Compact, uniform six-desk thumbnail grid
    └── utils/
        └── domHelpers.js         escapeHTML(), safe querySelector
```

## Design system

- **Colors:** `ink` (deep navy, primary) and `bronze` (muted gold, sole accent) — no other brand hues. Every desk and badge in the app draws from this same pair.
- **Type:** `font-serif` (Playfair Display) for headings/editorial voice; `font-sans` (Inter) for UI and body copy.
- **Background:** `bg-paper` (#faf9f6) instead of pure white, for the journal/print feel.

## What's next (Phase B)

- Wire `authService.js` into a real sign-in view for the Member Portal.
- Replace `constants.js` desk/brief data with live Supabase queries via `briefsService.js`.
- Build out leadership dashboards (Director-General, Chief of Staff, Secretariat) and the scholar workspace.
- Add RLS policies: public `SELECT` on `briefs` where `status = 'published'`; authenticated + role-checked `INSERT`/`UPDATE`.
