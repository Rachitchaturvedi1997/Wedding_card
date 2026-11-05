/*
  Renders tools/film.html to assets/video/invitation.mp4 (1080x1920, 30 fps, with music)
  and cuts the per-event clips used by the website.

  Usage (from the repo root, with a local server running on :8765):
    python3 -m http.server 8765 &
    node tools/render-film.js
  Requires: Playwright (Chromium) and ffmpeg.
*/
const { chromium } = require("playwright");
const { spawn, execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const FPS = 30, DUR = 60, SCALE = 1.5, WORKERS = 4;
const URL = "http://localhost:8765/tools/film.html?render";
const OUT = path.join(__dirname, "..", "assets", "video");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "film-"));

async function renderPart(browser, idx, from, to) {
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: SCALE });
  await page.goto(URL);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);
  const file = path.join(TMP, `part${idx}.mp4`);
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", file], { stdio: ["pipe", "inherit", "inherit"] });
  for (let f = from; f < to; f++) {
    await page.evaluate((t) => FILM.setTime(t), f / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if ((f - from) % 150 === 0) console.log(`worker ${idx}: frame ${f}/${to}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await page.close();
  return file;
}

(async () => {
  const total = FPS * DUR, per = Math.ceil(total / WORKERS);
  const browser = await chromium.launch();
  const parts = await Promise.all(Array.from({ length: WORKERS }, (_, i) =>
    renderPart(browser, i, i * per, Math.min(total, (i + 1) * per))));
  await browser.close();

  const list = path.join(TMP, "list.txt");
  fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join("\n"));
  const silent = path.join(TMP, "silent.mp4");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", silent]);

  const music = path.join(__dirname, "..", "assets", "music.mp3");
  const film = path.join(OUT, "invitation.mp4");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", silent, "-i", music, "-map", "0:v", "-map", "1:a",
    "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
    "-movflags", "+faststart", "-shortest", film]);
  console.log("wrote", film);

  // Per-event clips (720x1280) with short audio fades
  const clips = { "ganesh-ji": [0, 8], haldi: [14, 21], mehendi: [21, 28], sangeet: [28, 35], baraat: [35, 42], reception: [42, 49] };
  for (const [name, [s, e]] of Object.entries(clips)) {
    const d = e - s;
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(s), "-t", String(d), "-i", film,
      "-vf", `scale=720:1280,fade=t=in:st=0:d=0.4,fade=t=out:st=${d - 0.5}:d=0.5`,
      "-af", `afade=t=in:st=0:d=0.4,afade=t=out:st=${d - 0.8}:d=0.8`,
      "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k",
      "-movflags", "+faststart", path.join(OUT, `${name}.mp4`)]);
    console.log("wrote", name);
  }
  // Poster + share image
  const img = path.join(__dirname, "..", "assets", "img");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "12.5", "-i", film, "-frames:v", "1", "-vf", "scale=720:-2", "-q:v", "3", path.join(img, "film-poster.jpg")]);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "12.5", "-i", film, "-frames:v", "1", "-vf", "crop=1080:567:0:560,scale=1200:630", "-q:v", "3", path.join(img, "share.jpg")]);
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log("done");
})();
