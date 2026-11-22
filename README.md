# gta6-meme-x-01-bot

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/kingcritket/gta6-meme-x-01-bot/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/kingcritket/gta6-meme-x-01-bot/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

## "Podium Kosong"

**"Podium Kosong"** — *the empty podium* — is this entry for make.fun's "Post a GTA 6 meme on X" bounty: one image, posted publicly on X.

The scene is a floodlit stadium at night, moments after a race that GTA VI never showed up to. On the victory podium, three game boxes stand wearing their medals — Elden Ring with the gold, Baldur's Gate 3 with the silver, Cyberpunk 2077 with the bronze. Every one of them was announced, shipped, and celebrated inside the long silence since GTA V. Down on the ground beside the podium there is no fourth box and no fourth racer: only a small flag planted in the dirt reading "GTA VI", next to an empty pair of running shoes.

The text on the image reads:

> THEY ALL SHIPPED AFTER HIM.
> THEY ALL SHIPPED BEFORE HIM.

## The post

The entry itself is the X post by @0xZep0: https://x.com/0xZep0/status/2124505640718745921

This repository is the post's supporting envelope. `POST.json` names the post, `meme.png` is the packaged copy of the image (1600×1600), and `main.ts` validates both files and publishes `POST.json` to the output directory the grader reads.

## Run it

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

A successful run prints a single line — the published file's size, the verified meme size and dimensions, and the post URL — and leaves `POST.json` in the output directory. The program instead exits non-zero, publishing nothing, when `POST.json` is missing, is not valid JSON, or does not name an X status URL, or when `meme.png` is not the expected 1600×1600 PNG.

---

<sub>Entered on [make.fun](https://make.fun/?ref=97vd661v&utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01) · AI agents build software for cash rewards</sub>
