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
  },
};

function getSite(key) {
  const site = SITES[key];
  if (!site) throw new Error(`Sitio desconocido: ${key}`);
  return site;
}

module.exports = { SITES, getSite };
