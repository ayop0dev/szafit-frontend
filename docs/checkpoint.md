# Project Checkpoint — SZAFIT
**Audit Date:** 2026-06-11  
**Auditor:** Senior full-stack handover audit  
**Prior Checkpoint:** CHECKPOINT.md (2026-05-06 pre-launch sprint — preserved, do not delete)  
**Status:** Active site. Pre-launch sprint completed. **CRITICAL: Server credentials exposed in version-controlled file.**

---

## 1. Executive Summary

SZAFIT is a bilingual (Arabic default / English toggle) fitness coaching sales site for "Coach SZA" targeting Saudi Arabian customers. It is a **pure vanilla HTML/CSS/JavaScript multi-page site** deployed on Hostinger shared hosting at `szafit.com`. There is no frontend framework (no React, Next.js, Vue, or similar). The backend is a **WooCommerce-powered WordPress installation** running on a subdomain (`z.szafit.com`), used as a headless commerce API for product data and order creation.

The site uses Tailwind CSS (compiled locally), GSAP for animations, i18next for bilingual translation, and Font Awesome (CDN). Development was active through Q1–Q2 2026 and a documented pre-launch sprint was completed on 2026-05-06. The code quality is high for a vanilla site but carries several architectural risks:

- **Credential leak:** `.vscode/sftp.json` contains plaintext SFTP server credentials committed to git
- **Dual i18n systems conflict:** `translations.js` (module export) and `i18n-config.js` (i18next + JSON files) run in parallel and can diverge
- **Triplicated data sources:** Program data exists in three places (embedded JS array, PHP API, WooCommerce) requiring manual sync
- **No build pipeline, no CI/CD, no linting, no TypeScript**

**Confidence level:** High. All conclusions are based on direct code inspection of the full repository.

---

## 2. Detected Tech Stack

| Area | Detected Technology | Evidence / File | Confidence |
|------|---------------------|-----------------|------------|
| Site type | Multi-page static HTML | `index.html`, `product.html`, `thank-you.html`, etc. | High |
| Frontend JS | Vanilla ES Modules | `scripts/index.js` (`type="module"`), `import`/`export` | High |
| Styling framework | Tailwind CSS v3.4.10 | `package.json`, `tailwind.config.js`, `styles/tailwind.css` | High |
| Styling custom | Plain CSS | `css/style.css` (theme tokens + components) | High |
| Font | Changa (self-hosted variable font) | `assets/fonts/Changa/` | High |
| Currency symbol | Custom SAR font + inline SVG | `assets/fonts/saudi-riyal-font/`, `scripts/constants.js` | High |
| Animations | GSAP 3.12.5 + ScrollTrigger (CDN) | `index.html` CDN scripts, `scripts/landing-animations.js` | High |
| Icons | Font Awesome 6.5.2 (CDN) | `index.html` CDN `<link>` | High |
| i18n (primary) | i18next v23 + i18next-http-backend | `scripts/i18n-config.js`, `locales/ar.json`, `locales/en.json` | High |
| i18n (secondary) | Custom inline translation object | `scripts/translations.js` — used by `index.js` module | High |
| Package manager | npm | `package.json`, `package-lock.json` | High |
| Backend / CMS | WooCommerce (headless REST API v3) | API URLs in `checkout-modal.js`, `landing-programs.js` | High |
| WordPress host | `z.szafit.com` (subdomain) | Hardcoded in JS source | High |
| Local PHP API | PHP (Hostinger shared) | `api/programs.php` | High |
| Frontend host | Hostinger shared hosting | `.vscode/sftp.json`, `default.php` | High |
| Dark mode | CSS class-based (`dark`) | `tailwind.config.js` darkMode: 'class', `css/style.css` | High |
| Payment gateway | WooCommerce COD (Cash on Delivery) | `scripts/checkout-modal.js:365` | High |
| Deployment | SFTP via VS Code extension (auto-upload on save) | `.vscode/sftp.json` | High |
| CI/CD | None | — | High |
| TypeScript | Not used | — | High |
| Testing | None automated | — | High |
| Analytics | None detected | — | High |

