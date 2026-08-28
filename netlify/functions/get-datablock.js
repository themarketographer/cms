const { getSite } = require('./lib/config');
const { getFile } = require('./lib/github');
const { readDataBlock } = require('./lib/datablocks');
const { checkAuth } = require('./lib/auth');

exports.handler = async (event) => {
  const auth = checkAuth(event);
  if (!auth.ok) return { statusCode: auth.statusCode, body: JSON.stringify({ error: auth.error }) };

  try {
    const { site: siteKey, block: blockKey } = event.queryStringParameters || {};
    const site = getSite(siteKey);
    const block = (site.dataBlocks || {})[blockKey];
    if (!block) return { statusCode: 404, body: JSON.stringify({ error: 'Bloque desconocido' }) };

    const file = await getFile(site, block.path);
    if (!file) return { statusCode: 404, body: JSON.stringify({ error: `No se encontró ${block.path}` }) };
    const items = readDataBlock(file.content, block);
    return { statusCode: 200, body: JSON.stringify({ label: block.label, fields: block.fields, items }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
