# CMS Marketographers / Estudio Graphica — Fase 1 (posts del blog)

Panel único con login que crea, edita y despublica posts de blog en los dos
sitios. Cada acción hace un commit real a GitHub (post + tarjeta en
`/blog/index.html` + entrada en `sitemap.xml`, todo en un solo commit) y
Netlify despliega solo, igual que cuando subías los cambios a mano.

## Qué NO cubre esta fase

Los testimonios y los bloques de texto de la landing todavía se editan a
mano en el HTML. Esa es la Fase 2, porque primero hay que mover esos textos
a un archivo de datos separado para que sean editables sin romper el diseño.

## Despliegue (una sola vez)

1. **Crear un repositorio nuevo en GitHub** para este panel, por ejemplo
   `themarketographer/cms-contenido`. Puede ser privado, de hecho conviene
   que lo sea.
2. **Subir estos archivos** a ese repositorio (la carpeta completa que te
   compartí: `index.html`, `netlify.toml`, `netlify/`).
3. **Crear un sitio nuevo en Netlify** conectado a ese repositorio. No hace
   falta build command ni publish directory especial, el `netlify.toml` ya
   trae lo necesario.
4. **Agregar las variables de entorno** en Netlify (Site settings →
   Environment variables → Add a variable):
   - `GITHUB_TOKEN`: tu Personal Access Token de GitHub. Tiene que tener
     permiso de escritura sobre `themarketographer/marketographers` y
     `themarketographer/estudiographica`. Si es un token clásico, el scope
     `repo` alcanza. Si es fine-grained, dale acceso a esos dos
     repositorios con permiso "Contents: Read and write".
   - `ADMIN_PASSWORD`: la contraseña que vas a usar para entrar al panel.
     Elegí algo que no uses en ningún otro lado.

   Importante: esto se hace directo en el panel de Netlify, nunca me pegues
   el token ni la contraseña acá en el chat. Netlify los guarda como
   variables de entorno, no quedan en ningún archivo del repo.
5. **Redeploy** el sitio (Netlify → Deploys → Trigger deploy) para que las
   funciones tomen las variables nuevas.
6. Entrá a la URL que te dio Netlify, poné la contraseña, y ya podés
   publicar.

## Cómo se estructura por dentro

```
index.html                        ← panel (login + listado + formulario)
netlify/functions/
  list-posts.js                   ← lee blog/index.html y devuelve la lista
  get-post.js                     ← lee un post puntual para precargar el form
  save-post.js                    ← arma los 3 archivos y hace UN commit
  delete-post.js                  ← borra el post + su tarjeta + su entrada de sitemap
  lib/
    config.js                     ← acá se agregaría un tercer sitio si hiciera falta
    github.js                     ← llamadas a la API de GitHub (lectura + commit atómico)
    templates.js                  ← arma el HTML de cada post, tarjeta y entrada de sitemap
    compose.js                    ← inserta/reemplaza/borra la tarjeta y el sitemap
    auth.js                       ← chequeo de la contraseña
```

## Seguridad, en criollo

La autenticación es una sola contraseña compartida, sin usuarios ni
expiración de sesión. Alcanza para un panel de uso personal. Si en algún
momento otra persona necesita acceso propio, o si querés que la sesión
expire sola, ahí conviene migrar a Netlify Identity, pero eso agrega una
capa de configuración que hoy no hace falta.

El token de GitHub nunca llega al navegador. Vive solo como variable de
entorno del lado del servidor (las funciones de Netlify), y cada función lo
usa server side antes de responder al panel.