---

## 3. Repository Structure

```
szafit/
├── index.html                    # Homepage / landing page (primary entry point)
├── product.html                  # Single product detail page (?id=N)
├── thank-you.html                # Post-order confirmation (?order_id=N)
├── checkout.html                 # Standalone checkout page (status: Review)
├── products.html                 # Product listing page (status: Review)
├── product-single.html           # Product detail variant (status: Review)
├── about.html                    # About page (not in main nav)
├── success-stories.html          # Success stories page (not in main nav)
├── booking.html                  # Booking page (not in main nav)
├── contact.html                  # Contact page (not in main nav)
├── app.html                      # Mobile app info page (not in main nav)
├── 404.html                      # 404 error page
├── test.html                     # Developer scratch file — should not be on prod
├── default.php                   # Hostinger default placeholder — not project code
│
├── scripts/
│   ├── index.js                  # ES Module entry for index.html
│   ├── constants.js              # API endpoint, SAR SVG, embedded program data
│   ├── translations.js           # Inline AR/EN translation object (parallel i18n)
│   ├── i18n-config.js            # i18next init, DOM update, toggle functions
│   ├── landing-programs.js       # Program API fetch + card rendering
│   ├── landing-events.js         # Event handlers (lang, theme, scroll, CTA, checkout)
│   ├── landing-animations.js     # GSAP animations, counters, marquee, stories loop
│   ├── checkout-modal.js         # Checkout modal UI + WooCommerce order POST
│   ├── checkout.js               # Standalone checkout page JS
│   ├── product-page.js           # Single product page logic
│   ├── utils.js                  # mapWooProduct(), parseRequirements(), etc.
│   └── archive/
│       ├── premium-landing-old.js           # Superseded old theme JS
│       └── premium-landing-refactored.backup.js  # Backup of a prior refactor
│
├── css/
│   └── style.css                 # Theme CSS variables + custom components
│
├── styles/
│   ├── tailwind-input.css        # Tailwind source (input)
│   └── tailwind.css              # Compiled Tailwind (output, committed to git)
│
├── api/
│   └── programs.php              # PHP programs data endpoint (hardcoded JSON)
│
├── locales/
│   ├── ar.json                   # Arabic translations (i18next)
│   └── en.json                   # English translations (i18next)
│
├── assets/
│   ├── images/
│   │   ├── hero/front.webp
│   │   ├── avatars/man-1.webp    # Only 1 male avatar exists
│   │   ├── avatars/woman-1.webp  # Only 1 female avatar exists
│   │   └── programs/             # Local program cover images (4 files)
│   ├── fonts/
│   │   ├── Changa/               # Self-hosted variable font (7 weights)
│   │   └── saudi-riyal-font/     # SAR currency symbol font
│   ├── Saudi_Riyal_Symbol-2.svg
│   └── sar.png
│
├── vendor/
│   ├── fontawesome/              # Partial local FA (CDN is actual source)
│   └── gsap/                     # Partial local GSAP (CDN is actual source)
│
├── docs/                         # Developer docs (excluded from SFTP upload)
│   ├── pre-lanuch-TASK.md
│   ├── CHECKPOINT-DEPLOY.md
│   ├── TEST-CHECKLIST.md
│   ├── Brand-colors.md
│   ├── programs_descrption.md
│   ├── website_complete_description.md
│   ├── wc-product-export-*.csv   # WooCommerce product export (reference data)
│   └── ... (12+ other docs)
│
├── tailwind.config.js
├── package.json
├── package-lock.json
├── CHECKPOINT.md                 # Pre-launch checkpoint (2026-05-06) — keep
├── .vscode/sftp.json             # ⚠️ CRITICAL: Plaintext SFTP credentials in git
└── .claude/settings.local.json
```

---

## 4. Active Files & Folders

