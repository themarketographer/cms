// Bloques editables de marketographers.com, en el mismo orden en que aparecen
// en la página. Tres tipos:
//  1) bloques de la Home enlazados al HTML (home-blocks.json, lo genera la
//     herramienta de marcado: cada texto, enlace e imagen de cada sección)
//  2) listas de datos de la Home (testimonios, preguntas, tarjetas, planes...)
//  3) cursos: datos de cada curso y textos generales; al guardar se regeneran
//     el hub /cursos/ y una página por cada curso publicado.

const HOME = require('./home-blocks.json');
const PAGES = require('./page-blocks');

const MARK = [{ label: '★ Resaltado dorado', tag: 'mark' }];
const homeBlocks = {};
HOME.forEach((b) => {
  const blk = { ...b };
  if (blk.fields.some((f) => f.rich)) blk.richStyles = MARK;
  homeBlocks[b.key] = blk;
});

const EVENT_FIELDS = [
  { key: 'boton', label: 'Botón / acción en la página', readOnly: true },
  { key: 'tipo', label: 'Tipo de evento', type: 'select', options: [
    { value: 'estandar', label: 'Estándar (Meta Pixel)' },
    { value: 'personalizado', label: 'Personalizado' },
  ] },
  { key: 'nombre', label: 'Nombre del evento', type: 'evento-nombre' },
];

const listBlocks = {
  problemCards: {
    label: 'El problema · tarjetas', varName: 'problemCards', path: 'index.html',
    fields: [
      { key: 'num', label: 'Número (01, 02...)', compact: true },
      { key: 't', label: 'Título' },
      { key: 'p', label: 'Texto', long: true },
    ],
  },
  stats: {
    label: 'El problema · cifras', varName: 'stats', path: 'index.html',
    fields: [
      { key: 'v', label: 'Cifra (con su símbolo)', hint: 'Ejemplos: 95%, $200, 60h. La primera cifra con números cuenta animada al entrar.' },
      { key: 'l', label: 'Qué significa', long: true },
    ],
  },
  includesCards: {
    label: 'Qué incluye · tarjetas', varName: 'includesCards', path: 'index.html',
    fields: [
      { key: 't', label: 'Título' },
      { key: 'p', label: 'Texto', long: true },
    ],
  },
  mapaChips: {
    label: 'Mapa · problemas y cursos', varName: 'MAPA', path: 'index.html',
    fields: [
      { key: 'p', label: 'Problema que dice la persona', hint: 'Es el botón de la izquierda. Ejemplo: No sé cuánto cobrar.' },
      { key: 'cursos', label: 'Cursos que lo resuelven', hint: 'Identificadores (slug) de los cursos separados por coma, por ejemplo marketing-para-fotografos, landing-pages-con-ia. Un curso que no esté publicado no se muestra.' },
      { key: 'nota', label: 'Nota extra (opcional)', long: true },
    ],
  },
  cinta: {
    label: 'Cinta de palabras', varName: 'CINTA', path: 'index.html',
    fields: [
      { key: 'w', label: 'Palabra', hint: 'Cada palabra aparece en la cinta que se mueve bajo la portada. Agrega, quita o reordena.' },
    ],
  },
  testimonios: {
    label: 'Casos · testimonios', varName: 'testimonios', path: 'index.html', jsonld: 'reviews',
    fields: [
      { key: 'n', label: 'Nombre' },
      { key: 't', label: 'Especialidad · país' },
      { key: 'q', label: 'Cita', long: true },
      { key: 'img', label: 'Foto', image: true },
    ],
  },
  planes: {
    label: 'Planes · precios y textos', varName: 'PLANES', path: 'index.html', fixedRows: true,
    fields: [
      { key: 'id', label: 'Plan', readOnly: true },
      { key: 'p', label: 'Precio que se muestra por mes', type: 'number', hint: 'Anual: el precio mensual equivalente, por ejemplo 27.5.' },
      { key: 'o', label: 'Precio tachado (antes)', type: 'number' },
      { key: 'day', label: 'Frase del costo por día' },
      { key: 'bill', label: 'Frase de cobro', long: true },
      { key: 'cta', label: 'Texto del botón de compra' },
    ],
  },
  pricingFeatures: {
    label: 'Planes · beneficios', varName: 'pricingFeatures', path: 'index.html',
    fields: [
      { key: 'i', label: 'Ícono', type: 'select', options: [
        { value: 'cam', label: 'Cámara de video' }, { value: 'play', label: 'Reproducir' }, { value: 'chat', label: 'Chat' },
        { value: 'book', label: 'Libro' }, { value: 'mail', label: 'Correo' }, { value: 'chat2', label: 'Estrella' },
      ] },
      { key: 't', label: 'Título' },
      { key: 'p', label: 'Texto', long: true },
    ],
  },
  faqs: {
    label: 'Preguntas frecuentes', varName: 'faqs', path: 'index.html', jsonld: 'faq',
    fields: [
      { key: 'q', label: 'Pregunta' },
      { key: 'a', label: 'Respuesta', long: true, tall: true },
    ],
  },
  eventosInicio: {
    label: 'Inicio · Eventos de conversión', varName: 'eventosPagina', path: 'index.html', fixedRows: true, fields: EVENT_FIELDS,
  },
  eventosDiagnostico: {
    label: 'Diagnóstico · Eventos de conversión', varName: 'eventosPagina', path: 'diagnostico/index.html', fixedRows: true, fields: EVENT_FIELDS,
  },
};

