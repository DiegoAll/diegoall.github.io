import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../hooks/useSiteSettings';

// Los iconos se definen una sola vez porque ahora se usan en dos lugares:
// la barra superior (desktop) y el panel desplegable (móvil).
function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function Navbar({ onSearchClick }) {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings } = useSiteSettings();

  function selectLanguage(lang) {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* El botón queda por encima del panel (z-index en index.css) y se
          transforma en una X cuando el panel está abierto: así siempre hay
          una forma visible de cerrarlo. */}
      <button
        className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
        <NavLink to="/" end className="navbar-link" onClick={closeMenu}>{t('nav.home')}</NavLink>
        <NavLink to="/projects" className="navbar-link" onClick={closeMenu}>{t('nav.projects')}</NavLink>
        <NavLink to="/about" className="navbar-link" onClick={closeMenu}>{t('nav.about')}</NavLink>
        {settings?.highlights_enabled && (
          <NavLink to="/highlights" className="navbar-link" onClick={closeMenu}>{t('nav.highlights')}</NavLink>
        )}
        <NavLink to="/blog" className="navbar-link" onClick={closeMenu}>{t('nav.blog')}</NavLink>

        {/* Solo visible en móvil (ver index.css).
            Idioma y tema ya NO viven acá: en móvil se quedan siempre visibles
            arriba a la derecha. En el panel quedan búsqueda y redes sociales. */}
        <div className="navbar-mobile-actions">
          <div
            className="navbar-search"
            onClick={() => { closeMenu(); onSearchClick(); }}
          >
            <span>🔍</span>
            <span>{t('search.placeholder')}</span>
          </div>

          <a
            className="navbar-icon-btn"
            href="https://github.com/diegoall"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            onClick={closeMenu}
          >
            <GithubIcon />
            <span>GitHub</span>
          </a>

          <a
            className="navbar-icon-btn"
            href="https://linkedin.com/in/diego-alejandro-posada-llano"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            onClick={closeMenu}
          >
            <LinkedinIcon />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      {menuOpen && <div className="navbar-overlay" onClick={closeMenu} />}

      <div className="navbar-actions">
        <div className="navbar-search" onClick={onSearchClick}>
          <span>🔍</span>
          <span>Ctrl K</span>
        </div>

        {/* navbar-social: en móvil el CSS los oculta de la barra (se ven en el panel) */}
        <a
          className="navbar-icon-btn navbar-social"
          href="https://github.com/diegoall"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <GithubIcon />
        </a>

        <a
          className="navbar-icon-btn navbar-social"
          href="https://linkedin.com/in/diego-alejandro-posada-llano"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedinIcon />
        </a>

        <div className="lang-dropdown">
          <button
            className="navbar-icon-btn"
            onClick={() => setLangOpen(!langOpen)}
            aria-label={t('language.switchTo')}
            title={t('language.switchTo')}
          >
            🌐
          </button>
          {langOpen && (
            <div className="lang-menu">
              <button onClick={() => selectLanguage('es')}>ES</button>
              <button onClick={() => selectLanguage('en')}>EN</button>
            </div>
          )}
        </div>

        {/* Ya no hace falta que sea el ÚLTIMO hijo: en móvil el tema se queda
            visible junto al idioma (antes el CSS lo ocultaba con :last-child). */}
        <button className="navbar-icon-btn" onClick={toggleTheme} aria-label="Theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
