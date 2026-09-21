import { useState } from 'react';
import sophosImg from '../assets/1_sophos.jpeg';
import aligoNacImg from '../assets/2_bcol.jpg';
import aligoGoldbruteImg from '../assets/3_buc_goldbrute.jpg';
import meliImg from '../assets/4_meli_site.jpeg';
import boldImg from '../assets/5_bog_bold.jpeg';

const moments = [
  {
    img: sophosImg,
    company: 'Sophos Banking Solutions',
    role: 'Backend Developer',
    place: 'Pier 30, Bancolombia',
    date: '',
    detail: 'Célula SWIFT Payments junto a equipo de Infosys (India).',
  },
  {
    img: aligoNacImg,
    company: 'Aligo Defensores Informáticos',
    role: 'Mantenimiento de Bases de Datos',
    place: 'Dirección General, Medellín',
    date: '2:00 AM',
    detail: 'Depuración de Network Access Control.',
  },
  {
    img: aligoGoldbruteImg,
    company: 'Aligo Defensores Informáticos',
    role: 'Actualización de firmas de seguridad',
    place: 'Aeropuerto Palonegro, Bucaramanga',
    date: '',
    detail: 'Creación y actualización automática de firmas de Snort IDS para detectar intentos de explotación de CVE-2019-0708 (RDP).',
  },
  {
    img: meliImg,
    company: 'Mercado Libre',
    role: 'Golang REST API Development & Kubernetes Security',
    place: 'Sede Vizcaya, Medellín',
    date: '',
    detail: 'Un rato de chill en la oficina, entre sprints.',
  },
  {
    img: boldImg,
    company: 'Bold',
    role: 'Application Security & Secure Coding Coach',
    place: 'Torre Once, Chicó, Bogotá D.C.',
    date: '',
    detail: 'Algo cansado por la madrugada y el viaje, necesito un café Juan Valdez urgente...',
  },
];

const achievements = [
  {
    company: 'Aligo Defensores Informáticos',
    title: 'Generación automática de reglas para Snort IDS',
    detail: 'Validación y generación automática de reglas para el IDS.',
  },
  {
    company: 'Aligo Defensores Informáticos',
    title: 'Automatización de escaneos NAC',
    detail: 'Integración de escaneos remotos automáticos con PacketFence & OpenVAS.',
    link: 'https://github.com/DiegoAll/MS-NAC',
  },
  {
    company: 'Sofka Technologies',
    title: 'Estrategia DevSecOps',
    detail: 'Diseño e implementación de la estrategia DevSecOps de la compañía.',
  },
  {
    company: 'Mercado Libre',
    title: 'Falco Runtime Security & Red Teaming',
    detail: 'Nuevas reglas de runtime security y actividades de red teaming sobre clusters de Kubernetes.',
  },
  {
    company: 'Bold',
    title: 'Secure Coding Training Portal',
    detail: 'Desarrollo del portal y rol de Security Coach para los equipos de desarrollo.',
  },
];

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function MomentsCarousel() {
  const [idx, setIdx] = useState(0);
  const go = (dir) => setIdx((i) => (i + dir + moments.length) % moments.length);
  const current = moments[idx];

  return (
    <div className="hl-carousel">
      <span className="hl-counter">{idx + 1} / {moments.length}</span>

      <button className="hl-nav-btn prev" onClick={() => go(-1)} aria-label="Anterior">
        <ChevronLeft />
      </button>
      <button className="hl-nav-btn next" onClick={() => go(1)} aria-label="Siguiente">
        <ChevronRight />
      </button>

      <div className="hl-photo-box">
        <img src={current.img} alt={`${current.company} — ${current.role}`} />
      </div>

      <div className="hl-caption">
        <div className="hl-company">{current.company}</div>
        <div className="hl-role">{current.role}</div>
        <div className="hl-meta">
          <span className="hl-chip">📍 {current.place}</span>
          {current.date && <span className="hl-chip">🕐 {current.date}</span>}
        </div>
        {current.detail && <div className="hl-detail">{current.detail}</div>}
      </div>

      <div className="hl-dots">
        {moments.map((_, i) => (
          <button
            key={i}
            className={`hl-dot${i === idx ? ' active' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Ir a la foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function AchievementsGrid() {
  return (
    <div className="hl-ach-grid">
      {achievements.map((a, i) => (
        <div className="hl-ach-card" key={i}>
          <div className="hl-ach-icon">🏆</div>
          <div>
            <div className="hl-ach-company">{a.company}</div>
            <div className="hl-ach-title">{a.title}</div>
            <div className="hl-ach-detail">{a.detail}</div>
            {a.link && (
              <a
                className="hl-ach-link"
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver código →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Highlights() {
  return (
    <section className="highlights-page">
      <h1 className="section-title">Highlights</h1>
      <p className="hl-lede">
        Un recorrido visual por los proyectos y equipos con los que he trabajado,
        y algunos logros profesionales.
      </p>

      <MomentsCarousel />

      <h2 className="hl-h2">Logros</h2>
      <AchievementsGrid />
    </section>
  );
}