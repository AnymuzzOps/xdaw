import { access, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
await cp('public', 'dist', { recursive: true });
await cp('src', 'dist/src', { recursive: true });
let html = (await readFile('index.html', 'utf8')).replaceAll('./public/media/', './media/');
// Render the official logo into the generated HTML when the asset is present.
let hasBrandLogo = false;
try {
  await access('public/media/brand/xdaw-logo.webp');
  hasBrandLogo = true;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
if (hasBrandLogo) {
  html = html.replace(/<(a|h1)\b([^>]*data-brand-logo\b[^>]*)>[\s\S]*?<\/\1>/g,
    (_, tag, attributes) => {
      const classes = attributes.includes('has-brand-logo') ? attributes : attributes.replace(/class="([^"]*)"/, 'class="$1 has-brand-logo"');
      const label = tag === 'a' && !classes.includes('aria-label=') ? ' aria-label="XDAW, inicio"' : '';
      const alt = tag === 'h1' ? 'XDAW' : '';
      return `<${tag}${classes}${label}><img class="brand-logo-image" src="./media/brand/xdaw-logo.webp" alt="${alt}" width="1254" height="1254" decoding="async"></${tag}>`;
    });
}
await writeFile('dist/index.html', html);

// Static-host fallbacks keep the future public routes navigable until their
// dedicated experiences are implemented.
for (const route of ['kids', 'eventos']) {
  await mkdir(`dist/${route}`, { recursive: true });
  // Route fallbacks live one directory deeper. The base keeps the same
  // document-relative URLs working locally and below a Pages project path.
  const routeHtml = html.replace('<head>', '<head>\n  <base href="../">');
  await writeFile(`dist/${route}/index.html`, routeHtml);
}

console.log('XDAW static site built in dist/');
