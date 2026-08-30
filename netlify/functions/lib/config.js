// Configuración central de los dos sitios que maneja este CMS.
// Si en el futuro se suma un tercer sitio, se agrega una entrada más acá
// y el resto del código (templates, github, panel) lo toma automáticamente.

const SITES = {
  mkt: {
    key: 'mkt',
    label: 'The Marketographers',
    domain: 'marketographers.com',
    owner: 'themarketographer',
    repo: 'marketographers',
    branch: 'main',
    blogIndexPath: 'blog/index.html',
    sitemapPath: 'sitemap.xml',
    postPath: (slug) => `blog/${slug}/index.html`,
    pixelId: '467504537642622',
    author: 'Pablo Villarroel',
    logoUrl: 'https://res.cloudinary.com/dplhu2z6j/image/upload/v1755314905/Marketographers_Negro_S_F_tgh9z2.png',
    logoWhiteUrl: 'https://res.cloudinary.com/dplhu2z6j/image/upload/q_auto,f_auto/v1755314903/Marketographers_Blanco_S_F_p1toov.png',
    faviconUrl: 'https://res.cloudinary.com/dplhu2z6j/image/upload/q_auto,f_auto/v1755314903/Marketographers_Blanco_S_F_p1toov.png',
    whatsappHref: 'https://api.whatsapp.com/send?phone=+59169422335&text=%C2%A1Hola%2C%20Pablo!%20Vi%20tu%20blog%20y%20quiero%20m%C3%A1s%20info%20de%20la%20membres%C3%ADa%20de%20marketing%20para%20fot%C3%B3grafos',
    // Marcador exacto dentro de blog/index.html después del cual se inserta la tarjeta nueva.
    cardAnchor: '<div class="blog-grid" id="blog-grid">',
    grid: { imgAttrDefault: ' style="aspect-ratio:16/9;object-fit:cover;"' },
    // Bloques de datos (arrays de JS embebidos en una página) editables desde el panel.
    dataBlocks: {
      testimonios: {
        label: 'Testimonios',
        varName: 'testimonios',
        path: 'index.html',
        fields: [
          { key: 'n', label: 'Nombre' },
          { key: 't', label: 'Rol / ubicación' },
          { key: 'q', label: 'Cita', long: true },
          { key: 'img', label: 'URL de imagen' },
        ],
      },
    },
  },
  eg: {
    key: 'eg',
    label: 'Estudio Graphica',
    domain: 'estudiographica.com',
    owner: 'themarketographer',
    repo: 'estudiographica',
    branch: 'main',
    blogIndexPath: 'blog/index.html',
    sitemapPath: 'sitemap.xml',
    postPath: (slug) => `blog/${slug}/index.html`,
    pixelId: '1059099676340072',
    ga4Id: 'G-9H6Z8N5DTP',
    author: 'Pablo Villarroel',
    logoUrl: 'https://estudiographica.com/assets/logo-black.png',
    publisherLogoUrl: 'https://res.cloudinary.com/dplhu2z6j/image/upload/v1777509513/Logo_B_S_F_kdolev.png',
    // Marcador exacto dentro de blog/index.html después del cual se inserta la tarjeta nueva.
    cardAnchor: '<div class="posts">',
    dataBlocks: {
      faqs: {
        label: 'Preguntas frecuentes',
        varName: 'faqs',
        path: 'index.html',
        fields: [
          { key: 'q', label: 'Pregunta' },
          { key: 'a', label: 'Respuesta', long: true },
        ],
      },
      landingHero: {
        label: 'Home · Hero',
        varName: 'landingHero',
        path: 'index.html',
        singleton: true,
        fields: [
          { key: 'eyebrow', label: 'Texto sobre el título' },
          { key: 'titulo', label: 'Título (puede usar HTML de resaltado)', long: true },
          { key: 'subtitulo', label: 'Subtítulo', long: true },
          { key: 'imagen', label: 'URL de imagen principal' },
          { key: 'statValor1', label: 'Estadística 1 · valor' },
          { key: 'statLabel1', label: 'Estadística 1 · texto (puede usar <br>)' },
          { key: 'statValor2', label: 'Estadística 2 · valor' },
          { key: 'statLabel2', label: 'Estadística 2 · texto (puede usar <br>)' },
          { key: 'statValor3', label: 'Estadística 3 · valor' },
          { key: 'statLabel3', label: 'Estadística 3 · texto (puede usar <br>)' },
        ],
      },
      landingCopy: {
        label: 'Home · Textos sueltos',
        varName: 'landingCopy',
        path: 'index.html',
        singleton: true,
        fields: [
          { key: 'sobreBio1', label: 'Sobre · párrafo 1', long: true },
          { key: 'sobreBio2', label: 'Sobre · párrafo 2', long: true },
          { key: 'sobreBadgeNumero', label: 'Sobre · insignia (número/sigla)' },
          { key: 'sobreBadgeTexto', label: 'Sobre · insignia (texto)' },
          { key: 'sobreCredenciales', label: 'Sobre · credenciales (una por línea)', long: true },
          { key: 'cmpLabelAntes', label: 'Comparador · etiqueta "antes"' },
          { key: 'cmpLabelDespues', label: 'Comparador · etiqueta "después"' },
          { key: 'cmpHint', label: 'Comparador · texto de ayuda' },
          { key: 'ctaTitulo', label: 'CTA final · título (puede usar HTML de resaltado)', long: true },
          { key: 'ctaTexto', label: 'CTA final · texto', long: true },
          { key: 'ctaMicro', label: 'CTA final · texto pequeño' },
          { key: 'footerCopyright', label: 'Footer · línea de copyright', long: true },
        ],
      },
      marcas: {
        label: 'Marcas (carrusel)',
        varName: 'marcas',
        path: 'index.html',
        fields: [
          { key: 'nombre', label: 'Nombre de la marca' },
          { key: 'logo', label: 'URL del logo' },
        ],
      },
      proceso: {
        label: 'Proceso (3 pasos)',
        varName: 'proceso',
        path: 'index.html',
        fields: [
          { key: 'numero', label: 'Número' },
          { key: 'titulo', label: 'Título' },
          { key: 'texto', label: 'Texto', long: true },
        ],
      },
      promesa: {
        label: 'Promesa (grid)',
        varName: 'promesa',
        path: 'index.html',
        fields: [
          { key: 'icono', label: 'Ícono (emoji)' },
          { key: 'titulo', label: 'Título' },
          { key: 'detalle', label: 'Detalle', long: true },
        ],
      },
      portafolio: {
        label: 'Portafolio (grid + lightbox)',
        varName: 'portafolio',
        path: 'index.html',
        fields: [
          { key: 'imagen', label: 'URL de imagen' },
          { key: 'alt', label: 'Nombre / texto alternativo' },
        ],
      },
    },
  },
};

function getSite(key) {
  const site = SITES[key];
  if (!site) throw new Error(`Sitio desconocido: ${key}`);
  return site;
}

module.exports = { SITES, getSite };
