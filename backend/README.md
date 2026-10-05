# notes-app

The backend for the notes app.

## Running it

```bash
npm install
cp .env.example .env
npm run dev
```

Then open <http://localhost:8000/api/notes>.

## What's in here

- `server.js`, the Express server. It serves the built frontend out of `dist/`,
  and handles `GET /api/notes` and `POST /api/notes`. The notes are kept in an
  array in memory, so they go back to the two examples whenever the server
  restarts.
- `uploads.js`, which decides whether an attached file is written to
  `uploads/` or sent to S3, and turns a stored filename into a link the browser
  can open.
- `.env.example`, the configuration this app expects. Copy it to `.env`, which
  is deliberately never committed.
