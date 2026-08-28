// Los testimonios y las FAQs viven como un array de JavaScript escrito
// directo dentro de una página, del tipo:
//   const testimonios = [ {n:"...",t:"...",q:"...",img:"..."}, ... ];
// Esto extrae ese bloque, lo interpreta como datos, y sabe regenerarlo
// para guardarlo de vuelta sin tocar el resto del archivo.

// Encuentra "const NOMBRE = [ ... ];" contando corchetes para hallar el
// cierre correcto (el array puede tener objetos anidados con sus propios
// corchetes, así que no alcanza con una regex simple no-greedy).
function findArrayBlock(content, varName) {
  const marker = `const ${varName} = [`;
  const start = content.indexOf(marker);
  if (start === -1) return null;
  const openBracket = start + marker.length - 1; // índice del "[" inicial
  let depth = 0;
  for (let i = openBracket; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') {
      depth--;
      if (depth === 0) {
        // el ";" opcional justo después del "]" también se reemplaza
        const semi = content[i + 1] === ';' ? 1 : 0;
        return { start, end: i + 1 + semi, arrayText: content.slice(openBracket, i + 1) };
      }
    }
  }
  return null; // no se encontró el cierre, el archivo no tiene la forma esperada
}

// Interpreta el texto del array (con claves sin comillas, tal como está
// escrito hoy en el código) como datos reales. Es código propio del repo,
// no input de un desconocido, así que evaluarlo con Function es seguro acá.
function parseArray(arrayText) {
  // eslint-disable-next-line no-new-func
  return new Function(`"use strict"; return (${arrayText});`)();
}

// Regenera "const NOMBRE = [ ... ];" a partir de los datos ya editados.
// JSON.stringify produce sintaxis 100% válida como literal de JS (las claves
// quedan con comillas, que es perfectamente válido aunque el original no las
// tuviera), así que no hace falta reproducir el estilo original.
function serializeArray(varName, data) {
  return `const ${varName} = ${JSON.stringify(data, null, 2)};`;
}

function readDataBlock(content, block) {
  const found = findArrayBlock(content, block.varName);
  if (!found) throw new Error(`No se encontró "const ${block.varName} = [...]" en ${block.path}`);
  return parseArray(found.arrayText);
}

function writeDataBlock(content, block, data) {
  const found = findArrayBlock(content, block.varName);
  if (!found) throw new Error(`No se encontró "const ${block.varName} = [...]" en ${block.path}`);
  const replacement = serializeArray(block.varName, data);
  return content.slice(0, found.start) + replacement + content.slice(found.end);
}

module.exports = { readDataBlock, writeDataBlock };
