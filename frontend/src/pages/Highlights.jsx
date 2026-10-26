import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mergeById } from '../i18n/utils';
import sophosImg from '../assets/1_sophos.jpeg';
import aligoNacImg from '../assets/2_bcol.jpg';
import aligoGoldbruteImg from '../assets/3_buc_campaign.jpg';
import meliImg from '../assets/4_meli_site.jpeg';
import boldImg from '../assets/5_bog_bold.jpeg';

// Datos fijos. Los textos (role, place, date, detail, title...) viven en
// locales/<idioma>/highlights.json y se unen por `id`.
const momentsBase = [
  { id: 'sophos', img: sophosImg, company: 'Sophos Banking Solutions' },
  { id: 'aligo-nac', img: aligoNacImg, company: 'Aligo Defensores Informáticos' },
  { id: 'aligo-snort', img: aligoGoldbruteImg, company: 'Aligo Defensores Informáticos' },
  { id: 'meli', img: meliImg, company: 'Mercado Libre' },
  { id: 'bold', img: boldImg, company: 'Bold' },
];

const achievementsBase = [
  {
    id: 'aligo-snort',
    company: 'Aligo Defensores Informáticos',
    link: 'https://github.com/DiegoAll/MS-NAC',
  },
  {
    id: 'aligo-nac',
    company: 'Aligo Defensores Informáticos',
    confidential: true,
  },
  {
    id: 'sofka',
    company: 'Sofka Technologies',
    link: '/docs/Sofka2021-SecurityPlan.pdf',
  },
  {
    id: 'meli-falco',
    company: 'Mercado Libre',
    link: 'https://www.youtube.com/watch?v=lPJQxTmpm3Y&t=1s',
  },
  {
    id: 'bold-portal',
    company: 'Bold',
    link: 'https://www.youtube.com/watch?v=aeQ6cjakCQo',
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
  const { t } = useTranslation('highlights');
  const moments = mergeById(momentsBase, t('moments', { returnObjects: true }));
  const [idx, setIdx] = useState(0);
  const go = (dir) => setIdx((i) => (i + dir + moments.length) % moments.length);
  const current = moments[idx];

  return (
    <div className="hl-carousel">
      <span className="hl-counter">{idx + 1} / {moments.length}</span>

      <button className="hl-nav-btn prev" onClick={() => go(-1)} aria-label={t('aria.prev')}>
        <ChevronLeft />
      </button>
      <button className="hl-nav-btn next" onClick={() => go(1)} aria-label={t('aria.next')}>
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
        {moments.map((m, i) => (
          <button
            key={m.id}
            className={`hl-dot${i === idx ? ' active' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={t('aria.goTo', { n: i + 1 })}
          />
        ))}
      </div>
    </div>
  );
}

function AchievementsGrid() {
  const { t } = useTranslation('highlights');
  const achievements = mergeById(achievementsBase, t('achievements', { returnObjects: true }));

  return (
    <div className="hl-ach-grid">
      {achievements.map((a) => (
        <div className="hl-ach-card" key={a.id}>
          <div className="hl-ach-icon">🏆</div>
          <div>
            <div className="hl-ach-company">{a.company}</div>
            <div className="hl-ach-title">{a.title}</div>
            {a.confidential && (
              <span className="hl-chip" title={a.note}>🔒 {t('confidentialChip')}</span>
            )}
            <div className="hl-ach-detail">{a.detail}</div>
            {a.link && (
              <a
                className="hl-ach-link"
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {a.linkLabel || t('defaultLinkLabel')}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Highlights() {
  const { t } = useTranslation('highlights');

  return (
    <section className="highlights-page">
      <h1 className="section-title">{t('title')}</h1>
      <p className="hl-lede">{t('lede')}</p>

      <MomentsCarousel />

      <h2 className="hl-h2">{t('achievementsTitle')}</h2>
      <AchievementsGrid />
    </section>
  );
}
