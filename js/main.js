/* Wedding details live in js/data.js */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const portrait = () => matchMedia("(max-aspect-ratio: 1/1)").matches;

/* ---------- Artwork ---------- */
document.body.insertAdjacentHTML("afterbegin", ART.defs());
function paintArt(root = document) {
  $$("[data-art]", root).forEach((el) => {
    const k = el.dataset.art;
    if (k === "bells") el.innerHTML = ART.bell() + ART.bell() + ART.bell();
    else if (k === "mandala") el.innerHTML = ART.mandala({ sw: 0.5 });
    else if (k === "divider") el.innerHTML = ART.divider();
    else if (ART[k]) el.innerHTML = ART[k]();
  });
}
paintArt();

/* ---------- Text fields ---------- */
$$("[data-field]").forEach((el) => { if (DATA[el.dataset.field]) el.textContent = DATA[el.dataset.field]; });
$("#venue-map").href = DATA.mapUrl;

/* ---------- Events ---------- */
const list = $("#event-list");
DATA.events.forEach((ev) => {
  const card = document.createElement("article");
  card.className = `event ${ev.key} reveal`;
  card.innerHTML = `
    <div class="window">${ART[ev.art]()}</div>
    <div class="ribbon deva"></div>
    <h3></h3>
    <p class="when"></p>
    <p class="time"></p>
    <p class="desc"></p>
    <span class="dress"><i></i><span></span></span>
    <p class="venue"></p>
    <div class="actions">
      <button class="btn small watch">▶ Watch</button>
      <a class="btn small ghost" target="_blank" rel="noopener">Directions</a>
    </div>`;
  $(".ribbon", card).textContent = ev.hindi;
  $("h3", card).textContent = ev.name;
  $(".when", card).textContent = ev.date;
  $(".time", card).textContent = ev.time;
  $(".desc", card).textContent = ev.desc;
  $(".dress", card).style.setProperty("--swatch", ev.swatch);
  $(".dress span", card).textContent = `Dress code: ${ev.dress}`;
  $(".venue", card).textContent = DATA.venue;
  $(".actions a", card).href = DATA.mapUrl;
  $(".watch", card).addEventListener("click", () => openFilm(ev.film));
  list.appendChild(card);
});

/* ---------- Music ---------- */
const bgm = $("#bgm");
const musicBtn = $("#music-btn");
bgm.volume = 0.8;
function setMusic(on) { musicBtn.classList.toggle("on", on); }
function playMusic(fromStart) {
  if (fromStart) bgm.currentTime = 0;
  bgm.play().then(() => setMusic(true)).catch(() => setMusic(false));
}
musicBtn.addEventListener("click", () => (bgm.paused ? playMusic(false) : (bgm.pause(), setMusic(false))));

/* ---------- Cover: envelope → Ganesh Ji → site ---------- */
const cover = $("#cover");
const envStage = $("#stage-envelope");
const ganStage = $("#stage-ganesh");
const envVideo = $("#env-video");
let timers = [];
const later = (fn, ms) => timers.push(setTimeout(fn, ms));

function setupEnvelope() {
  const p = portrait();
  envVideo.poster = p ? "assets/img/envelope-m.jpg" : "assets/img/envelope.jpg";
  envVideo.src = p ? "assets/video/envelope-m.mp4" : "assets/video/envelope.mp4";
  envStage.style.backgroundImage = `url(${envVideo.poster})`;
}
setupEnvelope();

function showGanesh() {
  ganStage.classList.add("on", "drawing");
  ganStage.setAttribute("aria-hidden", "false");
  $(".petal-host", ganStage).innerHTML = ART.petalsLayer(26);
  later(() => ganStage.classList.add("ready"), 5200);
  later(enterSite, 12000);
}

function openCover() {
  envStage.classList.add("playing");
  playMusic(true);
  musicBtn.hidden = false;
  let moved = false;
  const go = () => { if (!moved) { moved = true; showGanesh(); } };
  envVideo.onended = go;
  envVideo.onerror = go;
  envVideo.currentTime = 0;
  envVideo.play().catch(go);
  later(go, 4500); // safety net
}

function enterSite() {
  if (cover.classList.contains("gone")) return;
  timers.forEach(clearTimeout); timers = [];
  cover.classList.add("gone");
  document.body.classList.remove("locked");
  document.body.classList.add("entered");
  window.scrollTo(0, 0);
}

$("#open-btn").addEventListener("click", openCover);
$("#enter-btn").addEventListener("click", enterSite);
ganStage.addEventListener("click", (e) => { if (ganStage.classList.contains("ready") && e.target === ganStage) enterSite(); });

