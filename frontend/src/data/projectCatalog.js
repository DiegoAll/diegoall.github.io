// Catálogo liviano de proyectos: solo lo que necesitan el panel de admin y el
// hook useVisibleProjects (id, título y categoría). Los datos pesados (imágenes,
// links, textos traducidos) siguen viviendo en pages/Projects.jsx.
//
// IMPORTANTE: si agregas un proyecto nuevo en Projects.jsx (projectsBase),
// agrégalo también acá con el mismo `id` y la misma `category`.

export const MAX_VISIBLE_PER_CATEGORY = 3;

export const CATEGORY_LABELS = {
  development: 'Desarrollo',
  security: 'Ciberseguridad',
  agentic: 'Agentic AI',
};

export const PROJECT_CATALOG = {
  development: [
    { id: 'thepragmatic', title: 'ThePragmatic.xyz' },
    { id: 'secure-coding-portal', title: 'Secure Coding Training Portal' },
    { id: 'anomaly-detection', title: 'Anomaly Detection' },
    { id: 'restful-rds-golang-products', title: 'restful-rds-golang-products' },
    { id: 'rest-api-golang-gen', title: 'rest-api-golang-gen' },
  ],
  security: [
    { id: 'cve-2023-4911', title: 'CVE-2023-4911 (Looney Tunables) Detection' },
    { id: 'k8s-runtime-sec', title: 'k8s-runtime-sec' },
    { id: 'go-vulnerable-api', title: 'go-vulnerable-api' },
    { id: 'vigenere-decipher', title: 'vigenereDecipher' },
    { id: 'cloudtrail-enrichment', title: 'cloudtrail-enrichment-api-golang' },
  ],
  agentic: [
    { id: 'tech-store-assistant', title: 'Tech Store Assistant' },
    { id: 'multiagent-contact-center', title: 'MultiAgent Contact Center' },
  ],
};

// Selección por defecto (la que se usa si el backend no responde o todavía no
// tiene el campo `visible_projects`). El orden de cada lista es el orden en pantalla.
export const DEFAULT_VISIBLE = {
  development: ['thepragmatic', 'secure-coding-portal', 'anomaly-detection'],
  security: ['cve-2023-4911', 'k8s-runtime-sec', 'go-vulnerable-api'],
  agentic: ['tech-store-assistant', 'multiagent-contact-center'],
};

const CATEGORIES = Object.keys(PROJECT_CATALOG);

// Recibe lo que venga del backend (o cualquier cosa) y devuelve SIEMPRE una
// selección válida: { development: [ids], security: [ids], agentic: [ids] }.
//  - Si el valor no es un objeto -> se usa DEFAULT_VISIBLE completo.
//  - Si una categoría no es un array -> se usa el default de esa categoría
//    (así una selección guardada antes de existir `agentic` sigue funcionando).
//  - Se descartan ids desconocidos o de otra categoría, y duplicados.
//  - Se recorta a MAX_VISIBLE_PER_CATEGORY.
export function normalizeVisible(raw) {
  if (!raw || typeof raw !== 'object') {
    return Object.fromEntries(
      CATEGORIES.map((category) => [category, [...DEFAULT_VISIBLE[category]]])
    );
  }

  const result = {};
  for (const category of CATEGORIES) {
    const list = raw[category];
    if (!Array.isArray(list)) {
      result[category] = [...DEFAULT_VISIBLE[category]];
      continue;
    }
    const valid = new Set(PROJECT_CATALOG[category].map((p) => p.id));
    const out = [];
    for (const id of list) {
      if (typeof id === 'string' && valid.has(id) && !out.includes(id)) out.push(id);
    }
    result[category] = out.slice(0, MAX_VISIBLE_PER_CATEGORY);
  }
  return result;
}

// { development: [a, b], security: [c] } -> [a, b, c]
export function flattenVisible(selection) {
  return CATEGORIES.flatMap((category) => selection[category] || []);
}