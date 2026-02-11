<!-- # News Dashboard - Full Stack Setup

This project now has both frontend (Next.js) and backend (Express.js) integrated.

## Quick Start

### Backend Setup

1. Open a terminal and navigate to the `backend` folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server (runs on http://localhost:4000):
```bash
npm run dev
```

The backend uses an in-memory store and supports:
- User authentication (login/logout)
- News CRUD operations
- Category management

### Frontend Setup

In a separate terminal, from the root folder:

1. Dependencies should already be installed (you ran `npm i` earlier)

2. Start the Next.js development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Testing the Integration

1. Navigate to http://localhost:3000/login
2. Enter any email and password (backend creates users on first login)
3. After login, you can:
   - View/create news items in Dashboard → News
   - View/create categories in Dashboard → Categories
4. All data is persisted in the backend's in-memory store

## Environment Variables

Frontend `.env.local` is already configured to point to the backend:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

To use a different backend URL, edit `.env.local` to change `NEXT_PUBLIC_API_URL`.

## Architecture

- **Frontend**: Next.js with React hooks for state management
- **Backend**: Express.js REST API with in-memory data store
- **Communication**: Fetch API via `lib/api.js` service layer

## API Endpoints

All endpoints are prefixed with `/api`:

**Auth**
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

**News**
- `GET /news` - List all news
- `POST /news` - Create news
- `PUT /news/:id` - Update news
- `DELETE /news/:id` - Delete news

**Categories**
- `GET /categories` - List categories
- `POST /categories` - Create category -->
