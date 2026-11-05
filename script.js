/* =========================================================
   EDIT YOUR WEDDING DETAILS HERE
   Everything on the page is filled in from this object.
   ========================================================= */
const WEDDING = {
  blessing: "|| Shree Ganeshaya Namah ||",
  bride: "Yashi",
  groom: "Siddhant",
  monogram: "S&Y",
  brideParents: "Mr. & Mrs. Bride's Parents",
  groomParents: "Mr. & Mrs. Groom's Parents",
  familyName: "The Families of Yashi & Siddhant",
  cityText: "City, State",
  hashtag: "#YashiWedsSiddhant",
  rsvpBy: "10th January 2026",

  // Main wedding moment, used for the countdown (local time, YYYY-MM-DDTHH:MM)
  weddingDateTime: "2026-01-23T19:00",
  // How the date is written on the card (matches the video)
  dateText: "23rd January 2026",

  // WhatsApp number that receives RSVPs (country code + number, digits only)
  rsvpWhatsApp: "919999999999",

  // Shown in the footer
  contacts: [
    { name: "Family Contact", phone: "+91 99999 99999" },
  ],

  events: [
    {
      icon: "🌼",
      name: "Haldi",
      start: "2026-01-22T10:00",
      end: "2026-01-22T13:00",
      venue: "Venue Name",
      address: "Venue address",
      mapUrl: "https://maps.google.com/",
    },
    {
      icon: "🎶",
      name: "Sangeet",
      start: "2026-01-22T19:00",
      end: "2026-01-22T23:00",
      venue: "Venue Name",
      address: "Venue address",
      mapUrl: "https://maps.google.com/",
    },
    {
      icon: "💍",
      name: "Wedding",
      start: "2026-01-23T19:00",
      end: "2026-01-24T01:00",
      venue: "Venue Name",
      address: "Venue address",
      mapUrl: "https://maps.google.com/",
    },
  ],
};

/* ========================================================= */

const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, "0");

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

/* ---------- Envelope intro ---------- */
function setupIntro() {
  const intro = $("intro");
  const video = $("intro-video");
  const openBtn = $("open-btn");
  const skipBtn = $("skip-btn");

  // Portrait (phone) screens get the vertical version of the video
  const portrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
  video.poster = portrait ? "assets/poster-mobile.jpg" : "assets/poster.jpg";
  video.src = portrait ? "assets/intro-mobile.mp4" : "assets/intro.mp4";

  const finish = () => {
    intro.classList.add("done");
    document.body.classList.remove("locked");
    skipBtn.hidden = true;
    video.pause();
  };

  openBtn.addEventListener("click", () => {
    openBtn.classList.add("hide");
    skipBtn.hidden = false;
    video.currentTime = 0;
    video.muted = false;
    video.play().catch(() => { video.muted = true; video.play().catch(finish); });
  });
  video.addEventListener("ended", finish);
  video.addEventListener("error", finish);
  skipBtn.addEventListener("click", finish);

  $("replay").addEventListener("click", () => {
    window.scrollTo(0, 0);
    document.body.classList.add("locked");
    intro.classList.remove("done");
    openBtn.classList.add("hide");
    skipBtn.hidden = false;
    video.currentTime = 0;
    video.play().catch(finish);
  });
}

/* ---------- Text fields ---------- */
function fillFields() {
  const values = { ...WEDDING, dateText: WEDDING.dateText || formatDate(WEDDING.weddingDateTime) };
  document.querySelectorAll("[data-field]").forEach((el) => {
    const v = values[el.dataset.field];
    if (v != null) el.textContent = v;
  });
  document.title = `${WEDDING.bride} & ${WEDDING.groom} — Wedding Invitation`;
}

/* ---------- Add to calendar (.ics) ---------- */
function icsFor(ev) {
  const toICS = (iso) => {
    const d = new Date(iso);
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };
  const esc = (s) => String(s).replace(/([,;\\])/g, "\\$1");
  const body = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN",
    "BEGIN:VEVENT",
    `UID:${ev.name.replace(/\s/g, "")}-${toICS(ev.start)}@wedding`,
    `DTSTAMP:${toICS(new Date().toISOString())}`,
    `DTSTART:${toICS(ev.start)}`,
    `DTEND:${toICS(ev.end || ev.start)}`,
    `SUMMARY:${esc(`${ev.name} — ${WEDDING.bride} & ${WEDDING.groom}`)}`,
    `LOCATION:${esc(`${ev.venue}, ${ev.address}`)}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
}

function renderEvents() {
  const list = $("event-list");
  WEDDING.events.forEach((ev) => {
    const card = document.createElement("article");
    card.className = "event";
    card.innerHTML = `
      <div class="icon" aria-hidden="true"></div>
      <h3></h3>
      <p class="when"></p>
      <p class="time"></p>
      <p class="venue"><strong></strong><br /><span></span></p>
      <div class="actions">
        <a class="btn ghost map" target="_blank" rel="noopener">Directions</a>
        <a class="btn ghost cal">Add to Calendar</a>
      </div>`;
    card.querySelector(".icon").textContent = ev.icon || "✨";
    card.querySelector("h3").textContent = ev.name;
    card.querySelector(".when").textContent = formatDate(ev.start);
    card.querySelector(".time").textContent =
      formatTime(ev.start) + (ev.end ? ` – ${formatTime(ev.end)}` : " onwards");
    card.querySelector(".venue strong").textContent = ev.venue;
    card.querySelector(".venue span").textContent = ev.address;
    card.querySelector(".map").href = ev.mapUrl;
    const cal = card.querySelector(".cal");
    cal.href = icsFor(ev);
    cal.download = `${ev.name}.ics`;
    list.appendChild(card);
  });
}

/* ---------- Countdown ---------- */
function startCountdown() {
  const target = new Date(WEDDING.weddingDateTime).getTime();
  let timer;
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      $("countdown").innerHTML = '<div class="married">Happily Married</div>';
      clearInterval(timer);
      return;
    }
    $("cd-days").textContent = Math.floor(diff / 864e5);
    $("cd-hours").textContent = pad(Math.floor(diff / 36e5) % 24);
    $("cd-mins").textContent = pad(Math.floor(diff / 6e4) % 60);
    $("cd-secs").textContent = pad(Math.floor(diff / 1e3) % 60);
  };
  timer = setInterval(tick, 1000);
  tick();
}

/* ---------- RSVP via WhatsApp ---------- */
function setupRSVP() {
  $("rsvp-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const text = [
      `RSVP for ${WEDDING.bride} & ${WEDDING.groom}'s wedding`,
      `Name: ${f.get("name")}`,
      `Guests: ${f.get("guests")}`,
      `Response: ${f.get("attending")}`,
      f.get("message") ? `Blessings: ${f.get("message")}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WEDDING.rsvpWhatsApp}?text=${encodeURIComponent(text)}`, "_blank");
  });
}

function renderContacts() {
  const c = $("contact");
  WEDDING.contacts.forEach((p, i) => {
    if (i) c.append(" · ");
    const a = document.createElement("a");
    a.href = `tel:${p.phone.replace(/\s/g, "")}`;
    a.textContent = `${p.name}: ${p.phone}`;
    c.append(a);
  });
}

/* ---------- Fade sections in on scroll ---------- */
function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  els.forEach((e) => io.observe(e));
}

fillFields();
renderEvents();
startCountdown();
setupRSVP();
renderContacts();
setupReveal();
setupIntro();
