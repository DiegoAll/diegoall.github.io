import { useState } from 'react';
import thePragmaticCover from '../assets/thepragmatic_cybersecurity_notes_cover.jpeg';
import meliArchitectureCover from '../assets/MELI-Architecture-Anomaly-detection.png';
import vigenereCover from '../assets/vigenere.jpeg';

const projects = [
  // ── Desarrollo de Software ──────────────────────────
  {
    title: 'ThePragmatic.xyz',
    type: 'Comunidad',
    category: 'development',
    description: 'Proyecto y comunidad de ciberseguridad donde se promueven conocimientos de seguridad informática alineados con las tendencias tecnológicas actuales y la industria.',
    stack: ['Golang', 'React', 'Digital Ocean'],
    // Portada provisional del proyecto (thepragmatic_cybersecurity_notes_cover.jpeg)
    image: thePragmaticCover,
    gradient: 'linear-gradient(135deg, #7f1d1d, #1a1a1a)',
    links: [
      { label: 'Sitio', url: 'https://thepragmatic.xyz/', variant: 'primary' },
      { label: 'Code', url: 'https://github.com/ThePragmaticCybersecurityNotes/web', variant: 'secondary' },
    ],
  },
  {
    title: 'Secure Coding Training Portal',
    type: 'Empresarial · Privado',
    category: 'development',
    description: 'Portal desarrollado para entrenar a los equipos de desarrollo de Bold en buenas prácticas de seguridad y diseño seguro de software.',
    stack: ['Golang', 'React', 'AWS'],
    confidential: true,
    note: 'Proyecto propiedad de Bold. Algunos detalles de implementación permanecen confidenciales.',
    links: [
      { label: 'Demo', url: 'https://www.youtube.com/watch?v=aeQ6cjakCQo', variant: 'primary' },
      { label: 'Code', url: 'https://github.com/diego-all/bold-secure-coding', variant: 'secondary' },
    ],
  },
  {
    title: 'Anomaly Detection',
    type: 'Empresarial · Privado',
    category: 'development',
    description: 'Sistema de detección de anomalías de seguridad desarrollado y mantenido en Mercado Libre, orientado a observabilidad y respuesta temprana ante comportamientos inusuales en la infraestructura.',
    stack: ['Golang', 'Python', 'AWS WAF', 'AWS Shield'],
    confidential: true,
    // Diagrama de arquitectura del proyecto (MELI-Architecture-Anomaly-detection.png)
    image: meliArchitectureCover,
    note: 'Proyecto propiedad de Mercado Libre. Código fuente confidencial, no disponible públicamente.',
    links: [
      { label: 'Artículo', url: 'https://aws.amazon.com/es/blogs/architecture/mercado-libre-how-to-block-malicious-traffic-in-a-dynamic-environment/', variant: 'primary' },
    ],
  },
  {
    title: 'restful-rds-golang-products',
    type: 'Personal',
    category: 'development',
    description: 'Microservicio RESTful para la gestión de datos de un torneo de fútbol. Utiliza recursos de AWS, provisionados y desplegados mediante Terraform.',
    stack: ['Golang', 'AWS RDS', 'Terraform', 'Amazon Cognito'],
    links: [
      { label: 'Code', url: 'https://github.com/DiegoAll/restful-rds-golang-products', variant: 'secondary' },
    ],
  },
  {
    title: 'rest-api-golang-gen',
    type: 'Personal',
    category: 'development',
    description: 'Genera el scaffold de una REST API en Golang segura a partir de la especificación de un modelo de dominio. Integrado con Google Gemini.',
    stack: ['Golang', 'Google Gemini API'],
    links: [
      { label: 'Code', url: 'https://github.com/DiegoAll/rest-api-golang-gen', variant: 'secondary' },
      // Cuando despliegues Swagger, agrega aquí:
      // { label: 'Demo', url: 'https://tu-api.up.railway.app/swagger/index.html', variant: 'primary' },
    ],
  },

  // ── Ciberseguridad ───────────────────────────────────
  {
    title: 'k8s-runtime-sec',
    type: 'Personal',
    category: 'security',
    description: 'CLI para simular comportamientos maliciosos en clústeres de Kubernetes. Incluye dos escenarios de incidentes de seguridad relacionados con escalación de privilegios y ejecución de malware.',
    stack: ['Golang', 'EKS', 'Python', 'Google Cloud'],
    links: [
      { label: 'Code', url: 'https://github.com/DiegoAll/k8s-runtime-sec', variant: 'secondary' },
    ],
  },
  {
    title: 'go-vulnerable-api',
    type: 'Personal',
    category: 'security',
    description: 'REST API deliberadamente vulnerable construida en Go, que demuestra vulnerabilidades comunes de seguridad incluyendo SQL Injection (SQLi) e Insecure Direct Object Reference (IDOR).',
    stack: ['Golang'],
    links: [
      { label: 'Code', url: 'https://github.com/diego-all/go-vulnerable-api', variant: 'secondary' },
    ],
  },
  {
    title: 'CVE-2023-4911 (Looney Tunables) Detection',
    type: 'Personal',
    category: 'security',
    description: 'Demo de detección en tiempo real de la vulnerabilidad CVE-2023-4911 (Looney Tunables) utilizando reglas de Falco runtime security.',
    stack: ['Falco', 'Kubernetes', 'Falco Sidekick-UI'],
    links: [
      { label: 'Demo', url: 'https://youtu.be/lPJQxTmpm3Y', variant: 'primary' },
    ],
  },
  {
    title: 'vigenereDecipher',
    type: 'Personal',
    category: 'security',
    description: 'Implementa un criptoanálisis clásico del cifrado Vigenère utilizando la prueba de Kasiski y el análisis de frecuencias.',
    stack: ['Python'],
    // Portada provisional del proyecto (vigenere.jpeg)
    image: vigenereCover,
    links: [
      { label: 'Code', url: 'https://github.com/DiegoAll/vigenereDecipher', variant: 'secondary' },
    ],
  },
  {
    title: 'cloudtrail-enrichment-api-golang',
    type: 'Personal',
    category: 'security',
    description: 'API REST de monitoreo de seguridad que enriquece con geolocalización de IP los logs de AWS CloudTrail.',
    stack: ['Golang', 'MongoDB', 'AWS CloudTrail'],
    links: [
      { label: 'Code', url: 'https://github.com/DiegoAll/cloudtrail-enrichment-api-golang', variant: 'secondary' },
      // Cuando despliegues Swagger, agrega aquí:
      // { label: 'Demo', url: 'https://tu-api.up.railway.app/swagger/index.html', variant: 'primary' },
    ],
  },
];

