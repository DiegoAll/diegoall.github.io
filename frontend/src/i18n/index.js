import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import esCommon from '../locales/es/common.json';
import esHome from '../locales/es/home.json';
import esAbout from '../locales/es/about.json';
import esProjects from '../locales/es/projects.json';
import esHighlights from '../locales/es/highlights.json';
import esBlog from '../locales/es/blog.json';

import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import enAbout from '../locales/en/about.json';
import enProjects from '../locales/en/projects.json';
import enHighlights from '../locales/en/highlights.json';
import enBlog from '../locales/en/blog.json';

i18n
  .use(LanguageDetector) // localStorage -> idioma del navegador
  .use(initReactI18next)
  .init({
    resources: {
      es: { common: esCommon, home: esHome, about: esAbout, projects: esProjects, highlights: esHighlights, blog: esBlog },
      en: { common: enCommon, home: enHome, about: enAbout, projects: enProjects, highlights: enHighlights, blog: enBlog },
    },
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    load: 'languageOnly', // 'en-US' -> 'en'
    defaultNS: 'common',
    interpolation: { escapeValue: false }, // React ya escapa
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Accesibilidad y SEO: mantener <html lang="..."> sincronizado.
function syncHtmlLang(lng) {
  document.documentElement.lang = i18n.resolvedLanguage || lng;
}
i18n.on('languageChanged', syncHtmlLang);
syncHtmlLang(i18n.language);

export default i18n;
