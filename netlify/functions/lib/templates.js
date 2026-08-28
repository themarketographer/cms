// Arma el HTML de cada pieza (post completo, tarjeta en /blog/, entrada de
// sitemap) reproduciendo EXACTAMENTE la estructura que ya usan los sitios.
// El cuerpo del artículo (post.bodyHtml) llega ya armado en HTML desde el
// panel: ahí es donde varía cada post (con o sin FAQ, con o sin callout,
// con blockquote o sin él), así que no se fuerza un molde rígido para eso.
// Lo que este archivo automatiza es todo lo que SIEMPRE es igual: el head,
// los pixeles, el nav, el footer, la tarjeta del listado y el sitemap.

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function fechaLarga(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

function esc(str) {
  return String(str || '').replace(/"/g, '&quot;');
}

// ───────────────────────────── Marketographers ─────────────────────────────

function buildPostHtml_mkt(site, post) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${post.title} | The Marketographers</title>
<meta name="description" content="${esc(post.metaDescription)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://${site.domain}/blog/${post.slug}/">

<meta property="og:type" content="article">
<meta property="og:site_name" content="The Marketographers">
<meta property="og:title" content="${esc(post.title)}">
<meta property="og:description" content="${esc(post.metaDescription)}">
<meta property="og:image" content="${post.coverImageUrl}">
<meta property="og:url" content="https://${site.domain}/blog/${post.slug}/">
<meta property="og:locale" content="es_LA">
<meta property="article:author" content="${site.author}">
<meta property="article:published_time" content="${post.date}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(post.title)}">
<meta name="twitter:description" content="${esc(post.metaDescription)}">
<meta name="twitter:image" content="${post.coverImageUrl}">

<link rel="icon" type="image/png" href="${site.faviconUrl}">
<link rel="apple-touch-icon" href="${site.faviconUrl}">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "${esc(post.title)}",
  "description": "${esc(post.metaDescription)}",
  "image": "${post.coverImageUrl}",
  "author": { "@type": "Person", "name": "${site.author}" },
  "publisher": {
    "@type": "EducationalOrganization",
    "name": "The Marketographers",
    "logo": { "@type": "ImageObject", "url": "${site.logoWhiteUrl}" }
  },
  "datePublished": "${post.date}",
  "dateModified": "${post.date}",
  "mainEntityOfPage": "https://${site.domain}/blog/${post.slug}/"
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/global.css">
<link rel="stylesheet" href="/blog/assets/blog-extra.css">
</head>
<body>

<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('set', 'autoConfig', false, '${site.pixelId}');
fbq('init', '${site.pixelId}');

function makeEventId(prefix){
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
}
function getCookie(name){
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
function sendCapiEvent(eventName, eventId, customData){
  try{
    fetch('/.netlify/functions/capi', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        custom_data: customData || undefined,
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc')
      })
    }).catch(()=>{});
  }catch(e){}
}
function trackBoth(eventName, params){
  const id = makeEventId(eventName.toLowerCase());
  fbq('track', eventName, params || {}, {eventID:id});
  sendCapiEvent(eventName, id, params);
}

trackBoth('PageView');
trackBoth('ViewContent', {content_name:'${esc(post.title)}', content_type:'article'});
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${site.pixelId}&ev=PageView&noscript=1"/></noscript>

<header>
  <div class="nav wrap">
    <a class="logo" href="/"><img src="${site.logoUrl}" alt="The Marketographers"></a>
    <div class="nav-actions">
      <a class="btn btn-whatsapp" href="${site.whatsappHref}" target="_blank" rel="noopener">WhatsApp</a>
      <a class="btn btn-gold" href="/#planes">Únete</a>
    </div>
  </div>
</header>

<article>
  <div class="article-hero">
    <div class="wrap">
      <span class="eyebrow eyebrow-red">${esc(post.category)}</span>
      <h1>${post.title}</h1>
      <div class="article-meta">
        <span>${site.author}</span>
        <span>${fechaLarga(post.date)}</span>
        <span>${post.readingMinutes} min de lectura</span>
      </div>
    </div>
    <div class="wrap">
      <img class="article-cover" src="${post.coverImageUrl}" alt="${esc(post.coverImageAlt)}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;">
    </div>
  </div>

  <div class="article-body">
    <div class="wrap-article">
${post.bodyHtml}
    </div>
  </div>

  <div class="wrap-article">
    <div class="article-cta">
      <h3>${esc(post.ctaTitle || '¿Quieres dejar de competir por precio?')}</h3>
      <p>${esc(post.ctaText || 'Entra a la comunidad de fotógrafos que ya lo están resolviendo.')}</p>
      <a class="btn btn-gold" href="${site.whatsappHref}" target="_blank" rel="noopener">Escríbeme por WhatsApp →</a>
    </div>
  </div>
</article>

<footer>
  <div class="wrap">
    <img src="${site.logoWhiteUrl}" alt="The Marketographers" loading="lazy">
    <p>© ${post.date.slice(0, 4)} The Marketographers. Todos los derechos reservados.</p>
  </div>
</footer>

<script>
  document.addEventListener('click', (e)=>{
    const link = e.target.closest('a');
    if(!link || !link.href) return;
    if(link.href.includes('chat.whatsapp.com')){
      trackBoth('Lead');
    } else if(link.href.includes('api.whatsapp.com') || link.href.includes('wa.me')){
      trackBoth('Contact');
    }
    if(link.href.includes('nas.com') || link.href.includes('nas.io')){
      trackBoth('ClickCheckoutLanding');
    }
  });
</script>

