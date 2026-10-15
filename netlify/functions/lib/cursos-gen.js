// Generador de las páginas de cursos de marketographers.com.
//
// Recibe los datos que se editan en el panel (const cursos = [...] y
// const cursosAjustes = [...] dentro de cursos/cursos-data.js) y devuelve los
// archivos HTML ya armados: el hub /cursos/ y una landing por curso publicado.
// Es el mismo marcado que tenían las páginas hechas a mano, así que el diseño
// no cambia: solo cambia quién lo escribe.

const E = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

const BANNER = 'https://res.cloudinary.com/dplhu2z6j/image/upload/q_auto,f_auto/v1785200397/Banner_z6b496.png';
const NOFLASH = '<script>try{if(localStorage.getItem("mk-theme")==="light")document.documentElement.setAttribute("data-theme","light")}catch(e){}</script>';
const RINGS = '<div class="ring" style="width:520px;height:520px;right:-170px;top:-130px"></div><div class="ring" style="width:320px;height:320px;left:-120px;bottom:-150px"></div>';
const X_ICON = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';
const OK_ICON = '<svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10"/></svg>';

// ── Lectura de los campos de texto del panel ─────────────────────────────
const lines = (t) => String(t == null ? '' : t).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

// "# Módulo 1 · Título" abre un módulo; las líneas siguientes son sus clases.
function parseModulos(t) {
  const out = [];
  lines(t).forEach((l) => {
    if (l.startsWith('#')) out.push({ titulo: l.replace(/^#+\s*/, ''), lecciones: [] });
    else {
      if (!out.length) out.push({ titulo: 'Módulo 1', lecciones: [] });
      out[out.length - 1].lecciones.push(l);
    }
  });
  return out;
}

// Pregunta en una línea, respuesta en la siguiente, línea en blanco entre pares.
function parseFaq(t) {
  const blocks = String(t == null ? '' : t).split(/\r?\n\s*\r?\n/).map((b) => lines(b)).filter((b) => b.length >= 2);
  return blocks.map((b) => [b[0], b.slice(1).join(' ')]);
}

// "Título | Texto | Dónde se resuelve"
function parseProblemas(t) {
  return lines(t).map((l) => {
    const p = l.split('|').map((s) => s.trim());
    return { t: p[0] || '', p: p[1] || '', fix: p[2] || '' };
  });
}

function nasUrl(c, aj) {
  if (c.nasId && aj.checkoutPlantilla) return aj.checkoutPlantilla.replace('{id}', c.nasId);
  return (aj.nasBase || 'https://nas.com/marketographers/challenges/') + (c.nasSlug || '');
}

const precioTxt = (c) => '$' + String(Number(c.precio));
const esPreventa = (c) => c.estado === 'preventa';
const publicado = (c) => String(c.publicado || 'si').toLowerCase() !== 'no';

function badge(c, aj) {
  if (esPreventa(c)) return `<span class="pill pill-pre">Preventa · entrega ${E(aj.fechaPreventa)}</span>`;
  return '<span class="pill pill-ok">Disponible ya</span>';
}

function priceBlock(c, cls) {
  const k = cls ? ' ' + cls : '';
  if (esPreventa(c)) {
    return `<div class="price${k}"><span class="old">$${Number(c.precioRegular)}</span><span class="now">${E(precioTxt(c))}</span><span class="cur">USD · pago único</span></div>`;
  }
  return `<div class="price${k}"><span class="now">${E(precioTxt(c))}</span><span class="cur">USD · pago único</span></div>`;
}

function coverHtml(c, big) {
  if (c.portada) {
    return `<div class="cv cv-img${big ? ' cv-big' : ''}"><img src="${E(c.portada)}" alt="${E(c.nombre)}" loading="lazy"></div>`;
  }
  if (!big) {
    return `<div class="cv cv-type cv-card cv-${E(c.categoria)}"><span class="cv-tag">Nuevo</span><span class="cv-glifo">${E(c.glifo || '')}</span></div>`;
  }
  return `<div class="cv cv-type cv-${E(c.categoria)} cv-big">\n  <span class="cv-tag">Nuevo</span>\n  <span class="cv-title">${E(c.nombre)}</span>\n  <span class="cv-sub">${E(c.corto)}</span>\n</div>`;
}

function head(title, desc, canonical, ogImg, pageCfg) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${E(title)}</title>
<meta name="description" content="${E(desc)}">
<meta property="og:title" content="${E(title)}">
<meta property="og:description" content="${E(desc)}">
<meta property="og:image" content="${E(ogImg)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${E(canonical)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${E(canonical)}">
<link rel="icon" type="image/png" href="https://res.cloudinary.com/dplhu2z6j/image/upload/q_auto,f_auto,w_64,h_64/v1755314905/Marketographers_Negro_S_F_tgh9z2.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/global.css">
<link rel="stylesheet" href="/cursos/assets/cursos.css">

<!-- GA4: misma propiedad que todo el sitio -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GQY8VYBD5T"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-GQY8VYBD5T');
</script>

<!-- Configuración de tracking de ESTA página. La lógica vive en
     /cursos/assets/cursos-tracking.js (Pixel + CAPI con el mismo event_id,
     autoConfig apagado, igual que el resto del sitio). -->
<script>window.MKT_PAGE = ${JSON.stringify(pageCfg)};</script>
<script src="/cursos/assets/cursos-tracking.js"></script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=467504537642522&ev=PageView&noscript=1" alt=""/></noscript>
${NOFLASH}<link rel="stylesheet" href="/assets/fx.css"></head>
<body>
<div class="bar" id="bar"></div><header>
  <div class="nav wrap">
    <a class="logo" href="/" aria-label="The Marketographers">the marketo<i>g</i>raphers</a>
    <div class="nav-actions">
      <a class="btn btn-dark" href="/cursos/">Cursos</a>
    </div>
  </div>
</header>
`;
}

const FOOTER = (aj) => `
<footer>
  <div class="wrap">
    <span class="mark">the marketo<i>g</i>raphers</span>
    <p>${aj.pie || '© 2026 The Marketographers · <a href="/privacidad/">Privacidad</a>'}</p>
  </div>
</footer>
`;

const fxScript = (cfg) => `<script src="/assets/fx.js"></script><script>mkFx(${JSON.stringify(cfg)})</script></body>\n</html>\n`;

function problemaSection(c, aj) {
  const probs = parseProblemas(c.problemas);
  const antes = lines(c.antes);
  const despues = lines(c.despues);
  if (!c.problemaFrase && !probs.length) return '';
  const cards = probs.map((p, i) => `<div class="pc2"><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${E(p.t)}</h3><p>${E(p.p)}</p>${p.fix ? `<a class="fix" href="#programa">${E(p.fix)}</a>` : ''}</div>`).join('');
  const vs = (antes.length || despues.length)
    ? `<div class="vs"><div class="before"><h3>${E(aj.antesTitulo)}</h3><ul>${antes.map((x) => `<li>${X_ICON}${E(x)}</li>`).join('')}</ul></div><div class="after"><h3>${E(aj.despuesTitulo)}</h3><ul>${despues.map((x) => `<li>${OK_ICON}${E(x)}</li>`).join('')}</ul></div></div>`
    : '';
  return `<section class="prob"><div class="wrap"><div class="top"><p class="eyebrow">${E(aj.problemaEyebrow)}</p><p class="wl" data-wl="${E(c.problemaFrase)}">${E(c.problemaFrase)}</p></div>${probs.length ? `<div class="pgrid2">${cards}</div>` : ''}${vs}</div></section>`;
}

function coursePage(c, aj) {
  const slug = c.slug;
  const url = `https://marketographers.com/cursos/${slug}/`;
  const mods = parseModulos(c.modulos);
  const totalLecciones = mods.reduce((n, m) => n + m.lecciones.length, 0);
  const cfg = { tipo: 'curso', curso: slug, estado: c.estado, precio: Number(c.precio), moneda: 'USD', nombre: c.nombre };
  const og = c.portada ? (c.portada.startsWith('/') ? 'https://marketographers.com' + c.portada : c.portada) : BANNER;
  const title = `${c.nombre}: ${c.corto} | The Marketographers`;
  const compra = esPreventa(c) ? aj.botonPreventa : aj.botonCompra;
  const buy = `<a class="btn btn-gold btn-buy" href="${E(nasUrl(c, aj))}" target="_blank" rel="noopener" data-checkout="curso">${E(compra)} · ${E(precioTxt(c))}</a>`;
  const h = [head(title, c.sub, url, og, cfg)];

  h.push(`
<section class="c-hero">${RINGS}
  <div class="wrap c-hero-grid">
    <div class="fade-in">
      <p class="eyebrow">${E(c.eyebrow)}</p>
      <h1>${c.h1 || E(c.nombre)}</h1>
      <p class="lead">${E(c.sub)}</p>
      <div class="hero-cta">${buy}<a class="btn btn-outline" href="#programa">${E(aj.botonPrograma)}</a></div>
      <div class="facts">
        ${badge(c, aj)}
        <span class="pill">${mods.length} módulos · ${totalLecciones} clases</span>
        <span class="pill">Acceso de por vida</span>
      </div>
    </div>
    <div class="fade-in d2">${coverHtml(c, true)}</div>
  </div>
</section>${problemaSection(c, aj)}`);

  const paras = lines(c.historia).map((p) => `<p>${E(p)}</p>`).join('\n');
  h.push(`
<section class="bg-alt">
  <div class="wrap-article story">
${paras}
  </div>
</section>`);

  const pq = lines(c.paraQuien).map((x) => `<div class="card-glass pq"><span class="chk">✓</span><p>${E(x)}</p></div>`).join('\n');
  h.push(`
<section>
  <div class="wrap">
    <p class="eyebrow center">${E(aj.paraQuienEyebrow)}</p>
    <h2 class="center">${E(aj.paraQuienTitulo)}</h2>
    <div class="grid-2">${pq}</div>
  </div>
</section>`);

  const modsHtml = mods.map((m, i) => `<details class="mod card-glass"${i === 0 ? ' open' : ''}>
  <summary><span>${E(m.titulo)}</span><span class="n">${m.lecciones.length} clases</span></summary>
  <ol>${m.lecciones.map((l) => `<li>${E(l)}</li>`).join('')}</ol>
</details>`).join('');
  const notaPre = esPreventa(c)
    ? `<p class="note">${E(aj.notaPreventa).replace('{fecha}', E(aj.fechaPreventa))}</p>` : '';
  h.push(`
<section class="bg-alt" id="programa">
  <div class="wrap-article">
    <p class="eyebrow center">${E(aj.programaEyebrow)}</p>
    <h2 class="center">${E(aj.programaTitulo)}</h2>
    <div class="mods">${modsHtml}</div>
    ${notaPre}
  </div>
</section>`);

  const res = lines(c.resultados).map((x) => `<li>${E(x)}</li>`).join('');
  h.push(`
<section>
  <div class="wrap">
    <p class="eyebrow center">${E(aj.resultadosEyebrow)}</p>
    <h2 class="center">${E(aj.resultadosTitulo)}</h2>
    <ul class="logros card-glass">${res}</ul>
  </div>
</section>`);

  h.push(`
<section class="bg-alt">
  <div class="wrap about">
    <img src="${E(aj.profeFoto)}" alt="${E(aj.profeNombre)}" loading="lazy">
    <div>
      <p class="eyebrow">${E(aj.profeEyebrow)}</p>
      <h2>${E(aj.profeNombre)}</h2>
      <p>${E(aj.profeTexto)}</p>
    </div>
  </div>
</section>`);

  const incluye = [`${totalLecciones} clases en video`, 'Acceso de por vida', 'Feed del curso para dejar tus preguntas'];
  if (esPreventa(c)) incluye.push(`Precio de preventa: ahorras $${Number(c.precioRegular) - Number(c.precio)}`);
  const garantia = esPreventa(c) ? E(aj.garantiaPreventa).replace('{fecha}', E(aj.fechaPreventa)) : E(aj.garantiaDisponible);
  h.push(`
<section id="precio">
  <div class="wrap">
    <div class="price-card card-glass">
      ${badge(c, aj)}
      <h2>${E(c.nombre)}</h2>
      ${priceBlock(c, '')}
      <ul class="inc">${incluye.map((x) => `<li>${E(x)}</li>`).join('')}</ul>
      ${buy}
      <p class="small">${garantia}</p>
      <div class="upsell">
        <p>${aj.upsellTexto}</p>
        <a class="btn btn-dark" href="${E(aj.motionUrl)}" target="_blank" rel="noopener" data-checkout="motion">${E(aj.upsellBoton)}</a>
      </div>
    </div>
  </div>
</section>`);

  const faqs = parseFaq(c.faq).concat(parseFaq(aj.faqComunes));
  if (esPreventa(c)) faqs.push([aj.faqPreventaQ, String(aj.faqPreventaA).replace('{fecha}', aj.fechaPreventa).replace('{regular}', '$' + Number(c.precioRegular))]);
  h.push(`
<section class="bg-alt">
  <div class="wrap-article">
    <p class="eyebrow center">${E(aj.faqEyebrow)}</p>
    <h2 class="center">${E(aj.faqTitulo)}</h2>
    ${faqs.map(([q, a]) => `<details class="faq"><summary>${E(q)}</summary><p>${E(a)}</p></details>`).join('')}
  </div>
</section>`);

  h.push(`
<section class="final">
  <div class="wrap center">
    <h2>${E(aj.finalTitulo)} ${E(precioTxt(c))}</h2>
    <p class="lead">${E(aj.finalTexto)}</p>
    ${buy}
    <p class="small"><a href="/cursos/">${E(aj.finalVerTodos)}</a></p>
  </div>
</section>
<div class="sticky-buy"><span>${E(c.nombre)} · <strong>${E(precioTxt(c))}</strong></span>${buy}</div>`);

  const ld = {
    '@context': 'https://schema.org', '@type': 'Course', name: c.nombre, description: c.sub,
    provider: { '@type': 'Organization', name: 'The Marketographers', sameAs: 'https://marketographers.com' },
    offers: { '@type': 'Offer', price: String(Number(c.precio)), priceCurrency: 'USD', url, category: 'Paid' },
    inLanguage: 'es',
  };
  h.push(`<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
  h.push(FOOTER(aj));
  const fx = {
    reveal: ['.prob .eyebrow', '.prob .wl', '.pc2', '.vs > div', '.c-hero h1', '.c-hero .eyebrow', '.c-hero .lead', '.hero-cta', '.facts', '.c-hero .cv', '.story p', 'section .eyebrow', 'section h2', '.pq', '.res', '.mod', '.logros', '.about > *', '.price-card', '.faq', '.final .wrap > *'],
    tilt: ['.pq', '.res', '.price-card', '.pc2'],
  };
  // el cierre </body></html> lo pone fxScript, FOOTER ya no lo trae
  return h.join('') + fxScript(fx);
}

function hubPage(cursos, aj) {
  const pub = cursos.filter(publicado);
  const cats = [1, 2, 3].map((n) => ({ id: aj['cat' + n + 'Id'], titulo: aj['cat' + n + 'Titulo'], texto: aj['cat' + n + 'Texto'] }));
  const activas = cats.filter((k) => pub.some((c) => c.categoria === k.id));
  const palabras = String(aj.hubTicker || '').split(',').map((s) => s.trim()).filter(Boolean);
  const tk = palabras.concat(palabras).map((p) => `<span>${E(p)}</span><i></i>`).join('');
  const desc = aj.hubDescripcion || 'Cursos online de fotografía, marketing y negocio. Pago único y acceso de por vida.';
  const h = [head(aj.hubTitle, desc, 'https://marketographers.com/cursos/', BANNER, { tipo: 'hub' })];
  h.push(`
<section class="c-hero hub-hero">${RINGS}
  <div class="wrap center fade-in">
    <p class="eyebrow">${E(aj.hubEyebrow)}</p>
    <h1>${aj.hubH1}</h1>
    <p class="lead">${E(aj.hubLead)}</p>
    <div class="cat-nav">${activas.length > 1 ? activas.map((k) => `<a class="btn btn-dark" href="#${E(k.id)}">${E(k.titulo)}</a>`).join('') : ''}</div>
  </div>
</section>${tk ? `<div class="ticker" aria-hidden="true"><div class="tk">${tk}</div></div>` : ''}${aj.hubFrase ? `<section class="prob"><div class="wrap"><p class="wl" data-wl="${E(aj.hubFrase)}">${E(aj.hubFrase)}</p></div></section>` : ''}`);
  cats.forEach((k) => {
    const lista = pub.filter((c) => c.categoria === k.id);
    if (!lista.length) return;
    const cards = lista.map((c) => `<a class="ccard card-glass" href="/cursos/${E(c.slug)}/" data-curso="${E(c.slug)}">
  ${coverHtml(c, false)}
  <div class="ccard-body">
    ${badge(c, aj)}
    <h3>${E(c.nombre)}</h3>
    <p>${E(c.corto)}</p>
    <div class="ccard-foot">${priceBlock(c, 'sm')}<span class="go">${E(aj.hubVerCurso)}</span></div>
  </div>
</a>`).join('');
    h.push(`
<section id="${E(k.id)}" class="cat">
  <div class="wrap">
    <h2>${E(k.titulo)}</h2>
    <p class="cat-sub">${E(k.texto)}</p>
    <div class="cgrid">${cards}</div>
  </div>
</section>`);
  });
  h.push(`
<section class="bg-alt">
  <div class="wrap">
    <div class="price-card card-glass center">
      <p class="eyebrow">${E(aj.motionEyebrow)}</p>
      <h2>${E(aj.motionTitulo)}</h2>
      <p>${E(aj.motionTexto)}</p>
      <a class="btn btn-gold" href="${E(aj.motionUrl)}" target="_blank" rel="noopener" data-checkout="motion">${E(aj.motionBoton)}</a>
    </div>
  </div>
</section>
<section>
  <div class="wrap center">
    <p class="eyebrow">${E(aj.restEyebrow)}</p>
    <h2>${E(aj.restTitulo)}</h2>
    <p class="lead">${E(aj.restTexto)}</p>
    <a class="btn btn-outline" href="${E(aj.restUrl)}">${E(aj.restBoton)}</a>
  </div>
</section>`);
  h.push(FOOTER(aj));
  return h.join('') + fxScript({ reveal: ['.hub-hero .wrap > *', '.cat h2', '.cat-sub', '.ccard', '.final .wrap > *'], tilt: ['.ccard'] });
}

// Devuelve todos los archivos que dependen de los cursos.
function buildCursosFiles(cursos, aj) {
  const files = [{ path: 'cursos/index.html', content: hubPage(cursos, aj) }];
  cursos.filter(publicado).forEach((c) => {
    files.push({ path: `cursos/${c.slug}/index.html`, content: coursePage(c, aj) });
  });
  return files;
}

const validSlug = (s) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(s || ''));

module.exports = { buildCursosFiles, coursePage, hubPage, parseModulos, parseFaq, parseProblemas, lines, publicado, validSlug };
