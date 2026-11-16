// Qué proyectos se muestran en /projects, y en qué orden.
//
// La lista sale del backend (GET /v1/settings -> data.visible_projects), que se
// gestiona desde el panel de admin (Configuración -> Proyectos visibles).
// Si la API falla, o todavía no trae el campo, se usa DEFAULT_VISIBLE
// (ver data/projectCatalog.js): el sitio nunca queda vacío por un problema de red.
//
// Los componentes siguen leyendo { visibleIds, loading }:
//   - visibleIds: array de ids, desarrollo primero y luego ciberseguridad.
//   - loading:    true mientras se resuelve la primera consulta de settings.
import { useMemo } from 'react';
import { useSiteSettings } from './useSiteSettings';
import { DEFAULT_VISIBLE, flattenVisible, normalizeVisible } from '../data/projectCatalog';

// Se mantiene exportado por compatibilidad con el código existente.
export const DEFAULT_VISIBLE_PROJECTS = flattenVisible(DEFAULT_VISIBLE);

export function useVisibleProjects() {
  const { settings, loading } = useSiteSettings();

  const visibleIds = useMemo(
    () => flattenVisible(normalizeVisible(settings?.visible_projects)),
    [settings]
  );

  return { visibleIds, loading };
}
