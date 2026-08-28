const { getSite } = require('./lib/config');
const { getFile } = require('./lib/github');
const { checkAuth } = require('./lib/auth');

function between(html, startRe, endRe) {
  const startMatch = startRe.exec(html);
  if (!startMatch) return '';
  const from = startMatch.index + startMatch[0].length;
  endRe.lastIndex = from;
  const endMatch = endRe.exec(html);
  const to = endMatch ? endMatch.index : html.length;
  return html.slice(from, to).trim();
}

function extractMeta(html, name) {
  const re = new RegExp(`<meta\\s+(?:property|name)="${name}"\\s+content="([^"]*)"`, 'i');
  const m = re.exec(html);
  return m ? m[1] : '';
}

function parsePost(siteKey, html) {
  const title = (extractMeta(html, 'og:title') || (/<title>([^<]*)<\/title>/.exec(html) || [, ''])[1]).split(' | ')[0].trim();
  const metaDescription = extractMeta(html, 'description');
  const coverImageUrl = extractMeta(html, 'og:image');
  const date = extractMeta(html, 'article:published_time');

  if (siteKey === 'mkt') {
    const category = (/<span class="eyebrow eyebrow-red">([\s\S]*?)<\/span>/.exec(html) || [, ''])[1].trim();
    const readingMinutes = (/(\d+)\s*min de lectura/.exec(html) || [, ''])[1];
    const coverImageAlt = (/<img class="article-cover"[^>]*alt="([^"]*)"/.exec(html) || [, ''])[1];
    const bodyHtml = between(
      html,
      /<div class="article-body">\s*<div class="wrap-article">/,
      /<\/div>\s*<\/div>\s*<div class="wrap-article">\s*<div class="article-cta">/g
    );
    return { title, metaDescription, coverImageUrl, coverImageAlt, date, category, readingMinutes, bodyHtml };
  } else {
    const category = (/<p class="eyebrow">([\s\S]*?)<\/p>/.exec(html) || [, ''])[1].trim();
    const readingMinutes = (/(\d+)\s*min de lectura/.exec(html) || [, ''])[1];
    const coverImageAlt = (/<img class="hero-img"[^>]*alt="([^"]*)"/.exec(html) || [, ''])[1];
    const bodyHtml = between(html, /<article>\s*/, /\s*<\/article>/g);
    return { title, metaDescription, coverImageUrl, coverImageAlt, date, category, readingMinutes, bodyHtml };
  }
}

exports.handler = async (event) => {
  const auth = checkAuth(event);
  if (!auth.ok) return { statusCode: auth.statusCode, body: JSON.stringify({ error: auth.error }) };

  try {
    const { site: siteKey, slug } = event.queryStringParameters || {};
    const site = getSite(siteKey);
    if (!slug) return { statusCode: 400, body: JSON.stringify({ error: 'Falta slug' }) };
    const file = await getFile(site, site.postPath(slug));
    if (!file) return { statusCode: 404, body: JSON.stringify({ error: 'Post no encontrado' }) };
    const post = parsePost(siteKey, file.content);
    return { statusCode: 200, body: JSON.stringify({ slug, ...post }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