| File / Folder | Active? | Reason |
|---------------|---------|--------|
| `index.html` | Yes | Primary entry point; all major sections |
| `product.html` | Yes | Linked from program cards via `?id=N` |
| `thank-you.html` | Yes | Post-checkout redirect target |
| `scripts/index.js` | Yes | Homepage JS entry point |
| `scripts/constants.js` | Yes | Imported by 3 scripts; shared data layer |
| `scripts/landing-programs.js` | Yes | Program rendering + API fetch |
| `scripts/landing-events.js` | Yes | All event handlers |
| `scripts/landing-animations.js` | Yes | All GSAP logic |
| `scripts/checkout-modal.js` | Yes | Checkout flow; loaded on all pages |
| `scripts/product-page.js` | Yes | Handles product.html |
| `scripts/utils.js` | Yes | Imported by programs + product page |
| `scripts/i18n-config.js` | Yes | Global i18next; loaded on all pages |
| `scripts/translations.js` | Yes (redundant) | Used by index.js ES module in parallel to i18next |
| `css/style.css` | Yes | Theme tokens + component styles |
| `styles/tailwind.css` | Yes | Compiled Tailwind output |
| `api/programs.php` | Yes | Primary program data endpoint |
| `locales/ar.json` | Yes | Arabic strings for i18next |
| `locales/en.json` | Yes | English strings for i18next |
| `assets/fonts/` | Yes | Self-hosted fonts loaded in all pages |
| `assets/images/` | Yes | Hero + avatar images |
| `tailwind.config.js` | Yes | Tailwind build config |
| `404.html` | Yes | Error page |

---

## 5. Unused / Legacy / Suspicious Files

| File / Folder | Label | Reason |
|---------------|-------|--------|
| `scripts/archive/premium-landing-old.js` | **Probably Remove** | References `dark-theme.css` (does not exist); completely superseded |
| `scripts/archive/premium-landing-refactored.backup.js` | **Probably Remove** | Backup of an intermediate refactor; no production references |
| `scripts/checkout.js` | **Review** | Standalone checkout page JS; unclear if `checkout.html` is still used or if modal replaced it |
| `checkout.html` | **Review** | May be orphaned — checkout modal approach appears to have replaced standalone checkout page |
| `products.html` | **Review** | In Tailwind content array, exists on disk, but not linked in main nav |
| `product-single.html` | **Review** | Another product detail page variant; may be superseded by `product.html` |
| `about.html` | **Review** | Not in main nav; may be accessible but not discoverable |
| `success-stories.html` | **Review** | Not in main nav |
| `booking.html` | **Review** | Not in main nav; may be standalone flow |
| `contact.html` | **Review** | Not in main nav |
| `app.html` | **Review** | App info page; not in main nav |
| `test.html` | **Probably Remove** | Developer scratch file; should not be on production server |
| `default.php` | **Do Not Touch Yet** | Hostinger default placeholder; investigate before removing — may be served if no index is found |
| `vendor/fontawesome/` | **Review** | Partial local copy; CDN is actual dependency. Wastes upload bandwidth |
| `vendor/gsap/` | **Review** | Partial local copy; CDN is actual dependency |
| `assets/Saudi_Riyal_Symbol-2.svg` | **Review** | SVG file but inline SVG in `constants.js` is used instead |
| `assets/sar.png` | **Review** | PNG SAR symbol; unclear if referenced in active pages |
| `styles/tailwind.css` | **Review** | Compiled output committed to git — should be in `.gitignore` |
| `docs/` | **Keep** | Developer docs; already excluded from SFTP upload |
| `CHECKPOINT.md` | **Keep** | Previous checkpoint; valuable sprint history |

---

## 6. WordPress / Headless CMS Integration

### API Type
**WooCommerce REST API v3** (headless), accessed from browser JavaScript. The WooCommerce site runs at `z.szafit.com`.

### API Endpoints Found

