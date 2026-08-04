import { useProfile } from '../hooks/useProfile';
import { PROFILE } from '../constants/ui';

export default function ProfilePage() {
  const { user, loading, serverError } = useProfile();

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" role="status" aria-label={PROFILE.LOADING_LABEL} />
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="profile-container">
        <div className="alert" role="alert">{serverError}</div>
      </div>
    );
  }

  if (!user) return null;

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="profile-name">
            {user.firstName} {user.lastName}
          </div>
          <span className="profile-role-badge">{user.role}</span>
        </div>

        <div className="profile-body">
          <div className="profile-row">
            <span className="profile-label">{PROFILE.FIELD_USER_ID}</span>
            <span className="profile-value">#{user.id}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">{PROFILE.FIELD_FIRST_NAME}</span>
            <span className="profile-value">{user.firstName}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">{PROFILE.FIELD_LAST_NAME}</span>
            <span className="profile-value">{user.lastName}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">{PROFILE.FIELD_EMAIL}</span>
            <span className="profile-value">{user.email}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">{PROFILE.FIELD_ROLE}</span>
            <span className={`badge badge-${user.role}`}>{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
