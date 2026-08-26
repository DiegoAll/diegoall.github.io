import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/posts';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-icon">
          <LockIcon />
        </div>

        <h1 className="admin-login-title">Panel de administración</h1>
        <p className="admin-login-subtitle">Acceso restringido — solo administradores</p>

        {error && <p className="admin-login-error">⚠ {error}</p>}

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            autoComplete="username"
          />
        </label>

        <label className="admin-field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <button className="admin-login-btn" type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="admin-login-footer">Sesión protegida con JWT + refresh token</p>
      </form>
    </div>
  );
}

export default Login;