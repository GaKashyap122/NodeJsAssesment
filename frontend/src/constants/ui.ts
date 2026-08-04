// ─── Login Page ───────────────────────────────────────────────────────────────
export const LOGIN = {
  TITLE: 'Welcome back',
  SUBTITLE: 'Sign in to your account to continue',
  EMAIL_LABEL: 'Email address',
  EMAIL_PLACEHOLDER: 'you@example.com',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: '••••••••',
  SUBMIT: 'Sign In',
  SUBMIT_LOADING: 'Signing in…',
  SHOW_PASSWORD: 'Show password',
  HIDE_PASSWORD: 'Hide password',
  NO_ACCOUNT: "Don't have an account?",
  SIGNUP_LINK: 'Create account',
} as const;

// ─── Signup Page ──────────────────────────────────────────────────────────────
export const SIGNUP = {
  TITLE: 'Create account',
  SUBTITLE: 'Join us — it only takes a minute',
  FIRST_NAME_LABEL: 'First name',
  FIRST_NAME_PLACEHOLDER: 'First Name',
  LAST_NAME_LABEL: 'Last name',
  LAST_NAME_PLACEHOLDER: 'Last Name',
  EMAIL_LABEL: 'Email address',
  EMAIL_PLACEHOLDER: 'Email address',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Password',
  CONFIRM_PASSWORD_LABEL: 'Confirm password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm password',
  ROLE_LABEL: 'Role',
  ROLE_USER: 'User',
  ROLE_ADMIN: 'Admin',
  SUBMIT: 'Create Account',
  SUBMIT_LOADING: 'Creating account…',
  SHOW_PASSWORD: 'Show password',
  HIDE_PASSWORD: 'Hide password',
  HAS_ACCOUNT: 'Already have an account?',
  LOGIN_LINK: 'Sign in',
} as const;

// ─── Profile Page ─────────────────────────────────────────────────────────────
export const PROFILE = {
  LOADING_LABEL: 'Loading profile',
  FIELD_USER_ID: 'User ID',
  FIELD_FIRST_NAME: 'First name',
  FIELD_LAST_NAME: 'Last name',
  FIELD_EMAIL: 'Email',
  FIELD_ROLE: 'Role',
} as const;

// ─── User List Page ───────────────────────────────────────────────────────────
export const USER_LIST = {
  HEADING: 'All Users',
  LOADING_LABEL: 'Loading users',
  EMPTY: 'No users found.',
  COL_NUMBER: '#',
  COL_NAME: 'Name',
  COL_EMAIL: 'Email',
  COL_ROLE: 'Role',
  COL_JOINED: 'Joined',
  PREV: '← Prev',
  NEXT: 'Next →',
  PREV_LABEL: 'Previous page',
  NEXT_LABEL: 'Next page',
} as const;
