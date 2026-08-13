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
```

### Database migrations

Migrations are managed with [node-pg-migrate](https://github.com/salsita/node-pg-migrate):

```bash
npm run migrate up
```

### Running

```bash
npm start
```

### Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Health check message |
| GET | `/health` | Returns current DB time |
| POST | `/register` | Create a user (`email`, `password`) |
| POST | `/login` | Authenticate and receive a JWT |

## License

See [LICENSE](LICENSE).
