import { NavLink } from 'react-router-dom';
import { SiGo, SiPython, SiKubernetes, SiDocker } from 'react-icons/si';
import { FaAws, FaBug } from 'react-icons/fa';

const stackIcons = [
  { icon: <SiGo />, label: 'Go' },
  { icon: <SiPython />, label: 'Python' },
  { icon: <FaAws />, label: 'AWS' },
  { icon: <SiKubernetes />, label: 'Kubernetes' },
  { icon: <SiDocker />, label: 'Docker' },
  { icon: <FaBug />, label: 'Cybersecurity' }, // Mantiene el icono de FaBug
];

const metrics = [
  { value: '9', label: 'Años de experiencia' },
  { value: '10+', label: 'Proyectos' },
  { value: '3', label: 'Certificaciones' },
];

function Home() {
  return (
    <div className="hero">
      <img src="/profile.png" alt="Diego Alejandro" className="hero-avatar" />

      <h1 className="hero-title">Diego Alejandro</h1>
      <p className="hero-subtitle">
        Cyber Engineer & Backend Developer — construyendo software seguro con Go, Python y React.
      </p>

      <div className="hero-badges">
        {stackIcons.map((s) => (
          <span className="skill-chip skill-chip-icon" key={s.label}>
            {s.icon}
            <span>{s.label}</span>
          </span>
        ))}
      </div>

      <div className="hero-actions">
        <NavLink to="/projects" className="hero-cta">Ver proyectos</NavLink>
        <a className="hero-cta-secondary" href="mailto:dposadallano@gmail.com">
          Contactar
        </a>
        
        {/* CORREGIDO: Se añade la etiqueta de apertura <a */}
        <a
          className="hero-cta-secondary"
          href="https://blog.thepragmatic.xyz/assets/portfolio/Portfolio_DiegoAlejandroPosada_2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Descargar CV
        </a>
      </div>

      <div className="hero-social">
        <a href="https://github.com/diegoall" target="_blank" rel="noopener noreferrer">GitHub</a>
        <span className="hero-social-sep">·</span>
        <a href="https://linkedin.com/in/diego-alejandro-posada-llano" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>

      {/* ── Métricas rápidas ─────────────────────────── */}
      <div className="metrics-row">
        {metrics.map((m) => (
          <div className="metric-card" key={m.label}>
            <span className="metric-value">{m.value}</span>
            <span className="metric-label">{m.label}</span>
          </div>
        ))}
      </div>

      {/* ── Proyecto destacado ───────────────────────── */}
      <div className="home-highlight-grid">
        <NavLink to="/projects" className="highlight-card">
          <span className="highlight-tag">Proyecto destacado</span>
          <h3 className="highlight-title">Secure Coding Training Portal</h3>
          <p className="highlight-desc">
            Portal desarrollado para entrenar a los equipos de desarrollo de Bold en
            buenas prácticas de seguridad y diseño seguro de software.
          </p>
          <span className="highlight-link">Ver proyecto →</span>
        </NavLink>

        {/* ── Preview último post del blog ────────────── */}
        
        {/* CORREGIDO: Se añade la etiqueta de apertura <a */}
        <a
          className="highlight-card"
          href="https://diego-all.github.io/cyber/kubernetes/falco-custom-rules/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="highlight-tag">Último post del blog</span>
          <h3 className="highlight-title">Falco Custom Rules</h3>
          <p className="highlight-desc">
            Paquete de reglas personalizado para Falco runtime security, orientado a
            detección de comportamientos anómalos en clústeres de Kubernetes.
          </p>
          <span className="highlight-link">Leer post →</span>
        </a>
      </div>
    </div>
  );
}

export default Home;