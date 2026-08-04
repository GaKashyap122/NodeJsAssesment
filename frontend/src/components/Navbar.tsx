import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link nav-link--active' : 'nav-link';

  return (
    <nav className="navbar">
      <span className="navbar-brand">UserApp</span>

      <div className="navbar-links">
        <NavLink to="/profile" className={linkClass} end>
          Profile
        </NavLink>

        {/* Users list is admin-only; hide the link for regular users */}
        {isAdmin && (
          <NavLink to="/users" className={linkClass}>
            Users
          </NavLink>
        )}

        <button type="button" onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
