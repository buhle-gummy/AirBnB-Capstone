# Airbnb Capstone

A full-stack Airbnb-style accommodation platform with a customer React frontend, an admin React dashboard, and an Express/MongoDB API.

## Project structure

| Folder | Purpose |
|---|---|
| `frontend` | Customer-facing Airbnb-style website with search, listings, details, authentication, and reservations |
| `admin` | Protected admin dashboard for listings, reservations, and users |
| `backend` | Express API with MongoDB, JWT authentication, role-based authorization, listing CRUD, and reservations |

## Requirements

- Node.js 18 or newer
- npm
- MongoDB Atlas or another reachable MongoDB instance

## Backend setup

1. Open a terminal in `backend`.
2. Copy `.env.example` to `.env`.
3. Set the following values in `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=<long-random-secret>
CLIENT_URLS=http://localhost:5173,http://localhost:5174
```

4. Install dependencies and start the API:

```bash
npm install
npm start
```

The API health check is available at `http://localhost:5000/api/health`.

## Customer frontend setup

```bash
cd frontend
npm install
npm run dev
```

The customer app runs on the Vite development port, normally `http://localhost:5173`. During local development, `/api` requests are proxied to the backend.

For a deployed frontend, set `VITE_API_URL` to the public backend origin before building.

## Admin frontend setup

```bash
cd admin
npm install
npm run dev -- --port 5174
```

The admin app is protected by JWT and admin-role checks. Public registration creates a normal user account; an existing administrator must promote an account through the admin Users section or seed an administrator directly in MongoDB.

For a deployed admin app, set `VITE_API_URL` to the public backend origin before building.

## Verification commands

Run these commands before submission:

```bash
cd frontend && npm ci && npm run lint && npm run build
cd ../admin && npm ci && npm run lint && npm run build
cd ../backend && npm test
```

## Important deployment notes

Do not commit `.env` files, MongoDB credentials, or JWT secrets. Configure `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URLS` in the backend hosting provider, and configure `VITE_API_URL` in each deployed frontend. Add the deployed frontend origins to `CLIENT_URLS` so browser CORS requests are accepted.

The frontend and admin Netlify configurations include SPA fallback redirects so direct navigation to React routes continues to work after deployment.

## Main API areas

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/accommodations`
- `POST /api/accommodations` (admin JWT required)
- `PUT /api/accommodations/:id` (admin JWT required)
- `DELETE /api/accommodations/:id` (admin JWT required)
- `POST /api/reservations` (JWT required)
- `GET /api/reservations/user` (JWT required)
- `GET /api/reservations/host` (JWT required)
- `DELETE /api/reservations/:id` (owner or admin JWT required)

## Security notes

Passwords are hashed with bcryptjs. Login issues a one-day JWT. Public registration always creates a normal user account and cannot assign an admin role. Admin routes require both a valid JWT and the `admin` role.

## Submission

Use `SUBMISSION-CHECKLIST.md` to confirm that environment variables, MongoDB access, builds, authentication, listing CRUD, and reservation flows have been checked before uploading the project.
