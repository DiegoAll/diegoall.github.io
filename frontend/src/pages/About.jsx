import { useState } from 'react';

const skills = [
  'Golang', 'Python', 'Gin Framework', 'Docker', 'Kubernetes',
  'AWS', 'GCP', 'MongoDB', 'PostgreSQL', 'MySQL', 'React',
  'Microservices', 'Terraform', 'Cybersecurity',
];

const experience = [
  {
    role: 'Cyber Security Specialist',
    company: 'Bold CF',
    period: 'Oct 2025 - Jul 2026',
    details: [
      'Golang Backend Developer & Python Scripting (CDK - CloudFormation)',
      'Application Security - Secure Coding',
      'Infrastructure as Code (IAC) en AWS',
    ],
  },
  {
    role: 'Cyber Engineer',
    company: 'Mercado Libre',
    period: 'Nov 2021 - May 2025',
    details: [
      'Golang Backend Developer & Python Scripting',
      'Application Security & S-SDLC (OWASP, AWS WAF, AWS Shield)',
      'Runtime & Kubernetes Security (EKS, GKE, EC2, GCE, Docker, Rancher)',
      'Observability Security (Amazon Athena, BigQuery, Elastic Search, GuardDuty, CrowdStrike, Datadog)',
    ],
  },
  {
    role: 'Senior Security Platform Administrator',
    company: 'Neosecure',
    period: 'Jun 2021 - Nov 2021',
    details: [
      'Linux System Administration (Fedora, Debian)',
      'Intrusion Detection System (Snort, Darktrace)',
      'Vulnerability Assessment and Remediation (Nessus)',
    ],
  },
  {
    role: 'Cyber Engineer',
    company: 'Sofka Technologies',
    period: 'Nov 2020 - Jun 2021',
    details: [
      'Application Security Testing (SAST, DAST, SCA, Pentest)',
      'DevSecOps (AWS CodeBuild & CodePipeline, ZAP, Jenkins, Git, GitLab, Docker, Kubernetes)',
      'Secure Coding Coach & S-SDLC',
    ],
  },
  {
    role: 'Security Operations Engineer',
    company: 'Aligo Defensores Informáticos',
    period: 'Abr 2018 - Dic 2019',
    details: [
      'Linux System Administration (Fedora, Debian, Python & Bash scripting)',
      'Network Access Control (Packetfence, MySQL)',
      'Intrusion Detection System (Snort), Malware Analysis (Cuckoo Sandbox)',
    ],
  },
  {
    role: 'Backend Developer',
    company: 'Sophos Banking Solutions',
    period: 'Jun 2016 - Oct 2017',
    details: [
      'Backend Developer (Finacle scripting, RPG, PL/SQL Oracle)',
      'Developer (VB for Applications, Microsoft Access)',
    ],
  },
];

const education = [
  { title: "Master's Degree in Engineering", place: 'Universidad EAFIT, Medellín', period: 'En curso' },
  { title: 'Postgraduate Specialization in Software Development', place: 'Universidad EAFIT, Medellín', period: '2024' },
  { title: 'Postgraduate Specialization in Cybersecurity', place: 'Universidad Pontificia Bolivariana, Medellín', period: '2021' },
  { title: 'Systems Engineer', place: 'Universidad de Medellín', period: '2018' },
];

const courses = [
  { title: 'AWS Security Essentials', place: 'AWS Training', period: 'Jul 2024' },
  { title: 'Certified Backend Secure Developer 2023 (Golang)', place: 'Secure Code Warrior', period: 'Jun 2024' },
  { title: 'Backend con Go', place: 'Platzi', period: 'Jun 2022 - Dic 2022' },
  { title: 'Security in Google Cloud', place: 'Arki1', period: 'Ago 2022' },
  { title: 'Networking in Google Cloud', place: 'Arki1', period: 'Jul 2022 - Ago 2022' },
  { title: 'Auditor interno ISO/IEC 27001:2013 - SGSI', place: 'SGS Academy Perú', period: 'Nov 2020' },
  { title: 'CDSS Certified Defensive Security Specialist', place: 'DSTEAM', period: 'Oct 2019 - Ene 2020' },
  { title: 'English Certification - APTIS B2', place: 'British Council', period: 'Nov 2018' },
  { title: 'CODSE Certified Offensive and Defensive Security Expert', place: 'DSTEAM', period: 'Oct 2017 - Dic 2017' },
  { title: 'CODSP Certified Offensive and Defensive Security Professional', place: 'DSTEAM', period: 'May 2017 - Jun 2017' },
];

