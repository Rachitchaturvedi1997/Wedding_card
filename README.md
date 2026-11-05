# Yashi & Siddanth — Wedding Invitation 💍

A premium, animated wedding-invitation website in royal emerald, ruby and gold.

**What guests see**
1. **Envelope opening** – the black-and-gold envelope video (portrait version on phones). Tap to open.
2. **Ganesh Ji darshan** – a gold Ganesh Ji drawn on in motion, rotating mandala, swinging temple bells, flickering diyas, falling marigold petals and the *Vakratunda Mahakaya* shloka, with music.
3. **The invitation** – shimmering gold-foil names, a hanging toran, an elephant parade, an invitation letter, a gold-foil *scratch to reveal* date and a live countdown.
4. **Celebrations** – animated cards for **Haldi, Mehendi, Sangeet, Baraat and Wedding & Reception**, each with its own motion artwork, dress code, directions and a ▶ Watch film.
5. **Invitation film** – a 60-second vertical (1080×1920) video with music, ready to download and share on WhatsApp.
6. **Venue & closing** – The Heritage Resorts with Google Maps directions.

## Edit the details
Everything (names, parents, event dates & times, dress codes, map link, countdown) is in **`js/data.js`**.

> After changing details, re-render the film so the video matches (see below).

## Files
| Path | What it is |
|---|---|
| `index.html`, `css/`, `js/` | The website |
| `js/art.js`, `css/art.css` | All hand-made SVG artwork & animations (Ganesh Ji, mandala, events…) |
| `assets/music.mp3` | Original background music (tanpura, santoor, bansuri, dholak, temple bells) |
| `assets/video/invitation.mp4` | Full invitation film |
| `assets/video/{ganesh-ji,haldi,mehendi,sangeet,baraat,reception}.mp4` | Individual event films |
| `tools/film.html` | Source of the film — open it in a browser to preview live |
| `tools/render-film.js` | Exports the film + event clips |
| `tools/make_music.py` | Generates the music |

## Re-make the music / film
```bash
python3 tools/make_music.py assets/music.mp3      # needs numpy + scipy + ffmpeg
python3 -m http.server 8765 &                     # serve the repo
node tools/render-film.js                         # needs Playwright + ffmpeg
```

To use your own song instead, replace `assets/music.mp3` (keep the file name).

## Publish (free, GitHub Pages)
Settings → Pages → *Deploy from a branch* → `main` / `(root)` → Save.
The invitation will be live at `https://rachitchaturvedi1997.github.io/Wedding_card/`.
