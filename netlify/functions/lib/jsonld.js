// Mantiene el marcado estructurado (JSON-LD) de la Home alineado con los datos
// que se editan en el panel, para que Google y las IAs lean lo mismo que ve la
// persona en pantalla.

const LD_RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

const plain = (s) => String(s == null ? '' : s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function replaceLd(html, marker, build) {
  let done = false;
  const out = html.replace(LD_RE, (all, body) => {
    if (done || !body.includes(marker)) return all;
    done = true;
    const obj = JSON.parse(body);
    return '<script type="application/ld+json">\n' + JSON.stringify(build(obj), null, 2) + '\n</script>';
  });
  if (!done) throw new Error(`No se encontró el marcado estructurado "${marker}" en la página`);
  return out;
}

function syncJsonLd(html, kind, items) {
  if (kind === 'faq') {
    return replaceLd(html, '"FAQPage"', (o) => {
      o.mainEntity = items.map((f) => ({ '@type': 'Question', name: plain(f.q), acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } }));
      return o;
    });
  }
  if (kind === 'reviews') {
    return replaceLd(html, '"Review"', (o) => {
      o.review = items.map((t) => ({
        '@type': 'Review', author: { '@type': 'Person', name: plain(t.n) }, reviewBody: plain(t.q),
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      }));
      if (o.aggregateRating) o.aggregateRating.reviewCount = String(items.length);
      return o;
    });
  }
  return html;
}

module.exports = { syncJsonLd };