const CATEGORIAS = [
  { value: 'creativos', label: 'Para fotógrafos y creativos' },
  { value: 'profesionales', label: 'Para quienes atienden clientes' },
  { value: 'restaurantes', label: 'Para restaurantes' },
];

const cursosBlocks = {
  cursos: {
    label: 'Cursos', varName: 'cursos', path: 'cursos/cursos-data.js', kind: 'cursos',
    richStyles: MARK, uploadDir: 'cursos/assets/portadas',
    fields: [
      { key: 'nombre', label: 'Nombre del curso', section: '1 · Datos básicos' },
      { key: 'slug', label: 'Dirección en la web (slug)', section: '1 · Datos básicos', readOnlyIfSaved: true, autoSlugFrom: 'nombre', hint: 'Solo minúsculas, números y guiones. Queda en marketographers.com/cursos/ese-texto/. No se puede cambiar después: para otra dirección, crea un curso nuevo.' },
      { key: 'categoria', label: 'Categoría', type: 'select', options: CATEGORIAS, section: '1 · Datos básicos' },
      { key: 'publicado', label: '¿Se ve en la web?', type: 'select', options: [{ value: 'si', label: 'Sí, publicado' }, { value: 'no', label: 'No, oculto' }], section: '1 · Datos básicos' },
      { key: 'estado', label: 'Estado de venta', type: 'select', options: [{ value: 'disponible', label: 'Disponible ya' }, { value: 'preventa', label: 'Preventa' }], section: '1 · Datos básicos' },

      { key: 'precio', label: 'Precio en dólares', type: 'number', section: '2 · Precio y compra' },
      { key: 'precioRegular', label: 'Precio regular (el que se tacha en preventa)', section: '2 · Precio y compra', showIf: { key: 'estado', equals: 'preventa' } },
      { key: 'nasId', label: 'ID del curso en Nas.io', section: '2 · Precio y compra', hint: 'Es el código largo del curso en Nas.io. Con él se arma el enlace de compra.' },
      { key: 'nasSlug', label: 'Nombre del curso en el enlace de Nas.io (opcional)', section: '2 · Precio y compra', hint: 'Solo se usa si no hay ID.' },

      { key: 'portada', label: 'Portada del curso', image: true, uploadName: 'slug', section: '3 · Portada', hint: 'Súbela desde tu computador. El panel la reduce sola para que cargue rápido. Si no hay portada, se muestra una tarjeta con texto.' },
      { key: 'glifo', label: 'Palabra grande de la tarjeta sin portada', section: '3 · Portada', hint: 'Ejemplo: Zoom, iPhone, Cal.' },

      { key: 'corto', label: 'Frase corta (aparece en la tarjeta del listado)', section: '4 · Encabezado de la página' },
      { key: 'eyebrow', label: 'Texto pequeño sobre el título', section: '4 · Encabezado de la página' },
      { key: 'h1', label: 'Título principal', rich: true, section: '4 · Encabezado de la página', hint: 'Usa el resaltado dorado para la parte que quieres destacar.' },
      { key: 'sub', label: 'Subtítulo', long: true, section: '4 · Encabezado de la página' },

      { key: 'problemaFrase', label: 'Frase que se enciende al hacer scroll (opcional)', long: true, section: '5 · El problema (opcional)', hint: 'Si dejas esta sección vacía, no aparece en la página.' },
      { key: 'problemas', label: 'Tarjetas de problema', long: true, tall: true, section: '5 · El problema (opcional)', hint: 'Una por línea con este formato: Título | Texto | Módulo que lo resuelve' },
      { key: 'antes', label: 'Antes del curso (una por línea)', long: true, section: '5 · El problema (opcional)' },
      { key: 'despues', label: 'Al terminar (una por línea)', long: true, section: '5 · El problema (opcional)' },

      { key: 'historia', label: 'Historia de apertura', long: true, tall: true, section: '6 · Historia', hint: 'Un párrafo por línea.' },
      { key: 'paraQuien', label: 'Para quién es (una frase por línea)', long: true, tall: true, section: '7 · Para quién es' },
      { key: 'modulos', label: 'Programa', long: true, tall: true, section: '8 · Programa', hint: 'Cada módulo empieza con # y su título. Debajo, una clase por línea. Ejemplo: # Módulo 1 · Las bases (y abajo las clases).' },
      { key: 'resultados', label: 'Qué vas a tener hecho (uno por línea)', long: true, section: '9 · Resultados' },
      { key: 'faq', label: 'Preguntas frecuentes', long: true, tall: true, section: '10 · Preguntas frecuentes', hint: 'Pregunta en una línea, respuesta en la siguiente, y una línea en blanco entre cada par.' },
    ],
  },
  cursosAjustes: {
    label: 'Textos generales de cursos', varName: 'cursosAjustes', path: 'cursos/cursos-data.js', kind: 'cursosAjustes',
    singleton: true, richStyles: MARK,
    fields: [
      { key: 'checkoutPlantilla', label: 'Enlace de compra por curso', section: '1 · Compra', hint: 'Usa {id} donde va el ID del curso en Nas.io.' },
      { key: 'nasBase', label: 'Enlace base de respaldo (si un curso no tiene ID)', section: '1 · Compra' },
      { key: 'botonCompra', label: 'Botón de compra', section: '1 · Compra' },
      { key: 'botonPreventa', label: 'Botón de compra en preventa', section: '1 · Compra' },
      { key: 'botonPrograma', label: 'Botón que lleva al programa', section: '1 · Compra' },
      { key: 'fechaPreventa', label: 'Fecha de entrega de las preventas', section: '2 · Preventa', hint: 'Ejemplo: diciembre de 2026.' },
      { key: 'notaPreventa', label: 'Nota bajo el programa', long: true, section: '2 · Preventa', hint: 'Usa {fecha} para insertar la fecha de entrega.' },
      { key: 'garantiaPreventa', label: 'Frase bajo el precio en preventa', long: true, section: '2 · Preventa' },
      { key: 'faqPreventaQ', label: 'Pregunta extra en preventa', section: '2 · Preventa' },
      { key: 'faqPreventaA', label: 'Respuesta extra en preventa', long: true, section: '2 · Preventa', hint: 'Puedes usar {fecha} y {regular}.' },

      { key: 'hubTitle', label: 'Título de la pestaña del navegador', section: '3 · Página /cursos/' },
      { key: 'hubDescripcion', label: 'Descripción para Google', long: true, section: '3 · Página /cursos/' },
      { key: 'hubEyebrow', label: 'Texto pequeño sobre el título', section: '3 · Página /cursos/' },
      { key: 'hubH1', label: 'Título principal', rich: true, section: '3 · Página /cursos/' },
      { key: 'hubLead', label: 'Texto de apoyo', long: true, section: '3 · Página /cursos/' },
      { key: 'hubTicker', label: 'Palabras de la cinta que se mueve', long: true, section: '3 · Página /cursos/', hint: 'Separadas por comas.' },
      { key: 'hubFrase', label: 'Frase que se enciende al hacer scroll', long: true, section: '3 · Página /cursos/' },
      { key: 'hubVerCurso', label: 'Texto del enlace de cada tarjeta', section: '3 · Página /cursos/' },

      { key: 'cat1Id', label: 'Categoría 1 · identificador', readOnly: true, section: '4 · Categorías' },
      { key: 'cat1Titulo', label: 'Categoría 1 · título', section: '4 · Categorías' },
      { key: 'cat1Texto', label: 'Categoría 1 · descripción', long: true, section: '4 · Categorías' },
      { key: 'cat2Id', label: 'Categoría 2 · identificador', readOnly: true, section: '4 · Categorías' },
      { key: 'cat2Titulo', label: 'Categoría 2 · título', section: '4 · Categorías' },
      { key: 'cat2Texto', label: 'Categoría 2 · descripción', long: true, section: '4 · Categorías' },
      { key: 'cat3Id', label: 'Categoría 3 · identificador', readOnly: true, section: '4 · Categorías' },
      { key: 'cat3Titulo', label: 'Categoría 3 · título', section: '4 · Categorías' },
      { key: 'cat3Texto', label: 'Categoría 3 · descripción', long: true, section: '4 · Categorías' },

      { key: 'motionUrl', label: 'Enlace de la membresía', section: '5 · Membresía Motion' },
      { key: 'motionEyebrow', label: 'Hub · texto pequeño', section: '5 · Membresía Motion' },
      { key: 'motionTitulo', label: 'Hub · título', section: '5 · Membresía Motion' },
      { key: 'motionTexto', label: 'Hub · texto', long: true, section: '5 · Membresía Motion' },
      { key: 'motionBoton', label: 'Hub · botón', section: '5 · Membresía Motion' },
      { key: 'upsellTexto', label: 'En cada curso · texto (admite negrita)', long: true, rich: true, section: '5 · Membresía Motion' },
      { key: 'upsellBoton', label: 'En cada curso · botón', section: '5 · Membresía Motion' },

      { key: 'restEyebrow', label: 'Bloque restaurantes · texto pequeño', section: '6 · Bloque de restaurantes' },
      { key: 'restTitulo', label: 'Bloque restaurantes · título', section: '6 · Bloque de restaurantes' },
      { key: 'restTexto', label: 'Bloque restaurantes · texto', long: true, section: '6 · Bloque de restaurantes' },
      { key: 'restUrl', label: 'Bloque restaurantes · enlace', section: '6 · Bloque de restaurantes' },
      { key: 'restBoton', label: 'Bloque restaurantes · botón', section: '6 · Bloque de restaurantes' },

      { key: 'problemaEyebrow', label: 'Problema · texto pequeño', section: '7 · Secciones de cada curso' },
      { key: 'antesTitulo', label: 'Problema · título de "antes"', section: '7 · Secciones de cada curso' },
      { key: 'despuesTitulo', label: 'Problema · título de "después"', section: '7 · Secciones de cada curso' },
      { key: 'paraQuienEyebrow', label: 'Para quién · texto pequeño', section: '7 · Secciones de cada curso' },
      { key: 'paraQuienTitulo', label: 'Para quién · título', section: '7 · Secciones de cada curso' },
      { key: 'programaEyebrow', label: 'Programa · texto pequeño', section: '7 · Secciones de cada curso' },
      { key: 'programaTitulo', label: 'Programa · título', section: '7 · Secciones de cada curso' },
      { key: 'resultadosEyebrow', label: 'Resultados · texto pequeño', section: '7 · Secciones de cada curso' },
      { key: 'resultadosTitulo', label: 'Resultados · título', section: '7 · Secciones de cada curso' },
      { key: 'garantiaDisponible', label: 'Frase bajo el precio', long: true, section: '7 · Secciones de cada curso' },
      { key: 'faqEyebrow', label: 'Preguntas · texto pequeño', section: '7 · Secciones de cada curso' },
      { key: 'faqTitulo', label: 'Preguntas · título', section: '7 · Secciones de cada curso' },
      { key: 'faqComunes', label: 'Preguntas que van en todos los cursos', long: true, tall: true, section: '7 · Secciones de cada curso', hint: 'Pregunta en una línea, respuesta en la siguiente, línea en blanco entre pares.' },
      { key: 'finalTitulo', label: 'Cierre · título (se le suma el precio)', section: '7 · Secciones de cada curso' },
      { key: 'finalTexto', label: 'Cierre · texto', long: true, section: '7 · Secciones de cada curso' },
      { key: 'finalVerTodos', label: 'Cierre · enlace a todos los cursos', section: '7 · Secciones de cada curso' },

      { key: 'profeFoto', label: 'Foto de quien enseña', image: true, section: '8 · Quién enseña y pie' },
      { key: 'profeEyebrow', label: 'Texto pequeño', section: '8 · Quién enseña y pie' },
      { key: 'profeNombre', label: 'Nombre', section: '8 · Quién enseña y pie' },
      { key: 'profeTexto', label: 'Presentación', long: true, section: '8 · Quién enseña y pie' },
      { key: 'pie', label: 'Pie de página (admite enlaces)', long: true, section: '8 · Quién enseña y pie' },
    ],
  },
};

