# ADR 0001: JWT authentication with sessionStorage on the client

- Status: Accepted
- Date: 2026-08-04

## Context

The app needs a simple authentication mechanism for a single backend API consumed by a React SPA. Requirements:

- Stateless backend (no server-side session store).
- Support role-based access control (`user`, `admin`).
- Token must be sent with every API request from the browser.
- Should minimize risk of long-lived credential theft via XSS.

Two main choices were considered:

1. **Session cookies** (server-managed, HttpOnly).
2. **JWT** stored on the client and sent via the `Authorization` header.

For token storage on the client, the options were:

- `localStorage` — persists across tabs and browser restarts.
- `sessionStorage` — cleared when the tab is closed.
- In-memory only — lost on any page reload.
- HttpOnly cookie — inaccessible to JS, but requires CSRF protection.

## Decision

Use **JWT** signed with `JWT_SECRET`, returned by `POST /auth/sign-in`, and stored in the browser's **`sessionStorage`**. The frontend attaches it as `Authorization: Bearer <token>` on every request via an Axios interceptor.

## Rationale

- **JWT + stateless backend** keeps the API simple and horizontally scalable — no shared session store required.
- **`sessionStorage` over `localStorage`**: the token is automatically cleared when the tab closes, reducing the window in which a stolen token can be replayed. Both are vulnerable to XSS, but `sessionStorage` has a shorter effective lifetime and does not leak across tabs.
- **`sessionStorage` over HttpOnly cookies**: avoids the need to implement CSRF tokens for this assessment-scope project. Cookies would be more secure against XSS but add complexity we chose not to take on here.
- **Short JWT expiry** (`JWT_EXPIRY=1h`) limits blast radius of a leaked token.
- **Password hashing with bcrypt** and rate limiting on `/auth/*` reduce credential-stuffing risk before a JWT is ever issued.

## Consequences

Positive:

- Simple, stateless auth flow that fits a small SPA + REST API.
- Easy to reason about; no session store to operate.
- Logout is instant client-side (just clear `sessionStorage`).

Negative / trade-offs:

- Token cannot be revoked server-side before it expires (stateless).
- XSS in the SPA can read the token from `sessionStorage`. Mitigated by React's default escaping and by not injecting untrusted HTML.
- No "remember me" / cross-tab session — user must sign in again after closing the tab. This is intentional for the current scope.

## Follow-ups (out of scope)

- Refresh tokens with rotation.
- Move to HttpOnly cookies + CSRF tokens if the app grows.
- Server-side token revocation list (e.g., Redis) if immediate logout-everywhere is required.
