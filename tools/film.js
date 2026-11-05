/* Invitation film: scenes on a 60-second timeline that matches assets/music.mp3 */
(function () {
  const D = window.DATA;
  const stage = document.getElementById("stage");
  document.body.insertAdjacentHTML("afterbegin", ART.defs());

  const corners = `<div class="frame"></div>${["tl", "tr", "bl", "br"].map((c) => `<div class="fc ${c}">${ART.corner()}</div>`).join("")}`;
  const ev = (k) => D.events.find((e) => e.key === k);

  function eventScene(e, day) {
    return `
      <div class="bg"></div>${corners}
      ${ART.petalsLayer(16, e.key === "reception" || e.key === "sangeet" ? "rose" : "marigold")}
      <p class="day up" style="--d:.2s">${day}</p>
      <div class="window zoom" style="--d:.1s">${ART[e.art]()}</div>
      <div class="ribbon up" style="--d:.7s">${e.hindi}</div>
      <h2 class="up" style="--d:1s">${e.name}</h2>
      <p class="when up" style="--d:1.4s">${e.date}</p>
      <p class="time up" style="--d:1.6s">${e.time}</p>
      <p class="desc up" style="--d:2.1s">${e.desc}</p>
      <span class="dress up" style="--d:2.6s;--swatch:${e.swatch}"><i></i>Dress code: ${e.dress}</span>
      <div class="up" style="--d:3s">${ART.divider()}</div>
      <p class="venue-line up" style="--d:3.2s">${D.venue}</p>
      <div class="diyas">${ART.diya()}${ART.diya()}</div>`;
  }

  const SCENES = [
    { id: "ganesh", s: 0, e: 8.2, cls: "s-ganesh drawing", html: `
      <div class="bg-emerald"></div><div class="rays"></div>
      <div class="bells">${ART.bell()}${ART.bell()}${ART.bell()}</div>
      <div class="g-wrap zoom" style="--d:.2s"><div class="g-mandala">${ART.mandala({ sw: .5 })}</div>
        <div class="g-arch"><div class="g-idol">${ART.ganesha()}</div></div></div>
      <p class="t1 deva up" style="--d:2.6s">॥ श्री गणेशाय नमः ॥</p>
      <p class="t2 deva up" style="--d:3.6s">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥</p>
      <div class="diyas">${ART.diya()}${ART.diya()}</div>
      ${ART.petalsLayer(22)}` },
    { id: "names", s: 8, e: 14.2, cls: "s-names", html: `
      <div class="bg-emerald"></div><div class="mandala-bg">${ART.mandala({ sw: .4 })}</div>
      <div class="toran">${ART.toran()}</div>${corners}
      <p class="eyebrow deva up" style="--d:.2s">॥ शुभ विवाह ॥</p>
      <p class="save up" style="--d:.5s">Save the date</p>
      <div class="up" style="--d:.6s">${ART.divider()}</div>
      <p class="names foil name-in" style="--d:.8s">${D.bride}</p>
      <p class="amp up" style="--d:1.5s">&amp;</p>
      <p class="names foil name-in" style="--d:1.7s">${D.groom}</p>
      <p class="line up" style="--d:2.6s">invite you to celebrate their wedding</p>
      <div class="plaque up" style="--d:3.1s"><span>Saturday</span><strong>23 · 01 · 2027</strong><span>${D.venue}</span></div>` },
    { id: "haldi", s: 14, e: 21.2, cls: "ev haldi", html: eventScene(ev("haldi"), "The celebrations begin") },
    { id: "mehendi", s: 21, e: 28.2, cls: "ev mehendi", html: eventScene(ev("mehendi"), "Colours of love") },
    { id: "sangeet", s: 28, e: 35.2, cls: "ev sangeet", html: eventScene(ev("sangeet"), "Music & dance") },
    { id: "baraat", s: 35, e: 42.2, cls: "ev baraat", html: eventScene(ev("baraat"), "The grand arrival") },
    { id: "reception", s: 42, e: 49.2, cls: "ev reception", html: eventScene(ev("reception"), "The sacred vows") },
    { id: "close", s: 49, e: 60, cls: "s-close", html: `
      <div class="bg-ruby"></div><div class="mandala-bg">${ART.mandala({ sw: .4 })}</div>${corners}
      <div class="palace up" style="--d:.2s">${ART.palace()}</div>
      <p class="eyebrow up" style="--d:.6s">All functions at</p>
      <p class="venue foil up" style="--d:.9s">${D.venue}</p>
      <p class="sub up" style="--d:1.3s">22 – 23 January 2027</p>
      <p class="msg up" style="--d:2s">Your presence and blessings will make our celebrations complete.</p>
      <p class="names foil name-in" style="--d:3s">${D.bride} &amp; ${D.groom}</p>
      <p class="date up" style="--d:3.8s">23 · 01 · 2027</p>
      <p class="tag up" style="--d:4.3s">#YASHIANDSIDDANTH</p>
      <div class="diyas">${ART.diya()}${ART.diya()}</div>
      ${ART.petalsLayer(24, "rose")}` },
  ];
  const DURATION = 60;
  const FADE = 0.7;

  SCENES.forEach((sc) => {
    const el = document.createElement("section");
    el.className = `scene ${sc.cls}`;
    el.innerHTML = sc.html;
    sc.el = el;
    stage.appendChild(el);
  });

  let anims = null;
  function collect() {
    anims = document.getAnimations().map((a) => {
      const t = a.effect && a.effect.target;
      const scEl = t && t.closest ? t.closest(".scene") : null;
      a.pause();
      return { a, sc: SCENES.find((s) => s.el === scEl) };
    });
  }

  function setTime(t) {
    if (!anims) collect();
    SCENES.forEach((sc) => {
      let o = 0;
      if (t >= sc.s && t < sc.e) {
        o = 1;
        if (sc.s > 0) o = Math.min(o, (t - sc.s) / FADE);
        if (sc.e < DURATION) o = Math.min(o, (sc.e - t) / FADE);
        if (sc.e >= DURATION) o = Math.min(o, (DURATION - t) / 1.6);
        if (sc.s === 0) o = Math.min(o, t / 0.5 + 0.0001);
      }
      sc.el.style.opacity = Math.max(0, Math.min(1, o));
      sc.el.style.visibility = o > 0 ? "visible" : "hidden";
    });
    anims.forEach(({ a, sc }) => {
      const local = sc ? Math.max(0, t - sc.s) : t;
      a.currentTime = local * 1000;
    });
  }

  window.FILM = { setTime, DURATION, SCENES: SCENES.map(({ id, s, e }) => ({ id, s, e })) };

  // Live preview when opened directly (not when rendering)
  if (!/render/.test(location.search)) {
    const music = document.getElementById("music");
    let t0 = null;
    const loop = (now) => {
      if (t0 === null) t0 = now;
      const t = music && !music.paused ? music.currentTime : ((now - t0) / 1000) % DURATION;
      setTime(t);
      requestAnimationFrame(loop);
    };
    document.fonts.ready.then(() => { collect(); requestAnimationFrame(loop); });
    addEventListener("click", () => { music.currentTime = 0; music.play(); });
  }
})();
