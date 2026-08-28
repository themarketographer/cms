const { getSite } = require('./lib/config');
const { getFile, commitFiles } = require('./lib/github');
const { upsertBlogCard, upsertSitemapEntry } = require('./lib/compose');
const { buildPostHtml, buildCardHtml, buildSitemapEntry } = require('./lib/templates');
const { checkAuth } = require('./lib/auth');

const REQUIRED = ['site', 'slug', 'title', 'metaDescription', 'category', 'date', 'readingMinutes', 'coverImageUrl', 'coverImageAlt', 'excerpt', 'bodyHtml'];
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const auth = checkAuth(event);
  if (!auth.ok) return { statusCode: auth.statusCode, body: JSON.stringify({ error: auth.error }) };

  try {
    const post = JSON.parse(event.body || '{}');
    for (const field of REQUIRED) {
      if (!post[field]) return { statusCode: 400, body: JSON.stringify({ error: `Falta el campo "${field}"` }) };
    }
    if (!SLUG_RE.test(post.slug)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'El slug solo puede tener minúsculas, números y guiones, sin espacios ni tildes' }) };
    }

    const site = getSite(post.site);

    const [blogIndex, sitemap] = await Promise.all([
      getFile(site, site.blogIndexPath),
      getFile(site, site.sitemapPath),
    ]);
    if (!blogIndex || !sitemap) {
      return { statusCode: 500, body: JSON.stringify({ error: 'No se pudo leer blog/index.html o sitemap.xml del repo' }) };
    }

    const postHtml = buildPostHtml(site, post);
    const cardHtml = buildCardHtml(site, post);
    const sitemapEntry = buildSitemapEntry(site, post);

    const newBlogIndex = upsertBlogCard(site, blogIndex.content, post.slug, cardHtml);
    const newSitemap = upsertSitemapEntry(site, sitemap.content, post.slug, sitemapEntry);

    const { commitSha, commitUrl } = await commitFiles(
      site,
      [
        { path: site.postPath(post.slug), content: postHtml },
        { path: site.blogIndexPath, content: newBlogIndex },
        { path: site.sitemapPath, content: newSitemap },
      ],
      `${post.isEdit ? 'Edita' : 'Publica'} post: ${post.title}`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        url: `https://${site.domain}/blog/${post.slug}/`,
        commitSha,
        commitUrl,
      }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
