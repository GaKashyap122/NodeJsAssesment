import { Link } from 'react-router-dom';
import { useSignupForm } from '../hooks/useSignupForm';
import { SIGNUP } from '../constants/ui';

export default function SignupPage() {
  const {
    form, errors, touched, showPw, setShowPw, loading, serverError,
    handleChange, handleBlur, handleSubmit, inputClass,
  } = useSignupForm();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">{SIGNUP.TITLE}</h1>
        <p className="auth-subtitle">{SIGNUP.SUBTITLE}</p>

        {serverError && (
          <div className="alert" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name row */}
          <div className="form-row">
            <div className="field">
              <label htmlFor="firstName">{SIGNUP.FIRST_NAME_LABEL}</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder={SIGNUP.FIRST_NAME_PLACEHOLDER}
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('firstName')}
                aria-invalid={!!(touched.firstName && errors.firstName)}
                aria-describedby={errors.firstName ? 'fn-err' : undefined}
              />
              {touched.firstName && errors.firstName && (
                <span id="fn-err" className="field-error" role="alert">
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="lastName">{SIGNUP.LAST_NAME_LABEL}</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder={SIGNUP.LAST_NAME_PLACEHOLDER}
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('lastName')}
                aria-invalid={!!(touched.lastName && errors.lastName)}
                aria-describedby={errors.lastName ? 'ln-err' : undefined}
              />
              {touched.lastName && errors.lastName && (
                <span id="ln-err" className="field-error" role="alert">
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="field">
            <label htmlFor="email">{SIGNUP.EMAIL_LABEL}</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={SIGNUP.EMAIL_PLACEHOLDER}
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('email')}
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby={errors.email ? 'email-err' : undefined}
            />
            {touched.email && errors.email && (
              <span id="email-err" className="field-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="field">
            <label htmlFor="password">{SIGNUP.PASSWORD_LABEL}</label>
            <div className="input-wrap">
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder={SIGNUP.PASSWORD_PLACEHOLDER}
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('password')}
                aria-invalid={!!(touched.password && errors.password)}
                aria-describedby={errors.password ? 'pw-err' : undefined}
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? SIGNUP.HIDE_PASSWORD : SIGNUP.SHOW_PASSWORD}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {touched.password && errors.password && (
              <span id="pw-err" className="field-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="field">
            <label htmlFor="confirmPassword">{SIGNUP.CONFIRM_PASSWORD_LABEL}</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder={SIGNUP.CONFIRM_PASSWORD_PLACEHOLDER}
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('confirmPassword')}
              aria-invalid={!!(touched.confirmPassword && errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? 'cpw-err' : undefined}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span id="cpw-err" className="field-error" role="alert">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Role */}
          <div className="field">
            <label htmlFor="role">{SIGNUP.ROLE_LABEL}</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('role')}
              aria-invalid={!!(touched.role && errors.role)}
              aria-describedby={errors.role ? 'role-err' : undefined}
            >
              <option value="user">{SIGNUP.ROLE_USER}</option>
              <option value="admin">{SIGNUP.ROLE_ADMIN}</option>
            </select>
            {touched.role && errors.role && (
              <span id="role-err" className="field-error" role="alert">
                {errors.role}
              </span>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn">
            {loading ? SIGNUP.SUBMIT_LOADING : SIGNUP.SUBMIT}
          </button>
        </form>

        <p className="auth-footer">
          {SIGNUP.HAS_ACCOUNT} <Link to="/login">{SIGNUP.LOGIN_LINK}</Link>
        </p>
      </div>
    </div>
  );
}