// Menú del panel: secciones y grupos en el orden de la página.
const g = (label, items, extra) => ({ label, items, ...(extra || {}) });
const it = (key, label, livePath) => ({ key, label, livePath });
const MENU = [
  g('Blog', [{ key: 'posts', label: 'Posts' }], { section: 'Contenido', sectionHint: 'blog y cursos' }),
  g('Cursos', [
    it('cursos', 'Cursos: agregar, portadas y precios', '/cursos/'),
    it('cursosAjustes', 'Textos generales de cursos', '/cursos/'),
  ], { section: 'Contenido' }),
  g('Menú y portada', [it('home_nav', 'Menú superior', '/'), it('home_hero', 'Portada', '/'), it('home_frase', 'Frase que se enciende', '/'), it('cinta', 'Cinta de palabras', '/'), it('home_vis', 'Mostrar u ocultar secciones', '/')], { num: 1, section: 'Página de inicio', sectionHint: 'en el orden de la página' }),
  g('Tres escenas', [it('home_escenas', 'Textos de las escenas', '/#escenas')], { num: 2, section: 'Página de inicio' }),
  g('El problema', [it('home_problema', 'Título y texto', '/#problema'), it('problemCards', 'Tarjetas', '/#problema'), it('stats', 'Cifras', '/#problema')], { num: 3, section: 'Página de inicio' }),
  g('Qué incluye', [it('home_incluye', 'Título y botón', '/#incluye'), it('includesCards', 'Tarjetas', '/#incluye')], { num: 4, section: 'Página de inicio' }),
  g('Por dentro', [it('home_dentro', 'Bloques y textos', '/#dentro')], { num: 5, section: 'Página de inicio' }),
  g('Mapa de cursos', [it('home_mapa', 'Título y botón', '/#mapa'), it('mapaChips', 'Problemas y cursos', '/#mapa')], { num: 6, section: 'Página de inicio' }),
  g('Casos de miembros', [it('home_casos', 'Título y botón', '/#casos'), it('testimonios', 'Testimonios', '/#casos')], { num: 7, section: 'Página de inicio' }),
  g('Sobre Pablo', [it('home_sobre', 'Foto y presentación', '/')], { num: 8, section: 'Página de inicio' }),
  g('Dudas honestas', [it('home_dudas', 'Dudas y respuestas', '/#dudas')], { num: 9, section: 'Página de inicio' }),
  g('Planes y precio', [it('home_planes', 'Textos y enlace de compra', '/#planes'), it('planes', 'Precios y frases', '/#planes'), it('pricingFeatures', 'Beneficios', '/#planes')], { num: 10, section: 'Página de inicio' }),
  g('Preguntas frecuentes', [it('home_faqtit', 'Título', '/#faq'), it('faqs', 'Preguntas y respuestas', '/#faq')], { num: 11, section: 'Página de inicio' }),
  g('Cierre y pie', [it('home_cierre', 'Cierre', '/'), it('home_pie', 'Pie de página', '/'), it('home_barra', 'Barra inferior en móvil', '/'), it('home_whatsapp', 'Botón de WhatsApp', '/')], { num: 12, section: 'Página de inicio' }),
  g('Medición', [it('eventosInicio', 'Eventos de la página de inicio', '/'), it('eventosDiagnostico', 'Eventos del diagnóstico', '/diagnostico')], { num: 13, section: 'Página de inicio' }),
  g('Otras páginas', [
    it('texto404', '404 · Textos', '/404.html'),
    it('textoPrivacidad', 'Privacidad · Textos', '/privacidad'),
    it('textoMasterclass', 'Masterclass · Textos', '/masterclass'),
    it('eventosMasterclass', 'Masterclass · Eventos', '/masterclass'),
    it('pg_diagnostico', 'Diagnóstico · Textos', '/diagnostico/'),
    it('pg_marketools', 'MarkeTools · Textos', '/marketools/'),
    it('pg_calculadora', 'Calculadora de precio · Textos', '/marketools/calculadora/'),
    it('pg_linkwpp', 'Link de WhatsApp · Textos', '/marketools/link-wpp/'),
  ], { section: 'Otras páginas', sectionHint: 'textos sueltos' }),
];

module.exports = { blocks: { ...homeBlocks, ...listBlocks, ...cursosBlocks, ...PAGES.mkt }, MENU };
