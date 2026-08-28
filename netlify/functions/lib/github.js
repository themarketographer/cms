// Helper de acceso a GitHub. Usa fetch nativo de Node (disponible en el
// runtime de Netlify Functions, sin dependencias externas que instalar).
//
// Requiere la variable de entorno GITHUB_TOKEN: un Personal Access Token
// (classic, con permiso "repo", o fine-grained con Contents: Read & Write)
// que tenga acceso a los dos repositorios. Se configura en Netlify:
// Site settings > Environment variables. Nunca va en el código ni en el
// panel, así no queda expuesto en el navegador ni en el historial de chat.

const API = 'https://api.github.com';

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('Falta GITHUB_TOKEN en las variables de entorno de Netlify');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function ghFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API ${res.status} en ${path}: ${text}`);
  }
  return res.json();
}

// Lee el contenido de texto de un archivo en el repo. Devuelve null si no existe.
async function getFile(site, path) {
  try {
    const data = await ghFetch(`/repos/${site.owner}/${site.repo}/contents/${path}?ref=${site.branch}`);
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { content, sha: data.sha };
  } catch (e) {
    if (String(e.message).includes('GitHub API 404')) return null;
    throw e;
  }
}

// Lista el contenido de una carpeta (para enumerar posts por carpeta si hace falta).
async function listDir(site, path) {
  try {
    return await ghFetch(`/repos/${site.owner}/${site.repo}/contents/${path}?ref=${site.branch}`);
  } catch (e) {
    if (String(e.message).includes('GitHub API 404')) return [];
    throw e;
  }
}

// Hace un commit atómico de uno o más archivos (crear o actualizar) en un
// solo commit, igual que "git add . && git commit && git push" a mano.
// files: [{ path, content }]  →  content en texto plano (UTF-8).
async function commitFiles(site, files, message) {
  const owner = site.owner;
  const repo = site.repo;
  const branch = site.branch;

  // 1. Referencia actual de la rama → SHA del último commit.
  const ref = await ghFetch(`/repos/${owner}/${repo}/git/ref/heads/${branch}`);
  const latestCommitSha = ref.object.sha;

  // 2. Ese commit → SHA del árbol base.
  const latestCommit = await ghFetch(`/repos/${owner}/${repo}/git/commits/${latestCommitSha}`);
  const baseTreeSha = latestCommit.tree.sha;

  // 3. Árbol nuevo: solo los archivos que cambian, GitHub crea los blobs solo
  //    porque mandamos "content" en vez de "sha".
  const tree = files.map((f) => ({
    path: f.path,
    mode: '100644',
    type: 'blob',
    content: f.content,
  }));
  const newTree = await ghFetch(`/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  });

  // 4. Commit nuevo apuntando al árbol nuevo, con el commit anterior como padre.
  const newCommit = await ghFetch(`/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      tree: newTree.sha,
      parents: [latestCommitSha],
    }),
  });

  // 5. Mover la rama al commit nuevo. Netlify detecta el push y despliega solo.
  await ghFetch(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sha: newCommit.sha }),
  });

  return { commitSha: newCommit.sha, commitUrl: newCommit.html_url };
}

// Igual que commitFiles pero también borra archivos (para despublicar un post).
// deletePaths: array de rutas a quitar del árbol.
async function commitFilesWithDeletes(site, files, deletePaths, message) {
  const owner = site.owner;
  const repo = site.repo;
  const branch = site.branch;

  const ref = await ghFetch(`/repos/${owner}/${repo}/git/ref/heads/${branch}`);
  const latestCommitSha = ref.object.sha;
  const latestCommit = await ghFetch(`/repos/${owner}/${repo}/git/commits/${latestCommitSha}`);
  const baseTreeSha = latestCommit.tree.sha;

  const tree = [
    ...files.map((f) => ({ path: f.path, mode: '100644', type: 'blob', content: f.content })),
    ...deletePaths.map((p) => ({ path: p, mode: '100644', type: 'blob', sha: null })),
  ];
  const newTree = await ghFetch(`/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  });
  const newCommit = await ghFetch(`/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, tree: newTree.sha, parents: [latestCommitSha] }),
  });
  await ghFetch(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sha: newCommit.sha }),
  });
  return { commitSha: newCommit.sha, commitUrl: newCommit.html_url };
}

module.exports = { getFile, listDir, commitFiles, commitFilesWithDeletes };
