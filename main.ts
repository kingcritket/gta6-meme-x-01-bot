// Entry program for the gta6-meme-x-01 make.fun bounty.
//
// The thing being entered is not this code — it is a public post on X
// carrying the "Podium Kosong" GTA 6 meme. This repository is the
// envelope for that post, and this program is the envelope's one moving
// part: it checks the envelope's contents and then places POST.json,
// which names the post, into the output directory the grader reads.
//
// Two locations come from the environment so the identical file works
// in the grading sandbox and in a plain local checkout:
//
//   bot dir     MAKEFUN_BOT_DIR     (default "/bot")    — where the repo sits
//   output dir  MAKEFUN_OUTPUT_DIR  (default "/output") — where POST.json goes
//
// Local run:
//
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Node standard library only. Any problem is fatal on purpose: a broken
// envelope should fail loudly here rather than be graded as an empty one.

import { copyFileSync, mkdirSync, readFileSync, renameSync, statSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function fail(reason: string): never {
  console.error(`gta6-meme-x-01: ${reason}`);
  process.exit(1);
}

// ---------------------------------------------------------------------
// POST.json — parse it, then insist it names one concrete X post.
// A profile link or a placeholder would grade as nothing, so the URL
// has to be a full status URL: https, x.com (or twitter.com), a handle,
// and a numeric status id.
// ---------------------------------------------------------------------

const postSource = join(botDir, "POST.json");

let postText: string;
try {
  postText = readFileSync(postSource, "utf8");
} catch {
  fail(`POST.json is missing or unreadable at ${postSource}`);
}

let postData: unknown;
try {
  postData = JSON.parse(postText);
} catch {
  fail(`POST.json at ${postSource} is not valid JSON`);
}

const candidate =
  postData !== null && typeof postData === "object"
    ? (postData as Record<string, unknown>).url
    : undefined;

const STATUS_URL_PATTERN = /^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/;

if (typeof candidate !== "string" || !STATUS_URL_PATTERN.test(candidate)) {
  fail(
    `POST.json must hold an "url" that is an X status URL; found ${JSON.stringify(candidate)}`,
  );
}
const postUrl: string = candidate;

// ---------------------------------------------------------------------
// meme.png — the packaged copy of the image that was posted. It is not
// handed to the grader, but it belongs to the entry, so confirm the
// file in the envelope is at least a genuine PNG before shipping.
// ---------------------------------------------------------------------

const memeSource = join(botDir, "meme.png");

let memeBytes: Buffer;
try {
  memeBytes = readFileSync(memeSource);
} catch {
  fail(`meme.png is missing or unreadable at ${memeSource}`);
}

// The eight bytes every PNG file opens with.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (memeBytes.length <= PNG_MAGIC.length || !memeBytes.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  fail(`meme.png at ${memeSource} does not begin with a PNG signature`);
}

// Just past the signature sits the IHDR chunk: a length word, the
// literal tag "IHDR", then width and height as big-endian uint32s. The
// packaged master is the 1600x1600 render; a different size means the
// wrong file was bundled into the envelope, so check it rather than
// discovering the swap after the post is graded.
const EXPECTED_WIDTH = 1600;
const EXPECTED_HEIGHT = 1600;
const headerMatches =
  memeBytes.length >= 24 &&
  memeBytes.toString("ascii", 12, 16) === "IHDR" &&
  memeBytes.readUInt32BE(16) === EXPECTED_WIDTH &&
  memeBytes.readUInt32BE(20) === EXPECTED_HEIGHT;
if (!headerMatches) {
  fail(
    `meme.png at ${memeSource} is not the expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT} master`,
  );
}

// ---------------------------------------------------------------------
// Publish. POST.json is staged under a temporary name in the output
// directory, the staged bytes are compared against the source, and
// only then is the file renamed into place — so the grader can never
// pick up a torn or truncated copy.
// ---------------------------------------------------------------------

mkdirSync(outputDir, { recursive: true });

const postTarget = join(outputDir, "POST.json");
const stagedTarget = `${postTarget}.part`;

try {
  copyFileSync(postSource, stagedTarget);
} catch (error) {
  fail(`could not stage POST.json in ${outputDir}: ${(error as Error).message}`);
}

if (!readFileSync(stagedTarget).equals(readFileSync(postSource))) {
  fail(`staged copy at ${stagedTarget} differs from ${postSource}; refusing to publish`);
}

try {
  renameSync(stagedTarget, postTarget);
} catch (error) {
  fail(`could not move the staged POST.json into place at ${postTarget}: ${(error as Error).message}`);
}

console.log(
  `Published POST.json (${statSync(postTarget).size} bytes) to ${postTarget}; ` +
    `meme.png verified (${memeBytes.length} bytes, ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}); post: ${postUrl}`,
);