$("#replay").addEventListener("click", () => {
  timers.forEach(clearTimeout); timers = [];
  cover.classList.remove("gone");
  ganStage.classList.remove("on", "drawing", "ready");
  envStage.classList.remove("playing");
  // restart the draw-on animation
  const idol = $(".g-idol", ganStage); idol.innerHTML = ART.ganesha();
  document.body.classList.add("locked");
  envVideo.currentTime = 0;
});

/* ---------- Scratch card ---------- */
(function scratch() {
  const box = $("#scratch"), cv = $("#scratch-canvas"), ctx = cv.getContext("2d", { willReadFrequently: true });
  let down = false, done = false;
  function paint() {
    const w = box.clientWidth, h = box.clientHeight, dpr = devicePixelRatio || 1;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#a77a2c"); g.addColorStop(.25, "#f9e7ad"); g.addColorStop(.5, "#c4943d"); g.addColorStop(.75, "#f3d98f"); g.addColorStop(1, "#9c6f24");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 1;
    for (let x = -h; x < w; x += 14) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h, h); ctx.stroke(); }
    ctx.fillStyle = "rgba(60,35,5,.7)"; ctx.textAlign = "center";
    ctx.font = "600 13px Cinzel, Georgia, serif"; ctx.fillText("✦  SCRATCH HERE  ✦", w / 2, h / 2 - 4);
    ctx.font = "italic 15px 'Cormorant Garamond', Georgia, serif"; ctx.fillText("to reveal our wedding date", w / 2, h / 2 + 20);
  }
  function at(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  function scratchAt(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill();
  }
  function check() {
    if (done) return;
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data; let clear = 0, n = 0;
    for (let i = 3; i < d.length; i += 4 * 40) { n++; if (d[i] === 0) clear++; }
    if (clear / n > .5) reveal();
  }
  function reveal() {
    done = true; cv.style.opacity = "0"; setTimeout(() => (cv.style.display = "none"), 800);
    burst(box);
  }
  cv.addEventListener("pointerdown", (e) => { down = true; cv.setPointerCapture(e.pointerId); scratchAt(...at(e)); });
  cv.addEventListener("pointermove", (e) => { if (down) scratchAt(...at(e)); });
  cv.addEventListener("pointerup", () => { down = false; check(); });
  addEventListener("resize", () => { if (!done) paint(); });
  document.fonts.ready.then(paint); paint();
})();

function burst(el) {
  const r = el.getBoundingClientRect();
  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;pointer-events:none;z-index:50`;
  host.innerHTML = ART.petalsLayer(30, "rose");
  host.querySelector(".petals").style.inset = "-200px 0 auto 0";
  host.querySelector(".petals").style.height = "100vh";
  document.body.appendChild(host);
  setTimeout(() => host.remove(), 7000);
}

/* ---------- Countdown ---------- */
(function countdown() {
  const target = new Date(DATA.countdownTo).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  const set = (id, v) => { const e = $(id); if (e.textContent !== v) { e.textContent = v; e.classList.remove("flip"); void e.offsetWidth; e.classList.add("flip"); } };
  function tick() {
    const d = Math.max(0, target - Date.now());
    set("#cd-d", String(Math.floor(d / 864e5)));
    set("#cd-h", pad(Math.floor(d / 36e5) % 24));
    set("#cd-m", pad(Math.floor(d / 6e4) % 60));
    set("#cd-s", pad(Math.floor(d / 1e3) % 60));
  }
  tick(); setInterval(tick, 1000);
})();

/* ---------- Film lightbox ---------- */
const lb = $("#lightbox"), lbVideo = $("#lb-video");
function openFilm(src) {
  bgm.pause(); setMusic(false);
  lbVideo.src = src; lb.hidden = false; lbVideo.play().catch(() => {});
}
function closeFilm() { lbVideo.pause(); lb.hidden = true; lbVideo.removeAttribute("src"); lbVideo.load(); }
$("#lb-close").addEventListener("click", closeFilm);
lb.addEventListener("click", (e) => { if (e.target === lb) closeFilm(); });
addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) closeFilm(); });
$("#film-video").addEventListener("play", () => { bgm.pause(); setMusic(false); });

/* ---------- Share ---------- */
$("#share-wa").href = "https://wa.me/?text=" + encodeURIComponent(
  `${DATA.bride} & ${DATA.groom} are getting married! 💍\n23 January 2027 · ${DATA.venue}\nOpen the invitation: ${location.href.split("#")[0]}`
);

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: 0.12 });
$$(".reveal").forEach((el) => io.observe(el));
