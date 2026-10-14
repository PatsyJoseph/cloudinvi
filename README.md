# The Hidden Concert Invitation

A web file manager that turns out to be a personal invitation. Open `Documents → Site Manual.mp4`.

`Site Manual.mp4` is **not a real video** — it's an interactive component (`src/components/MediaPlayer.jsx`). No video file is needed.

## Run it

```bash
npm install
npm run dev      # development (shows a badge listing unset placeholders)
npm run build    # production build in /dist
npm run preview  # preview the production build
```

## What to edit

Everything is in **`src/config/eventConfig.js`**. Anything set to `null` shows a visible `[… TBD]` placeholder — nothing is invented.

| Fill in | Where |
| --- | --- |
| Her name, your name | `recipientName`, `senderName` |
| Venue, time, dress code, cost, transport, getting home, meeting halfway, parents note | `fields` |
| Concert poster | `poster` — put the image in `public/` (e.g. `public/poster.jpg`) and set `poster: "poster.jpg"` |
| Bands (name, role, blurb, photos, songs, link) | `performers` — one slide each, in order; photos go in `public/performers/`, audio in `public/audio/` |
| Reply email / phone | `reply` |
| Copy of the letter and the answer options | `practical`, `question` |

## How her answer reaches you

There is **no backend**, and nothing pretends to send data. Her answer is delivered only if she chooses to:

- **Email / Text my answer** — opens her own mail/SMS app pre-filled (needs `reply.email` / `reply.phone`).
- **Copy my answer** — always available.
- Her pick is remembered in her browser only (`localStorage`), so reopening shows her choice.

If you want answers delivered automatically, add a form service (Formspree / Web3Forms / EmailJS) or a Supabase insert in `ResponseCard.jsx` — that needs an account/endpoint on your side.

### Band slideshow and music

Add three band images to `public/performers/`, then set a performer's `photos` array in `src/config/eventConfig.js` to paths such as `"performers/band-1.jpg"`. The photos rotate every five seconds while the band slide is on screen; visitors can also pick a photo using the dots.

Put audio files you have permission to use in `public/audio/` and add them to that performer's `songs` array, for example `{ title: "Song title", src: "audio/song.mp3" }`. Visitors start playback with the on-screen Play button; the first song fades in and the playlist advances when each track ends. Browsers do not allow websites to start audio automatically before a visitor interacts.

## Flow

`fm` (file manager) → `player` (fake video, glitch, expand, title card) → `invitation`.
If she closes the "video" after pressing play, the next open goes straight to the reveal. The invitation has "Back to the files" and "Replay the reveal".

## Accessibility & motion

Keyboard navigation (arrows, Enter, Backspace, Shift+F10), visible focus states, `prefers-reduced-motion` support (no shake/sweep, gentle fades), touch support (tap-to-select then tap-to-open, long-press menu, tap performers for a bottom sheet).

## Deploy

`npm run build`, then upload `dist/` to Netlify, Vercel, Cloudflare Pages, or GitHub Pages (`base` is relative).
