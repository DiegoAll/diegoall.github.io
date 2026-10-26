import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const stack = ['Golang', 'Python', 'AWS', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform', 'Cybersecurity'];

function Home() {
  const { t } = useTranslation('home');

  return (
    <div className="hero">
      <img src="/profile.png" alt="Diego Alejandro" className="hero-avatar" />

      <p className="hero-eyebrow">{t('eyebrow')}</p>
      <h1 className="hero-title">{t('title')}</h1>
      <p className="hero-subtitle">{t('subtitle')}</p>

      <div className="hero-badges">
        {stack.map((s) => (
          <span className="skill-chip" key={s}>{s}</span>
        ))}
      </div>

      <div className="hero-actions">
        <NavLink to="/projects" className="hero-cta">{t('ctaProjects')}</NavLink>
        <a className="hero-cta-secondary" href="mailto:dposadallano@gmail.com">
          {t('ctaContact')}
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
