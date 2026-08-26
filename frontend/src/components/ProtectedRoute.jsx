import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { accessToken, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    // Mientras se resuelve el refresh silencioso inicial no redirigimos
    // todavía — evita un parpadeo hacia /admin/login en cada F5 aunque la
    // sesión siga siendo válida.
    return <p className="admin-status">Verificando sesión...</p>;
  }

  if (!accessToken) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;