const filters = [
  { key: 'all', label: 'Todos' },
  { key: 'development', label: 'Desarrollo' },
  { key: 'security', label: 'Ciberseguridad' },
];

function ProjectCard({ project }) {
  const initial = project.title.charAt(0).toUpperCase();

  return (
    <div className="project-card">
      <div
        className="project-thumb"
        style={!project.image && project.gradient ? { background: project.gradient } : undefined}
      >
        {project.image ? (
          // Si el proyecto tiene imagen (screenshot/logo), se usa en vez de la inicial
          <img
            src={project.image}
            alt={project.title}
            className="project-thumb-img"
          />
        ) : (
          <span className="project-thumb-initial">{initial}</span>
        )}
        <span className="project-type-badge">{project.type}</span>
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
        {project.confidential && (
          <p className="project-note">🔒 {project.note}</p>
        )}

        {project.links?.length > 0 && (
          <div className="project-links">
            {project.links.map((link) => {
              // Cuando "Code" es el único link de la card, se resalta con acento
              // en vez del estilo secundario plano, que se pierde sobre fondo blanco
              const isSoloCode = project.links.length === 1 && link.variant !== 'primary';
              const btnClass = link.variant === 'primary'
                ? 'btn-demo'
                : isSoloCode
                  ? 'btn-code btn-code-solo'
                  : 'btn-code';

              return (
                <a
                  key={link.label}
                  className={btnClass}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
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
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  const countFor = (key) =>
    key === 'all' ? projects.length : projects.filter((p) => p.category === key).length;

  return (
    <section className="projects-page">
      <h1 className="section-title">Projects</h1>

      <div className="filter-tabs">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter-tab ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            <span>{f.label}</span>
            <span className="filter-count">{countFor(f.key)}</span>
          </button>
        ))}
      </div>

      <div className="project-grid">
        {filteredProjects.map((p) => (
          <ProjectCard project={p} key={p.title} />
        ))}
      </div>
    </section>
  );
}

export default Projects;