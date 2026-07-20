# Redemption Hour Radio

The website for **Redemption Radio**, a 24/7 Christian internet radio station operated by
Redemption Hour Ministries. Built as a React/TypeScript frontend backed by a small Express API
that proxies AzuraCast's public Now Playing data and handles form submissions.

## Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Lucide icons
- **Backend:** Node.js + Express (TypeScript), Zod validation, Helmet, rate limiting
- **Radio data:** AzuraCast `/api/nowplaying/{shortcode}` via a backend proxy
- **Testing:** Vitest (+ Testing Library) for both packages

## Project layout

```
.
├── src/                  Frontend application (routes, components, data, hooks)
│   ├── data/             Editable content: programmes, schedule, presenters, sermons, ministry info
│   ├── lib/azuracast/    AzuraCast fetch + normaliser (null-safe)
│   ├── context/          Global persistent audio player (PlayerContext)
│   └── pages/            One file per route
├── server/               Express backend (AzuraCast proxy + form endpoints)
│   ├── src/routes/       nowplaying proxy, contact/newsletter/prayer/testimony endpoints
│   ├── src/validation/   Zod schemas (unit tested)
│   └── data/             Local JSONL storage for form submissions (gitignored, private)
├── deploy/               Example Nginx / Apache reverse-proxy configs
└── scripts/               Sitemap generation
```

## Content management (v1)

Programmes, the weekly schedule, presenters, sermons, ministry copy, and contact/social details
live in `src/data/*.ts`. This is intentionally decoupled from AzuraCast — playlist/song-history
data does not represent the public programme schedule. Edit these files to update content; the
shape is designed so a future Laravel/Node admin backend can replace this layer without touching
UI components.

Testimony and prayer request **submissions** are never auto-published. They're stored privately by
the backend in `server/data/*.jsonl`; a moderator reviews and promotes approved testimonies into
`src/data/testimonies.ts` by hand (or via a future admin UI).

## Getting started

Requires Node.js 20+.

### 1. Install dependencies (frontend and backend are separate npm packages)

```bash
npm install
cd server && npm install && cd ..
```

### 2. Configure environment variables

```bash
cp .env.example .env          # frontend (VITE_*) values, read by Vite
cp .env.example server/.env   # backend values (AZURACAST_*, PORT, ALLOWED_ORIGINS, ...)
```

Both files read from the same `.env.example` template — see the comments inside it for which
variables belong to which side. **`AZURACAST_API_KEY` must never be prefixed with `VITE_`** and is
only ever read by the backend.

### 3. Run in development

```bash
# Terminal 1 — backend API (port 4000)
cd server && npm run dev

# Terminal 2 — frontend (port 5173, proxies /api to the backend automatically)
npm run dev
```

Visit http://localhost:5173.

## Testing, linting, type checking

```bash
# Frontend
npm run typecheck
npm run lint
npm run test

# Backend
cd server
npm run typecheck
npm run lint
npm run test
```

Unit tests cover the AzuraCast response normaliser (`src/lib/azuracast/normalise.test.ts`,
including offline/malformed/missing-field payloads), the player's stream-source and toggle logic
(`src/lib/playerLogic.test.ts` — verifies the audio element is never restarted on a metadata-only
refresh), and the backend's form validation schemas (`server/src/validation/schemas.test.ts`).

## Production build

```bash
# Frontend — outputs static files to dist/
npm run build

# Backend — compiles TypeScript to server/dist/
cd server && npm run build
```

## Deployment

1. **Build both packages** on the server (or build in CI and rsync the artifacts):
   ```bash
   npm ci && npm run build          # → dist/
   cd server && npm ci && npm run build   # → server/dist/
   ```
2. **Run the backend with PM2** (see `server/ecosystem.config.cjs`):
   ```bash
   cd server
   pm2 start ecosystem.config.cjs --env production
   pm2 save
   ```
   Ensure `server/.env` is present on the server with real `AZURACAST_*` values and
   `ALLOWED_ORIGINS` set to your production domain.
3. **Serve the frontend and reverse-proxy `/api`** with Nginx or Apache — example configs are in
   [`deploy/nginx.conf.example`](deploy/nginx.conf.example) and
   [`deploy/apache.conf.example`](deploy/apache.conf.example). Point the document root at `dist/`
   and forward `/api/` to the PM2-managed backend (default port 4000).

## AzuraCast integration

- The frontend never calls AzuraCast directly. It calls `GET /api/nowplaying` on our own backend,
  which proxies `GET {AZURACAST_BASE_URL}/api/nowplaying/{AZURACAST_STATION_SHORTCODE}` — a public
  endpoint that doesn't require an API key. Routing it through our backend adds a request timeout,
  a short server-side cache to absorb bursts of client polling, and a single place to add auth
  later if the AzuraCast instance is locked down.
- `AZURACAST_API_KEY` is accepted as a backend-only config value for future protected-endpoint use,
  but **no route in this codebase uses it**, and no AzuraCast administrative actions (start/stop/
  restart station, media management, user management) are exposed through any API route. Those
  require the API key and must never be reachable by public site visitors.
- The frontend polls `/api/nowplaying` every 15 seconds via TanStack Query, which automatically
  pauses polling while the browser tab is hidden and resumes when it becomes visible again
  (`refetchIntervalInBackground: false`).
- The stream URL is resolved from `station.listen_url`, falling back to the first mount with a
  valid `url` in `mounts[]`. See `src/lib/azuracast/normalise.ts`.
- The global audio player (`src/context/PlayerContext.tsx`) only touches the `<audio>` element's
  `src` when the *resolved stream URL* actually changes — never on a metadata-only refresh — so
  playback is never interrupted by the 15s poll.

## Security notes

- `AZURACAST_API_KEY` is read only in `server/src/env.ts` and never sent to the browser, embedded
  in any `VITE_`-prefixed variable, or included in any API response.
- `server/.env` and `.env` are excluded via `.gitignore`.
- The Express app applies Helmet (with a restrictive CSP), CORS restricted to `ALLOWED_ORIGINS`,
  a 10s per-request timeout, a 50kb JSON body limit, general API rate limiting, and stricter rate
  limiting on form submission endpoints.
- Form endpoints validate all input with Zod and include a honeypot field for basic spam
  protection; prayer requests and testimony submissions are stored privately and are never
  returned by any public API route.

## Accessibility

Semantic HTML, visible focus states, labelled form controls, descriptive alt text (with a branded
gradient+icon fallback when artwork is missing), `aria-live` regions for now-playing updates,
`prefers-reduced-motion` support, and keyboard-operable navigation/player controls throughout.

## License

Private — © Redemption Hour Ministries. Not licensed for redistribution.
