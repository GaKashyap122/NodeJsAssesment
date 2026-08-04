import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

/**
 * Wraps protected routes.
 * - Redirects unauthenticated users to /login, preserving the intended URL
 *   in location state so LoginPage can restore navigation after sign-in.
 * - Renders the Navbar above the route content for authenticated users.
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
    </>
  );
}
