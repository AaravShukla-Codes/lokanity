# LOKANITY

**Your Place. Your People. Your Knowledge.**

LOKANITY is a hyperlocal community web app: tips, hidden spots and honest answers from people who know the lanes. Members join with just a nickname (no real name, email or phone), browse places, read short local guides, ask and answer neighbourhood questions, and collect stamps in a playful explorer passport called **LOKAQUEST**.

> **This is a frontend-only demo.** There is no backend, no database and no live AI. Every place, guide and post is made-up sample content, and everything you do is stored in your own browser.

---

## Table of contents

- [Highlights](#highlights)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Pages](#pages)
- [Features in detail](#features-in-detail)
- [LOKAQUEST rules](#lokaquest-rules)
- [Data and storage](#data-and-storage)
- [Privacy and safety](#privacy-and-safety)
- [Accessibility](#accessibility)
- [Responsive design and theming](#responsive-design-and-theming)
- [Customising the content](#customising-the-content)
- [Known limitations](#known-limitations)
- [Ideas for what's next](#ideas-for-whats-next)
- [License](#license)

---

## Highlights

- **Zero dependencies, zero build step.** Plain HTML, CSS and vanilla JavaScript. No frameworks, no npm, no CDN, no fonts or images fetched from the network. The logo is embedded in the stylesheet as a base64 PNG.
- **Five linked pages** (Home, Explore, Ask, Guides, Saved) that share one script and one stylesheet.
- **Nickname-only accounts**: log in, sign up, or just look around as a guest.
- **Seven sample cities**: Pune, Jaipur, Varanasi, Bengaluru, Delhi, Mumbai and Chennai.
- **LOKAQUEST**: an explorer passport with XP, levels, badges, challenges and mystery riddles.
- **LOKANITY A.I.**: a scripted demo assistant (clearly labelled as pre-written replies).
- **Animated vector city scene** with a procedural walk cycle, parallax and pins that light up as the explorer passes them.
- **Dark mode by default**, with a light theme toggle that is remembered.
- **Privacy-minded copy throughout**: "mention the area, never your door number."

---

## Quick start

No installation is required.

**Option 1: open the file**

Open `index.html` in a modern browser.

**Option 2: use a local server (recommended)**

Some browsers treat each `file://` page as a separate origin, which can make saved data and login state behave inconsistently between pages. A tiny local server avoids that:

```bash
# from the project folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

Any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, an S3 bucket) will also work because the site is just static files.

**Try it out**

1. Wait for the splash screen, then choose **Sign up** (pick a 3 to 20 character nickname and a password of 6+ characters), **Log in**, or **Just look around as a guest**.
2. Pick a city from the city strip, or tap a mood on Home.
3. Save a few places, open your **LOKAQUEST** passport and watch your XP grow.

---

## Project structure

```
lokanity/
├── index.html     Home feed          (data-page="feed")
├── explore.html   Places             (data-page="explore")
├── ask.html       Questions          (data-page="ask")
├── guides.html    Local guides       (data-page="guides")
├── saved.html     Saved list         (data-page="saved")
├── script.js      All behaviour: data, rendering, login, quest, scene, A.I. demo
└── style.css      All styling: themes, layout, animations, responsive rules
```

The five HTML files are near-identical shells. Each one contains the splash screen, the login overlay, the header, the sidebars, the A.I. dialog and a single page-specific `<div class="v" id="v-…">` view. The `data-page` attribute on `<html>` tells `script.js` which page it is running on.

### How `script.js` is organised

The file is split into numbered sections that run in order:

| # | Section | What it does |
|---|---------|--------------|
| 1 | Theme bootstrap | Applies the saved theme before the first paint to avoid a flash. |
| 2 | Session bootstrap | Remembers a logged-in session so the login overlay stays hidden. |
| 3 | Core app (+ v3 enhancements) | Sample data, rendering, filters, posts, answers, modals, saving, reporting, "Near me". |
| 4 | Explore banner | Parallax and click sparkle effects on the floating emoji bar. |
| 5 | Home | Hood Pulse (live ticker, animated counters), mood buttons, Spin the pin. |
| 6 | Theme toggle | Light/dark switch, persisted in `localStorage`. |
| 7 | Home CTA | Home banner and `data-go` shortcuts between pages. |
| 8 | Splash and login | Splash, sign up, log in, guest mode, log out. |
| 9 | LOKAQUEST | XP, levels, badges, challenges, mysteries, passport modal. |
| 10 | City scene | Procedural SVG city, walk cycle, parallax and discovery pins. |
| 11 | LOKANITY A.I. | Scripted chat assistant dialog. |

`style.css` follows the same layered approach, with commented sections for the floating emoji bar, arch-and-pin place cards, Hood Pulse, story cards, theme toggle, splash and login, the A.I. panel, the city scene, and the LOKAQUEST passport.

---

## Pages

| Page | File | What you'll find |
|------|------|------------------|
| **Home** | `index.html` | Greeting, live "Hood Pulse" ticker, sample-content counters, mood picker, Spin the pin, place "stories" and the community feed. |
| **Explore** | `explore.html` | Places grouped by city, with city and category filters, a "Near me" button, and a Cards / Area sketch toggle. |
| **Ask** | `ask.html` | Neighbourhood Q&A with topic chips, city filter and sort by recent or most helpful. |
| **Guides** | `guides.html` | Short practical guides, topic filter, saved-only filter, "Answers people liked" and "Fresh from neighbours". |
| **Saved** | `saved.html` | Everything you saved: places, guides and posts. |

Two more entries in the navigation open overlays instead of pages: **LOKAQUEST** (the passport) and **LOKANITY A.I.** (the assistant).

Moving between pages carries your filters, search text and any pending toast message across via `sessionStorage`, so navigation feels continuous even though each tab is its own HTML file. The splash screen plays once per visit rather than on every tab change.

---

## Features in detail

### Accounts (demo only)

- **Sign up** with a nickname (`3 to 20` letters, numbers or underscores), a password (6+ characters) and an optional home city.
- **Log in** or continue **as a guest**; log out from the profile dialog.
- Passwords are salted and hashed with SHA-256 (Web Crypto) before being stored in `localStorage`. This keeps a plain password out of storage, but it is **not real authentication**. See [Known limitations](#known-limitations).

### Places and exploration

- 12 sample places across the seven cities, in six categories: Food, Study, Shopping, Attractions, Services and Favorites.
- Place detail view with a description, a neighbour tip, sample neighbour notes, related questions and guides to read next, plus "Ask about this place" which pre-fills the composer.
- **Near me** uses the browser's geolocation only to pick the closest sample city (Haversine distance). The location is never saved or sent anywhere.
- **Area sketch** is a playful pin view, explicitly not a real map.
- Skeleton loading cards give a short "finding places" moment on each page load.

### Community posts and Q&A

- Post types: Recommendation, Study spot, Advice and Question. Questions also get a topic (Accommodation, Food, Transport, Education, Shopping, Local Services, Everyday Life).
- Composer rules: at least 10 and at most 500 characters, with a live counter and inline validation.
- Questions have a status of **Unanswered**, **Answered** or **Resolved**. The asker can mark their own question resolved.
- Answers can be marked **Helpful** (you can't upvote your own), and the most helpful answer rises to the top.
- **Report** a post with a reason; reports are stored locally only.
- **Share** uses the native share sheet where available, otherwise copies text to the clipboard.
- Comments on non-question posts, and a "Waiting for an answer" sidebar to nudge neighbours toward unanswered questions.

### Guides

- 5 sample guides. The first three have rich detail pages (short version, good to know, saving money, getting around, neighbour tips, quick questions, related places, keep-reading and conversations). Remaining guides fall back to generated generic sections.
- Every guide and place carries a clear "illustrative sample content" reminder.

### Home extras

- **Hood Pulse**: animated counters and a rotating live ticker built from sample posts and pins.
- **Mood picker**: jump to Explore pre-filtered by what you feel like (Hungry, Study, Shop, Wander, Services, Favorites).
- **Spin the pin**: a slot-machine style random place pick with a confetti burst.

### LOKANITY A.I. (scripted demo)

A chat panel with typing indicator, prompt chips and in-chat action buttons. It matches your message against a handful of intents (places, helpful tips, community questions, plan a day, greeting) and builds replies from the app's own sample data. **No AI API is called**, and every reply is labelled "Demo reply · sample content". It includes focus trapping, Escape-to-close and focus return to the opener.

### City scene

An original SVG scene built entirely in JavaScript: parallax skyline, landmarks, shopfronts with awnings and signs, street furniture, and a faceless explorer with a procedurally animated walk cycle. Pins glow as the explorer passes them, and on the login screen they trigger A.I.-style "discovery" moments. Rendering pauses when the scene is off-screen (`IntersectionObserver`) or the tab is hidden, and it becomes a static pose under reduced motion.

---

## LOKAQUEST rules

LOKAQUEST is a self-contained gamification layer. It is played **on trust**: it never checks your location or verifies a visit, and saved places are simply bookmarks.

**XP sources**

| Action | XP |
|--------|----|
| Save a place (stamp) | 10 |
| Complete a challenge ("I did this") | 25 |
| Solve a mystery riddle | 50 |

**Levels**

| Level | Title | XP needed |
|-------|-------|-----------|
| 1 | Newcomer | 0 |
| 2 | Wanderer | 40 |
| 3 | Wayfinder | 100 |
| 4 | Pathfinder | 200 |
| 5 | Trailblazer | 320 |
| 6 | Grand Voyager | 450 |

**Badges**

| Badge | How to earn it |
|-------|----------------|
| 🌱 First Step | Save your first place |
| 🧭 Explorer | Complete 3 challenges |
| 🍜 Food Scout | Save 3 food spots |
| 🌿 Nature Seeker | Save the 3 outdoor spots (ghat walk, deer loop, garden) |
| 🗺️ Local Legend | Complete 10 challenges |
| ✨ Mystery Solver | Solve a mystery challenge |

There are 10 place-based challenges and 2 mystery riddles. Unsaving a place does not remove a stamp or XP you've already earned. Resetting the passport clears XP, badges, stamps and challenges while leaving your saved places and posts untouched, and places that were already saved at the moment of reset won't re-stamp unless you unsave and save them again.

Separately, the **profile dialog** shows four community badges: Newcomer Sprout, Local Voice (first post), Helpful Neighbour (first answer or comment) and Trail Collector (3+ saved items).

---

## Data and storage

Everything lives in the browser. Nothing is sent to a server.

| Key | Storage | Purpose |
|-----|---------|---------|
| `lk2` | localStorage | Main app state: posts, saved items, liked items, nickname, reports. |
| `lk-theme` | localStorage | `dark` or `light`. |
| `lk-session` | localStorage | Logged-in nickname, or `guest`. |
| `lk-users` | localStorage | Demo accounts: nickname, salt, password hash, home city. |
| `lk-quest` | localStorage | LOKAQUEST progress (validated against known ids on load). |
| `lk-demo` | localStorage | Whether the demo-mode banner was dismissed. |
| `lk-nav` | sessionStorage | One-shot filter/search/toast hand-off between pages. |

To start completely fresh, clear this site's data in your browser (or run `localStorage.clear()` in the console).

Seed posts are re-synced on load: updates to the sample posts in `script.js` flow into existing browsers, while posts and replies you created are preserved.

---

## Privacy and safety

- Members appear only as a **nickname**. The app asks for no email, phone number or real name, and tells users not to use any as a nickname.
- Location is optional, used only in-browser for "Near me", and never stored.
- A built-in **Community guidelines** and **Privacy** dialog is available from every page.
- All user-generated text is HTML-escaped before rendering.
- The login screen, header and footer repeat the demo disclaimer so no one mistakes sample content for verified listings.

---

## Accessibility

- Semantic dialogs (`role="dialog"`, `aria-modal`, labelled headings), `aria-live` regions for toasts and the A.I. log, and `aria-pressed` / `aria-checked` on toggles.
- The app behind the login overlay is made `inert` while locked.
- Visible `:focus-visible` outlines, focus moved into opened dialogs and restored on close, and Escape closes overlays.
- `prefers-reduced-motion` is respected: the splash is shortened, the city scene becomes static, and confetti is skipped.
- Decorative emoji and SVGs are marked `aria-hidden`.

---

## Responsive design and theming

- Three-column desktop layout (navigation, content, side panel) that collapses to a bottom navigation bar on small screens, with safe-area insets for notched phones.
- Breakpoints from small phones up to very wide screens, plus `pointer: coarse` tweaks for touch devices.
- Decorative animation is tiered: tablets drop some layers and phones drop more.
- Theming is driven by CSS custom properties on `:root`, with `data-theme="dark"` (default) and `data-theme="light"` overrides, plus `color-scheme` and a `theme-color` meta tag.

---

## Customising the content

All sample data lives at the top of `script.js`.

| To change… | Edit |
|-----------|------|
| Cities and neighbourhoods | `LOCS` (labels like `"Pune · FC Road"`), then `CC` (coordinates for "Near me") and `CE` (city emoji) |
| Places | `PL` (the original six) and the `PL.push(...)` block that adds p7 to p12 |
| Neighbour notes on places | `EX`, keyed by place id |
| Guides | `GD` for cards, `GX` for the rich detail pages |
| Seed posts | `SEED` |
| Place categories / question topics / post types | `CATS`, `QC`, `KS` |
| LOKAQUEST balance | `DXP`, `LV`, `CH`, `MY`, `B` inside section 9 |
| A.I. replies and triggers | `R` and `INT` inside section 11 |

**Adding a new city:** add at least one entry to `LOCS`, add its coordinates to `CC` and an emoji to `CE`. The city strip, filters, composer and sign-up dropdown update automatically.

**Adding a new page:**

1. Copy an existing HTML file and set `data-page="yourpage"` plus a `<div class="v on" id="v-yourpage">` view.
2. Register the file in `PGS` and the tab in `NAV`.
3. Add a rendering branch for your page inside `all()`.

---

## Known limitations

- **Not real security.** Accounts, hashes and sessions are all client-side and can be read or edited by anyone with access to the browser. Don't reuse a real password.
- **Single device.** Data doesn't sync across browsers or devices, and no posts are visible to other people.
- **Sample content.** Places, guides and posts are illustrative and unverified. There is no moderation backend, so "Report" only records locally.
- **Scripted A.I.** Replies come from simple keyword matching over sample data.
- **Private-browsing and blocked storage.** If storage is blocked, the app still runs but progress is lost on reload (LOKAQUEST shows a warning in that case).
- **Shared markup.** The five HTML pages duplicate the same shell, so a change to the header, login overlay or A.I. dialog has to be copied into each file.
- **Page titles.** Every page uses the same `<title>`.

---

## Ideas for what's next

These are suggestions, not commitments:

- A small backend (auth, posts, comments, moderation queue) to make the community real.
- Real place data with verified listings and map tiles in place of the area sketch.
- Replace the scripted assistant with a live model behind a server-side API key, keeping the "sample / unverified" labelling honest.
- Extract the shared page shell into a template or a tiny build step to avoid duplication.
- Per-page `<title>` and meta descriptions, a web app manifest and offline support.
- Automated tests for the quest logic and storage migration.
- Localisation, starting with Hindi and other regional languages.

---

## License

No license has been chosen yet. Add a `LICENSE` file (for example MIT) before sharing or accepting contributions.
