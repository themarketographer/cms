const { getSite } = require('./lib/config');
const { getFile, commitFilesWithDeletes } = require('./lib/github');
const { removeCard, removeSitemapEntry } = require('./lib/compose');
const { checkAuth } = require('./lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const auth = checkAuth(event);
  if (!auth.ok) return { statusCode: auth.statusCode, body: JSON.stringify({ error: auth.error }) };

  try {
    const { site: siteKey, slug } = JSON.parse(event.body || '{}');
    if (!slug) return { statusCode: 400, body: JSON.stringify({ error: 'Falta slug' }) };
    const site = getSite(siteKey);

    const [blogIndex, sitemap] = await Promise.all([
      getFile(site, site.blogIndexPath),
      getFile(site, site.sitemapPath),
    ]);
    if (!blogIndex || !sitemap) {
      return { statusCode: 500, body: JSON.stringify({ error: 'No se pudo leer blog/index.html o sitemap.xml del repo' }) };
    }

    const newBlogIndex = removeCard(site, blogIndex.content, slug);
    const newSitemap = removeSitemapEntry(site, sitemap.content, slug);

    const { commitSha, commitUrl } = await commitFilesWithDeletes(
      site,
      [
        { path: site.blogIndexPath, content: newBlogIndex },
        { path: site.sitemapPath, content: newSitemap },
      ],
      [site.postPath(slug)],
      `Despublica post: ${slug}`
    );

    return { statusCode: 200, body: JSON.stringify({ ok: true, commitSha, commitUrl }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
