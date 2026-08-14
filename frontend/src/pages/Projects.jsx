const projects = [
  {
    title: 'ThePragmatic.xyz',
    type: 'Comunidad',
    description: 'Proyecto y comunidad de ciberseguridad donde se promueven conocimientos de seguridad informática alineados con las tendencias tecnológicas actuales y la industria.',
    stack: ['Golang', 'React', 'Digital Ocean'],
    links: [
      { label: 'Sitio', url: 'https://thepragmatic.xyz/', variant: 'primary' },
      { label: 'Blog', url: 'https://blog.thepragmatic.xyz/', variant: 'secondary' },
    ],
  },
  {
    title: 'rest-api-golang-gen',
    type: 'Personal',
    description: 'Genera el scaffold de una REST API en Golang a partir de la especificación de un modelo de dominio. Próximamente incorporará funcionalidades para crear APIs REST seguras. Integrado con Google Gemini.',
    stack: ['Golang', 'Google Gemini API'],
    links: [
      { label: 'Code', url: 'https://github.com/DiegoAll/rest-api-golang-gen', variant: 'secondary' },
    ],
  },
  {
    title: 'cloudtrail-enrichment-api-golang',
    type: 'Personal',
    description: 'API REST de monitoreo de seguridad que enriquece con geolocalización de IP los logs de AWS CloudTrail. Arquitectura pensada para aprovechar MongoDB en el almacenamiento y procesamiento de estos logs.',
    stack: ['Golang', 'MongoDB', 'AWS CloudTrail'],
    links: [
      { label: 'Code', url: 'https://github.com/DiegoAll/cloudtrail-enrichment-api-golang', variant: 'secondary' },
    ],
  },
  {
    title: 'restful-rds-golang-products',
    type: 'Personal',
    description: 'Microservicio RESTful para la gestión de datos de un torneo de fútbol. Utiliza recursos de AWS, provisionados y desplegados mediante Terraform.',
    stack: ['Golang', 'AWS RDS', 'Terraform'],
    links: [
      { label: 'Code', url: 'https://github.com/DiegoAll/restful-rds-golang-products', variant: 'secondary' },
    ],
  },
  {
    title: 'Secure Coding Training Portal',
    type: 'Empresarial · Privado',
    description: 'Portal desarrollado para entrenar a los equipos de desarrollo de Bold en buenas prácticas de seguridad y diseño seguro de software.',
    stack: ['Golang', 'React', 'AWS'],
    confidential: true,
    note: 'Proyecto propiedad de Bold. Código fuente y detalles de implementación confidenciales.',
    links: [
      { label: 'Demo', url: 'https://www.youtube.com/watch?v=aeQ6cjakCQo', variant: 'primary' },
    ],
  },
  {
    title: 'Anomaly Detection',
    type: 'Empresarial · Privado',
    description: 'Sistema de detección de anomalías de seguridad desarrollado durante mi tiempo en Mercado Libre, orientado a observabilidad y respuesta temprana ante comportamientos inusuales en la infraestructura.',
    stack: ['Golang', 'Observability', 'AWS'],
    confidential: true,
    note: 'Proyecto propiedad de Mercado Libre. Código fuente confidencial, no disponible públicamente.',
    links: [],
  },
];

function ProjectCard({ project }) {
  const initial = project.title.charAt(0).toUpperCase();

  return (
    <div className="project-card">
      <div className="project-thumb">
        <span className="project-thumb-initial">{initial}</span>
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
            {project.links.map((link) => (
              <a
                key={link.label}
                className={link.variant === 'primary' ? 'btn-demo' : 'btn-code'}
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
    </div>
  );
}

function Projects() {
  return (
    <section className="projects-page">
      <h1 className="section-title">Projects</h1>
      <div className="project-grid">
        {projects.map((p) => (
          <ProjectCard project={p} key={p.title} />
        ))}
      </div>
    </section>
  );
}

export default Projects;