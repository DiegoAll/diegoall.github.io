import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';

// Si el backend no responde en este tiempo, se usa la configuración por defecto.
// Sin esto, una VM apagada deja la petición colgada y /projects queda vacío.
const SETTINGS_TIMEOUT_MS = 3000;

// Se consulta una sola vez por carga de página (Navbar, Highlights y Projects
// comparten esta llamada gracias al cache en módulo — no varios fetches, ni
// siquiera cuando dos componentes se montan al mismo tiempo).
let cache = null;
let inflight = null;

function loadSettings() {
  if (!inflight) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SETTINGS_TIMEOUT_MS);

    inflight = fetch(`${API_URL}/v1/settings`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        cache = json.data;
      })
      .catch(() => {
        // Si el backend está caído o tarda demasiado, se asume "encendido" —
        // igual que hace el propio backend cuando falta la fila en site_settings.
        // Así un problema de red nunca te oculta la sección por accidente.
        // (Sin `visible_projects` -> useVisibleProjects usa su selección por defecto.)
        cache = { highlights_enabled: true };
      })
      .finally(() => clearTimeout(timer));
  }
  return inflight;
}

// El panel de admin llama a esto después de guardar, para que /projects (que
// lee este cache) refleje el cambio sin tener que recargar la página.
export function updateSiteSettingsCache(patch) {
  cache = { ...(cache || {}), ...patch };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return undefined;

    let cancelled = false;
    loadSettings().then(() => {
      if (cancelled) return;
      setSettings(cache);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { settings, loading };
}