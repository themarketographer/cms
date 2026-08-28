const { getSite } = require('./lib/config');
const { getFile, commitFiles } = require('./lib/github');
const { writeDataBlock } = require('./lib/datablocks');
const { checkAuth } = require('./lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const auth = checkAuth(event);
  if (!auth.ok) return { statusCode: auth.statusCode, body: JSON.stringify({ error: auth.error }) };

  try {
    const { site: siteKey, block: blockKey, items } = JSON.parse(event.body || '{}');
    const site = getSite(siteKey);
    const block = (site.dataBlocks || {})[blockKey];
    if (!block) return { statusCode: 404, body: JSON.stringify({ error: 'Bloque desconocido' }) };
    if (!Array.isArray(items)) return { statusCode: 400, body: JSON.stringify({ error: 'Falta "items" (debe ser un array)' }) };

    const file = await getFile(site, block.path);
    if (!file) return { statusCode: 500, body: JSON.stringify({ error: `No se pudo leer ${block.path}` }) };
    const newContent = writeDataBlock(file.content, block, items);

    const { commitSha, commitUrl } = await commitFiles(
      site,
      [{ path: block.path, content: newContent }],
      `Actualiza ${block.label.toLowerCase()}`
    );
    return { statusCode: 200, body: JSON.stringify({ ok: true, commitSha, commitUrl }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
