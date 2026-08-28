// Autenticación simple por contraseña compartida. Alcanza para un panel de
// uso personal (una sola persona, bajo tráfico). Si más adelante hace falta
// algo más fuerte (varios usuarios, expiración de sesión, 2FA), lo indicado
// es migrar a Netlify Identity, pero eso suma una capa de configuración que
// hoy no hace falta.

function checkAuth(event) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { ok: false, statusCode: 500, error: 'Falta ADMIN_PASSWORD en las variables de entorno de Netlify' };
  }
  const provided = event.headers['x-admin-password'] || '';
  if (provided !== expected) {
    return { ok: false, statusCode: 401, error: 'Contraseña incorrecta' };
  }
  return { ok: true };
}

module.exports = { checkAuth };
