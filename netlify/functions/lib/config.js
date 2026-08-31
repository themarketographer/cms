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
    // Mismo patrón que "eg" (ver netlify/functions/lib/datablocks.js): cada
    // entrada es "const NOMBRE = [...]" dentro de la página real. mkt usa
    // <mark> (tag nativo, ya definido en el CSS real del hero) para su
    // resaltado dorado, en vez de un span.clase como eg — por eso su
    // richStyles declara "tag" en vez de className (ver sanitizeRichHtml /
    // richApplySpecial generalizados en el panel).
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
      heroMkt: {
        label: 'Encabezado',
        varName: 'heroMkt',
        path: 'index.html',
        singleton: true,
        richStyles: [ { label: '★ Resaltado dorado', tag: 'mark' } ],
        fields: [
          { key: 'eyebrow', label: 'Texto sobre el título' },
          { key: 'titulo', label: 'Título', rich: true, previewTemplate: '<h1 id="mkt-hero-h1" style="font-size:38px;max-width:720px;">__VALUE__</h1>' },
          { key: 'subtitulo', label: 'Subtítulo', long: true },
          { key: 'stat1', label: 'Estadística 1' },
          { key: 'stat2', label: 'Estadística 2' },
          { key: 'stat3', label: 'Estadística 3' },
          { key: 'videoUrl', label: 'URL del video (embed de YouTube)' },
        ],
      },
      textosMkt: {
        label: 'Textos de la página',
        varName: 'textosMkt',
        path: 'index.html',
        singleton: true,
        fields: [
          { key: 'problemaEyebrow', label: 'Problema · texto sobre el título' },
          { key: 'problemaTitulo', label: 'Problema · título' },
          { key: 'problemaTexto', label: 'Problema · texto', long: true },
          { key: 'incluyeEyebrow', label: 'Qué incluye · texto sobre el título' },
          { key: 'incluyeTitulo', label: 'Qué incluye · título' },
          { key: 'midCtaTitulo', label: 'CTA intermedio · título (puede usar un salto de línea)', lineBreaks: true },
          { key: 'midCtaTexto', label: 'CTA intermedio · texto', long: true },
          { key: 'midCtaBoton', label: 'CTA intermedio · texto del botón' },
          { key: 'pricingEyebrow', label: 'Precios · texto sobre el título' },
          { key: 'pricingTitulo', label: 'Precios · título' },
          { key: 'pricingTexto', label: 'Precios · texto' },
          { key: 'aboutEyebrow', label: 'Sobre Pablo · texto sobre el título' },
          { key: 'aboutTitulo', label: 'Sobre Pablo · título' },
          { key: 'aboutParrafo1', label: 'Sobre Pablo · párrafo 1', long: true },
          { key: 'aboutParrafo2', label: 'Sobre Pablo · párrafo 2', long: true },
          { key: 'aboutParrafo3', label: 'Sobre Pablo · párrafo 3 (en cursiva, corto)' },
          { key: 'testiEyebrow', label: 'Testimonios · texto sobre el título' },
          { key: 'testiTitulo', label: 'Testimonios · título' },
          { key: 'faqEyebrow', label: 'FAQ · texto sobre el título' },
          { key: 'faqTitulo', label: 'FAQ · título' },
          { key: 'finalTitulo1', label: 'CTA final · título (parte 1)' },
          { key: 'finalTitulo2', label: 'CTA final · título (parte 2, en dorado)' },
          { key: 'finalTexto', label: 'CTA final · texto', long: true },
          { key: 'finalWaBoton', label: 'CTA final · texto del botón de WhatsApp' },
          { key: 'finalWaNota', label: 'CTA final · texto pequeño bajo el botón de WhatsApp' },
          { key: 'finalSub', label: 'CTA final · texto pequeño final' },
          { key: 'freeBandEyebrow', label: 'Comunidad gratis · texto sobre el título' },
          { key: 'freeBandTexto', label: 'Comunidad gratis · texto' },
          { key: 'freeBandBoton', label: 'Comunidad gratis · texto del botón' },
          { key: 'footerCopyright', label: 'Footer · línea de copyright' },
        ],
      },
      problemaCards: {
        label: 'Problema · tarjetas',
        varName: 'problemaCards',
        path: 'index.html',
        fields: [
          { key: 'numero', label: 'Número' },
          { key: 'tag', label: 'Etiqueta (opcional, solo la 1ª tarjeta la usa hoy)' },
          { key: 'titulo', label: 'Título' },
          { key: 'texto', label: 'Texto', long: true },
        ],
      },
      problemaStats: {
        label: 'Problema · estadísticas',
        varName: 'problemaStats',
        path: 'index.html',
        fields: [
          { key: 'valor', label: 'Valor' },
          { key: 'texto', label: 'Texto' },
        ],
      },
      featurePair: {
        label: 'Clases y cursos (2 columnas)',
        varName: 'featurePair',
        path: 'index.html',
        fields: [
          { key: 'imagen', label: 'URL de imagen' },
          { key: 'titulo', label: 'Título' },
          { key: 'texto', label: 'Texto', long: true },
        ],
      },
      incluyeCards: {
        label: 'Qué incluye · tarjetas',
        varName: 'incluyeCards',
        path: 'index.html',
        fields: [
          { key: 'icono', label: 'URL del ícono' },
          { key: 'titulo', label: 'Título' },
          { key: 'detalle', label: 'Detalle', long: true },
        ],
      },
      midCtaFloat: {
        label: 'CTA intermedio · tarjetas flotantes',
        varName: 'midCtaFloat',
        path: 'index.html',
        fields: [
          { key: 'titulo', label: 'Título' },
          { key: 'texto', label: 'Texto' },
        ],
      },
      pricingFeatures: {
        label: 'Precios · lista de beneficios',
        varName: 'pricingFeatures',
        path: 'index.html',
        fields: [
          { key: 'titulo', label: 'Título' },
          { key: 'texto', label: 'Texto' },
        ],
      },
      faqsMkt: {
        label: 'Preguntas frecuentes',
        varName: 'faqsMkt',
        path: 'index.html',
        fields: [
          { key: 'q', label: 'Pregunta' },
          { key: 'a', label: 'Respuesta', long: true },
        ],
      },
      eventosInicio: {
        label: 'Eventos de conversión',
        varName: 'eventosPagina',
        path: 'index.html',
        fixedRows: true,
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
      texto404: {
        label: 'Textos',
        varName: 'texto404',
        path: '404.html',
        singleton: true,
        fields: [
          { key: 'titulo', label: 'Título' },
          { key: 'subtitulo', label: 'Subtítulo', long: true },
          { key: 'boton', label: 'Texto del botón ("Volver al inicio")' },
          { key: 'footerCopyright', label: 'Footer · línea de copyright' },
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
          { key: 'footer', label: 'Footer · línea de copyright' },
        ],
      },
      textoMasterclass: {
        label: 'Textos',
        varName: 'textoMasterclass',
        path: 'masterclass/index.html',
        singleton: true,
        richStyles: [ { label: '★ Resaltado dorado', tag: 'mark' } ],
        fields: [
          { key: 'badge', label: 'Insignia superior' },
          { key: 'titulo', label: 'Título', rich: true, previewTemplate: '<h1 style="font-size:32px;max-width:640px;">__VALUE__</h1>' },
          { key: 'subtitulo', label: 'Bajada', long: true },
          { key: 'botonRegistrar', label: 'Texto del botón "Registrarme al evento"' },
          { key: 'eventoQue', label: 'Tarjeta del evento · "Qué"' },
          { key: 'eventoCuando', label: 'Tarjeta del evento · "Cuándo" (fecha y hora)' },
          { key: 'whatsappTexto', label: 'Bloque de WhatsApp · texto', long: true },
          { key: 'whatsappBoton', label: 'Bloque de WhatsApp · texto del botón' },
          { key: 'infoTitulo', label: '"¿Qué te vas a llevar?" · título' },
          { key: 'infoTexto', label: '"¿Qué te vas a llevar?" · texto', long: true },
          { key: 'footerCopyright', label: 'Footer · línea de copyright' },
        ],
      },
      eventosMasterclass: {
        label: 'Eventos de conversión',
        varName: 'eventosPagina',
        path: 'masterclass/index.html',
        fixedRows: true,
        fields: [
          { key: 'boton', label: 'Botón / acción en la página', readOnly: true },
          { key: 'tipo', label: 'Tipo de evento', type: 'select', options: [
              { value: 'estandar', label: 'Estándar (Meta Pixel)' },
              { value: 'personalizado', label: 'Personalizado' },
            ] },
          { key: 'nombre', label: 'Nombre del evento', type: 'evento-nombre' },
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
          { key: 'statLabel1', label: 'Estadística 1 · texto (puede usar un salto de línea)', lineBreaks: true },
          { key: 'statValor2', label: 'Estadística 2 · valor' },
          { key: 'statLabel2', label: 'Estadística 2 · texto (puede usar un salto de línea)', lineBreaks: true },
          { key: 'statValor3', label: 'Estadística 3 · valor' },
          { key: 'statLabel3', label: 'Estadística 3 · texto (puede usar un salto de línea)', lineBreaks: true },
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
          { key: 'cmpImgAntes', label: 'Comparador · foto de "antes" (URL)' },
          { key: 'cmpImgAntesAlt', label: 'Comparador · foto de "antes" (texto alternativo)' },
          { key: 'cmpImgDespues', label: 'Comparador · foto de "después" (URL)' },
          { key: 'cmpImgDespuesAlt', label: 'Comparador · foto de "después" (texto alternativo)' },
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
        fixedRows: true,
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
        fixedRows: true,
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
          { key: 'qrCaption', label: 'Texto bajo el QR (puede usar un salto de línea)', lineBreaks: true },
          { key: 'importante', label: 'Aviso "Importante" (empieza en negrita)', rich: true, previewTemplate: '<div class="card-dark" id="eg-gs-importante" style="padding:16px;border-radius:12px">__VALUE__</div>' },
          { key: 'botonWhatsapp', label: 'Texto del botón de WhatsApp' },
          { key: 'volverInicio', label: 'Link "Volver al inicio"' },
        ],
      },
      eventosGraciasSesion: {
        label: 'Eventos de conversión',
        varName: 'eventosPagina',
        path: 'gracias-sesion/index.html',
        fixedRows: true,
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
          { key: 'qrCaption', label: 'Texto bajo el QR (puede usar un salto de línea)', lineBreaks: true },
          { key: 'importante', label: 'Aviso "Importante" (empieza en negrita)', rich: true, previewTemplate: '<div class="card-dark" id="eg-gp-importante" style="padding:16px;border-radius:12px">__VALUE__</div>' },
          { key: 'botonWhatsapp', label: 'Texto del botón de WhatsApp' },
          { key: 'volverInicio', label: 'Link "Volver al inicio"' },
        ],
      },
      eventosGraciasPlan: {
        label: 'Eventos de conversión',
        varName: 'eventosPagina',
        path: 'gracias-plan/index.html',
        fixedRows: true,
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
        fixedRows: true,
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

      // ── Precios (/precios) ───────────────────────────────────────
      // pricing-logic.js es la fuente única de los 3 bloques de abajo (ver
      // el comentario al principio de ese archivo). Los TRAMOS de precio
      // (a partir de cuántas fotos pasás de Básico a Estándar, etc) y los
      // textos que dependen de esos mismos tramos ("Entrega en 24h",
      // "Edición profesional") siguen siendo código a propósito: son
      // umbrales acoplados a los sliders de la calculadora, no números
      // sueltos — cambiarlos sin tocar el resto rompería la calculadora.
      preciosBase: {
        label: 'Precios · tarifas base',
        varName: 'preciosBase',
        path: 'assets/js/pricing-logic.js',
        singleton: true,
        fields: [
          { key: 'sesionBasicoBase', label: 'Sesión Básico · precio a las 8 fotos', type: 'number' },
          { key: 'sesionBasicoIncremento', label: 'Sesión Básico · precio extra por cada foto (9-10 fotos)', type: 'number' },
          { key: 'sesionEstandarBase', label: 'Sesión Estándar · precio a las 10 fotos', type: 'number' },
          { key: 'sesionEstandarIncremento', label: 'Sesión Estándar · precio extra por cada foto (11-18 fotos)', type: 'number' },
          { key: 'sesionPremiumBase', label: 'Sesión Premium · precio a las 18 fotos', type: 'number' },
          { key: 'sesionPremiumIncremento', label: 'Sesión Premium · precio extra por cada foto (19+ fotos)', type: 'number' },
          { key: 'planBasicoBase', label: 'Plan Básico · precio a las 12 fotos/mes', type: 'number' },
          { key: 'planBasicoIncremento', label: 'Plan Básico · precio extra por cada foto (13-14 fotos/mes)', type: 'number' },
          { key: 'planEstandarBase', label: 'Plan Estándar · precio a las 14 fotos/mes', type: 'number' },
          { key: 'planEstandarIncremento', label: 'Plan Estándar · precio extra por cada foto (15-20 fotos/mes)', type: 'number' },
          { key: 'planPremiumBase', label: 'Plan Premium · precio a las 20 fotos/mes', type: 'number' },
          { key: 'planPremiumIncremento', label: 'Plan Premium · precio extra por cada foto (21+ fotos/mes)', type: 'number' },
          { key: 'descuento6meses', label: 'Descuento por pagar 6 meses de una vez (%)', type: 'number' },
          { key: 'descuento12meses', label: 'Descuento por pagar 12 meses de una vez (%)', type: 'number' },
        ],
      },
      preciosTextos: {
        label: 'Precios · textos de "lo que incluye"',
        varName: 'preciosTextos',
        path: 'assets/js/pricing-logic.js',
        singleton: true,
        fields: [
          { key: 'beneficioSesion1', label: 'Sesión · beneficio fijo 1' },
          { key: 'beneficioSesion2', label: 'Sesión · beneficio fijo 2' },
          { key: 'beneficioPlan1', label: 'Plan mensual · beneficio fijo 1' },
          { key: 'beneficioPlan2', label: 'Plan mensual · beneficio fijo 2' },
          { key: 'beneficioAsesoria', label: 'Plan mensual · beneficio extra desde 16 fotos/mes' },
          { key: 'beneficioPaginaWeb', label: 'Plan mensual · beneficio extra desde 16 fotos/mes + 3 o más meses' },
          { key: 'beneficioGuion', label: 'Plan mensual · beneficio extra si se agrega video (1 de 3)' },
          { key: 'beneficioMusica', label: 'Plan mensual · beneficio extra si se agrega video (2 de 3)' },
        ],
      },
      preciosExtras: {
        label: 'Precios · extras a la carta',
        varName: 'EXTRAS',
        path: 'assets/js/pricing-logic.js',
        autoIdField: 'id',
        fields: [
          { key: 'id', label: 'Identificador interno', readOnly: true },
          { key: 'label', label: 'Nombre del extra' },
          { key: 'desc', label: 'Descripción', long: true },
          { key: 'tipo', label: 'Tipo de precio', type: 'select', options: [
              { value: 'flat', label: 'Precio fijo' },
              { value: 'stepper', label: 'Por cantidad (selector +/-)' },
            ] },
          { key: 'precio', label: 'Precio (Bs.)', type: 'number', showIf: { key: 'tipo', equals: 'flat' } },
          { key: 'precioUnidad', label: 'Precio por unidad (Bs.)', type: 'number', showIf: { key: 'tipo', equals: 'stepper' } },
          { key: 'min', label: 'Cantidad mínima', type: 'number', showIf: { key: 'tipo', equals: 'stepper' } },
          { key: 'max', label: 'Cantidad máxima', type: 'number', showIf: { key: 'tipo', equals: 'stepper' } },
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
