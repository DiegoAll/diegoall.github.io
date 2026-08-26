import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';

// useAdminApi centraliza las llamadas autenticadas a /v1/admin/*.
// Si el access token expiró (401), intenta un refresh silencioso UNA vez
// y reintenta la request original — así el admin nunca ve un error de sesión
// mientras el refresh token siga vigente (hasta JWT_REFRESH_TTL_HOURS).
export function useAdminApi() {
  const { accessToken, silentRefresh, logout } = useAuth();

  const request = useCallback(
    async (path, options = {}, tokenOverride = null, alreadyRetried = false) => {
      const token = tokenOverride ?? accessToken;

      const res = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
          ...(options.body ? { 'Content-Type': 'application/json' } : {}),
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (res.status === 401 && !alreadyRetried) {
        const newToken = await silentRefresh();
        if (newToken) {
          return request(path, options, newToken, true);
        }
        await logout();
        throw new Error('Tu sesión expiró — inicia sesión de nuevo');
      }

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.error) {
        throw new Error(json.message || 'Ocurrió un error en la solicitud');
      }
      return json;
    },
    [accessToken, silentRefresh, logout]
  );

  return { request };
}