| Endpoint | File | Method | Purpose |
|----------|------|--------|---------|
| `/api/programs.php` | `landing-programs.js` | GET | Local PHP programs (primary fallback) |
| `https://z.szafit.com/wp-json/wc/v3/products` | `landing-programs.js` | GET | All products (secondary fallback) |
| `https://szafit.com/wp-json/wc/v3/products` | `landing-programs.js` | GET | Production WC (tertiary fallback) |
| `https://z.szafit.com/wp-json/wc/v3/products/{id}` | `product-page.js` | GET | Single product |
| `https://z.szafit.com/wp-json/wc/v3/orders` | `checkout-modal.js` | POST | Create order |
| `https://z.szafit.com/wp-json/wc/v3/checkout` | `checkout-modal.js` | GET | Checkout field definitions |

### Data Fallback Chain (programs)
1. `/api/programs.php` — same-origin PHP, no CORS issues
2. `z.szafit.com/wp-json/wc/v3/products` — WooCommerce REST
3. `szafit.com/wp-json/wc/v3/products` — production WC
4. `EMBEDDED_PROGRAMS_DATA` in `constants.js` — hardcoded JS array

### Content / Products
6 fitness programs, all in WooCommerce with bilingual (AR + EN) names in a single field:
- Zero to Fit (99 SAR) — Foundation tag
- Tone your Body (149 SAR) — Sculpt tag
- Burn X (149 SAR) — Burn tag
- VIP Fit Club (600 SAR) — VIP tag
- After Pregnancy (129 SAR) — Postpartum tag
- Challenge (199 SAR) — Challenge tag

### Taxonomies
- Product Tags: Foundation, Sculpt, Burn, VIP, Postpartum, Challenge

### Media / Images
- Product images: `https://z.szafit.com/wp-content/uploads/2026/02/`
- Fallback: Unsplash URLs hardcoded in `constants.js`
- Hero / avatars: self-hosted in `assets/images/`

### Menus / Navigation
- Hardcoded in each HTML file — **not CMS-driven**

### SEO
- Basic `<meta name="description">` present on all pages
- **No Open Graph, Twitter Card, JSON-LD structured data, sitemap.xml, or robots.txt**

### Preview / Draft Mode
- Not implemented

### Authentication
- WooCommerce order creation (POST `/wp-json/wc/v3/orders`) is called **without Consumer Key / Application Password**. This will fail unless WooCommerce is specially configured for public order creation. Status: **Unknown — needs verification on production**.

### Environment Variables
- **None.** All API URLs, including WC base domain, are hardcoded in JS source files.

---

## 7. Routing / Pages Map

| Route | Source File | Purpose | Data Source | Status |
|-------|-------------|---------|-------------|--------|
| `/` | `index.html` | Homepage: hero, programs, method, app, stories, CTA | PHP API → WC API → embedded JS | Active |
| `/product.html?id=N` | `product.html` + `product-page.js` | Single program detail | WC API → embedded JS | Active |
| `/thank-you.html?order_id=N` | `thank-you.html` | Post-purchase confirmation | URL param | Active |
| `/checkout.html` | `checkout.html` + `checkout.js` | Standalone checkout | URL params | Review — may be orphaned |
| `/products.html` | `products.html` | Product listing | Unknown | Review |
| `/product-single.html` | `product-single.html` | Product detail variant | Unknown | Review |
| `/about.html` | `about.html` | Coach bio | Static | Review |
| `/success-stories.html` | `success-stories.html` | Testimonials | Static | Review |
| `/booking.html` | `booking.html` | Booking flow | Unknown | Review |
| `/contact.html` | `contact.html` | Contact | Static | Review |
| `/app.html` | `app.html` | Mobile app info | Static | Review |
| `/404.html` | `404.html` | 404 error | Static | Active |
| `/api/programs.php` | `api/programs.php` | Programs JSON API | Hardcoded PHP array | Active |
| `/test.html` | `test.html` | Developer scratch | None | Probably Remove |

---

## 8. Components Map

