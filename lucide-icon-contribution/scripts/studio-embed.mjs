#!/usr/bin/env node
// Reproduce Lucide Studio's "Copy preview embed code to clipboard" output offline.
//
// Verified byte-compatible with Studio's Share button: base64 of the FULL
// pretty-printed SVG, no /<name>/ path segment. The anchor opens the same SVG
// in Studio so a reviewer can edit it.
//
//   node studio-embed.mjs icons/foo.svg [icons/bar.svg ...]
//   node studio-embed.mjs --name my-alt --svg '<svg ...>...</svg>'
//   node studio-embed.mjs --table icons/a.svg icons/b.svg   # markdown comparison table
//
// --width N   img width (default 200)

import fs from 'fs';
import path from 'path';

const API = 'https://lucide.dev/api/gh-icon';
const STUDIO = 'https://studio.lucide.dev/edit';

export function embed(svg, name, width = 200) {
  const b64 = Buffer.from(svg).toString('base64');
  const href = `${STUDIO}?value=${encodeURIComponent(svg)}&name=${name}`;
  return (
    `<a title="Open lucide studio" target="_blank" href="${href}">` +
    `<img alt="icons" width="${width}px" src="${API}/${b64}.svg"/>` +
    `<br/>Open lucide studio</a>`
  );
}

function parseArgs(argv) {
  const out = { files: [], width: 200, table: false, name: null, svg: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--width') out.width = Number(argv[++i]);
    else if (a === '--table') out.table = true;
    else if (a === '--name') out.name = argv[++i];
    else if (a === '--svg') out.svg = argv[++i];
    else out.files.push(a);
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

if (args.svg) {
  if (!args.name) {
    console.error('--svg requires --name');
    process.exit(1);
  }
  console.log(embed(args.svg, args.name, args.width));
  process.exit(0);
}

if (!args.files.length) {
  console.error(
    'usage: studio-embed.mjs <icon.svg...> [--table] [--width N]\n' +
      '       studio-embed.mjs --name <name> --svg "<svg>...</svg>"',
  );
  process.exit(1);
}

const rows = args.files.map((f) => ({
  name: path.basename(f, '.svg'),
  svg: fs.readFileSync(f, 'utf-8'),
}));

if (args.table) {
  // A comparison table is the clearest way to present alternatives in a PR:
  // every cell is a live X-ray that links into Studio.
  console.log(`| ${rows.map((r) => `\`${r.name}\``).join(' | ')} |`);
  console.log(`| ${rows.map(() => '---').join(' | ')} |`);
  console.log(`| ${rows.map((r) => embed(r.svg, r.name, args.width)).join(' | ')} |`);
} else {
  for (const r of rows) {
    if (rows.length > 1) console.log(`\n<!-- ${r.name} -->`);
    console.log(embed(r.svg, r.name, args.width));
  }
}
