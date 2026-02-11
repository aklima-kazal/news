# News Dashboard - Backend

This is a minimal Express.js backend for the News Dashboard project. It uses an in-memory store and is intended for local development.

Quick start:

1. Open a terminal in `backend` and install dependencies:

```bash
npm install
```

2. Start the server in development mode (with nodemon):

```bash
npm run dev
```

Server runs on `http://localhost:4000` by default.

Available endpoints:

- `GET /api/health` - health check
- `POST /api/auth/login` - login (body: `{ email, password }`)
- `POST /api/auth/logout` - logout (body: `{ token }`)
- `GET /api/auth/me` - current user (Authorization: `Bearer <token>`)
- `GET /api/news` - list news
- `POST /api/news` - create news
- `PUT /api/news/:id` - update news
- `DELETE /api/news/:id` - delete news
- `GET /api/categories` - list categories
- `POST /api/categories` - create category
