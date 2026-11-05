/* =====================================================================
   art.js — hand-built SVG artwork shared by the website and the video.
   Every drawing is vector, so it stays crisp on any screen.
   ===================================================================== */
(function (global) {
  const TAU = Math.PI * 2;
  const f = (n) => +n.toFixed(2);

  /* ---------- Shared gradients (inject once per page) ---------- */
  function defs() {
    return `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="g-gold" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#fff2c4"/><stop offset=".35" stop-color="#e8c66e"/>
      <stop offset=".7" stop-color="#c39338"/><stop offset="1" stop-color="#8a621d"/>
    </linearGradient>
    <linearGradient id="g-gold-h" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#9c7430"/><stop offset=".5" stop-color="#f6e2a2"/><stop offset="1" stop-color="#9c7430"/>
    </linearGradient>
    <radialGradient id="g-face" cx=".5" cy=".35" r=".75">
      <stop offset="0" stop-color="#fff0c2"/><stop offset=".55" stop-color="#eac16a"/><stop offset="1" stop-color="#b8862e"/>
    </radialGradient>
    <radialGradient id="g-ear" cx=".6" cy=".45" r=".8">
      <stop offset="0" stop-color="#f6dc95"/><stop offset=".7" stop-color="#cf9e45"/><stop offset="1" stop-color="#93681f"/>
    </radialGradient>
    <radialGradient id="g-ruby" cx=".35" cy=".3" r=".8">
      <stop offset="0" stop-color="#ff7a86"/><stop offset=".5" stop-color="#c3142f"/><stop offset="1" stop-color="#5e0614"/>
    </radialGradient>
    <radialGradient id="g-emerald" cx=".35" cy=".3" r=".8">
      <stop offset="0" stop-color="#8ff0c0"/><stop offset=".5" stop-color="#138a5a"/><stop offset="1" stop-color="#05371f"/>
    </radialGradient>
    <radialGradient id="g-glow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#ffe7a3" stop-opacity=".95"/><stop offset=".45" stop-color="#ffcf6a" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf6a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g-flame" cx=".5" cy=".75" r=".7">
      <stop offset="0" stop-color="#fffbe0"/><stop offset=".35" stop-color="#ffd54a"/><stop offset=".75" stop-color="#ff8a1a"/><stop offset="1" stop-color="#e2380f" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="g-brass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3d58a"/><stop offset=".5" stop-color="#c08a2c"/><stop offset="1" stop-color="#6e4610"/>
    </linearGradient>
    <radialGradient id="g-haldi" cx=".45" cy=".35" r=".7">
      <stop offset="0" stop-color="#fff07a"/><stop offset=".6" stop-color="#f5b50a"/><stop offset="1" stop-color="#c77700"/>
    </radialGradient>
    <linearGradient id="g-skin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f2c8a0"/><stop offset="1" stop-color="#d99a6c"/>
    </linearGradient>
    <linearGradient id="g-dhol" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d9363e"/><stop offset=".5" stop-color="#9a1022"/><stop offset="1" stop-color="#560812"/>
    </linearGradient>
    <linearGradient id="g-dusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a0b2e"/><stop offset=".55" stop-color="#8a1f3a"/><stop offset="1" stop-color="#f08a3c"/>
    </linearGradient>
    <linearGradient id="g-night" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14061f"/><stop offset="1" stop-color="#4a1350"/>
    </linearGradient>
    <linearGradient id="g-sun" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff6c8"/><stop offset="1" stop-color="#ffd24d"/>
    </linearGradient>
    <linearGradient id="g-leafy" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e9f3cf"/><stop offset="1" stop-color="#9cc46a"/>
    </linearGradient>
    <linearGradient id="g-maroon" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3b0712"/><stop offset="1" stop-color="#7d1426"/>
    </linearGradient>
    <linearGradient id="g-beam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe7ff" stop-opacity=".55"/><stop offset="1" stop-color="#ffe7ff" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>`;
  }

  /* ---------- Mandala ---------- */
  function petal(len, w) {
    return `M0 0C${f(-w)} ${f(-len * .35)} ${f(-w * .6)} ${f(-len * .85)} 0 ${f(-len)}C${f(w * .6)} ${f(-len * .85)} ${f(w)} ${f(-len * .35)} 0 0Z`;
  }
  function mandala({ stroke = "#d9b26a", sw = 0.6, fill = "none", cls = "" } = {}) {
    const rings = [
      { n: 8, r: 6, len: 12, w: 5 },
      { n: 16, r: 16, len: 11, w: 3.5 },
      { n: 24, r: 27, len: 10, w: 3 },
      { n: 32, r: 37, len: 9, w: 2.4 },
    ];
    let s = `<g class="${cls}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}">`;
    rings.forEach((g, gi) => {
      const p = petal(g.len, g.w);
      for (let k = 0; k < g.n; k++) {
        const a = (k / g.n) * 360 + (gi % 2 ? 180 / g.n : 0);
        s += `<path d="${p}" transform="rotate(${f(a)}) translate(0 ${-g.r})"/>`;
      }
      s += `<circle r="${g.r + 0.3}" />`;
    });
    // outer dots + scallops
    for (let k = 0; k < 48; k++) {
      const a = (k / 48) * TAU;
      s += `<circle cx="${f(Math.cos(a) * 47)}" cy="${f(Math.sin(a) * 47)}" r=".9" fill="${stroke}" stroke="none"/>`;
    }
    s += `<circle r="44"/><circle r="49.5" stroke-dasharray="1.5 2.5"/>`;
    s += `<circle r="2.5" fill="${stroke}" stroke="none"/></g>`;
    return `<svg viewBox="-51 -51 102 102" aria-hidden="true">${s}</svg>`;
  }

  /* ---------- Ganesh Ji ---------- */
  function ganesha() {
    return ganeshaRaw()
      .replace(/class="g-line thin"/g, 'class="g-line thin" fill="none" stroke="#5a3b0e" stroke-width=".9" stroke-linecap="round"')
      .replace(/class="g-line"/g, 'class="g-line" fill="none" stroke="#5a3b0e" stroke-width="1.6" stroke-linejoin="round"');
  }
  function ganeshaRaw() {
    const ear = `
      <path class="g-fill" d="M94 90C70 66 32 70 22 100C14 126 26 154 52 162C70 167 84 156 94 144Z" fill="url(#g-ear)"/>
      <path class="g-line" pathLength="1" d="M94 90C70 66 32 70 22 100C14 126 26 154 52 162C70 167 84 156 94 144"/>
      <path class="g-line thin" pathLength="1" d="M88 102C68 88 44 92 38 112C34 128 42 146 60 150"/>
      <path class="g-line thin" pathLength="1" d="M84 112C70 104 54 108 52 120C50 132 58 140 70 140"/>
      ${Array.from({ length: 9 }, (_, i) => {
        const t = i / 8, a = Math.PI * (0.75 + t * 1.0);
        return `<circle class="g-fill" cx="${f(60 + Math.cos(a) * 34)}" cy="${f(118 + Math.sin(a) * 40)}" r="2.2" fill="url(#g-ruby)"/>`;
      }).join("")}`;
    const crown = `
      <path class="g-fill" d="M86 84L90 54L101 64L109 36L120 12L131 36L139 64L150 54L154 84Z" fill="url(#g-gold)"/>
      <path class="g-line" pathLength="1" d="M86 84L90 54L101 64L109 36L120 12L131 36L139 64L150 54L154 84Z"/>
      <path class="g-line thin" pathLength="1" d="M96 76L104 52M144 76L136 52M112 70L120 30L128 70"/>
      <path class="g-fill" d="M82 80Q120 92 158 80L156 92Q120 104 84 92Z" fill="url(#g-gold)"/>
      <path class="g-line" pathLength="1" d="M82 80Q120 92 158 80L156 92Q120 104 84 92Z"/>
      ${[92, 104, 120, 136, 148].map((x, i) => `<circle class="g-fill" cx="${x}" cy="${i === 2 ? 91 : 88 + (i % 2) * 1.5}" r="${i === 2 ? 3.4 : 2.2}" fill="url(#${i % 2 ? "g-emerald" : "g-ruby"})"/>`).join("")}
      <circle class="g-fill" cx="120" cy="58" r="6.5" fill="url(#g-ruby)"/>
      <circle class="g-line" pathLength="1" cx="120" cy="58" r="8.5"/>
      <circle class="g-fill" cx="120" cy="9" r="3.2" fill="url(#g-gold)"/>`;
    return `
<svg class="ganesha" viewBox="0 0 240 262" aria-label="Lord Ganesha" role="img">
  <g class="g-halo">
    <circle cx="120" cy="120" r="116" fill="none" stroke="#e7c879" stroke-width="1" stroke-dasharray="2 6"/>
    <circle cx="120" cy="120" r="108" fill="none" stroke="#e7c879" stroke-width=".6"/>
    ${Array.from({ length: 36 }, (_, i) => `<path d="M120 6L121.6 16L118.4 16Z" fill="#e7c879" opacity=".75" transform="rotate(${i * 10} 120 120)"/>`).join("")}
  </g>
  <circle class="g-glow" cx="120" cy="124" r="100" fill="url(#g-glow)"/>
  <g class="g-ear-l">${ear}</g>
  <g transform="translate(240 0) scale(-1 1)"><g class="g-ear-r">${ear}</g></g>
  <!-- necklace -->
  <path class="g-neck" d="M88 146Q120 222 152 146" fill="none" stroke="#8a621d" stroke-width="1"/>
  <path class="g-fill" d="M90 150Q120 214 150 150" fill="none" stroke="#f3dc9a" stroke-width="3" stroke-linecap="round" stroke-dasharray="0 7"/>
  <circle class="g-fill" cx="120" cy="196" r="5" fill="url(#g-emerald)" stroke="#8a621d"/>
  <!-- head -->
  <path class="g-fill" d="M88 90C78 104 80 122 90 134C96 142 104 146 108 150L132 150C136 146 144 142 150 134C160 122 162 104 152 90Z" fill="url(#g-face)"/>
  <path class="g-line" pathLength="1" d="M88 90C78 104 80 122 90 134C96 142 104 146 108 150M152 90C162 104 160 122 150 134C144 142 136 146 132 150"/>
  ${crown}
  <!-- tilak -->
  <path class="g-fill" d="M113 98Q120 114 127 98" fill="none" stroke="#b3122b" stroke-width="2.6" stroke-linecap="round"/>
  <circle class="g-fill" cx="120" cy="106" r="2.6" fill="#b3122b"/>
  <!-- eyes -->
  <g class="g-eyes">
    <path class="g-fill" d="M99 117Q107 109 115 117Q107 122 99 117Z" fill="#fffaf0" stroke="#5a3b0e" stroke-width="1.2"/>
    <path class="g-fill" d="M125 117Q133 109 141 117Q133 122 125 117Z" fill="#fffaf0" stroke="#5a3b0e" stroke-width="1.2"/>
    <circle class="g-fill" cx="108" cy="116.3" r="2.8" fill="#2a1606"/>
    <circle class="g-fill" cx="132" cy="116.3" r="2.8" fill="#2a1606"/>
  </g>
  <path class="g-line thin" pathLength="1" d="M98 112Q107 106 116 112M124 112Q133 106 142 112"/>
  <!-- tusks -->
  <path class="g-fill" d="M107 140C98 150 96 162 100 172C105 162 109 152 113 144Z" fill="#fffaf0" stroke="#8a621d" stroke-width="1.2"/>
  <path class="g-fill" d="M133 140C139 145 141 149 140 154C136 150 132 147 129 144Z" fill="#fffaf0" stroke="#8a621d" stroke-width="1.2"/>
  <!-- trunk -->
  <g class="g-trunk">
    <path d="M120 120C120 146 114 166 119 184C124 200 146 205 153 192C159 181 146 174 141 184" fill="none" stroke="#6b4a12" stroke-width="23" stroke-linecap="round"/>
    <path d="M120 120C120 146 114 166 119 184C124 200 146 205 153 192C159 181 146 174 141 184" fill="none" stroke="url(#g-face)" stroke-width="19" stroke-linecap="round"/>
    ${[136, 148, 160, 172].map((y) => `<path d="M${f(111 - (y - 136) * .08)} ${y}Q${f(119 - (y - 136) * .08)} ${y + 4} ${f(127 - (y - 136) * .08)} ${y}" fill="none" stroke="#8a621d" stroke-width="1.1"/>`).join("")}
    <!-- modak held in the trunk -->
    <path class="g-fill" d="M134 190C134 180 142 176 146 172C150 176 158 180 158 190Z" fill="#fff4dc" stroke="#8a621d" stroke-width="1"/>
    <path d="M140 189L144 177M146 189V174M152 189L148 177" stroke="#c9a24a" stroke-width=".8"/>
  </g>
  <!-- lotus seat -->
  <g class="g-lotus">
    ${[-60, -36, -12, 12, 36, 60].map((x, i) => `<path class="g-fill" d="M${120 + x} 248C${120 + x - 14} 236 ${120 + x - 8} 220 ${120 + x} 212C${120 + x + 8} 220 ${120 + x + 14} 236 ${120 + x} 248Z" fill="url(#${i % 2 ? "g-gold" : "g-ruby"})" stroke="#6b4a12" stroke-width="1"/>`).join("")}
    <path class="g-line" pathLength="1" d="M48 250Q120 262 192 250"/>
  </g>
</svg>`;
  }

  /* ---------- Small ornaments ---------- */
  function corner() {
    return `<svg class="corner" viewBox="0 0 90 90" aria-hidden="true"><g fill="none" stroke="url(#g-gold)" stroke-width="1.6" stroke-linecap="round">
      <path d="M4 86V24Q4 4 24 4H86"/><path d="M11 86V27Q11 11 27 11H86" stroke-width=".8"/>
      <path d="M22 22C40 22 46 34 39 43C32 52 20 45 24 36C28 29 35 33 33 38"/>
      <path d="M46 11C52 20 62 20 68 11M11 46C20 52 20 62 11 68"/>
      <path d="M52 22C58 26 66 26 72 22M22 52C26 58 26 66 22 72" stroke-width=".9"/></g>
      <circle cx="17" cy="17" r="3.4" fill="url(#g-ruby)" stroke="#e8c66e" stroke-width=".8"/>
      <circle cx="57" cy="16" r="1.6" fill="#e8c66e"/><circle cx="16" cy="57" r="1.6" fill="#e8c66e"/></svg>`;
  }

  function divider(wide = 260) {
    const h = wide / 2;
    return `<svg class="divider-svg" viewBox="0 0 ${wide} 24" aria-hidden="true"><g fill="none" stroke="url(#g-gold-h)" stroke-width="1.2" stroke-linecap="round">
      <path d="M4 12H${h - 30}M${h + 30} 12H${wide - 4}"/>
      <path d="M${h - 30} 12C${h - 22} 4 ${h - 14} 4 ${h - 10} 12C${h - 14} 20 ${h - 22} 20 ${h - 30} 12Z"/>
      <path d="M${h + 30} 12C${h + 22} 4 ${h + 14} 4 ${h + 10} 12C${h + 14} 20 ${h + 22} 20 ${h + 30} 12Z"/></g>
      <path d="M${h} 2L${h + 8} 12L${h} 22L${h - 8} 12Z" fill="url(#g-ruby)" stroke="#e8c66e"/>
      <circle cx="${h - 40}" cy="12" r="1.8" fill="#e8c66e"/><circle cx="${h + 40}" cy="12" r="1.8" fill="#e8c66e"/></svg>`;
  }

  function diya(cls = "") {
    return `<svg class="diya ${cls}" viewBox="0 0 60 70" aria-hidden="true">
      <ellipse class="diya-glow" cx="30" cy="30" rx="26" ry="26" fill="url(#g-glow)"/>
      <path class="flame" d="M30 8C36 20 38 28 30 38C22 28 24 20 30 8Z" fill="url(#g-flame)"/>
      <path d="M6 44Q30 40 54 44Q50 62 30 64Q10 62 6 44Z" fill="url(#g-brass)" stroke="#6e4610" stroke-width="1"/>
      <path d="M10 48Q30 52 50 48" fill="none" stroke="#fff0b8" stroke-width="1" opacity=".7"/>
      <circle cx="18" cy="54" r="1.4" fill="#b3122b"/><circle cx="30" cy="57" r="1.4" fill="#0f6a48"/><circle cx="42" cy="54" r="1.4" fill="#b3122b"/></svg>`;
  }

  function bell() {
    return `<svg class="bell" viewBox="0 0 30 64" aria-hidden="true">
      <path d="M15 0V18" stroke="#c9a24a" stroke-width="1.2"/>
      ${[4, 10, 15].map((y) => `<circle cx="15" cy="${y}" r="2" fill="#f2a22b"/>`).join("")}
      <path d="M15 18C6 20 6 32 5 44H25C24 32 24 20 15 18Z" fill="url(#g-brass)" stroke="#6e4610" stroke-width=".8"/>
      <rect x="2" y="43" width="26" height="4" rx="2" fill="url(#g-gold)"/>
      <circle class="clapper" cx="15" cy="51" r="3.2" fill="url(#g-gold)"/></svg>`;
  }

  function marigold(cx, cy, r, cls = "") {
    let s = `<g transform="translate(${cx} ${cy})"><g class="marigold ${cls}">`;
    const rings = [[1, 14, "#e8731c"], [.78, 12, "#f59a1b"], [.55, 9, "#ffb42a"], [.32, 6, "#ffcf4a"]];
    rings.forEach(([k, n, c], ri) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 360 + ri * 13;
        s += `<ellipse cx="0" cy="${f(-r * k * .62)}" rx="${f(r * .2)}" ry="${f(r * k * .42)}" fill="${c}" transform="rotate(${f(a)})" stroke="#c4560f" stroke-width=".3"/>`;
      }
    });
    return s + `<circle r="${f(r * .14)}" fill="#a8460c"/></g></g>`;
  }

  function toran(count = 13) {
    // a gold rope with marigold strings & mango leaves
    let s = `<svg class="toran-svg" viewBox="0 0 400 110" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 6Q200 30 400 6" fill="none" stroke="url(#g-gold-h)" stroke-width="3"/>`;
    for (let i = 0; i < count; i++) {
      const x = 14 + (i * 372) / (count - 1);
      const y = 6 + 24 * (1 - Math.pow((x - 200) / 200, 2)) * 1;
      const len = i % 2 ? 72 : 46;
      s += `<g transform="translate(${f(x)} ${f(y)})"><g class="tstring" style="--k:${i}">`;
      if (i % 2) {
        for (let j = 0; j < 7; j++) s += `<circle cy="${6 + j * 9}" r="4.6" fill="${j % 2 ? "#ffb42a" : "#e8731c"}" stroke="#c4560f" stroke-width=".4"/>`;
        s += `<path d="M0 ${len - 4}l-3 10h6z" fill="#b3122b"/>`;
      } else {
        s += `<path d="M0 0C-9 12 -8 30 0 ${len}C8 30 9 12 0 0Z" fill="#2f8a3c" stroke="#1d5a26" stroke-width=".8"/><path d="M0 2V${len - 4}" stroke="#a7d68a" stroke-width=".7"/>`;
      }
      s += `</g></g>`;
    }
    return s + `</svg>`;
  }

  function petalsLayer(n = 18, kind = "marigold") {
    // DOM-free: returns spans; CSS animates them falling
    let s = `<div class="petals ${kind}" aria-hidden="true">`;
    for (let i = 0; i < n; i++) {
      const left = ((i * 37) % 100) + (i % 3) * 1.3;
      const dur = 6 + ((i * 13) % 7);
      const delay = -((i * 7) % 11) - (i % 4) * .7;
      const dx = ((i * 29) % 80) - 40;
      const sc = .7 + ((i * 17) % 6) / 10;
      s += `<i style="left:${f(left)}%;--dur:${dur}s;--delay:${f(delay)}s;--dx:${dx}px;--sc:${sc}"></i>`;
    }
    return s + `</div>`;
  }

  /* ---------- Event illustrations (viewBox 0 0 300 220) ---------- */
  function haldiArt() {
    const rays = Array.from({ length: 24 }, (_, i) => `<path d="M150 120L146 -40L154 -40Z" fill="#fff4b8" opacity="${i % 2 ? .35 : .6}" transform="rotate(${i * 15} 150 120)"/>`).join("");
    return `<svg class="art art-haldi" viewBox="0 0 300 220" aria-hidden="true">
      <rect width="300" height="220" fill="url(#g-sun)"/>
      <g class="spin-slow">${rays}</g>
      <circle cx="150" cy="120" r="56" fill="#fff8d6" opacity=".7"/>
      ${marigold(46, 70, 22, "spin-a")}${marigold(256, 66, 20, "spin-b")}${marigold(28, 168, 16, "spin-b")}${marigold(276, 170, 17, "spin-a")}
      <g class="bob">
        <ellipse cx="150" cy="196" rx="86" ry="10" fill="#7a5410" opacity=".25"/>
        <path d="M70 132Q150 150 230 132Q222 196 150 198Q78 196 70 132Z" fill="url(#g-brass)" stroke="#6e4610" stroke-width="1.2"/>
        <path d="M84 160Q150 176 216 160" fill="none" stroke="#fff0b8" stroke-width="1.4" opacity=".6"/>
        ${[96, 123, 150, 177, 204].map((x) => `<circle cx="${x}" cy="${172 - Math.abs(x - 150) * .12}" r="3" fill="url(#g-ruby)" stroke="#f3d58a" stroke-width=".6"/>`).join("")}
        <ellipse cx="150" cy="132" rx="80" ry="15" fill="url(#g-brass)" stroke="#6e4610" stroke-width="1.2"/>
        <ellipse cx="150" cy="133" rx="70" ry="11" fill="url(#g-haldi)"/>
        <path class="shine" d="M112 128Q140 122 168 127" fill="none" stroke="#fffbe0" stroke-width="3" stroke-linecap="round" opacity=".8"/>
        ${marigold(104, 126, 11)}${marigold(196, 127, 11)}${marigold(150, 121, 9)}
        <ellipse cx="128" cy="134" rx="9" ry="3.5" fill="#2f8a3c"/><ellipse cx="176" cy="135" rx="9" ry="3.5" fill="#2f8a3c" transform="rotate(-12 176 135)"/>
      </g>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle class="splash" style="--i:${i}" cx="${40 + i * 31}" cy="${36 + (i % 3) * 12}" r="${3 + (i % 3)}" fill="#f5b50a"/>`).join("")}
    </svg>`;
  }

  function mehendiArt() {
    const H = "#6a2410";
    // hand built from overlapping rounded shapes in the same skin colour
    const hand = `
      <g fill="url(#g-skin)">
        <rect x="112" y="98" width="84" height="96" rx="38"/>
        <rect x="120" y="150" width="68" height="70" rx="14"/>
        <rect x="113" y="36" width="19" height="84" rx="9.5" transform="rotate(-8 122 110)"/>
        <rect x="134" y="22" width="20" height="94" rx="10"/>
        <rect x="156" y="26" width="20" height="90" rx="10" transform="rotate(4 166 110)"/>
        <rect x="177" y="46" width="18" height="74" rx="9" transform="rotate(12 186 116)"/>
        <rect x="94" y="100" width="24" height="70" rx="12" transform="rotate(-38 112 162)"/>
      </g>`;
    const d = (path, w = 1.3) => `<path class="draw" pathLength="1" d="${path}" fill="none" stroke="${H}" stroke-width="${w}" stroke-linecap="round"/>`;
    let pat = "";
    // palm mandala
    pat += `<circle class="dot" cx="154" cy="146" r="5" fill="${H}"/>`;
    pat += d("M154 128a18 18 0 1 1-.1 0", 1.4);
    pat += d("M154 120a26 26 0 1 1-.1 0", .9);
    for (let i = 0; i < 12; i++) {
      pat += `<path class="draw" pathLength="1" d="M154 128C150 121 151 114 154 110C157 114 158 121 154 128Z" fill="none" stroke="${H}" stroke-width=".9" transform="rotate(${i * 30} 154 146)"/>`;
    }
    // fingers: caps + bands + vines
    const fingers = [[122, 46, -8], [144, 32, 0], [166, 36, 4], [186, 56, 12]];
    fingers.forEach(([x, y, r]) => {
      pat += `<g transform="rotate(${r} ${x} 110)">`;
      pat += `<path class="cap" d="M${x - 9} ${y + 14}Q${x} ${y - 6} ${x + 9} ${y + 14}Z" fill="${H}"/>`;
      pat += d(`M${x - 8} ${y + 26}H${x + 8}M${x - 8} ${y + 30}H${x + 8}`, 1);
      pat += d(`M${x} ${y + 36}C${x - 6} ${y + 44} ${x + 6} ${y + 50} ${x} ${y + 58}C${x - 6} ${y + 64} ${x + 6} ${y + 70} ${x} ${y + 76}`, 1);
      pat += `<circle class="dot" cx="${x - 4}" cy="${y + 47}" r="1.2" fill="${H}"/><circle class="dot" cx="${x + 4}" cy="${y + 67}" r="1.2" fill="${H}"/>`;
      pat += `</g>`;
    });
    // wrist bands
    pat += d("M122 182Q154 190 186 182", 1.4) + d("M122 190Q154 198 186 190", .9);
    for (let i = 0; i < 9; i++) pat += `<circle class="dot" cx="${126 + i * 7}" cy="${194 + Math.sin(i) * .5}" r="1.3" fill="${H}"/>`;
    pat += d("M122 202Q138 196 154 204Q170 212 186 204", 1.1);
    // thumb vine
    pat += d("M92 140C98 134 104 138 106 146C108 154 114 156 118 150", 1);
    return `<svg class="art art-mehendi" viewBox="0 0 300 220" aria-hidden="true">
      <rect width="300" height="220" fill="url(#g-leafy)"/>
      ${Array.from({ length: 14 }, (_, i) => `<path class="leaf" style="--i:${i}" d="M0 0C-8 -10 -6 -22 0 -30C6 -22 8 -10 0 0Z" fill="#4c8a2e" opacity=".55" transform="translate(${(i * 47) % 300} ${(i * 71) % 220}) rotate(${i * 40})"/>`).join("")}
      <g class="paisley-l" fill="none" stroke="#3d6e23" stroke-width="1.2" opacity=".8">
        <path d="M40 150C10 150 10 100 44 96C70 94 76 130 50 140C40 144 34 130 46 128"/>
        <path d="M262 76C292 76 292 126 258 130C232 132 226 96 252 86C262 82 268 96 256 98"/>
      </g>
      <g class="hand">${hand}${pat}</g>
      <g class="cone"><path d="M226 150L262 112L270 120L234 158Z" fill="#7a3a12" stroke="#4a1f08"/><path d="M226 150L218 160L234 158Z" fill="#4a1f08"/><path d="M244 130l8 8M250 124l8 8" stroke="#c98a40" stroke-width="1.2"/></g>
    </svg>`;
  }

  function sangeetArt() {
    const bulbs = Array.from({ length: 15 }, (_, i) => {
      const x = 10 + i * 20, y = 14 + 18 * (1 - Math.pow((x - 150) / 150, 2));
      return `<circle class="bulb" style="--i:${i}" cx="${x}" cy="${f(y + 6)}" r="3.6" fill="${["#ffd76a", "#ff7ab6", "#7ad7ff"][i % 3]}"/>`;
    }).join("");
    const notes = ["♪", "♫", "♩", "♬", "♪", "♫"].map((n, i) => `<text class="note" style="--i:${i}" x="${50 + i * 42}" y="170" font-size="${18 + (i % 3) * 5}" fill="#f6dd96">${n}</text>`).join("");
    return `<svg class="art art-sangeet" viewBox="0 0 300 220" aria-hidden="true">
      <rect width="300" height="220" fill="url(#g-night)"/>
      <g class="beam b1"><path d="M60 0L20 220H120Z" fill="url(#g-beam)"/></g>
      <g class="beam b2"><path d="M240 0L180 220H280Z" fill="url(#g-beam)"/></g>
      ${Array.from({ length: 22 }, (_, i) => `<circle class="star" style="--i:${i}" cx="${(i * 53) % 300}" cy="${30 + (i * 37) % 90}" r="${.8 + (i % 3) * .5}" fill="#fff"/>`).join("")}
      <path d="M0 14Q150 50 300 14" fill="none" stroke="#3c2a48" stroke-width="1.2"/>${bulbs}
      ${notes}
      <ellipse cx="150" cy="200" rx="90" ry="9" fill="#000" opacity=".35"/>
      <g class="dhol">
        <ellipse class="ring r1" cx="92" cy="140" rx="10" ry="30" fill="none" stroke="#ffd76a" stroke-width="2"/>
        <ellipse class="ring r2" cx="208" cy="140" rx="10" ry="30" fill="none" stroke="#ffd76a" stroke-width="2"/>
        <path d="M96 106Q150 92 204 106V174Q150 188 96 174Z" fill="url(#g-dhol)" stroke="#3b0710" stroke-width="1.4"/>
        <path d="M96 112L114 168L132 112L150 168L168 112L186 168L204 112" fill="none" stroke="#f6dd96" stroke-width="1.6"/>
        <path d="M96 106Q150 92 204 106M96 174Q150 188 204 174" fill="none" stroke="url(#g-gold-h)" stroke-width="4"/>
        <ellipse cx="96" cy="140" rx="12" ry="35" fill="#f4e6c4" stroke="#8a621d" stroke-width="2"/>
        <ellipse cx="204" cy="140" rx="12" ry="35" fill="#e8d6ae" stroke="#8a621d" stroke-width="2"/>
        <ellipse cx="96" cy="140" rx="5" ry="14" fill="#3b2a1a" opacity=".6"/>
        ${[120, 150, 180].map((x) => `<circle cx="${x}" cy="${140}" r="4" fill="url(#g-gold)"/>`).join("")}
      </g>
      <g class="stick s1"><path d="M60 70L94 128" stroke="#7a4a1c" stroke-width="5" stroke-linecap="round"/><path d="M60 70L94 128" stroke="#c48a4a" stroke-width="2" stroke-linecap="round"/></g>
      <g class="stick s2"><path d="M246 66L206 126" stroke="#7a4a1c" stroke-width="5" stroke-linecap="round"/><path d="M246 66L206 126" stroke="#c48a4a" stroke-width="2" stroke-linecap="round"/><path d="M206 126q-6 2-6 8" stroke="#7a4a1c" stroke-width="5" fill="none"/></g>
    </svg>`;
  }

  function elephant(cls = "") {
    return `<svg class="elephant ${cls}" viewBox="0 0 240 170" aria-hidden="true">
      <g class="e-body">
        <path class="e-tail" d="M44 82C32 90 30 104 36 118" fill="none" stroke="#6f6a72" stroke-width="4" stroke-linecap="round"/>
        <rect class="e-leg la" x="62" y="108" width="22" height="50" rx="9" fill="#857f88"/>
        <rect class="e-leg lb" x="138" y="108" width="22" height="50" rx="9" fill="#857f88"/>
        <path d="M40 92C40 52 80 38 124 40C160 42 176 60 176 84C176 110 160 124 120 124H64C48 124 40 110 40 92Z" fill="#a39daa" stroke="#5a5560" stroke-width="2"/>
        <rect class="e-leg lb" x="80" y="110" width="22" height="50" rx="9" fill="#a39daa" stroke="#5a5560" stroke-width="1.5"/>
        <rect class="e-leg la" x="154" y="108" width="22" height="50" rx="9" fill="#a39daa" stroke="#5a5560" stroke-width="1.5"/>
        <!-- caparison -->
        <path d="M70 46H150L144 106Q110 116 76 106Z" fill="#9a1022" stroke="#e8c66e" stroke-width="2"/>
        <path d="M78 56H142L138 98Q110 106 82 98Z" fill="none" stroke="#e8c66e" stroke-width="1" stroke-dasharray="3 2"/>
        <path d="M96 66h28l-4 24h-20z" fill="#0f6a48" stroke="#e8c66e"/>
        ${[80, 92, 104, 116, 128, 140].map((x) => `<path d="M${x} ${108 + (x === 80 || x === 140 ? -2 : 2)}v8" stroke="#e8c66e" stroke-width="2"/><circle cx="${x}" cy="${118 + (x === 80 || x === 140 ? -2 : 2)}" r="2.5" fill="#e8c66e"/>`).join("")}
        <!-- howdah -->
        <path d="M80 46V30H140V46Z" fill="url(#g-gold)" stroke="#6b4a12"/>
        <path d="M86 30V14M134 30V14" stroke="#c9a24a" stroke-width="2"/>
        <path d="M78 16Q110 -8 142 16Z" fill="#b3122b" stroke="#e8c66e" stroke-width="1.5"/>
        <circle cx="110" cy="2" r="3" fill="url(#g-gold)"/>
        <!-- head -->
        <path d="M168 50C186 40 206 46 210 66C214 84 206 96 198 102L176 104Z" fill="#a39daa" stroke="#5a5560" stroke-width="2"/>
        <path class="e-ear" d="M176 56C160 54 150 70 154 88C158 100 172 102 180 92Z" fill="#8f8996" stroke="#5a5560" stroke-width="1.5"/>
        <path d="M184 52L206 58L200 74Z" fill="#b3122b" stroke="#e8c66e"/>
        <circle cx="198" cy="66" r="2.6" fill="#1e1a20"/>
        <path d="M204 92L218 100" stroke="#fffaf0" stroke-width="4" stroke-linecap="round"/>
        <path class="e-trunk" d="M206 84C216 104 218 126 210 146C206 156 214 160 220 154" fill="none" stroke="#a39daa" stroke-width="13" stroke-linecap="round"/>
      </g></svg>`;
  }

  function baraatArt() {
    const burst = (cx, cy, c, k) => `<g transform="translate(${cx} ${cy})"><g class="fw" style="--k:${k}">${Array.from({ length: 16 }, (_, i) => `<circle cx="0" cy="-26" r="2" fill="${c}" transform="rotate(${i * 22.5})"/><path d="M0 -8V-20" stroke="${c}" stroke-width="1" transform="rotate(${i * 22.5 + 11})"/>`).join("")}</g></g>`;
    return `<svg class="art art-baraat" viewBox="0 0 300 220" aria-hidden="true">
      <rect width="300" height="220" fill="url(#g-dusk)"/>
      ${burst(64, 52, "#ffd76a", 0)}${burst(232, 44, "#ff8fb0", 1)}${burst(150, 30, "#a7f0ff", 2)}${burst(260, 96, "#ffd76a", 3)}${burst(36, 104, "#ffb37a", 4)}
      <path d="M0 176Q75 168 150 176T300 176V220H0Z" fill="#3b0712"/>
      ${Array.from({ length: 10 }, (_, i) => `<g transform="translate(${15 + i * 30} 182)"><path d="M0 0V-14" stroke="#c9a24a"/><path class="flame" d="M0 -14C3 -19 3 -22 0 -27C-3 -22 -3 -19 0 -14Z" fill="url(#g-flame)"/></g>`).join("")}
      <g transform="translate(58 46) scale(.8)">${elephant("walk-in-place").replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>
    </svg>`;
  }

  function receptionArt() {
    const garland = (x1, x2, y, sag) => {
      let s = "";
      for (let i = 0; i <= 14; i++) {
        const t = i / 14, x = x1 + (x2 - x1) * t, yy = y + sag * 4 * t * (1 - t);
        s += `<circle cx="${f(x)}" cy="${f(yy)}" r="3.4" fill="${i % 2 ? "#ffb42a" : "#fff4e0"}" stroke="#c4560f" stroke-width=".3"/>`;
      }
      return s;
    };
    return `<svg class="art art-reception" viewBox="0 0 300 220" aria-hidden="true">
      <rect width="300" height="220" fill="url(#g-maroon)"/>
      ${Array.from({ length: 26 }, (_, i) => `<path class="tw" style="--i:${i}" d="M0 -4L1 -1L4 0L1 1L0 4L-1 1L-4 0L-1 -1Z" fill="#ffe9a8" transform="translate(${(i * 61) % 300} ${(i * 43) % 200}) scale(${1 + (i % 3) * .4})"/>`).join("")}
      <!-- mandap -->
      <path d="M58 58Q150 -4 242 58Z" fill="url(#g-gold)" stroke="#6b4a12" stroke-width="1.4"/>
      <path d="M150 6V-6M70 58Q150 14 230 58" fill="none" stroke="#6b4a12"/>
      <circle cx="150" cy="10" r="4" fill="url(#g-ruby)"/>
      <rect x="50" y="56" width="200" height="10" rx="2" fill="url(#g-gold)" stroke="#6b4a12"/>
      ${[62, 228].map((x) => `<rect x="${x}" y="66" width="10" height="122" fill="url(#g-gold)" stroke="#6b4a12"/><rect x="${x - 4}" y="182" width="18" height="8" fill="url(#g-gold)"/>`).join("")}
      <g class="garland">${garland(72, 150, 66, 40)}${garland(150, 228, 66, 40)}</g>
      ${[100, 150, 200].map((x, i) => `<g transform="translate(${x - 6} 66) scale(.42)"><g class="hbell" style="--i:${i}">${bell().replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g></g>`).join("")}
      <!-- havan kund + agni -->
      <path d="M118 176H182L176 196H124Z" fill="url(#g-brass)" stroke="#6e4610"/>
      <path d="M112 170H188V178H112Z" fill="url(#g-gold)" stroke="#6e4610"/>
      <g class="fire">
        <path class="fl f1" d="M150 172C126 156 136 128 150 104C164 128 174 156 150 172Z" fill="url(#g-flame)"/>
        <path class="fl f2" d="M136 172C124 160 128 146 136 134C144 146 148 160 136 172Z" fill="url(#g-flame)"/>
        <path class="fl f3" d="M164 172C152 160 156 146 164 134C172 146 176 160 164 172Z" fill="url(#g-flame)"/>
      </g>
      <circle class="fireglow" cx="150" cy="150" r="60" fill="url(#g-glow)"/>
      ${marigold(84, 198, 9)}${marigold(216, 198, 9)}${marigold(106, 204, 7)}${marigold(194, 204, 7)}
    </svg>`;
  }

  function palace() {
    const dome = (x, w, h) => `<path d="M${x - w} ${h}Q${x - w} ${h - w * 1.3} ${x} ${h - w * 1.7}Q${x + w} ${h - w * 1.3} ${x + w} ${h}Z"/><path d="M${x} ${h - w * 1.7}V${h - w * 2.1}"/><circle cx="${x}" cy="${h - w * 2.2}" r="1.6"/>`;
    return `<svg class="palace" viewBox="0 0 320 160" aria-hidden="true"><g fill="none" stroke="url(#g-gold)" stroke-width="1.4" stroke-linejoin="round">
      <path d="M10 150H310"/><path d="M40 150V84H280V150"/><path d="M110 84V54H210V84"/>
      ${dome(160, 34, 54)}${dome(124, 12, 54)}${dome(196, 12, 54)}${dome(56, 14, 84)}${dome(264, 14, 84)}
      ${[60, 92, 124, 196, 228, 260].map((x) => `<path d="M${x - 10} 150V124Q${x} 108 ${x + 10} 124V150"/>`).join("")}
      <path d="M144 150V112Q160 92 176 112V150"/>
      ${[122, 140, 158, 176, 194].map((x) => `<path d="M${x - 5} 80V68Q${x} 62 ${x + 5} 68V80"/>`).join("")}
      <path d="M40 96H280M110 62H210" stroke-dasharray="2 3"/>
      <path d="M20 150V112M300 150V112"/>${dome(20, 7, 112)}${dome(300, 7, 112)}
    </g></svg>`;
  }

  global.ART = { defs, mandala, ganesha, corner, divider, diya, bell, marigold, toran, petalsLayer, haldiArt, mehendiArt, sangeetArt, baraatArt, receptionArt, elephant, palace };
})(window);
