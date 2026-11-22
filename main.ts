// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: the GTA 6 meme "Podium Kosong" — an
// Olympic podium of shipped games with a lone "GTA VI" flag left on the
// ground — posted from a public account. This program does the one
// mechanical job the grader
// needs — it copies POST.json, which names that post, from the repository
// root to /output/POST.json, where the gate reads it. Nothing this program
// writes is judged; the house reads the post straight from X.
//
// Local check (the grader's /bot and /output swapped for local paths):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, renameSync, statSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

// Validate before copying: the gate reads whatever lands in /output, so a
// malformed POST.json should fail loudly here instead of silently scoring
// zero. The file must be JSON carrying an "url" that points at one concrete
// X (or Twitter) status — not a profile page, not a placeholder.
let post: { url?: unknown };
try {
  post = JSON.parse(readFileSync(source, 'utf8')) as { url?: unknown };
} catch (error) {
  console.error(`POST.json at ${source} is not readable JSON: ${(error as Error).message}`);
  process.exit(1);
}

const postUrl = typeof post.url === 'string' ? post.url : '';
if (!/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(postUrl)) {
  console.error(`POST.json "url" is not an X post URL: ${JSON.stringify(post.url)}`);
  process.exit(1);
}

// Publish atomically: copy to a temp file in the same directory, verify the
// copied bytes match the source exactly, then rename into place. The gate
// can therefore never observe a half-written or corrupted POST.json, and a
// bad copy fails here instead of at grading time.
const tempTarget = `${target}.tmp`;
try {
  copyFileSync(source, tempTarget);
  const sourceBytes = readFileSync(source);
  const copiedBytes = readFileSync(tempTarget);
  if (!sourceBytes.equals(copiedBytes)) {
    console.error(`Copy verification failed: ${tempTarget} differs from ${source}`);
    process.exit(1);
  }
  renameSync(tempTarget, target);
} catch (error) {
  console.error(`Could not copy POST.json from ${source}: ${(error as Error).message}`);
  process.exit(1);
}

const { size } = statSync(target);
console.log(`Copied POST.json (${size} bytes) to ${target} — post: ${postUrl}`);
