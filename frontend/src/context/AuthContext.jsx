import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // El access token vive SOLO en memoria (nunca en localStorage/sessionStorage)
  // para minimizar la ventana de robo por XSS. El refresh token está en una
  // cookie httpOnly con Path=/v1/admin (ver JWTService en jwt.go) — el
  // frontend nunca lo lee ni lo toca directamente.
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // silentRefresh intenta hidratar la sesión usando la cookie httpOnly.
  // Se llama al montar la app (para sobrevivir un F5) y desde useAdminApi
  // cuando una request responde 401 por access token expirado.
  const silentRefresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/v1/admin/refresh`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('No hay sesión activa');
      const json = await res.json();
      setAccessToken(json.data.access_token);
      return json.data.access_token;
    } catch {
      setAccessToken(null);
      return null;
    }
  }, []);

  useEffect(() => {
    silentRefresh().finally(() => setIsAuthLoading(false));
    // Solo al montar — silentRefresh es estable (useCallback sin deps).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_URL}/v1/admin/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.error) {
      throw new Error(json.message || 'Credenciales inválidas');
    }
    setAccessToken(json.data.access_token);
    return json.data.access_token;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/v1/admin/logout`, {
        method: 'GET',
        credentials: 'include',
      });
    } finally {
      setAccessToken(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, isAuthLoading, login, logout, silentRefresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}