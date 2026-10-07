# Notes app

## Running it with Docker

```bash
docker compose up --build
```

Then open <http://localhost:8000/api/notes>.

## Running it without Docker

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

<!-- test commit -->
