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
    // CSS real de la página (pedido #3: vista previa fiel). Se extrae del
    // mismo archivo que ya se leyó para el dataBlock — así el preview usa
    // SIEMPRE el CSS real y actual del sitio, nunca una copia que se pueda
    // desactualizar. Si la página no tiene <style> propio (no debería
    // pasar en las páginas de eg), simplemente no hay preview fiel posible.
    // El sitio ahora separa el CSS en archivos enlazados (/assets/css/*.css)
    // y deja solo ajustes puntuales en <style>. Se juntan ambos, en el orden
    // en que la página los carga, y las fuentes se apuntan al dominio real
    // para que el preview del panel las pueda descargar.
    let pageCss = '';
    const linkRe = /<link[^>]+rel="stylesheet"[^>]*href="(\/[^"]+\.css)"[^>]*>/g;
    const hrefs = []; let lm;
    while ((lm = linkRe.exec(file.content))) hrefs.push(lm[1]);
    for (const href of hrefs) {
      try {
        const css = await getFile(site, href.replace(/^\//, ''));
        if (css && css.content) pageCss += css.content + '\n';
      } catch (e) { /* un CSS que falle no debe tumbar el preview */ }
    }
    const inline = /<style>([\s\S]*?)<\/style>/.exec(file.content);
    if (inline) pageCss += inline[1];
    pageCss = pageCss.replace(/url\((["']?)\/fonts\//g, 'url($1https://estudiographica.com/fonts/');
    return { statusCode: 200, body: JSON.stringify({ label: block.label, fields: block.fields, singleton: !!block.singleton, fixedRows: !!block.fixedRows, autoIdField: block.autoIdField || null, richStyles: block.richStyles || [], items, pageCss }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
