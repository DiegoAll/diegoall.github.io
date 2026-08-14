import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pages = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'About', path: '/about' },
  { label: 'Blog', path: '/blog' },
];

function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const filtered = pages.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  const goTo = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          className="search-input"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="search-results">
          {filtered.length === 0 && (
            <div className="search-empty">Sin resultados</div>
          )}
          {filtered.map((p) => (
            <button
              key={p.path}
              className="search-result-item"
              onClick={() => goTo(p.path)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
