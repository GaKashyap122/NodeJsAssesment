import { Link } from 'react-router-dom';
import { useLoginForm } from '../hooks/useLoginForm';
import { LOGIN } from '../constants/ui';

export default function LoginPage() {
  const {
    form, errors, touched, showPw, setShowPw, loading, serverError,
    handleChange, handleBlur, handleSubmit, inputClass,
  } = useLoginForm();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">{LOGIN.TITLE}</h1>
        <p className="auth-subtitle">{LOGIN.SUBTITLE}</p>

        {serverError && (
          <div className="alert" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="field">
            <label htmlFor="email">{LOGIN.EMAIL_LABEL}</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={LOGIN.EMAIL_PLACEHOLDER}
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
            <label htmlFor="password">{LOGIN.PASSWORD_LABEL}</label>
            <div className="input-wrap">
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder={LOGIN.PASSWORD_PLACEHOLDER}
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
                aria-label={showPw ? LOGIN.HIDE_PASSWORD : LOGIN.SHOW_PASSWORD}
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

          <button type="submit" disabled={loading} className="btn">
            {loading ? LOGIN.SUBMIT_LOADING : LOGIN.SUBMIT}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}
