const { getSite } = require('./lib/config');
const { getFile } = require('./lib/github');
const { checkAuth } = require('./lib/auth');

// Extrae las tarjetas ya publicadas directamente de blog/index.html, así el
// listado del panel siempre refleja lo que el sitio muestra de verdad, sin
// mantener un índice aparte que se pueda desincronizar.
function parseCards(siteKey, html) {
  const cards = [];
  if (siteKey === 'mkt') {
    const re = /<a class="blog-card" href="\/blog\/([^/]+)\/">[\s\S]*?<img src="([^"]*)"[\s\S]*?<span class="tag">([\s\S]*?)<\/span>\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
    let m;
    while ((m = re.exec(html))) {
      cards.push({ slug: m[1], coverImageUrl: m[2], category: m[3].trim(), title: m[4].trim(), excerpt: m[5].trim() });
    }
  } else {
    const re = /<a class="post-card" href="\/blog\/([^/]+)\/">[\s\S]*?src="([^"]*)"[\s\S]*?<p class="post-eyebrow">([\s\S]*?)<\/p>\s*<p class="post-date">([\s\S]*?)<\/p>\s*<p class="post-title">([\s\S]*?)<\/p>\s*<p class="post-excerpt">([\s\S]*?)<\/p>/g;
    let m;
    while ((m = re.exec(html))) {
      cards.push({ slug: m[1], coverImageUrl: m[2], category: m[3].trim(), dateLabel: m[4].trim(), title: m[5].trim(), excerpt: m[6].trim() });
    }
  }
  return cards;
}

exports.handler = async (event) => {
  const auth = checkAuth(event);
  if (!auth.ok) return { statusCode: auth.statusCode, body: JSON.stringify({ error: auth.error }) };

  try {
    const siteKey = (event.queryStringParameters || {}).site;
    const site = getSite(siteKey);
    const file = await getFile(site, site.blogIndexPath);
    if (!file) return { statusCode: 404, body: JSON.stringify({ error: 'No se encontró blog/index.html' }) };
    const posts = parseCards(siteKey, file.content);
    return { statusCode: 200, body: JSON.stringify({ posts }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
