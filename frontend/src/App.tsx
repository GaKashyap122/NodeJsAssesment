import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import UserListPage from './pages/UserListPage';

/**
 * Route tree — lives inside <BrowserRouter> and <AuthProvider> so it can
 * consume both the router context and the auth context.
 */
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/*
       * Public routes
       * Already-authenticated users are bounced to /profile so they never
       * see the login / signup screens while a valid session exists.
       */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/profile" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/profile" replace /> : <SignupPage />}
      />

      {/*
       * Protected routes
       * <ProtectedRoute> is a layout route that:
       *   • Redirects unauthenticated visitors to /login (preserves "from" in state).
       *   • Renders <Navbar> + <Outlet> for authenticated visitors.
       */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users" element={<UserListPage />} />
      </Route>

      {/* Catch-all – send unknown paths to the right starting screen */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/profile' : '/login'} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
