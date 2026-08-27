import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
await cp('public', 'dist', { recursive: true });
await cp('src', 'dist/src', { recursive: true });
await cp('index.html', 'dist/index.html');

// Static-host fallbacks keep the future public routes navigable until their
// dedicated experiences are implemented.
const html = await readFile('index.html', 'utf8');
for (const route of ['kids', 'eventos']) {
  await mkdir(`dist/${route}`, { recursive: true });
  // Route fallbacks live one directory deeper. The base keeps the same
  // document-relative URLs working locally and below a Pages project path.
  const routeHtml = html.replace('<head>', '<head>\n  <base href="../">');
  await writeFile(`dist/${route}/index.html`, routeHtml);
}

console.log('XDAW static site built in dist/');