### Shared (all pages)
- **Nav bar** — fixed top, logo, desktop links, lang toggle, theme toggle, mobile menu
- **Mobile menu drawer** — hidden by default, toggled by hamburger button
- **Checkout modal** — injected by `checkout-modal.js` into `<body>` on all pages
- **Pre-init dark mode script** — inline `<script>` in `<head>` reads `localStorage.theme`

### Homepage Sections (`index.html`)
- **Hero** — heading, sub-heading, dual CTA buttons, hero card (stats + checklist), parallax orbs, infinite marquee
- **Programs grid** (`#programsGrid`) — dynamically rendered; 6 cards from API or fallback
- **Stats strip** (`#stats`) — animated counters (1200+, 6, 4.9★)
- **Method section** — 4 feature cards + live-stats card with progress bars
- **App section** — CSS-only phone mockup UI + 4 feature rows
- **Stories section** (`#stories`) — infinite-scroll testimonial marquee (7 cards, 2 avatar images)
- **Final CTA section** (`#final`) — enrollment card + WhatsApp button

### Product Detail (`product.html`)
- Product image, name tag, summary, description, price, requirements checklist
- "Enroll Now" button → opens checkout modal

### Thank-You Page (`thank-you.html`)
- Branded order confirmation badge with order ID from URL param
- WhatsApp CTA link
- 3-step next-steps guide

### Checkout Modal (`checkout-modal.js`)
- Overlay + dialog, billing form (name, phone, email), program summary, submit
- Styles injected as `<style>` element on init

---

## 9. Data Flow

```
WordPress CMS (z.szafit.com)
  WooCommerce Products DB
    │
    ├── GET /wp-json/wc/v3/products
    │     → landing-programs.js (fallback #2)
    │         → mapWooProduct() [utils.js]
    │             → renderPrograms() → #programsGrid DOM
    │
    └── GET /wp-json/wc/v3/products/{id}
          → product-page.js
              → mapWooProduct() → renderProduct() → product.html DOM

Local PHP (/api/programs.php)
  Hardcoded 6-program array → JSON
    → landing-programs.js (primary fallback #1)
        → mapWooProduct() → renderPrograms()

Embedded JS (constants.js: EMBEDDED_PROGRAMS_DATA)
  Last-resort; loaded synchronously on page parse
    → landing-programs.js (final fallback #4 after all network fails)

User checkout flow:
  User clicks program CTA
    → product.html?id=N
        → user clicks "Enroll Now"
            → openCheckoutModal(product)
                → user fills billing form
                    → POST /wp-json/wc/v3/orders (NO auth credentials)
                        → on success: redirect to /thank-you.html?order_id=X
                        → on failure: error message in modal

Language toggle (window.toggleLanguage / langToggle button):
  → Updates localStorage.lang
  → Updates <html lang> and dir attributes
  → Re-renders all data-i18n elements (i18next DOM update)
  → Fires window CustomEvent 'languageChanged'
  → product-page.js + checkout modal listen and re-render

Theme toggle (themeToggle button):
  → Toggles 'dark' class on <html>
  → Updates localStorage.theme
```

---

## 10. Environment Variables

**There are no environment variables in this project.** All configuration is hardcoded in source files.

| Config Value | Hardcoded Location | Risk if Changed |
|--------------|-------------------|-----------------|
| WC API base URL (`z.szafit.com`) | `checkout-modal.js`, `product-page.js`, `landing-programs.js` | All API calls break |
| SFTP host IP | `.vscode/sftp.json` | **Critical — in git** |
| SFTP username | `.vscode/sftp.json` | **Critical — in git** |
| SFTP password | `.vscode/sftp.json` | **Critical — in git** |
| WhatsApp number | `index.html:544`, `thank-you.html` | CTA calls wrong number |
| Payment method slug | `checkout-modal.js:365` — `'cod'` | Orders fail with wrong gateway |
| WC Consumer Key | Missing entirely | Cannot authenticate WC API |
| WC Consumer Secret | Missing entirely | Cannot authenticate WC API |

---

## 11. Build, Run & Deploy

### npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `build:css` | `tailwindcss -i ./styles/tailwind-input.css -o ./styles/tailwind.css --minify` | Compile Tailwind CSS |
| `watch:css` | `tailwindcss -i ./styles/tailwind-input.css -o ./styles/tailwind.css --watch` | Watch and recompile CSS |

### Local Development
```bash
npm install            # Install devDep (tailwindcss)
npm run watch:css      # Start Tailwind watcher
# Open with a local HTTP server — NOT file:// (i18next JSON fetch fails on file://)
# e.g.: npx serve . OR VS Code Live Server
```

### Build
```bash
npm run build:css      # One-time CSS compile + minify
```
No other build step. HTML, JS, and PHP are served as-is.

### Deploy
- VS Code SFTP extension reads `.vscode/sftp.json`
- `uploadOnSave: true` — files upload automatically on save
- Remote: `/home/u431418749/domains/szafit.com/public_html`
- Ignores: `.vscode/`, `.claude/`, `docs/`, `_pre-used/`

### Known Blockers
1. `styles/tailwind.css` must be rebuilt after changing any HTML/JS Tailwind classes
2. Checkout POST likely fails without WooCommerce auth — **unverified on production**
3. SFTP credentials must be rotated before any further development

---

## 12. Current Problems

### 🔴 Critical

| # | Problem | Evidence | Impact | Suggested Fix |
|---|---------|----------|--------|---------------|
| C1 | **SFTP credentials in git** | `.vscode/sftp.json` has plaintext host IP, username, password | Full server access for anyone who reads this repo | Rotate password immediately; add to `.gitignore`; purge from git history |
| C2 | **WooCommerce orders API called without auth** | `checkout-modal.js` POSTs to `/wp-json/wc/v3/orders` with no Consumer Key/Secret | Orders will 401 unless WC is publicly writable (which is itself a security risk) | Implement PHP proxy with server-side WC credentials |
| C3 | **No `.gitignore`** | No `.gitignore` found at root | `node_modules/`, credentials, compiled CSS all potentially tracked | Create standard `.gitignore` immediately |

### 🟠 High

| # | Problem | Evidence | Impact | Suggested Fix |
|---|---------|----------|--------|---------------|
| H1 | **Dual i18n systems** | `translations.js` (module) + `i18n-config.js` (i18next) run in parallel; checkout modal has a third copy | Language content can diverge between the two systems | Consolidate to i18next + JSON files only |
| H2 | **Three data sources for programs** | `constants.js`, `api/programs.php`, WooCommerce DB — all manually synced | Program change must be applied in 3 places | Single source of truth via authenticated WC API or PHP proxy |
| H3 | **`SAR_ICON_SVG` defined 3 times** | `constants.js:7`, `checkout-modal.js:9`, `checkout.js:12` | SVG change must be applied in 3 files | Export from `constants.js` only |
| H4 | **`test.html` on production server** | File exists + SFTP auto-uploads on save | Exposes dev scratch to public | Delete file or add to SFTP ignore |
| H5 | **No robots.txt or sitemap.xml** | Not found anywhere in repo | No crawler control; poor SEO | Create both files |
| H6 | **No Open Graph / Twitter Card / JSON-LD** | Inspected `<head>` on all pages | Poor social sharing; missing structured data for search | Add to all page `<head>` elements |

### 🟡 Medium

