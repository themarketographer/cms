const { getSite } = require('./lib/config');
const { getFile, commitMixed } = require('./lib/github');
const { writeDataBlock, readDataBlock, writeBound } = require('./lib/datablocks');
const { buildCursosFiles, publicado, validSlug } = require('./lib/cursos-gen');
const { syncCursosSitemap } = require('./lib/compose');
const { syncJsonLd } = require('./lib/jsonld');
const { checkAuth } = require('./lib/auth');

const IMG_DIRS = ['cursos/assets/portadas/', 'assets/img/'];
const IMG_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;
const MAX_IMG = 3.5 * 1024 * 1024;

const fail = (code, msg) => ({ statusCode: code, body: JSON.stringify({ error: msg }) });

// Imágenes que el panel mandó junto con el guardado (ya reducidas en el navegador).
function checkUploads(uploads) {
  const out = [];
  for (const u of uploads || []) {
    const path = String((u && u.path) || '');
    if (!IMG_DIRS.some((d) => path.startsWith(d)) || path.includes('..') || !IMG_EXT.test(path)) {
      throw new Error(`Ruta de imagen no permitida: ${path}`);
    }
    const base64 = String(u.base64 || '').replace(/^data:[^,]*,/, '');
    if (!base64 || Buffer.byteLength(base64, 'base64') > MAX_IMG) {
      throw new Error(`La imagen ${path} pesa demasiado (máximo 3,5 MB). Súbela más pequeña.`);
    }
    out.push({ path, base64 });
  }
  return out;
}

function cleanCursos(items) {
  const seen = new Set();
  return items.map((c, i) => {
    const slug = String(c.slug || '').trim();
    if (!validSlug(slug)) throw new Error(`Curso ${i + 1}: el identificador (slug) "${slug}" no es válido. Usa minúsculas, números y guiones, por ejemplo mi-curso-nuevo.`);
    if (seen.has(slug)) throw new Error(`El identificador "${slug}" está repetido. Cada curso necesita uno propio.`);
    seen.add(slug);
    const precio = Number(String(c.precio).replace(',', '.'));
    if (!isFinite(precio) || precio < 0) throw new Error(`Curso "${c.nombre || slug}": el precio no es un número.`);
    const reg = String(c.precioRegular == null ? '' : c.precioRegular).trim();
    return { ...c, slug, precio, precioRegular: reg === '' ? '' : Number(reg.replace(',', '.')) };
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const auth = checkAuth(event);
  if (!auth.ok) return { statusCode: auth.statusCode, body: JSON.stringify({ error: auth.error }) };

  try {
    const { site: siteKey, block: blockKey, items, uploads } = JSON.parse(event.body || '{}');
    const site = getSite(siteKey);
    const block = (site.dataBlocks || {})[blockKey];
    if (!block) return fail(404, 'Bloque desconocido');
    if (!Array.isArray(items)) return fail(400, 'Falta "items" (debe ser un array)');
    const binaries = checkUploads(uploads);

    const file = await getFile(site, block.path);
    if (!file) return fail(500, `No se pudo leer ${block.path}`);

    const files = [];
    const deletes = [];
    let message = `Actualiza ${block.label.toLowerCase()}`;

    if (block.bind) {
      // Textos de una sección de la página: se reescriben dentro del HTML.
      files.push({ path: block.path, content: writeBound(file.content, block, items) });
    } else {
      let toWrite = items;
      if (block.merge) {
        // varios bloques comparten la misma lista; se combinan solo las claves de este
        const current = readDataBlock(file.content, block);
        const keys = block.fields.map((f) => f.key);
        toWrite = items.map((it, i) => {
          const merged = { ...(current[i] || {}) };
          keys.forEach((k) => { if (it && it[k] !== undefined) merged[k] = it[k]; });
          return merged;
        });
      }
      if (block.kind === 'cursos') toWrite = cleanCursos(toWrite);
      let newContent = writeDataBlock(file.content, block, toWrite);
      if (block.jsonld) newContent = syncJsonLd(newContent, block.jsonld, toWrite);
      files.push({ path: block.path, content: newContent });

      if (block.kind === 'cursos' || block.kind === 'cursosAjustes') {
        // Cualquier cambio en cursos o ajustes regenera el hub y las páginas de cada curso.
        const cursosBlk = site.dataBlocks.cursos;
        const ajBlk = site.dataBlocks.cursosAjustes;
        const prevCursos = readDataBlock(file.content, cursosBlk);
        const cursos = block.kind === 'cursos' ? toWrite : prevCursos;
        const aj = (block.kind === 'cursosAjustes' ? toWrite : readDataBlock(file.content, ajBlk))[0] || {};
        const pages = buildCursosFiles(cursos, aj);
        pages.forEach((p) => files.push(p));
        const nowPub = cursos.filter(publicado).map((c) => c.slug);
        const prevPub = prevCursos.filter(publicado).map((c) => c.slug);
        const removed = prevPub.filter((s) => !nowPub.includes(s));
        removed.forEach((s) => deletes.push(`cursos/${s}/index.html`));
        const sm = await getFile(site, site.sitemapPath);
        if (sm) {
          const today = new Date().toISOString().slice(0, 10);
          const xml = syncCursosSitemap(site, sm.content, nowPub, removed, today);
          if (xml !== sm.content) files.push({ path: site.sitemapPath, content: xml });
        }
        message = block.kind === 'cursos' ? 'Actualiza los cursos y regenera sus páginas' : 'Actualiza los textos generales de cursos y regenera sus páginas';
      }
    }

    const { commitSha, commitUrl } = await commitMixed(site, { files, binaries, deletes }, message);
    return { statusCode: 200, body: JSON.stringify({ ok: true, commitSha, commitUrl, archivos: files.length + binaries.length, borrados: deletes.length }) };
  } catch (e) {
    return fail(500, e.message);
  }
};
