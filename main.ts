// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: a GTA 6 meme picturing make.fun's ghost
// mascot, posted from a public account with make.fun and the entrant's play
// code in its text. This program does the one mechanical job the grader
// needs — it copies POST.json, which names that post, from the repository
// root to /output/POST.json, where the gate reads it. Nothing this program
// writes is judged; the house reads the post straight from X.
//
// Local check (the grader's /bot and /output swapped for local paths):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

try {
  copyFileSync(source, target);
} catch (error) {
  console.error(`Could not copy POST.json from ${source}: ${(error as Error).message}`);
  process.exit(1);
}
