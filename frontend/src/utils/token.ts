import type { AuthTokenPayload } from '../types';

const TOKEN_KEY = 'auth_token';

// ─── Token helpers ───────────────────────────────────────────────────────────
export function saveToken(token: string): void {
  /**
   * Stored in sessionStorage (not localStorage) because:
   *  • Cleared automatically when the browser tab/session closes.
   *  • Not shared across tabs — limits blast radius of a stolen token.
   *  • Still accessible on page refresh inside the same tab (unlike memory).
   * httpOnly cookies would be ideal but require backend changes to set them.
   */
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function loadToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function parseToken(token: string): AuthTokenPayload | null {
  try {
    // Decode payload segment only — verification happens server-side.
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64)) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseToken(token);
  if (!payload) return true;
  return Date.now() >= payload.exp * 1000;
}
