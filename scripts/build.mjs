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
  await writeFile(`dist/${route}/index.html`, html);
}

console.log('XDAW static site built in dist/');
