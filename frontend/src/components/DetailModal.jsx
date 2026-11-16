import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

// Modal reutilizable para el detalle de una empresa (About) o de un proyecto.
// Estructura fija: título, subtítulo, meta, tecnologías, lista de puntos, nota y enlaces.
// Cada bloque se oculta solo si no tiene contenido.
//
// links: [{ key, label, url, className }]
function DetailModal({
  open,
  onClose,
  title,
  subtitle,
  meta,
  tags = [],
  sectionTitle,
  items = [],
  note,
  links = [],
}) {
  const { t } = useTranslation('detail');
  const titleId = useId();
  const closeRef = useRef(null);

  // Escape cierra el modal.
  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Bloquea el scroll del fondo y maneja el foco (entra al botón de cerrar,
  // y al cerrar devuelve el foco a quien abrió el modal).
  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="detail-overlay" onClick={onClose}>
      <div
        className="detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="detail-close"
          onClick={onClose}
          aria-label={t('close')}
        >
          ×
        </button>

        <h2 id={titleId} className="detail-title">{title}</h2>
        {subtitle && <p className="detail-subtitle">{subtitle}</p>}
        {meta && <p className="detail-meta">{meta}</p>}

        {tags.length > 0 && (
          <>
            <h3 className="detail-section">{t('tech')}</h3>
            <div className="detail-tags">
              {tags.map((tag) => (
                <span className="stack-chip" key={tag}>{tag}</span>
              ))}
            </div>
          </>
        )}

        {items.length > 0 && (
          <>
            {sectionTitle && <h3 className="detail-section">{sectionTitle}</h3>}
            <ul className="detail-list">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {note && <p className="detail-note">🔒 {note}</p>}

        {links.length > 0 && (
          <div className="detail-links">
            {links.map((link) => (
              <a
                key={link.key}
                className={link.className}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default DetailModal;
