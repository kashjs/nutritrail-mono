# nutritrail-mono

A monorepo for NutriTrail, built as a learning project for Node.js/Express and PostgreSQL.

Live at **https://www.nutritrail.net**.

## Structure

- `server/` — Express API backed by PostgreSQL
- `client/` — React (Vite) frontend
- `learning/` — learning notes and progress log

## Local development setup

### Prerequisites

- [Node.js](https://nodejs.org) (LTS) and npm
- [PostgreSQL](https://www.postgresql.org/download/) 14+, running locally
- An [OpenAI API key](https://platform.openai.com/api-keys) (only needed for `/meals/parse`)

Installing and starting Postgres on macOS with Homebrew:

```bash
brew install postgresql@16
brew services start postgresql@16
```

On Debian/Ubuntu: `sudo apt install postgresql` (it starts automatically). On Windows, use the [official installer](https://www.postgresql.org/download/windows/).

### Create the databases

The app uses one database for development and a separate one for tests:

```bash
createdb nutritrail
createdb nutritrail_test
```

(On Linux you may need to run these as the `postgres` user, e.g. `sudo -u postgres createdb nutritrail`, and set a password for your role.) Verify with `psql -l`.

### Run everything

1. Configure the server `.env` files and run migrations (see [Server](#server) below).
2. Start the backend: `cd server && npm start` (port 3000).
3. In another terminal, start the frontend: `cd client && npm install && npm run dev` (port 4000).
4. Open `http://localhost:4000`.

## Server

### Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` with:

```
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/nutritrail
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
```

Replace `user:password` with your local Postgres role. On a default Homebrew install the role is your macOS username with no password, so the URL is `postgres://your-username@localhost:5432/nutritrail`.

For tests, create `server/.env.test` with the same variables, but point `DATABASE_URL` at the test database (`.../nutritrail_test`) and run the migrations against it too, so the schema exists there (the tests only truncate tables, they don't create them):

```bash
DATABASE_URL=postgres://user:password@localhost:5432/nutritrail_test npm run migrate up
```

`OPENAI_API_KEY` is required for the `/meals/parse` endpoint, which uses OpenAI to turn freeform meal text into structured nutrition data.

### Database migrations

Migrations are managed with [node-pg-migrate](https://github.com/salsita/node-pg-migrate):

```bash
npm run migrate up
```

### Running

```bash
npm start
```

### Testing

```bash
npm test
```

Tests run with Jest and Supertest against a separate test database, configured via `server/.env.test`.

### Middleware

- **helmet** — sets security-related HTTP headers
- **express-rate-limit** — per-route rate limiting (see below)
- JWT auth (`requireAuth`) — applied to all routes except `/register` and `/login`
- Zod-based request validation on write endpoints
- Centralized error handler

### Endpoints

Auth is cookie-based: `POST /login` sets an `httpOnly` JWT cookie, which the browser then sends automatically on every subsequent request. All endpoints below except `/register` and `/login` require that cookie (`requireAuth` responds `401` without it).

| Method | Path | Description | Rate limit |
| --- | --- | --- | --- |
| POST | `/register` | Create a user (`email`, `password`) | 3/day per IP |
| POST | `/login` | Authenticate and receive a JWT | 20/day per IP |
| POST | `/meals` | Create a meal, optionally with items | 50/day per user |
| GET | `/meals` | List meals for the current user (filter by `date`, or `from`/`to`) | — |
| GET | `/meals/:id` | Get a single meal with its items | — |
| PATCH | `/meals/:id` | Update meal fields | — |
| DELETE | `/meals/:id` | Delete a meal | — |
| POST | `/meals/:mealId/items` | Add an item to a meal | 50/day per user |
| PATCH | `/meals/:mealId/items/:itemId` | Update a meal item | — |
| DELETE | `/meals/:mealId/items/:itemId` | Delete a meal item | — |
| POST | `/meals/parse` | Parse freeform meal text into structured data via OpenAI | 10/min + 50/day per user |

## Client

### Setup

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:4000`. All API calls are relative (`/api/...`); a dev-server proxy (`vite.config.js`) forwards `/api/*` to `http://localhost:3000`, stripping the `/api` prefix — no client-side env var needed to point at the backend, in dev or in production.

### Build

```bash
npm run build
```

Outputs a static bundle to `client/dist/`.

## Deployment

- **Frontend** — [Vercel](https://vercel.com), project root set to `client/`. Build command `vite build`, output `dist/`. `client/vercel.json` rewrites `/api/:path*` to the Render backend URL, so the browser only ever talks to the Vercel domain — this is what keeps the auth cookie same-site (`SameSite=Lax`) without needing a separate CSRF token.
- **Backend** — [Render](https://render.com) web service, root directory `server/`, build command `npm install`, start command `npm start`. `PORT` is injected by Render automatically; other env vars (`DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, `NODE_ENV=production`) are set in the service's Environment tab. Migrations run automatically on deploy via Render's **Pre-Deploy Command** (`npx node-pg-migrate up`).
- **Database** — Render-managed PostgreSQL. The *internal* connection URL is used by the web service (same private network, no TLS needed); the *external* URL is only for connecting from outside Render (e.g. running a one-off migration from a local machine), and requires `?sslmode=require` appended to the connection string.
- **Domain** — `nutritrail.net`, registered via Squarespace, DNS pointed at Vercel. The bare domain (`nutritrail.net`) redirects to `www.nutritrail.net` automatically.

## License

See [LICENSE](LICENSE).
