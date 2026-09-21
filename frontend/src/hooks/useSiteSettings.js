import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';

// Se consulta una sola vez por carga de página (Navbar y Highlights.jsx
// comparten esta llamada gracias al cache en módulo — no dos fetches).
let cache = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;

    fetch(`${API_URL}/v1/settings`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        cache = json.data;
        setSettings(json.data);
      })
      .catch(() => {
        // Si el backend está caído, se asume "encendido" — igual que hace
        // el propio backend cuando falta la fila en site_settings. Así un
        // problema de red nunca te oculta la sección por accidente.
        cache = { highlights_enabled: true };
        setSettings(cache);
      })
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}