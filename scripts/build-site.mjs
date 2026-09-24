import { mkdir, copyFile, cp } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await mkdir(output, { recursive: true });
await copyFile(new URL('index-codex.html', root), new URL('index.html', output));
await copyFile(new URL('game.js', root), new URL('game.js', output));
await cp(new URL('assets/', root), new URL('assets/', output), { recursive: true });
console.log('Built static site in dist/');
