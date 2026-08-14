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

function About() {
  const [showAllExperience, setShowAllExperience] = useState(false);
  const visibleExperience = showAllExperience ? experience : experience.slice(0, 3);

  return (
    <div className="about-page">
      <div className="about-profile">
        <img src="/profile.png" alt="Diego Alejandro" className="about-avatar" />
        <div>
          <h1 className="about-name">Diego Alejandro Posada Llano</h1>
          <p className="about-role">Cyber Engineer & Backend Developer</p>
        </div>
      </div>

      <div className="about-contact">
        <p>📍 Envigado, Colombia</p>
        <p>✉️ dposadallano@gmail.com</p>
        <p>🔗 linkedin.com/in/diego-alejandro-posada-llano</p>
        <p>🐙 github.com/diegoall</p>
      </div>

      <section className="about-section">
        <h2 className="about-section-title">About</h2>
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
        <h2 className="about-section-title">Experience</h2>
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
        <h2 className="about-section-title">Education</h2>
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
    </div>
  );
}

export default About;