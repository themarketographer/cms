// Textos, enlaces e imágenes de páginas sueltas, marcados con tools/marcar-pagina.js.
// Un bloque por página. Para sumar otra página: correr la herramienta, pegar su
// JSON en page-blocks.json y agregarla al menú del panel.
const DATA = require('./page-blocks.json');
const toMap = (arr) => { const o = {}; arr.forEach((b) => { o[b.key] = b; }); return o; };
module.exports = { mkt: toMap(DATA.mkt), eg: toMap(DATA.eg), list: DATA };
