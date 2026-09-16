# Airbnb API Documentation

## Overview

The Airbnb API is a Node.js, Express, MongoDB, and Mongoose backend for this Airbnb capstone project. It provides JWT authentication, accommodation management, reservation management, admin user management, validation, and role-based access control.

## Running the API

```bash
cd server
npm install
npm start
```

The default base URL is `http://localhost:5000/api`. Copy `.env.example` to `.env` and provide a MongoDB connection string, a long random JWT secret, and the allowed client URL.

## Authentication

Login at `POST /users/login`. Use the returned token for protected endpoints:

```text
Authorization: Bearer <jwt-token>
```

Public registration always creates a normal user. Admin-only endpoints require a valid JWT whose role is `admin`.

## Health check

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | Confirms that the API is running |

## Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/users/register` | Public | Registers a normal user |
| POST | `/users/login` | Public | Authenticates a user and returns a JWT |
| GET | `/users` | Admin | Lists users without password fields |
| PATCH | `/users/:id/role` | Admin | Changes a user's role |
| DELETE | `/users/:id` | Admin | Deletes another user |

Example login request:

```json
{
  "email": "guest@example.com",
  "password": "password123"
}
```

## Accommodations

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/accommodations` | Public | Lists accommodations sorted by newest |
| GET | `/accommodations/:id` | Public | Returns one accommodation |
| POST | `/accommodations` | Admin | Creates a validated accommodation |
| PUT | `/accommodations/:id` | Admin | Updates an accommodation |
| DELETE | `/accommodations/:id` | Admin | Deletes an accommodation |

Required accommodation fields include `title`, `location`, `description`, `bedrooms`, `bathrooms`, `guests`, `type`, `price`, and `host`. Optional fields include `images`, `amenities`, ratings, and fee configuration.

## Reservations

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/reservations` | Authenticated | Creates a reservation for the current user |
| GET | `/reservations` | Authenticated | Admins see all reservations; users see their own |
| GET | `/reservations/:id` | Owner/Admin | Returns one authorized reservation |
| PUT | `/reservations/:id` | Owner/Admin | Updates reservation details |
| PATCH | `/reservations/:id/status` | Admin | Updates pending, confirmed, cancelled, or completed status |
| DELETE | `/reservations/:id` | Owner/Admin | Deletes a reservation |

Reservation creation validates the date order, guest count, total price, accommodation existence, and accommodation capacity.

## Response conventions

Successful responses return `{ "success": true, ... }`. Validation errors use HTTP `400`, unauthenticated requests use `401`, forbidden actions use `403`, missing resources use `404`, and server/database failures use `500`.

## Security notes

Passwords are hashed with bcrypt and never returned by user-list endpoints. JWT tokens expire after one day. Admin middleware protects management routes. The server uses a configured CORS origin, validates Mongoose schemas, excludes `.env` from version control, and should be deployed with a rotated production JWT secret and database credentials.
