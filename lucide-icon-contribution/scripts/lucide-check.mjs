#!/usr/bin/env node
// Geometry sanity checks for a Lucide icon. Catches the arithmetic mistakes that
// are tedious to do by hand — especially diagonal gaps between rounded rects,
// which are easy to under-estimate because the orthogonal gap looks fine.
//
//   node lucide-check.mjs icons/foo.svg
//
// This does NOT replace the Lucide Studio lint pass. Studio knows about sub-icon
// roles and conventions this script can't see. Run both.

import fs from 'fs';

const STROKE = 2;
const HALF = STROKE / 2;
const CANVAS = 24;
const MIN_PAD = 1;
const MIN_GAP = 2;

const file = process.argv[2];
if (!file) {
  console.error('usage: lucide-check.mjs <icon.svg>');
  process.exit(1);
}
const svg = fs.readFileSync(file, 'utf-8');

const problems = [];
const notes = [];

// ---- envelope ----
const required = [
  ['xmlns', 'http://www.w3.org/2000/svg'],
  ['width', '24'],
  ['height', '24'],
  ['viewBox', '0 0 24 24'],
  ['fill', 'none'],
  ['stroke', 'currentColor'],
  ['stroke-width', '2'],
  ['stroke-linecap', 'round'],
  ['stroke-linejoin', 'round'],
];
const head = (svg.match(/<svg[\s\S]*?>/) || [''])[0];
for (const [k, v] of required) {
  const m = head.match(new RegExp(`${k}="([^"]*)"`));
  if (!m) problems.push(`envelope: missing ${k}="${v}"`);
  else if (m[1] !== v) problems.push(`envelope: ${k}="${m[1]}" should be "${v}"`);
}

const body = svg.replace(/<svg[\s\S]*?>/, '').replace(/<\/svg>/, '');
for (const bad of ['transform=', 'filter=', 'fill="', '<use', 'stroke="black"', 'stroke="#']) {
  if (body.includes(bad)) problems.push(`forbidden: ${bad} on a child element`);
}

// ---- elements ----
const rects = [];
for (const m of body.matchAll(/<rect([^>]*)\/?>/g)) {
  const at = (k) => {
    const r = m[1].match(new RegExp(`${k}="([^"]*)"`));
    return r ? Number(r[1]) : 0;
  };
  rects.push({ x: at('x'), y: at('y'), w: at('width'), h: at('height'), rx: at('rx') });
}

const nums = [];
for (const m of body.matchAll(/(?:\s|^|,)(-?\d+(?:\.\d+)?)/g)) nums.push(Number(m[1]));

// ---- corner radius ----
for (const r of rects) {
  const small = Math.min(r.w, r.h) < 8;
  const want = small ? 1 : 2;
  if (r.rx !== want) {
    notes.push(
      `rect ${r.w}x${r.h} at (${r.x},${r.y}) has rx=${r.rx}; guideline suggests ${want} ` +
        `(<8px → 1, ≥8px → 2). Check neighbours — layout-panel-left uses rx=1 on a 7x18.`,
    );
  }
}

// ---- bbox / padding (rects only; paths are reported separately) ----
if (rects.length) {
  const minX = Math.min(...rects.map((r) => r.x)) - HALF;
  const maxX = Math.max(...rects.map((r) => r.x + r.w)) + HALF;
  const minY = Math.min(...rects.map((r) => r.y)) - HALF;
  const maxY = Math.max(...rects.map((r) => r.y + r.h)) + HALF;
  console.log(`rect bbox: x ${minX}–${maxX}, y ${minY}–${maxY}`);
  console.log(
    `padding:   left ${minX}, right ${CANVAS - maxX}, top ${minY}, bottom ${CANVAS - maxY}`,
  );
  for (const [side, v] of [
    ['left', minX],
    ['right', CANVAS - maxX],
    ['top', minY],
    ['bottom', CANVAS - maxY],
  ]) {
    if (v < MIN_PAD) problems.push(`padding: ${side} is ${v}px, minimum is ${MIN_PAD}px`);
  }
}

// ---- pixel alignment ----
const halves = nums.filter((n) => Math.abs(n % 1) === 0.5);
if (halves.length) {
  notes.push(
    `half-pixel coordinates present (${[...new Set(halves)].join(', ')}). A 2px stroke centred ` +
      `on x.5 straddles pixels and blurs at low DPI. Legitimate inside a path's relative curve ` +
      `data — but never as a stroke centre.`,
  );
}

// ---- rect-to-rect gaps, including the diagonal ----
function gap(a, b) {
  // Orthogonal separation between stroke outer edges.
  const dx = Math.max(0, Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w)) - STROKE);
  const dy = Math.max(0, Math.max(a.y - (b.y + b.h), b.y - (a.y + a.h)) - STROKE);
  const overlapX = a.x < b.x + b.w && b.x < a.x + a.w;
  const overlapY = a.y < b.y + b.h && b.y < a.y + a.h;

  if (overlapY && !overlapX) return { kind: 'horizontal', d: dx };
  if (overlapX && !overlapY) return { kind: 'vertical', d: dy };
  if (overlapX && overlapY) return { kind: 'overlapping', d: 0 };

  // Diagonal: nearest approach is between the facing rounded corners.
  const ax = a.x + a.w < b.x ? a.x + a.w - a.rx : a.x + a.rx;
  const ay = a.y + a.h < b.y ? a.y + a.h - a.rx : a.y + a.rx;
  const bx = b.x + b.w < a.x ? b.x + b.w - b.rx : b.x + b.rx;
  const by = b.y + b.h < a.y ? b.y + b.h - b.rx : b.y + b.rx;
  const centreDist = Math.hypot(ax - bx, ay - by);
  return { kind: 'diagonal', d: centreDist - a.rx - b.rx - HALF - HALF };
}

if (rects.length > 1) {
  console.log('\nrect gaps:');
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const g = gap(rects[i], rects[j]);
      const d = Math.round(g.d * 100) / 100;
      const flag = d < MIN_GAP ? '  ✗ under 2px' : '';
      console.log(
        `  rect${i} (${rects[i].x},${rects[i].y}) ↔ rect${j} (${rects[j].x},${rects[j].y}): ` +
          `${g.kind} ${d}px${flag}`,
      );
      if (d < MIN_GAP) {
        problems.push(
          `spacing: rect${i}↔rect${j} ${g.kind} gap is ${d}px, guideline is ${MIN_GAP}px`,
        );
      }
    }
  }
}

const paths = [...body.matchAll(/<path[^>]*d="([^"]*)"/g)].map((m) => m[1]);
if (paths.length) {
  console.log(`\n${paths.length} path(s) — gaps against paths are not computed here:`);
  for (const p of paths) console.log(`  ${p}`);
  console.log('  → check these visually in Lucide Studio (red hatch = under 2px).');
}

console.log('');
if (notes.length) {
  console.log('notes:');
  for (const n of notes) console.log(`  · ${n}`);
  console.log('');
}
if (problems.length) {
  console.log('problems:');
  for (const p of problems) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log('✓ no rule violations found in the checks this script can do.');
console.log('  Still run the icon through Lucide Studio — it catches what this cannot.');
