// Inserta o reemplaza la tarjeta de un post dentro de blog/index.html, y la
// entrada correspondiente en sitemap.xml, conservando todo lo demás del
// archivo intacto. Si el slug ya tenía tarjeta/entrada (edición de un post
// existente) se quita la vieja antes de insertar la nueva, así no queda
// duplicada.

function cardBlockRegex(siteKey, slug) {
  const cardClass = siteKey === 'mkt' ? 'blog-card' : 'post-card';
  // Captura desde el <a class="..." href="/blog/SLUG/"> hasta su </a> de cierre,
  // incluyendo los espacios en blanco antes, para no dejar una línea vacía.
  return new RegExp(`\\s*<a class="${cardClass}" href="/blog/${slug}/">[\\s\\S]*?</a>\\s*`, 'g');
}

function upsertBlogCard(site, blogIndexHtml, slug, cardHtml) {
  let html = blogIndexHtml.replace(cardBlockRegex(site.key, slug), '\n');
  const anchorIndex = html.indexOf(site.cardAnchor);
  if (anchorIndex === -1) {
    throw new Error(`No se encontró el marcador "${site.cardAnchor}" en blog/index.html. Revisar si cambió la estructura del archivo.`);
  }
  const insertAt = anchorIndex + site.cardAnchor.length;
  return html.slice(0, insertAt) + '\n\n' + cardHtml + html.slice(insertAt);
}

function urlBlockRegex(domain, slug) {
  return new RegExp(`\\s*<url>\\s*<loc>https://${domain}/blog/${slug}/</loc>[\\s\\S]*?</url>\\s*`, 'g');
}

function upsertSitemapEntry(site, sitemapXml, slug, entryXml) {
  let xml = sitemapXml.replace(urlBlockRegex(site.domain, slug), '\n');
  const anchor = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const anchorIndex = xml.indexOf(anchor);
  if (anchorIndex === -1) {
    throw new Error('No se encontró la etiqueta <urlset> en sitemap.xml. Revisar si cambió la estructura del archivo.');
  }
  const insertAt = anchorIndex + anchor.length;
  return xml.slice(0, insertAt) + '\n' + entryXml + xml.slice(insertAt);
}

// Quita la tarjeta y la entrada de sitemap de un slug, sin agregar nada
// nuevo. Se usa al despublicar un post.
function removeCard(site, blogIndexHtml, slug) {
  return blogIndexHtml.replace(cardBlockRegex(site.key, slug), '\n');
}
function removeSitemapEntry(site, sitemapXml, slug) {
  return sitemapXml.replace(urlBlockRegex(site.domain, slug), '\n');
}

module.exports = { upsertBlogCard, upsertSitemapEntry, removeCard, removeSitemapEntry };
