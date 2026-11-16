import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mergeById } from '../i18n/utils';
import DetailModal from '../components/DetailModal';
import { useModalParam } from '../hooks/useModalParam';

const skills = [
  'Golang', 'Python', 'Docker', 'Kubernetes',
  'AWS', 'GCP', 'MongoDB', 'PostgreSQL', 'MySQL', 'React',
  'Microservices', 'Terraform', 'WebSockets', 'gRPC', 'Redis', 'Flask', 'FastAPI',
  'Cybersecurity', 'Jenkins', 'Application Security', 'Secure Coding', 'Event Driven',
  'LLM Integration', 'Langchain', 'VibeCoding', 'Claude', 'Antigravity'
];

// Datos que NO cambian con el idioma. Los textos (rol, periodo, detalles)
// viven en locales/<idioma>/about.json y se unen por `id`.
//
// Detalle en modal (opcional, por empresa):
//   - `tech` (aquí): etiquetas de tecnologías.
//   - `location` (aquí, opcional): ciudad que aparece junto al periodo.
//   - `bullets` (about.json, en cada idioma): lista de responsabilidades y logros.
// El botón "Ver detalle" solo aparece en las empresas que tienen `bullets`.
const experienceBase = [
  {
    id: 'bold',
    company: 'Bold CF',
    location: 'Bogotá',
    tech: [
      'Golang', 'Python', 'AWS Lambda', 'DynamoDB', 'API Gateway', 'ECS', 'ECR',
      'AWS CDK', 'CloudFormation', 'Terraform', 'Azure Pipelines', 'CDK-Nag', 'Trivy',
    ],
  },
  {
    id: 'meli',
    company: 'Mercado Libre',
    location: 'Medellín',
    tech: [
      'Golang', 'Python', 'Kubernetes', 'Terraform', 'Falco', 'EKS', 'GKE', 'EC2', 'GCE',
      'Rancher', 'Argo CD', 'Prometheus', 'Grafana', 'Datadog', 'ELK', 'Jenkins',
    ],
  },
  { id: 'neosecure', company: 'Neosecure', tech: [] },
  { id: 'sofka', company: 'Sofka Technologies', tech: [] },
  { id: 'aligo', company: 'Aligo Defensores Informáticos', tech: [] },
  { id: 'sophos', company: 'Sophos Banking Solutions', tech: [] },
];

const educationBase = [
  { id: 'msc', title: "Master's Degree in Engineering", place: 'Universidad EAFIT, Medellín' },
  { id: 'spec-software', title: 'Postgraduate Specialization in Software Development', place: 'Universidad EAFIT, Medellín' },
  { id: 'spec-cyber', title: 'Postgraduate Specialization in Cybersecurity', place: 'Universidad Pontificia Bolivariana, Medellín' },
  { id: 'systems', title: 'Systems Engineer', place: 'Universidad de Medellín' },
];

const coursesBase = [
  {
    id: 'go-udemy',
    title: 'Mastering Go Programming',
    place: 'Udemy',
    credentialUrl: 'https://udemy-certificate.s3.amazonaws.com/pdf/UC-72aa1fa2-4cd5-4cfd-a8c3-14ec917f1c3a.pdf',
  },
  { id: 'aws-security', title: 'AWS Security Essentials', place: 'AWS Training' },
  { id: 'scw-backend', title: 'Certified Backend Secure Developer 2023 (Golang)', place: 'Secure Code Warrior' },
  {
    id: 'vue-go',
    title: 'Working with Vue 3 and Go (Golang)',
    place: 'Udemy',
    credentialUrl: 'https://www.udemy.com/certificate/UC-28376f00-8aa1-4560-a962-824db4effde9/',
  },
  {
    id: 'platzi-go',
    title: 'Backend con Go',
    place: 'Platzi',
    credentialUrl: 'https://platzi.com/p/DiegoAll/ruta/7171-web-go/diploma/detalle/',
  },
  { id: 'gcp-security', title: 'Security in Google Cloud', place: 'Arki1' },
  { id: 'gcp-networking', title: 'Networking in Google Cloud', place: 'Arki1' },
  { id: 'iso27001', title: 'Auditor interno ISO/IEC 27001:2013 - SGSI', place: 'SGS Academy Perú' },
  { id: 'cdss', title: 'CDSS Certified Defensive Security Specialist', place: 'DSTEAM' },
  { id: 'aptis', title: 'English Certification - APTIS B2', place: 'British Council' },
  { id: 'codse', title: 'CODSE Certified Offensive and Defensive Security Expert', place: 'DSTEAM' },
  { id: 'codsp', title: 'CODSP Certified Offensive and Defensive Security Professional', place: 'DSTEAM' },
];

