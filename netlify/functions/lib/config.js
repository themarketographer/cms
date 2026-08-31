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
        label: 'Encabezado',
        varName: 'landingHero',
        path: 'index.html',
        singleton: true,
        // Clases de resaltado ya definidas en el CSS real de estudiographica.com
        // (no inventadas por el panel) — el mini editor de texto enriquecido
        // solo puede producir estas, así nunca se rompe el diseño a mano.
        richStyles: [
          { label: '✦ Cursiva dorada', className: 'eg-cursive' },
          { label: '★ Resaltado dorado', className: 'eg-accent' },
        ],
        fields: [
          { key: 'eyebrow', label: 'Texto sobre el título' },
          // previewTemplate usa el mismo tag + id que el <h1> real de
          // index.html (ver eg-hero-h1) — junto con el CSS real de la
          // página (que manda get-datablock, ver pageCss) el panel puede
          // mostrar exactamente cómo se va a ver (pedido #3).
          { key: 'titulo', label: 'Título', rich: true, previewTemplate: '<h1 class="eg-hero__h1" id="eg-hero-h1">__VALUE__</h1>' },
          { key: 'subtitulo', label: 'Subtítulo', long: true },
          { key: 'imagen', label: 'URL de imagen principal' },
          { key: 'statValor1', label: 'Estadística 1 · valor' },
          { key: 'statLabel1', label: 'Estadística 1 · texto (puede usar un salto de línea)' },
          { key: 'statValor2', label: 'Estadística 2 · valor' },
          { key: 'statLabel2', label: 'Estadística 2 · texto (puede usar un salto de línea)' },
          { key: 'statValor3', label: 'Estadística 3 · valor' },
          { key: 'statLabel3', label: 'Estadística 3 · texto (puede usar un salto de línea)' },
        ],
      },
      landingCopy: {
        label: 'Textos de la página',
        varName: 'landingCopy',
        path: 'index.html',
        singleton: true,
        richStyles: [
          { label: '✦ Cursiva dorada', className: 'eg-cursive' },
          { label: '★ Resaltado dorado', className: 'eg-accent' },
        ],
        fields: [
          { key: 'sobreBio1', label: 'Sobre · párrafo 1', long: true },
          { key: 'sobreBio2', label: 'Sobre · párrafo 2', rich: true, previewTemplate: '<p class="eg-sobre__bio" id="eg-sobre-bio-2">__VALUE__</p>' },
          { key: 'sobreBadgeNumero', label: 'Sobre · insignia (número/sigla)' },
          { key: 'sobreBadgeTexto', label: 'Sobre · insignia (texto)' },
          { key: 'sobreCredenciales', label: 'Sobre · credenciales (una por línea)', long: true },
          { key: 'cmpLabelAntes', label: 'Comparador · etiqueta "antes"' },
          { key: 'cmpLabelDespues', label: 'Comparador · etiqueta "después"' },
          { key: 'cmpHint', label: 'Comparador · texto de ayuda' },
          // El fondo real de esta sección (#cta) es oscuro — se envuelve
          // igual que en el sitio real para que el preview también se vea
          // sobre fondo oscuro (si no, el texto se vería invisible: es
          // blanco/dorado por CSS, pensado para ese fondo).
          { key: 'ctaTitulo', label: 'CTA final · título', rich: true, previewTemplate: '<section id="cta" style="padding:32px 24px"><div class="eg-cta__inner"><h2 class="eg-cta__h2" id="eg-cta-h2">__VALUE__</h2></div></section>' },
          { key: 'ctaTexto', label: 'CTA final · texto', long: true },
          { key: 'ctaMicro', label: 'CTA final · texto pequeño' },
          // Antes era un textarea con el <a href="/privacidad">...</a> escrito
          // a mano — si Pablo borraba mal la etiqueta rompía el link. Ahora es
          // "texto plano" + "texto plano" alrededor de un href que NUNCA se
          // puede tocar desde el panel (ver type:'text-fixed-link').
          { key: 'footerCopyright', label: 'Footer · línea de copyright', type: 'text-fixed-link', linkHref: '/privacidad' },
        ],
      },
      marcas: {
        label: 'Marcas de clientes',
        varName: 'marcas',
        path: 'index.html',
        fields: [
          { key: 'nombre', label: 'Nombre de la marca' },
          { key: 'logo', label: 'URL del logo' },
        ],
      },
      proceso: {
        label: 'Cómo trabajamos',
        varName: 'proceso',
        path: 'index.html',
        fields: [
          { key: 'numero', label: 'Número' },
          { key: 'titulo', label: 'Título' },
          { key: 'texto', label: 'Texto', long: true },
        ],
      },
      promesa: {
        label: 'Qué incluye',
        varName: 'promesa',
        path: 'index.html',
        fields: [
          { key: 'icono', label: 'Ícono (emoji)' },
          { key: 'titulo', label: 'Título' },
          { key: 'detalle', label: 'Detalle', long: true },
        ],
      },
      portafolio: {
        label: 'Portafolio',
        varName: 'portafolio',
        path: 'index.html',
        fields: [
          { key: 'imagen', label: 'URL de imagen' },
          { key: 'alt', label: 'Nombre / texto alternativo' },
        ],
      },
      eventosInicio: {
        label: 'Eventos de conversión',
        varName: 'eventosPagina',
        path: 'index.html',
        fields: [
          { key: 'boton', label: 'Botón / acción en la página', readOnly: true },
          { key: 'tipo', label: 'Tipo de evento', type: 'select', options: [
              { value: 'estandar', label: 'Estándar (Meta Pixel)' },
              { value: 'personalizado', label: 'Personalizado' },
            ] },
          { key: 'nombre', label: 'Nombre del evento', type: 'evento-nombre' },
        ],
      },

      // ── Otras páginas ─────────────────────────────────────────────
      // Mismo patrón "const NOMBRE = [...]" en cada página suelta del repo
      // (404, las 3 de "gracias" y privacidad). Los campos "eventosPagina"
      // usan un tipo de campo especial (ver EVENTOS_ESTANDAR / fields con
      // type:'select' y type:'evento-nombre') para que Pablo nunca pueda
      // tipear a mano un nombre de evento estándar que Meta no reconozca.
      texto404: {
        label: 'Textos',
        varName: 'texto404',
        path: '404.html',
        singleton: true,
        richStyles: [ { label: '✦ Cursiva dorada', className: 'cursive' } ],
        fields: [
          { key: 'tag', label: 'Etiqueta ("Error 404")' },
          { key: 'titulo', label: 'Título ("¡Ups!")' },
          { key: 'subtitulo', label: 'Subtítulo', rich: true, previewTemplate: '<h2 id="eg-404-h2">__VALUE__</h2>' },
          { key: 'texto', label: 'Texto', long: true },
          { key: 'btnPrimario', label: 'Botón principal ("Volver al inicio")' },
          { key: 'btnSecundario', label: 'Botón secundario ("Ver planes y precios")' },
          { key: 'micro', label: 'Texto pequeño del pie' },
        ],
      },
      eventos404: {
        label: 'Eventos de conversión',
        varName: 'eventosPagina',
        path: '404.html',
        fields: [
          { key: 'boton', label: 'Botón / acción en la página', readOnly: true },
          { key: 'tipo', label: 'Tipo de evento', type: 'select', options: [
              { value: 'estandar', label: 'Estándar (Meta Pixel)' },
              { value: 'personalizado', label: 'Personalizado' },
            ] },
          { key: 'nombre', label: 'Nombre del evento', type: 'evento-nombre' },
        ],
      },
      textoGraciasSesion: {
        label: 'Textos',
        varName: 'textosGraciasSesion',
        path: 'gracias-sesion/index.html',
        singleton: true,
        richStyles: [ { label: '✦ Cursiva dorada', className: 'cursive' } ],
        fields: [
          { key: 'badge', label: 'Insignia superior' },
          { key: 'titulo', label: 'Título', rich: true, previewTemplate: '<h1 id="eg-gs-h1">__VALUE__</h1>' },
          { key: 'subtitulo', label: 'Subtítulo', long: true },
          { key: 'configuraLabel', label: 'Etiqueta de la tarjeta ("Configura tu sesión")' },
          { key: 'precioNota', label: 'Nota bajo el precio' },
          { key: 'depositoLabel', label: 'Etiqueta ("¿Cuánto vas a depositar?")' },
          { key: 'qrCaption', label: 'Texto bajo el QR (puede usar un salto de línea)' },
          { key: 'importante', label: 'Aviso "Importante" (empieza en negrita)', rich: true, previewTemplate: '<div class="card-dark" id="eg-gs-importante" style="padding:16px;border-radius:12px">__VALUE__</div>' },
          { key: 'botonWhatsapp', label: 'Texto del botón de WhatsApp' },
          { key: 'volverInicio', label: 'Link "Volver al inicio"' },
        ],
      },
      eventosGraciasSesion: {
        label: 'Eventos de conversión',
        varName: 'eventosPagina',
        path: 'gracias-sesion/index.html',
        fields: [
          { key: 'boton', label: 'Botón / acción en la página', readOnly: true },
          { key: 'tipo', label: 'Tipo de evento', type: 'select', options: [
              { value: 'estandar', label: 'Estándar (Meta Pixel)' },
              { value: 'personalizado', label: 'Personalizado' },
            ] },
          { key: 'nombre', label: 'Nombre del evento', type: 'evento-nombre' },
        ],
      },
      textoGraciasPlan: {
        label: 'Textos',
        varName: 'textosGraciasPlan',
        path: 'gracias-plan/index.html',
        singleton: true,
        richStyles: [ { label: '✦ Cursiva dorada', className: 'cursive' } ],
        fields: [
          { key: 'badge', label: 'Insignia superior' },
          { key: 'titulo', label: 'Título', rich: true, previewTemplate: '<h1 id="eg-gp-h1">__VALUE__</h1>' },
          { key: 'subtitulo', label: 'Subtítulo', long: true },
          { key: 'configuraLabel', label: 'Etiqueta de la tarjeta ("Configura tu plan")' },
          { key: 'precioNota', label: 'Nota bajo el precio' },
          { key: 'depositoLabel', label: 'Etiqueta ("¿Cuánto vas a depositar?")' },
          { key: 'qrCaption', label: 'Texto bajo el QR (puede usar un salto de línea)' },
          { key: 'importante', label: 'Aviso "Importante" (empieza en negrita)', rich: true, previewTemplate: '<div class="card-dark" id="eg-gp-importante" style="padding:16px;border-radius:12px">__VALUE__</div>' },
          { key: 'botonWhatsapp', label: 'Texto del botón de WhatsApp' },
          { key: 'volverInicio', label: 'Link "Volver al inicio"' },
        ],
      },
      eventosGraciasPlan: {
        label: 'Eventos de conversión',
        varName: 'eventosPagina',
        path: 'gracias-plan/index.html',
        fields: [
          { key: 'boton', label: 'Botón / acción en la página', readOnly: true },
          { key: 'tipo', label: 'Tipo de evento', type: 'select', options: [
              { value: 'estandar', label: 'Estándar (Meta Pixel)' },
              { value: 'personalizado', label: 'Personalizado' },
            ] },
          { key: 'nombre', label: 'Nombre del evento', type: 'evento-nombre' },
        ],
      },
      textoGraciasReunion: {
        label: 'Textos',
        varName: 'textosGraciasReunion',
        path: 'gracias-reunion/index.html',
        singleton: true,
        richStyles: [ { label: '✦ Cursiva dorada', className: 'cursive' } ],
        fields: [
          { key: 'badge', label: 'Insignia superior' },
          { key: 'titulo', label: 'Título (puede usar un salto de línea)', rich: true, previewTemplate: '<h1 id="eg-gr-h1">__VALUE__</h1>' },
          { key: 'subtitulo', label: 'Subtítulo', long: true },
          { key: 'tarjetaTitulo', label: 'Título de la tarjeta clara' },
          { key: 'oscuraTitulo', label: 'Título de la tarjeta oscura' },
          { key: 'oscuraParrafo1', label: 'Tarjeta oscura · párrafo 1', long: true },
          { key: 'oscuraParrafo2', label: 'Tarjeta oscura · párrafo 2', long: true },
          { key: 'botonWhatsapp', label: 'Texto del botón de WhatsApp' },
          { key: 'micro', label: 'Texto pequeño bajo el botón' },
          { key: 'volverInicio', label: 'Link "Volver al inicio"' },
        ],
      },
      eventosGraciasReunion: {
        label: 'Eventos de conversión',
        varName: 'eventosPagina',
        path: 'gracias-reunion/index.html',
        fields: [
          { key: 'boton', label: 'Botón / acción en la página', readOnly: true },
          { key: 'tipo', label: 'Tipo de evento', type: 'select', options: [
              { value: 'estandar', label: 'Estándar (Meta Pixel)' },
              { value: 'personalizado', label: 'Personalizado' },
            ] },
          { key: 'nombre', label: 'Nombre del evento', type: 'evento-nombre' },
        ],
      },
      textoPrivacidad: {
        label: 'Textos',
        varName: 'textoPrivacidad',
        path: 'privacidad/index.html',
        singleton: true,
        fields: [
          { key: 'volverInicio', label: 'Link "Volver al inicio"' },
          { key: 'titulo', label: 'Título' },
          { key: 'actualizado', label: 'Línea "Última actualización"' },
          { key: 'intro', label: 'Párrafo de introducción', long: true },
          { key: 'footer', label: 'Línea del footer', type: 'text-fixed-link', linkHref: '/' },
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