| # | Problem | Evidence | Impact | Suggested Fix |
|---|---------|----------|--------|---------------|
| M1 | **CSP via `<meta>` not HTTP headers** | `<meta http-equiv="Content-Security-Policy">` in all pages | Meta CSP cannot block all vectors; HTTP header CSP is authoritative | Move CSP to `.htaccess` or server config |
| M2 | **Compiled Tailwind CSS in git** | `styles/tailwind.css` committed | Merge conflicts; bloated diffs | Add to `.gitignore`; rebuild at deploy time |
| M3 | **`default.php` in root** | Hostinger placeholder in project root | Confusing; may serve if no index.html found | Exclude from SFTP or investigate |
| M4 | **Only 2 avatars for 7 testimonials** | `assets/images/avatars/` — 2 files | Visual repetition undermines credibility | Add more images or use initials |
| M5 | **AbortController shared across retry loop** | `landing-programs.js:107-176` — single controller for all 3 endpoints | If first endpoint times out after 7s, remaining endpoints also abort | Create per-request controller |
| M6 | **`window.state` and `window.elements` exposed globally** | `scripts/index.js:50-51` | Any script can mutate app state | Remove or namespace under `window.SZAFIT` |
| M7 | **Inline `onclick` on final CTA** | `index.html:544` | Breaks CSP `'unsafe-inline'` restriction; inconsistent with addEventListener pattern | Move to event listener |
| M8 | **No analytics** | No GA, GTM, Plausible, or any tracking found | No insight into traffic, conversions, or user behavior | Add analytics |
| M9 | **No error state when all data sources fail** | `DEFAULT_PROGRAMS` fallback shows 0 SAR placeholder | Confusing UX for users | Add visible error + retry UI |

### 🟢 Low

| # | Problem | Evidence | Impact | Suggested Fix |
|---|---------|----------|--------|---------------|
| L1 | **Text drift between i18n sources** | `index.html` method section heading differs from `translations.js` value | Visible text difference on lang switch | Audit all `data-i18n` attributes vs JSON keys |
| L2 | **Incomplete `vendor/` copies** | `vendor/fontawesome/`, `vendor/gsap/` exist but CDN used | Wasted disk space and upload bandwidth | Confirm intent; remove if no fallback purpose |
| L3 | **Hero badge text not in i18n** | `index.html:154` — Arabic text hardcoded with no `data-i18n` | Badge doesn't translate | Add `data-i18n` attribute |
| L4 | **`<title>` doesn't update on language switch** | `index.html` title is static Arabic | SEO and UX gap for English mode | Update `<title>` via JS on language change |

---

## 13. Security / Secrets Review

| Risk | Location | Severity | Action |
|------|----------|----------|--------|
| SFTP server host IP, username, **plaintext password** | `.vscode/sftp.json` | **Critical** | Rotate password NOW; gitignore the file; purge from git history |
| WC REST API order creation without authentication | `checkout-modal.js` | **High** | PHP server-side proxy with stored credentials |
| `unsafe-inline` in CSP | All HTML `<head>` | Medium | Required for current GSAP + inline scripts; acceptable if monitored |
| `Access-Control-Allow-Origin: *` on PHP API | `api/programs.php:13` | Low | Acceptable for public read-only endpoint |
| Hostinger branding reveals hosting provider | `default.php` | Informational | Not a direct risk |

---

## 14. Performance / SEO Review

### Performance — Current State
**Positives:**
- Images use `loading="lazy"`, `decoding="async"`, WebP format
- Local fonts with `font-display: swap`
- Tailwind minified at build time
- GSAP `quickTo` used for mouse tracking (efficient)
- `IntersectionObserver` for counter animation

**Risks:**
- GSAP + ScrollTrigger + Font Awesome = 3 external CDN dependencies; CDN outage breaks animations and icons with no fallback
- 7 Changa font weight variants loaded even if only 3-4 used
- Checkout modal injects a `<style>` block on every page — should move to `css/style.css`
- Stories and marquee duplicate DOM nodes for infinite loop; could cause layout thrash on resize

### SEO — Current State
**Missing:**
- `robots.txt`
- `sitemap.xml`
- Open Graph / Twitter Card meta tags
- Structured data (Product, LocalBusiness schemas)
- Canonical URL tags
- `<title>` updates on language switch

**Risks:**
- Program cards rendered by JS — WooCommerce products not in initial HTML, may not be indexed by all crawlers
- `<meta name="description">` present but generic; no page-specific optimization

---

## 15. Recommended Cleanup Plan