const languagesBase = [{ id: 'spanish' }, { id: 'english' }];

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
  const { t } = useTranslation('about');
  const { t: td } = useTranslation('detail');
  const { activeId: activeJobId, open: openJob, close: closeJob } = useModalParam('job');
  const [showAllExperience, setShowAllExperience] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);

  const experience = mergeById(experienceBase, t('experience', { returnObjects: true }));
  const education = mergeById(educationBase, t('education', { returnObjects: true }));
  const courses = mergeById(coursesBase, t('courses', { returnObjects: true }));
  const languages = mergeById(languagesBase, t('languages', { returnObjects: true }));

  const activeJob = experience.find((j) => j.id === activeJobId);
  const visibleExperience = showAllExperience ? experience : experience.slice(0, 3);
  const visibleCourses = showAllCourses ? courses : courses.slice(0, 3);

  return (
    <div className="about-page">
      <div className="about-header">
        <img src="/profile.png" alt="Diego Alejandro" className="about-avatar" />
        <h1 className="about-name">Diego Alejandro Posada Llano</h1>
        <p className="about-role">{t('role')}</p>

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
        <h2 className="about-section-title">{t('sections.about')}</h2>
        <p className="about-text">{t('summary')}</p>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">{t('sections.stack')}</h2>
        <div className="about-skills">
          {skills.map((skill) => (
            <span className="skill-chip" key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">{t('sections.experience')}</h2>
        <div className="timeline">
          {visibleExperience.map((job) => (
            <div className="timeline-item" key={job.id}>
              <div className="timeline-header">
                <h3 className="timeline-role">{job.role} · {job.company}</h3>
                <span className="timeline-period">{job.period}</span>
              </div>
              <ul className="timeline-details">
                {(job.details || []).map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              {job.bullets?.length > 0 && (
                <button
                  type="button"
                  className="detail-trigger"
                  onClick={() => openJob(job.id)}
                >
                  {td('readMore')} →
                </button>
              )}
            </div>
          ))}
        </div>

        {experience.length > 3 && (
          <button
            className="show-more-btn"
            onClick={() => setShowAllExperience(!showAllExperience)}
          >
            {showAllExperience
              ? t('showLess')
              : t('showAllExperience', { total: experience.length })}
          </button>
        )}
      </section>

      <section className="about-section">
        <h2 className="about-section-title">{t('sections.education')}</h2>
        <div className="timeline">
          {education.map((edu) => (
            <div className="timeline-item" key={edu.id}>
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
        <h2 className="about-section-title">{t('sections.courses')}</h2>
        <div className="timeline">
          {visibleCourses.map((course) => (
            <div className="timeline-item" key={course.id}>
              <div className="timeline-header">
                <h3 className="timeline-role">{course.title}</h3>
                <span className="timeline-period">{course.period}</span>
              </div>
              <p className="timeline-place">{course.place}</p>
              {course.credentialUrl && (
                <a
                  className="credential-link"
                  href={course.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('viewCredential')}
                </a>
              )}
            </div>
          ))}
        </div>

        {courses.length > 3 && (
          <button
            className="show-more-btn"
            onClick={() => setShowAllCourses(!showAllCourses)}
          >
            {showAllCourses
              ? t('showLess')
              : t('showAllCourses', { total: courses.length })}
          </button>
        )}
      </section>

      <section className="about-section">
        <h2 className="about-section-title">{t('sections.languages')}</h2>
        <div className="languages-list">
          {languages.map((lang) => (
            <div className="language-item" key={lang.id}>
              <span className="language-name">{lang.name}</span>
              <span className="language-level">{lang.level}</span>
            </div>
          ))}
        </div>
      </section>

      <DetailModal
        open={Boolean(activeJob?.bullets?.length)}
        onClose={closeJob}
        title={activeJob?.company}
        subtitle={activeJob?.role}
        meta={[activeJob?.location, activeJob?.period].filter(Boolean).join(' · ')}
        tags={activeJob?.tech}
        sectionTitle={td('responsibilities')}
        items={activeJob?.bullets}
      />
    </div>
  );
}

export default About;
