import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mergeById } from '../i18n/utils';
import thePragmaticCover from '../assets/thepragmatic_cybersecurity_notes_cover.jpeg';
import meliArchitectureCover from '../assets/MELI-Architecture-Anomaly-detection.png';
import vigenereCover from '../assets/vigenere.jpeg';
import secureCodingCover from '../assets/SecureCodingTrainingPortal.jpeg';
import cloudtrailCover from '../assets/cloudtrail-enrichment-api-golang.jpeg';
import k8sRuntimeSecCover from '../assets/k8s-runtime-sec.jpeg';
import goVulnerableApiCover from '../assets/go-vulnerable-api.jpeg';
import cveLooneyTunablesCover from '../assets/CVE-2023-4911_Looney_Tunables_Detection.jpeg';
import restApiGolangGenCover from '../assets/rest-api-golang-gen.jpeg';
import restfulRdsCover from '../assets/restful-rds-golang-products.jpeg';

// Datos que NO cambian con el idioma (título, stack, imágenes, links).
// `description` y `note` viven en locales/<idioma>/projects.json y se unen por `id`.
// `typeKey` y `labelKey` apuntan a las claves types.* y links.* del JSON.
const projectsBase = [
  // ── Desarrollo de Software ──────────────────────────
  {
    id: 'thepragmatic',
    title: 'ThePragmatic.xyz',
    typeKey: 'community',
    category: 'development',
    stack: ['Golang', 'React', 'Digital Ocean'],
    image: thePragmaticCover,
    gradient: 'linear-gradient(135deg, #7f1d1d, #1a1a1a)',
    links: [
      { labelKey: 'site', url: 'https://thepragmatic.xyz/', variant: 'primary' },
      { labelKey: 'code', url: 'https://github.com/ThePragmaticCybersecurityNotes/web', variant: 'secondary' },
    ],
  },
  {
    id: 'secure-coding-portal',
    title: 'Secure Coding Training Portal',
    typeKey: 'enterprise',
    category: 'development',
    stack: ['Golang', 'React', 'AWS'],
    confidential: true,
    image: secureCodingCover,
    links: [
      { labelKey: 'demo', url: 'https://www.youtube.com/watch?v=aeQ6cjakCQo', variant: 'primary' },
      { labelKey: 'code', url: 'https://github.com/diego-all/bold-secure-coding', variant: 'secondary' },
    ],
  },
  {
    id: 'anomaly-detection',
    title: 'Anomaly Detection',
    typeKey: 'enterprise',
    category: 'development',
    stack: ['Golang', 'Python', 'AWS WAF', 'AWS Shield'],
    confidential: true,
    image: meliArchitectureCover,
    links: [
      { labelKey: 'article', url: 'https://aws.amazon.com/es/blogs/architecture/mercado-libre-how-to-block-malicious-traffic-in-a-dynamic-environment/', variant: 'primary' },
    ],
  },
  {
    id: 'restful-rds-golang-products',
    title: 'restful-rds-golang-products',
    typeKey: 'personal',
    category: 'development',
    stack: ['Golang', 'AWS RDS', 'Terraform', 'Amazon Cognito'],
    image: restfulRdsCover,
    links: [
      { labelKey: 'code', url: 'https://github.com/DiegoAll/restful-rds-golang-products', variant: 'secondary' },
    ],
  },
  {
    id: 'rest-api-golang-gen',
    title: 'rest-api-golang-gen',
    typeKey: 'personal',
    category: 'development',
    stack: ['Golang', 'Google Gemini API'],
    image: restApiGolangGenCover,
    links: [
      { labelKey: 'code', url: 'https://github.com/DiegoAll/rest-api-golang-gen', variant: 'secondary' },
    ],
  },

  // ── Ciberseguridad ───────────────────────────────────
  {
    id: 'k8s-runtime-sec',
    title: 'k8s-runtime-sec',
    typeKey: 'personal',
    category: 'security',
    stack: ['Golang', 'EKS', 'Python', 'Google Cloud'],
    image: k8sRuntimeSecCover,
    links: [
      { labelKey: 'code', url: 'https://github.com/DiegoAll/k8s-runtime-sec', variant: 'secondary' },
    ],
  },
  {
    id: 'go-vulnerable-api',
    title: 'go-vulnerable-api',
    typeKey: 'personal',
    category: 'security',
    stack: ['Golang'],
    image: goVulnerableApiCover,
    links: [
      { labelKey: 'code', url: 'https://github.com/diego-all/go-vulnerable-api', variant: 'secondary' },
    ],
  },
  {
    id: 'cve-2023-4911',
    title: 'CVE-2023-4911 (Looney Tunables) Detection',
    typeKey: 'personal',
    category: 'security',
    stack: ['Falco', 'Kubernetes', 'Falco Sidekick-UI'],
    image: cveLooneyTunablesCover,
    links: [
      { labelKey: 'demo', url: 'https://youtu.be/lPJQxTmpm3Y', variant: 'primary' },
    ],
  },
  {
    id: 'vigenere-decipher',
    title: 'vigenereDecipher',
    typeKey: 'personal',
    category: 'security',
    stack: ['Python'],
    image: vigenereCover,
    links: [
      { labelKey: 'code', url: 'https://github.com/DiegoAll/vigenereDecipher', variant: 'secondary' },
    ],
  },
  {
    id: 'cloudtrail-enrichment',
    title: 'cloudtrail-enrichment-api-golang',
    typeKey: 'personal',
    category: 'security',
    stack: ['Golang', 'MongoDB', 'AWS CloudTrail'],
    image: cloudtrailCover,
    links: [
      { labelKey: 'code', url: 'https://github.com/DiegoAll/cloudtrail-enrichment-api-golang', variant: 'secondary' },
    ],
  },
];

