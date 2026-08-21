# nutritrail-mono

A monorepo for NutriTrail, built as a learning project for Node.js/Express and PostgreSQL.

## Structure

- `server/` — Express API backed by PostgreSQL
- `client/` — frontend app (not yet started)
- `learning/` — learning notes and progress log

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

All endpoints below except `/register` and `/login` require an `Authorization: Bearer <token>` header.

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

## License

See [LICENSE](LICENSE).