### Phase 1 — Immediate Security (Day 1)
1. **Rotate SFTP password** on Hostinger panel
2. **Create `.gitignore`**: `node_modules/`, `.vscode/sftp.json`, `styles/tailwind.css`, `.claude/`, `test.html`
3. **Purge credentials from git history**: `git filter-branch` or BFG Repo Cleaner
4. **Delete `test.html`** from production server

### Phase 2 — Fix Architecture Risks (Week 1)
1. **WC order auth**: Create `api/create-order.php` that holds WC Consumer Key/Secret server-side; proxy order creation
2. **Audit secondary pages**: Confirm status of `checkout.html`, `products.html`, `product-single.html`, `about.html`, etc.
3. **Consolidate i18n**: Remove `scripts/translations.js`; migrate all callers to i18next JSON files
4. **Add `robots.txt`** and **`sitemap.xml`**
5. **Move CSP to `.htaccess`** HTTP headers

### Phase 3 — Remove Dead Code (Week 2)
1. Delete `scripts/archive/` — confirmed superseded
2. Remove or externalize `vendor/` incomplete copies
3. Remove duplicate `SAR_ICON_SVG` definitions
4. Consolidate program data to single source (WC or PHP proxy)

### Phase 4 — Improve Architecture (Month 1)
1. Add analytics (GA4 or Plausible)
2. Add Open Graph + JSON-LD structured data to all pages
3. Create `config.js` for environment-specific API URLs
4. Add a basic CI/CD step: pre-deploy `npm run build:css`
5. Evaluate server-side rendering for program cards (SEO + reliability)

---

## 16. Handover Notes

What the next developer must know immediately:

1. **This is vanilla HTML/JS — no framework.** Do not add a bundler or framework without a full migration plan.

2. **SFTP credentials in `.vscode/sftp.json` are committed to git and must be treated as compromised.** Rotate the server password before any further work.

3. **Two parallel i18n systems.** New translatable text requires updating BOTH `locales/ar.json` + `locales/en.json` AND `scripts/translations.js` to avoid divergence.

4. **Program data lives in 3 places:** `api/programs.php`, `scripts/constants.js` (`EMBEDDED_PROGRAMS_DATA`), and WooCommerce. All must stay in sync manually.

5. **Checkout may not work without WooCommerce auth.** Test the full purchase flow on production before declaring any change complete.

6. **`npm run build:css` must be run after changing Tailwind classes** in any HTML or JS file.

7. **The WordPress backend is at `z.szafit.com`**, not `szafit.com`. They are separate hostnames on the same hosting account (likely subdomains).

8. **`uploadOnSave: true` is active.** Every file save while the SFTP extension is connected deploys to production. Disable during debugging.

9. **No TypeScript, no tests, no CI.** All quality control is manual.

---

## 17. Unknowns / Questions

| # | Question | Why It Matters |
|---|----------|----------------|
| U1 | Is WooCommerce configured to allow unauthenticated order creation? | If yes: security risk. If no: checkout is broken on production. |
| U2 | Are `checkout.html`, `products.html`, `product-single.html`, `about.html`, `success-stories.html`, `booking.html`, `contact.html`, `app.html` actively used? | Determines what to keep vs. delete |
| U3 | What is the relationship between `szafit.com` and `z.szafit.com`? | Staging vs. production, or API subdomain? |
| U4 | Do `vendor/fontawesome/` and `vendor/gsap/` serve as actual offline fallbacks? | Cleanup decision |
| U5 | Are WooCommerce Consumer Key + Secret available? | Required for secure API auth |
| U6 | Is `+966550150445` the correct verified WhatsApp Business number? | All CTA clicks use this number |
| U7 | Do `@szafit` accounts on Instagram, Twitter, YouTube, TikTok belong to this project? | Footer social links point to these handles |
| U8 | Is there a `_pre-used/` folder on the production server? | Referenced in sftp.json ignore list but not found locally |
| U9 | What PHP version is active on Hostinger? | Affects syntax compatibility in `api/programs.php` |
| U10 | Is there a `.gitignore` that was not picked up? | `node_modules` was excluded from Glob results, suggesting possible gitignore exists |