const filterKeys = ['all', 'development', 'security'];

function ProjectCard({ project }) {
  const { t } = useTranslation('projects');
  const initial = project.title.charAt(0).toUpperCase();

  return (
    <div className="project-card">
      <div
        className="project-thumb"
        style={!project.image && project.gradient ? { background: project.gradient } : undefined}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="project-thumb-img"
          />
        ) : (
          <span className="project-thumb-initial">{initial}</span>
        )}
        <span className="project-type-badge">{t(`types.${project.typeKey}`)}</span>
      </div>

      <div className="project-info">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        <div className="project-stack">
          {project.stack.map((s) => (
            <span className="stack-chip" key={s}>{s}</span>
          ))}
        </div>
      </div>

      <div className="project-actions">
        {project.confidential && project.note && (
          <p className="project-note">🔒 {project.note}</p>
        )}

        {project.links?.length > 0 && (
          <div className="project-links">
            {project.links.map((link) => {
              const isSoloCode = project.links.length === 1 && link.variant !== 'primary';
              const btnClass = link.variant === 'primary'
                ? 'btn-demo'
                : isSoloCode
                  ? 'btn-code btn-code-solo'
                  : 'btn-code';
              return (
                <a
                  key={link.labelKey}
                  className={btnClass}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(`links.${link.labelKey}`)}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Projects() {
  const { t } = useTranslation('projects');
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = mergeById(projectsBase, t('items', { returnObjects: true }));

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  const countFor = (key) =>
    key === 'all' ? projects.length : projects.filter((p) => p.category === key).length;

  return (
    <section className="projects-page">
      <h1 className="section-title">{t('title')}</h1>

      <div className="filter-tabs">
        {filterKeys.map((key) => (
          <button
            key={key}
            className={`filter-tab ${activeFilter === key ? 'active' : ''}`}
            onClick={() => setActiveFilter(key)}
          >
            <span>{t(`filters.${key}`)}</span>
            <span className="filter-count">{countFor(key)}</span>
          </button>
        ))}
      </div>

      <div className="project-grid">
        {filteredProjects.map((p) => (
          <ProjectCard project={p} key={p.id} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