</body>
</html>
`;
}

function buildCardHtml_mkt(post) {
  return `      <a class="blog-card" href="/blog/${post.slug}/">
        <img src="${post.coverImageUrl}" alt="${esc(post.coverImageAlt)}" loading="lazy" style="aspect-ratio:16/9;object-fit:cover;">
        <div class="blog-card-body">
          <span class="tag">${esc(post.category)}</span>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <span class="meta">${post.author || 'Pablo Villarroel'} · ${post.readingMinutes} min de lectura</span>
          <span class="read-more">Leer artículo</span>
        </div>
      </a>
`;
}

// ───────────────────────────── Estudio Graphica ─────────────────────────────

function buildPostHtml_eg(site, post) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${post.title} | Estudio Graphica</title>
<meta name="description" content="${esc(post.metaDescription)}" />
<meta name="robots" content="index,follow" />
<meta name="theme-color" content="#181818" />
<link rel="canonical" href="https://${site.domain}/blog/${post.slug}/" />

<meta property="og:type" content="article" />
<meta property="og:title" content="${esc(post.title)}" />
<meta property="og:description" content="${esc(post.metaDescription)}" />
<meta property="og:image" content="${post.coverImageUrl}" />
<meta property="og:url" content="https://${site.domain}/blog/${post.slug}/" />
<meta property="article:published_time" content="${post.date}" />
<meta property="article:author" content="${site.author}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(post.title)}" />
<meta name="twitter:image" content="${post.coverImageUrl}" />

<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

<!-- ═══════════ PIXEL + GA4 ═══════════ -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', '${site.ga4Id}');
</script>
<script>
  !(function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('set', 'autoConfig', false, '${site.pixelId}');
  fbq('init', '${site.pixelId}');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=${site.pixelId}&ev=PageView&noscript=1"/></noscript>
<script src="/assets/js/tracking.js"></script>
<!-- ═══════════════════════════════════════════════════ -->

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Playfair+Display:ital,wght@1,700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/blog/assets/style.css" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${esc(post.title)}",
  "description": "${esc(post.metaDescription)}",
  "image": "${post.coverImageUrl}",
  "author": { "@type": "Person", "name": "${site.author}", "url": "https://${site.domain}/#sobre" },
  "publisher": {
    "@type": "Organization",
    "name": "Estudio Graphica",
    "logo": { "@type": "ImageObject", "url": "${site.publisherLogoUrl}" }
  },
  "datePublished": "${post.date}",
  "dateModified": "${post.date}",
  "mainEntityOfPage": "https://${site.domain}/blog/${post.slug}/"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://${site.domain}/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://${site.domain}/blog" },
    { "@type": "ListItem", "position": 3, "name": "${esc(post.title)}", "item": "https://${site.domain}/blog/${post.slug}/" }
  ]
}
</script>
</head>
<body>

<nav>
  <div class="inner">
    <a href="/"><img src="${site.logoUrl}" alt="Estudio Graphica" /></a>
    <a class="back" href="/blog">← Blog</a>
  </div>
</nav>

<p class="breadcrumb"><a href="/">Inicio</a> · <a href="/blog">Blog</a> · ${post.title}</p>

<div class="post-hero">
  <div class="post-hero-text">
    <p class="eyebrow">${esc(post.category)}</p>
    <h1>${post.title}</h1>
    <p class="meta">
      <span>Por ${site.author}</span><span>·</span><span>${fechaLarga(post.date)}</span><span>·</span><span>${post.readingMinutes} min de lectura</span>
    </p>
  </div>
  <div class="post-hero-img-wrap">
    <img class="hero-img" src="${post.coverImageUrl}" alt="${esc(post.coverImageAlt)}" />
  </div>
</div>

<article>
${post.bodyHtml}
</article>

<footer>
  <p>© ${post.date.slice(0, 4)} Estudio Graphica · Cochabamba, Bolivia</p>
  <p style="margin-top: 8px;"><a href="/blog">← Volver al blog</a> · <a href="/">Inicio</a> · <a href="/privacidad">Privacidad</a></p>
</footer>

<script>
  if (window.EG) {
    window.EG.trackEvent('ViewContent', { content_name: 'Blog - ${esc(post.title)}', content_type: 'blog_post' });
    window.EG.trackCustomEvent('ver_blog', { content_name: 'Blog', post_slug: '${post.slug}', origen: window.EG.getOrigen() });
  }
</script>

</body>
</html>
`;
}

function buildCardHtml_eg(post) {
  return `  <a class="post-card" href="/blog/${post.slug}/">
    <img class="post-img" src="${post.coverImageUrl}" alt="${esc(post.coverImageAlt)}" />
    <div class="post-body">
      <p class="post-eyebrow">${esc(post.category)}</p>
      <p class="post-date">${fechaLarga(post.date)}</p>
      <p class="post-title">${post.title}</p>
      <p class="post-excerpt">${post.excerpt}</p>
    </div>
  </a>
`;
}

// ───────────────────────────── Comunes ─────────────────────────────

function buildSitemapEntry(site, post) {
  return `  <url>
    <loc>https://${site.domain}/blog/${post.slug}/</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

function buildPostHtml(site, post) {
  return site.key === 'mkt' ? buildPostHtml_mkt(site, post) : buildPostHtml_eg(site, post);
}

function buildCardHtml(site, post) {
  return site.key === 'mkt' ? buildCardHtml_mkt(post) : buildCardHtml_eg(post);
}

module.exports = { buildPostHtml, buildCardHtml, buildSitemapEntry, fechaLarga };
