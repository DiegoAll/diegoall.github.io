import { NavLink } from 'react-router-dom';

const stack = ['Golang', 'Python', 'AWS', 'Kubernetes', 'Docker', 'Cybersecurity'];

function Home() {
  return (
    <div className="hero">
      <img src="/profile.png" alt="Diego Alejandro" className="hero-avatar" />

      <h1 className="hero-title">Diego Alejandro</h1>
      <p className="hero-subtitle">
        Cyber Engineer & Backend Developer — construyendo software seguro con Go, Python y React.
      </p>

      <div className="hero-badges">
        {stack.map((s) => (
          <span className="skill-chip" key={s}>{s}</span>
        ))}
      </div>

      <div className="hero-actions">
        <NavLink to="/projects" className="hero-cta">Ver proyectos</NavLink>
        <a className="hero-cta-secondary" href="mailto:dposadallano@gmail.com">
          Contactar
        </a>
      </div>

      <div className="hero-social">
        <a href="https://github.com/diegoall" target="_blank" rel="noopener noreferrer">GitHub</a>
        <span className="hero-social-sep">·</span>
        <a href="https://linkedin.com/in/diego-alejandro-posada-llano" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  );
}

export default Home;
