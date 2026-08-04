# User Management Application

> Full-stack assessment project — Node.js REST API + React SPA with authentication, protected routes, and role-based access.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
   - [Backend Setup](#backend-setup-steps-16)
   - [Frontend Setup](#frontend-setup-steps-711)
7. [API Reference](#api-reference)
8. [Validation Rules](#validation-rules)
9. [Environment Variables](#environment-variables)
10. [Security Decisions & Rationale](#security-decisions--rationale)
11. [Known Limitations](#known-limitations)
12. [Evidence (Screenshots)](#evidence-screenshots)
13. [Architecture Decision Records (ADRs)](#architecture-decision-records-adrs)
14. [Common Errors](#common-errors)

---

## Overview

A full-stack user management system that allows users to register, log in, view their profile, and (for admin accounts) browse a paginated list of all users.

The backend exposes a secure REST API with JWT-based authentication and role-based authorization. The frontend is a single-page React application with inline form validation, protected routing, and sessionStorage-based token management.

---

## Architecture

High-level component and request flow:

```mermaid
flowchart LR
    Browser[React SPA<br/>Vite + React Router]
    API[Express REST API<br/>TypeScript]
    DB[(PostgreSQL)]

    Browser -- "JSON + Authorization: Bearer &lt;JWT&gt;" --> API
    API -- "Prisma Client" --> DB
```

**Request flow (authenticated route):**

1. User submits credentials on `/login`.
2. Frontend `POST /auth/sign-in` → backend verifies password with `bcrypt.compare`, signs a JWT with `JWT_SECRET`, returns it.
3. Frontend stores JWT in `sessionStorage`; Axios interceptor attaches `Authorization: Bearer <token>` to every subsequent request.
4. Protected routes (`/user/profile`, `/user/list`) pass through:
   - `contentType` middleware (rejects non-JSON on writes)
   - `rateLimit` middleware (auth routes)
   - `auth` middleware (verifies JWT, attaches `req.user`)
   - Role guard (for `/user/list`, requires `role === 'admin'`)
5. Controller queries Postgres via Prisma and returns JSON.

**Layering (backend):** `routes/` → `middleware/` → `controllers/` → `db.ts` (Prisma singleton) → PostgreSQL.

**Layering (frontend):** `pages/` → `hooks/` (business logic) → `api/` (Axios) → backend. `context/AuthContext` holds current user; `components/ProtectedRoute` guards private pages.

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server and routing |
| TypeScript | Type safety |
| Prisma ORM | Database access and migrations |
| PostgreSQL | Relational database |
| bcrypt | Password hashing |
| jsonwebtoken | JWT signing and verification |
| helmet + cors | Security headers and CORS |
| express-rate-limit | Brute-force protection on auth routes |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework with type safety |
| Vite | Build tool and dev server |
| React Router v7 | Client-side navigation and protected routes |
| Axios | HTTP client with interceptors |
| Custom hooks | Separation of business logic from UI |
| sessionStorage | Secure JWT storage (cleared on tab close) |

---

## Features

### Authentication
- User registration with role selection (`user` / `admin`)
- JWT login with token expiry
- Secure logout (clears sessionStorage)
- Rate limiting on auth endpoints

### Frontend Screens
| Screen | Route | Access |
|---|---|---|
| Login | `/login` | Public |
| Create Account | `/signup` | Public |
| User Profile | `/profile` | Authenticated |
| User Listing | `/users` | Authenticated + Admin only |

### Validation
- Inline field-level validation (on blur and on submit)
- Error messages shown per field
- Both frontend and backend enforce the same rules
- Password show/hide toggle

### Navigation
- Unauthenticated users redirected to `/login`
- Login restores the originally requested page after sign-in
- Authenticated users redirected away from `/login` and `/signup`
- Admin-only **Users** nav link hidden for non-admin accounts

---

## Project Structure

```
Node-Assesment-1/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts     Sign-up, Sign-in
│   │   │   └── user.controller.ts     Profile, User list
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts     JWT verification, role guard
│   │   │   ├── rateLimit.middleware.ts
│   │   │   ├── logger.middleware.ts
│   │   │   └── contentType.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── db.ts                      Prisma client singleton
│   │   └── index.ts                   Express app entry point
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── .env                           ← create this (see Step 3)
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── client.ts              Axios instance + interceptors
    │   │   ├── auth.ts                signIn, signUp
    │   │   └── user.ts                getProfile, getUserList
    │   ├── hooks/
    │   │   ├── useLoginForm.ts        Login form state + API call
    │   │   ├── useSignupForm.ts       Signup form state + API call
    │   │   ├── useProfile.ts          Profile data fetching
    │   │   └── useUserList.ts         Paginated user list fetching
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   ├── SignupPage.tsx
    │   │   ├── ProfilePage.tsx
    │   │   └── UserListPage.tsx
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── constants/
    │   │   └── ui.ts                  All hardcoded UI strings
    │   ├── utils/
    │   │   ├── validation.ts          Email, password, name rules
    │   │   └── token.ts               sessionStorage helpers + JWT decode
    │   ├── types/
    │   │   └── index.ts               Shared TypeScript types
    │   ├── config.ts                  VITE_API_URL export
    │   └── App.tsx                    Router tree
    └── .env                           ← create this (see Step 9)
```

---

## Getting Started

### Prerequisites

| Tool | Minimum version | Check |
|---|---|---|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| PostgreSQL | 13+ | `psql --version` |
| Git | any | `git --version` |

### Clone the repository

```bash
git clone <your-repo-url>
cd Node-Assesment-1
```

---

## Backend Setup (Steps 1–6)

### Step 1 — Install dependencies

```bash
cd backend
npm install
```

### Step 2 — Create the environment file

Copy the example file:

```bash
cp backend/.env.example backend/.env
```

### Step 3 — Fill in environment values

Edit `backend/.env` and replace the placeholders. Reference:

```env
# Server
PORT=8000

# Database — PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# JWT
JWT_SECRET="replace-with-a-long-random-secret-min-32-chars"
JWT_EXPIRY="1h"
```

> **Local database example:**
> ```
> DATABASE_URL="postgresql://postgres:password@localhost:5432/userapp"
> ```

### Step 4 — Run database migrations

```bash
cd backend
npx prisma migrate deploy
```

Creates the `User` table in your database.

### Step 5 — Generate Prisma client

```bash
npx prisma generate
```

### Step 6 — Start the backend server

```bash
# Development (live reload)
npm run dev

# Production
npm run build && npm start
```

> ✅ Backend running at **http://localhost:8000**

---

## Frontend Setup (Steps 7–11)

### Step 7 — Open a new terminal and install dependencies

```bash
cd frontend
npm install
```

### Step 8 — Create the environment file

```bash
cp frontend/.env.example frontend/.env
```

### Step 9 — Fill in environment values

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

> Restart the dev server after any `.env` change — Vite reads it only at startup.

### Step 10 — Start the frontend dev server

```bash
npm run dev
```

> ✅ Frontend running at **http://localhost:5173**

### Step 11 — Open in browser

```
http://localhost:5173
```

You will land on the **Login** screen. Use the **Create account** link to register, then sign in.

---

## API Reference

### Authentication

#### POST `/auth/sign-up`
Register a new user. No authentication required.

**Request body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "password": "Secret@123",
  "role": "user"
}
```

**Success response `201`:**
```json
{ "message": "User created successfully", "userId": 1 }
```

---

#### POST `/auth/sign-in`
Login and receive a JWT token.

**Request body:**
```json
{
  "email": "jane@example.com",
  "password": "Secret@123"
}
```

**Success response `200`:**
```json
{ "message": "Login successful", "token": "<JWT>" }
```

---

### User (requires `Authorization: Bearer <token>` header)

#### GET `/user/profile`
Returns the logged-in user's profile.

**Success response `200`:**
```json
{
  "id": 1,
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "role": "user"
}
```

---

#### GET `/user/list?page=1&limit=10`
Returns a paginated list of all users. **Admin role required.**

**Success response `200`:**
```json
{
  "data": [{ "id": 1, "firstName": "Jane", ... }],
  "meta": { "total": 25, "page": 1, "limit": 10, "totalPages": 3 }
}
```

---

## Validation Rules

Applied on **both frontend (inline) and backend (request level)**:

| Field | Rule |
|---|---|
| `email` | Must be a valid email format |
| `password` | Minimum 8 characters · at least 1 uppercase · 1 lowercase · 1 number · 1 special character |
| `firstName` | Required · letters, spaces, hyphens, apostrophes only · max 50 characters |
| `lastName` | Required · letters, spaces, hyphens, apostrophes only · max 50 characters |
| `role` | Must be exactly `user` or `admin` |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Port the API server listens on |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for signing JWT tokens |
| `JWT_EXPIRY` | No | `1h` | JWT token expiry duration |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `http://localhost:8000` | Base URL of the backend API |

Example templates are checked in as `backend/.env.example` and `frontend/.env.example`. Real `.env` files must **not** be committed.

---

## Security Decisions & Rationale

| Decision | Why |
|---|---|
| **bcrypt** for password hashing | Adaptive cost factor resists brute-force; industry standard. Passwords are never stored or logged in plaintext. |
| **JWT** (stateless auth) | Simple, no session store, scales horizontally. Signed with `JWT_SECRET` from env. |
| **`sessionStorage`** for JWT (not `localStorage`) | Token is cleared when the tab closes — shorter blast radius if leaked. See [ADR 0001](docs/adr/0001-jwt-with-sessionstorage.md). |
| **Short JWT expiry** (`1h` default) | Limits the useful lifetime of a stolen token. |
| **`helmet`** middleware | Sets secure HTTP headers (X-Content-Type-Options, Referrer-Policy, etc.) with one line. |
| **`cors`** with explicit origin | Only the frontend origin can call the API from the browser. |
| **`express-rate-limit`** on `/auth/*` | Slows credential-stuffing and brute-force attempts before a JWT is ever issued. |
| **Content-Type middleware** | Rejects non-JSON writes early — reduces attack surface for parser abuse. |
| **Password policy** (8+ chars, mixed case, digit, special) | Enforced on both client and server; the server is the source of truth. |
| **Input validation on client and server** | Same rules in both places: client gives fast feedback, server is authoritative. |
| **Role check for `/user/list`** | Authorization middleware verifies `role === 'admin'` on the decoded JWT before the controller runs. |
| **Secrets from environment** | `JWT_SECRET` and `DATABASE_URL` never in source; `.env` is gitignored, `.env.example` is committed. |

---

## Known Limitations

- **No refresh tokens.** When the JWT expires the user must sign in again.
- **No password reset / email verification** flow.
- **No account lockout** after N failed logins — only IP-level rate limiting.
- **JWT is not revocable server-side** (stateless). Logout only clears the client-side token.
- **No HTTPS in local dev** — production deployment is expected to terminate TLS at a proxy/load balancer.
- **No automated tests yet.** Coverage is currently 0%; org policy target is ≥80% on new/changed code.
- **Role model is minimal** (`user` / `admin` only). No permission granularity.
- **Pagination on `/user/list`** uses simple offset/limit; not suitable for very large tables (consider keyset pagination).
- **No structured audit logging** of auth events.
- **CORS origin** is currently permissive for local dev; must be tightened before production.

---

## Evidence (Screenshots)

Drop screenshots into `docs/screenshots/` with the filenames below and they will render here.

### Signup → Profile flow

| Step | Screenshot |
|---|---|
| 1. Signup form filled | ![Signup](docs/screenshots/01-signup.png) |
| 2. Redirect / login after signup | ![Login](docs/screenshots/02-login.png) |
| 3. Profile page for the new user | ![Profile](docs/screenshots/03-profile.png) |

### Role-based access on `/users/list`

| Case | Screenshot |
|---|---|
| Admin sees the user list | ![Admin users list](docs/screenshots/04-admin-users-list.png) |
| Non-admin is blocked (nav hidden or 403 response) | ![Non-admin forbidden](docs/screenshots/05-nonadmin-forbidden.png) |

---

## Architecture Decision Records (ADRs)

- [ADR 0001 — JWT authentication with sessionStorage on the client](docs/adr/0001-jwt-with-sessionstorage.md)

---

## Common Errors

| Error message | Cause | Fix |
|---|---|---|
| `ERR_CONNECTION_REFUSED` | Backend server not running | Complete Steps 1–6 and run `npm run dev` |
| `Invalid credentials` | Wrong email or password | Verify credentials or create a new account |
| `Authorization token required` | Accessing a protected route without login | Sign in first to receive a token |
| `User with this email already exists` | Email already registered | Use a different email address |
| Prisma migration error | Database unreachable | Verify `DATABASE_URL` in `backend/.env` |
| `VITE_API_URL` is `undefined` | Missing `frontend/.env` | Create the file (Step 9) and restart the dev server |
