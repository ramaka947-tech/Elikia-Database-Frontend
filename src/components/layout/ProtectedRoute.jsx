import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const { pathname } = useLocation();
  if (loading) return <p className="p-6">Chargement...</p>;
  // Les pages /admin renvoient vers la connexion administrateur
  if (!user) return <Navigate to={pathname.startsWith('/admin') ? '/admin/login' : '/login'} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/tableau-de-bord" replace />;
  return <Outlet />;
}
