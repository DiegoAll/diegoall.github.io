// Combina datos "fijos" (links, imágenes, stack...) con los textos traducidos
// usando el campo `id`. Si falta la traducción, devuelve el item base intacto.
export function mergeById(base, texts) {
  const list = Array.isArray(texts) ? texts : [];
  return base.map((item) => ({
    ...item,
    ...list.find((x) => x.id === item.id),
  }));
}

// Locale para toLocaleDateString según el idioma activo.
export function dateLocale(language) {
  return language === 'en' ? 'en-US' : 'es-CO';
}