const languages = [
  { name: 'Español', level: 'Nativo' },
  { name: 'Inglés', level: 'B2' },
];

function IconLocation() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function About() {
  const [showAllExperience, setShowAllExperience] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);

  const visibleExperience = showAllExperience ? experience : experience.slice(0, 3);
  const visibleCourses = showAllCourses ? courses : courses.slice(0, 3);

  return (
    <div className="about-page">
      <div className="about-header">
        <img src="/profile.png" alt="Diego Alejandro" className="about-avatar" />
        <h1 className="about-name">Diego Alejandro Posada Llano</h1>
        <p className="about-role">Cyber Engineer & Backend Developer</p>

        <div className="about-info-card">
          <div className="about-info-item">
            <IconLocation />
            <span>Envigado, Colombia</span>
          </div>
          <div className="about-info-item">
            <IconMail />
            <span>dposadallano@gmail.com</span>
          </div>
          <div className="about-info-item">
            <IconLink />
            <span>linkedin.com/in/diego-alejandro-posada-llano</span>
          </div>
          <div className="about-info-item">
            <IconGithub />
            <span>github.com/diegoall</span>
          </div>
        </div>
      </div>

      <section className="about-section">
        <h2 className="about-section-title">Sobre mí</h2>
        <p className="about-text">
          Systems Engineer con experiencia en desarrollo de software y ciberseguridad
          para los sectores bancario y e-commerce. Disfruto participar en todas las
          etapas del ciclo de vida del software: diseño, implementación, evaluación y
          mantenimiento de sistemas. Conocimiento sólido en desarrollo backend con Go,
          Python, sistemas Unix, seguridad ofensiva y defensiva, y controles de
          seguridad perimetral (on-premise y cloud).
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Stack</h2>
        <div className="about-skills">
          {skills.map((skill) => (
            <span className="skill-chip" key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Experiencia</h2>
        <div className="timeline">
          {visibleExperience.map((job) => (
            <div className="timeline-item" key={job.role + job.company}>
              <div className="timeline-header">
                <h3 className="timeline-role">{job.role} · {job.company}</h3>
                <span className="timeline-period">{job.period}</span>
              </div>
              <ul className="timeline-details">
                {job.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {experience.length > 3 && (
          <button
            className="show-more-btn"
            onClick={() => setShowAllExperience(!showAllExperience)}
          >
            {showAllExperience ? 'Ver menos ▲' : `Ver toda la experiencia (${experience.length}) ▼`}
          </button>
        )}
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Educación</h2>
        <div className="timeline">
          {education.map((edu) => (
            <div className="timeline-item" key={edu.title}>
              <div className="timeline-header">
                <h3 className="timeline-role">{edu.title}</h3>
                <span className="timeline-period">{edu.period}</span>
              </div>
              <p className="timeline-place">{edu.place}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Cursos y certificaciones</h2>
        <div className="timeline">
          {visibleCourses.map((course) => (
            <div className="timeline-item" key={course.title}>
              <div className="timeline-header">
                <h3 className="timeline-role">{course.title}</h3>
                <span className="timeline-period">{course.period}</span>
              </div>
              <p className="timeline-place">{course.place}</p>
            </div>
          ))}
        </div>

        {courses.length > 3 && (
          <button
            className="show-more-btn"
            onClick={() => setShowAllCourses(!showAllCourses)}
          >
            {showAllCourses ? 'Ver menos ▲' : `Ver todos los cursos (${courses.length}) ▼`}
          </button>
        )}
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Idiomas</h2>
        <div className="languages-list">
          {languages.map((lang) => (
            <div className="language-item" key={lang.name}>
              <span className="language-name">{lang.name}</span>
              <span className="language-level">{lang.level}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
