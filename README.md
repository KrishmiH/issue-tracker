# Issue Tracker

Full-stack issue/ticket tracker with JWT auth and CRUD workflows.

## Deploy Links

- Frontend: https://issue-tracker-frontend-beryl.vercel.app
- Backend: https://issue-tracker-backend-six.vercel.app

## Dependencies

- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React, Vite, Tailwind CSS

## Setup

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
FRONTEND_ORIGIN=http://localhost:5173
PORT=5000
```

### Frontend (.env)

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

## Usage

- Register/login to get a JWT. The frontend stores it in `localStorage` and sends it as `Authorization: Bearer <token>`.
- Use the dashboard to create, update, and track issues.

## API Endpoints

Base URL: `/api`

### Auth

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Issues (auth required)

- `GET /api/issues/counts` - Issue status counts
- `GET /api/issues` - List issues
- `POST /api/issues` - Create issue
- `GET /api/issues/:id` - Get issue by id
- `PUT /api/issues/:id` - Update issue
- `PATCH /api/issues/:id/status` - Update issue status
- `DELETE /api/issues/:id` - Delete issue
