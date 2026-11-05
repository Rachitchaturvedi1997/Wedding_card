/* =========================================================
   EDIT YOUR WEDDING DETAILS HERE
   Everything on the page is filled in from this object.
   ========================================================= */
const WEDDING = {
  blessing: "|| Shree Ganeshaya Namah ||",
  bride: "Bride Name",
  groom: "Groom Name",
  brideParents: "Daughter of Mr. & Mrs. Bride's Parents",
  groomParents: "Son of Mr. & Mrs. Groom's Parents",
  familyName: "The Bride & Groom Families",
  cityText: "Jaipur, Rajasthan",
  hashtag: "#ForeverTogether",
  rsvpBy: "January 15, 2027",

  // Main wedding moment, used for the countdown (local time, YYYY-MM-DDTHH:MM)
  weddingDateTime: "2027-02-14T19:00",

  // WhatsApp number that receives RSVPs (country code + number, digits only)
  rsvpWhatsApp: "919999999999",

  // Shown in the footer
  contacts: [
    { name: "Family Contact", phone: "+91 99999 99999" },
  ],

  events: [
    {
      icon: "🌿",
      name: "Haldi",
      start: "2027-02-13T10:00",
      end: "2027-02-13T13:00",
      venue: "Family Residence",
      address: "123 Example Street, Jaipur",
      mapUrl: "https://maps.google.com/?q=Jaipur",
    },
    {
      icon: "🎶",
      name: "Sangeet",
      start: "2027-02-13T19:00",
      end: "2027-02-13T23:00",
      venue: "The Grand Banquet",
      address: "456 Example Road, Jaipur",
      mapUrl: "https://maps.google.com/?q=Jaipur",
    },
    {
      icon: "💍",
      name: "Wedding",
      start: "2027-02-14T19:00",
      end: "2027-02-15T01:00",
      venue: "The Royal Palace Lawns",
      address: "789 Example Avenue, Jaipur",
      mapUrl: "https://maps.google.com/?q=Jaipur",
    },
  ],
};

/* ========================================================= */

const pad = (n) => String(n).padStart(2, "0");

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

// Fill simple text fields
function fillFields() {
  const values = { ...WEDDING, dateText: formatDate(WEDDING.weddingDateTime) };
  document.querySelectorAll("[data-field]").forEach((el) => {
    const v = values[el.dataset.field];
    if (v != null) el.textContent = v;
  });
  document.title = `${WEDDING.bride} & ${WEDDING.groom} — Wedding Invitation`;
}

// Build an .ics calendar file for an event
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
  const list = document.getElementById("event-list");
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

function startCountdown() {
  const target = new Date(WEDDING.weddingDateTime).getTime();
  const el = (id) => document.getElementById(id);
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    el("cd-days").textContent = Math.floor(diff / 864e5);
    el("cd-hours").textContent = pad(Math.floor(diff / 36e5) % 24);
    el("cd-mins").textContent = pad(Math.floor(diff / 6e4) % 60);
    el("cd-secs").textContent = pad(Math.floor(diff / 1e3) % 60);
    if (diff === 0) {
      document.getElementById("countdown").innerHTML = "<p>Just married! 💐</p>";
      clearInterval(timer);
    }
  };
  const timer = setInterval(tick, 1000);
  tick();
}

function setupRSVP() {
  document.getElementById("rsvp-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const text = [
      `RSVP for ${WEDDING.bride} & ${WEDDING.groom}'s wedding`,
      `Name: ${f.get("name")}`,
      `Guests: ${f.get("guests")}`,
      `Response: ${f.get("attending")}`,
      f.get("message") ? `Message: ${f.get("message")}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WEDDING.rsvpWhatsApp}?text=${encodeURIComponent(text)}`, "_blank");
  });
}

function renderContacts() {
  const c = document.getElementById("contact");
  WEDDING.contacts.forEach((p, i) => {
    if (i) c.append(" · ");
    const a = document.createElement("a");
    a.href = `tel:${p.phone.replace(/\s/g, "")}`;
    a.textContent = `${p.name}: ${p.phone}`;
    c.append(a);
  });
}

fillFields();
renderEvents();
startCountdown();
setupRSVP();
renderContacts();
