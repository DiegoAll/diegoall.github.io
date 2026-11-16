import { useEffect, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { updateSiteSettingsCache } from '../../hooks/useSiteSettings';
import {
  CATEGORY_LABELS,
  DEFAULT_VISIBLE,
  MAX_VISIBLE_PER_CATEGORY,
  PROJECT_CATALOG,
  normalizeVisible,
} from '../../data/projectCatalog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';
const CATEGORIES = Object.keys(PROJECT_CATALOG);

const sameSelection = (a, b) => CATEGORIES.every((c) => a[c].join('|') === b[c].join('|'));

// Tarjeta de la pestaña "Configuración": elige qué proyectos se ven en /projects.
// Hasta MAX_VISIBLE_PER_CATEGORY por categoría. El orden en que se marcan es el
// orden en que aparecen en el sitio (el número junto al check lo muestra).
function VisibleProjectsCard() {
  const { request } = useAdminApi();
  const [selection, setSelection] = useState(() => normalizeVisible(null));
  const [saved, setSaved] = useState(() => normalizeVisible(null));
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'ok' | 'error', text }

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/v1/settings`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        if (cancelled) return;
        // Si el backend aún no tiene `visible_projects`, normalizeVisible
        // devuelve la selección por defecto.
        const current = normalizeVisible(json.data?.visible_projects);
        setSelection(current);
        setSaved(current);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => { cancelled = true; };
  }, []);

  function toggle(category, id) {
    setMessage(null);
    setSelection((prev) => {
      const list = prev[category];
      if (list.includes(id)) {
        return { ...prev, [category]: list.filter((x) => x !== id) };
      }
      if (list.length >= MAX_VISIBLE_PER_CATEGORY) return prev;
      return { ...prev, [category]: [...list, id] };
    });
  }

  function restoreDefaults() {
    setMessage(null);
    setSelection(normalizeVisible(DEFAULT_VISIBLE));
  }

  const dirty = !sameSelection(selection, saved);
  const missingCategory = CATEGORIES.find((c) => selection[c].length === 0);
  const canSave = status === 'ready' && dirty && !missingCategory && !saving;

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await request('/v1/admin/settings/projects', {
        method: 'PUT',
        body: JSON.stringify(selection),
      });
      setSaved(selection);
      updateSiteSettingsCache({ visible_projects: selection });
      setMessage({ type: 'ok', text: 'Cambios guardados.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-settings-card">
      <div className="admin-settings-title">Proyectos visibles</div>
      <p className="admin-settings-desc">
        Elige hasta {MAX_VISIBLE_PER_CATEGORY} proyectos por categoría para mostrar en la
        página Proyectos y mantener el sitio ligero. Se muestran en el orden en que los marques.
      </p>

      {status === 'loading' && <p className="admin-status">Cargando…</p>}
      {status === 'error' && <p className="admin-login-error">No se pudo cargar la configuración</p>}

      {status === 'ready' && (
        <>
          <div className="vp-columns">
            {CATEGORIES.map((category) => {
              const selected = selection[category];
              const full = selected.length >= MAX_VISIBLE_PER_CATEGORY;
              return (
                <fieldset className="vp-col" key={category}>
                  <legend className="vp-col-head">
                    <span>{CATEGORY_LABELS[category]}</span>
                    <span className={`vp-count${full ? ' full' : ''}`}>
                      {selected.length}/{MAX_VISIBLE_PER_CATEGORY}
                    </span>
                  </legend>

                  {PROJECT_CATALOG[category].map((project) => {
                    const position = selected.indexOf(project.id);
                    const checked = position !== -1;
                    return (
                      <label
                        key={project.id}
                        className={`vp-option${checked ? ' checked' : ''}${!checked && full ? ' disabled' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!checked && full}
                          onChange={() => toggle(category, project.id)}
                        />
                        <span className="vp-option-title">{project.title}</span>
                        {checked && <span className="vp-order">{position + 1}</span>}
                      </label>
                    );
                  })}
                </fieldset>
              );
            })}
          </div>

          {missingCategory && (
            <p className="vp-hint">
              Selecciona al menos un proyecto en {CATEGORY_LABELS[missingCategory]}.
            </p>
          )}

          <div className="vp-actions">
            <button type="button" className="admin-btn-primary" disabled={!canSave} onClick={handleSave}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button type="button" className="admin-btn-secondary" disabled={saving} onClick={restoreDefaults}>
              Restaurar selección inicial
            </button>
            {message && (
              <span className={`vp-msg ${message.type}`}>
                {message.type === 'ok' ? '✓ ' : '⚠ '}
                {message.text}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default VisibleProjectsCard;
