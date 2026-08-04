// ─── Regex ───────────────────────────────────────────────────────────────────
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Min 8 chars | at least one uppercase | one lowercase | one digit | one special char
 */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).{8,}$/;

const NAME_REGEX = /^[a-zA-Z\s\-']+$/;
const NAME_MAX = 50;

// ─── Validators ──────────────────────────────────────────────────────────────
export function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Email is required.';
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address.';
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (!PASSWORD_REGEX.test(value))
    return 'Must include uppercase, lowercase, number and special character.';
  return null;
}

export function validateName(value: string, field: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return `${field} is required.`;
  if (trimmed.length > NAME_MAX) return `${field} must be at most ${NAME_MAX} characters.`;
  if (!NAME_REGEX.test(trimmed))
    return `${field} may only contain letters, spaces, hyphens, or apostrophes.`;
  return null;
}

export function validateRole(value: string): string | null {
  if (!value) return 'Role is required.';
  if (!['user', 'admin'].includes(value)) return 'Select a valid role.';
  return null;
}

// ─── Sanitizer ───────────────────────────────────────────────────────────────
/**
 * Strip HTML-dangerous characters to prevent reflected XSS if the value
 * is ever rendered as raw HTML. React escapes JSX automatically, but the
 * value is also sent to the API, so we sanitize before submission.
 */
export function sanitize(value: string): string {
  return value.replace(/[<>]/g, '');
}
