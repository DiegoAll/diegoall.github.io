const projects = [
  {
    title: 'Fitness Tracker',
    description: 'Tool to keep track of your fitness',
    tech: 'Angular 8, Ngrx, Material, Firestore',
    image: '/projects/fitness-tracker.png',
    demoUrl: 'https://tu-demo-1.vercel.app',
    codeUrl: 'https://github.com/diegoall/fitness-tracker',
  },
  {
    title: 'Ng Shop List',
    description: 'Manage shopping list',
    tech: 'Angular 8, Ngrx 8, FlexLayout, Firestore',
    image: '/projects/ng-shop-list.png',
    demoUrl: 'https://tu-demo-2.vercel.app',
    codeUrl: 'https://github.com/diegoall/ng-shop-list',
  },
  {
    title: 'Leaflet - US states',
    description: 'Mini-game using some map features',
    tech: 'Angular 8, leafletjs',
    image: '/projects/leaflet-us.png',
    demoUrl: 'https://tu-demo-3.vercel.app',
    codeUrl: 'https://github.com/diegoall/leaflet-us-states',
  },
];

function Projects() {
  return (
    <section className="projects-page">
      <h1 className="section-title">Projects</h1>
      <div className="project-grid">
        {projects.map((p) => (
          <div className="project-card" key={p.title}>
            <div
              className="project-thumb"
              style={{ backgroundImage: `url(${p.image})` }}
            />
            <div className="project-info">
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.description}</p>
              <p className="project-tech">{p.tech}</p>
            </div>
            <div className="project-actions">
              <a
                className="btn-demo"
                href={p.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Demo
              </a>
              <a
                className="btn-code"
                href={p.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Code
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;