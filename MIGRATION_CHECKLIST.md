# MIGRATION_CHECKLIST.md — SZAFIT Astro Migration

**Project:** SZAFIT  
**Branch:** `feature/astro-migration`  
**Plan source:** `docs/IMPLEMENTATION_PLAN.md`  
**Created:** 2026-06-11  

> Check each box only after verifying the item. Do not pre-check. Do not skip.

---

## Phase 0 — Prerequisites (Verify Before Starting Any Work)

- [ ] Working directory is `D:\claude-Projects\szafit`
- [ ] Current branch is `feature/astro-migration` (`git branch` confirms)
- [ ] Remote `origin` is accessible (`git remote -v` shows a valid URL)
- [ ] Node.js ≥ 18 is installed (`node --version`)
- [ ] npm is available (`npm --version`)
- [ ] WooCommerce Consumer Key available from project owner
- [ ] WooCommerce Consumer Secret available from project owner
- [ ] WordPress admin access to `z.szafit.com/wp-admin` confirmed
- [x] Hostinger panel access confirmed — SFTP password rotated by owner ✅
- [ ] GA4 measurement ID available from project owner

---

## Phase 1 — Safety Setup (Module 1)

### 1.1 Git Baseline

- [ ] `backup/pre-astro-migration` branch created from `main`
  ```bash
  git branch backup/pre-astro-migration main
  ```
- [ ] `.gitignore` updated with all required entries:
  - [ ] `node_modules/`
  - [ ] `dist/`
  - [ ] `.astro/`
  - [ ] `.env`
  - [ ] `.env.*` (with `!.env.example` exception)
  - [ ] `.vscode/sftp.json`
  - [ ] `.claude/`
  - [ ] `docs/_archive/`
  - [ ] `styles/tailwind.css` (compiled output — regenerated at build)
  - [ ] `api/config.php` (will hold WC credentials)

### 1.2 SFTP Safety

- [ ] `uploadOnSave: false` confirmed in `.vscode/sftp.json` (already done)
- [ ] `.vscode/sftp.example.json` created without credentials
- [x] SFTP password rotated on Hostinger panel — completed by owner; old password invalidated ✅
- [ ] `.vscode/sftp.json` confirmed absent from git tracking (`git ls-files .vscode/sftp.json` returns empty)

### 1.3 Credential Purge from Git History

> **Moved to Phase 9 — Security Hardening.** The old SFTP password in commit `af9f50b` is already invalidated, so this is not a blocker for Phase 1 or any subsequent phase. It remains a recommended security cleanup task.

---

## Phase 2 — Documentation Cleanup (Module 2)

- [ ] `docs/_archive/` directory created
- [ ] `docs/_active/` directory created
- [ ] Active reference docs moved to `docs/_active/`:
  - [ ] `checkpoint.md`
  - [ ] `PRD.md`
  - [ ] `ARCHITECTURE.md`
  - [ ] `IMPLEMENTATION_PLAN.md`
  - [ ] `TEST-CHECKLIST.md`
  - [ ] `CHECKPOINT-DEPLOY.md`
  - [ ] `Brand-colors.md`
  - [ ] `website_complete_description.md`
  - [ ] `programs_descrption.md`
  - [ ] `wc-product-export-*.csv`
- [ ] Old/duplicate docs moved to `docs/_archive/` (after review — do not delete)
- [ ] `docs/DOCS_INDEX.md` created listing all docs with status and purpose
- [ ] No doc files deleted — only moved

---

## Phase 3 — Checkout Fix / WC Auth Proxy (Module 3)

- [ ] `api/config.example.php` created (sanitized — committed to git)
- [ ] `api/config.php` created with real WC credentials (NOT committed to git)
- [ ] `api/config.php` added to `.gitignore`
- [ ] `api/create-order.php` created with:
  - [ ] Reads WC Consumer Key + Secret from `config.php`
  - [ ] Accepts POST with `{product_id, locale, billing: {first_name, phone, email}}`
  - [ ] Calls `z.szafit.com/wp-json/wc/v3/orders` server-side with auth
  - [ ] Returns `{success: true, order_id: N}` or error
  - [ ] No WC credentials exposed in response
- [ ] `scripts/checkout-modal.js` updated: POST target changed from WC API to `/api/create-order.php`
- [ ] Test order created in WooCommerce admin via the proxy endpoint
- [ ] No WC Consumer Key or Secret appears anywhere in frontend JS (`git grep -r "ck_\|cs_" --include="*.js"` returns empty)

---

## Phase 4 — ACF Field Mapping (Module 4)

- [ ] Advanced Custom Fields Free plugin installed on `z.szafit.com`
- [ ] ACF field group created for WooCommerce Products with fields:
  - [ ] `program_slug`
  - [ ] `program_name_ar`, `program_name_en`
  - [ ] `program_short_description_ar`, `program_short_description_en`
  - [ ] `program_full_description_ar`, `program_full_description_en`
  - [ ] `program_requirements_ar`, `program_requirements_en`
  - [ ] `program_features_ar`, `program_features_en`
  - [ ] `program_badge_ar`, `program_badge_en`
  - [ ] `program_cta_ar`, `program_cta_en`
  - [ ] `program_duration_ar`, `program_duration_en`
  - [ ] `program_level_ar`, `program_level_en`
  - [ ] `program_app_screenshot`
  - [ ] `program_gallery`
- [ ] Homepage Settings page (or options page if available) created with fields:
  - [ ] `hero_title_ar`, `hero_title_en`
  - [ ] `hero_subtitle_ar`, `hero_subtitle_en`
  - [ ] `hero_primary_cta_ar`, `hero_primary_cta_en`
  - [ ] `hero_secondary_cta_ar`, `hero_secondary_cta_en`
  - [ ] Section titles for Method, App, Stories, Final CTA (AR + EN each)
  - [ ] `whatsapp_number`
- [ ] ACF fields exposed via WC REST API (`meta_data` array confirmed in API response)
- [ ] `docs/ACF_FIELD_MAP.md` created with field name, type, object, frontend file, and AR/EN behavior
- [ ] At least one WooCommerce product has all ACF fields populated for testing

---

## Phase 5 — Astro Migration (Module 5)

### 5.1 Project Init

- [ ] Astro installed with minimal template + TypeScript strict
  ```bash
  npm create astro@latest . -- --template minimal --typescript strict
  ```
- [ ] Existing `package.json` scripts preserved/merged (no blind overwrite)
- [ ] `@astrojs/tailwind` integration added
  ```bash
  npx astro add tailwind
  ```
- [ ] Existing `tailwind.config.js` content merged into new Tailwind config
- [ ] `npm run dev` starts without errors

### 5.2 Layouts & Shared Components

- [ ] `src/layouts/BaseLayout.astro` created with:
  - [ ] `lang` and `dir` props for AR/EN
  - [ ] `<head>` with meta, CSS imports, font loading
  - [ ] Pre-init dark mode inline script (prevents FOUC)
  - [ ] Nav and Footer slots
- [ ] `src/components/Nav.astro` created (replaces hardcoded nav in all HTML files)
- [ ] `src/components/Footer.astro` created
- [ ] `src/components/CheckoutModal.astro` created (replaces `checkout-modal.js` injection)

### 5.3 Homepage

- [ ] `src/pages/ar/index.astro` created
- [ ] `src/pages/en/index.astro` created
- [ ] `src/components/Hero.astro` created
- [ ] `src/components/ProgramsGrid.astro` created
- [ ] `src/components/ProgramCard.astro` created
- [ ] `src/components/AppScreenshots.astro` created
- [ ] GSAP animations preserved (`scripts/landing-animations.js` ported or adapted)
- [ ] Dark/light mode toggle works
- [ ] RTL/LTR layout correct for each route

### 5.4 Program Detail Pages

- [ ] `src/pages/ar/programs/[slug].astro` created
- [ ] `src/pages/en/programs/[slug].astro` created
- [ ] Dynamic slug resolved from WooCommerce `program_slug` ACF field
- [ ] Product detail renders correctly in both locales

### 5.5 Thank-You Page

- [ ] `src/pages/ar/thank-you.astro` created
- [ ] `src/pages/en/thank-you.astro` created
- [ ] `order_id` read from URL search params
- [ ] WhatsApp CTA renders correctly

### 5.6 Assets

- [ ] `assets/` moved to `public/assets/`
- [ ] `locales/` accessible from Astro (moved to `public/locales/` or built into `src/i18n/`)
- [ ] `api/programs.php` moved to `public/api/programs.php` (preserved as fallback)
- [ ] `api/create-order.php` at `public/api/create-order.php` OR `src/pages/api/create-order.ts`

### 5.7 Data Layer

- [ ] `src/lib/config.ts` created with `WC_BASE`, `SITE_URL`, locale config
- [ ] `src/lib/wordpress.ts` created with `getPrograms(locale)` and `getProgramBySlug(slug, locale)`
- [ ] `src/lib/woocommerce.ts` created with WC REST helpers
- [ ] `src/lib/programMapper.ts` created with `mapWooProductToProgram(product, locale)`
- [ ] `.env.example` created:
  ```
  PUBLIC_SITE_URL=https://szafit.com
  WORDPRESS_URL=https://z.szafit.com
  WC_CONSUMER_KEY=
  WC_CONSUMER_SECRET=
  ```
- [ ] `.env` created locally with real values (NOT committed)

### 5.8 Build Verification

- [ ] `npm run build` completes without errors
- [ ] `npm run preview` serves all routes correctly
- [ ] `/ar/` loads Arabic homepage
- [ ] `/en/` loads English homepage
- [ ] `/ar/programs/zero-to-fit` (or equivalent slug) loads
- [ ] `/ar/thank-you?order_id=123` loads
- [ ] Dark mode toggle works in preview
- [ ] Language switch works in preview
- [ ] Checkout modal opens and renders correctly in preview

---

## Phase 6 — URL-Based Translation (Module 6)

- [ ] `/` redirects to `/ar/` (via Astro middleware or `.htaccess`)
- [ ] `src/pages/index.astro` emits redirect (or is a redirect page)
- [ ] Language toggle in Nav links to `/ar/[currentPage]` ↔ `/en/[currentPage]`
- [ ] `<html lang="ar" dir="rtl">` on all `/ar/` pages
- [ ] `<html lang="en" dir="ltr">` on all `/en/` pages
- [ ] Direct URL `/en/` works without visiting `/ar/` first
- [ ] Program page URL is `/ar/programs/burn-x` not `/ar/programs/?id=3`
- [ ] Language switch on program page → `/en/programs/burn-x` (slug preserved)
- [ ] `localStorage.lang` still updated as secondary signal
- [ ] No visible flash of wrong language/direction on load

---

## Phase 7 — Screenshots Replacement (Module 7)

- [ ] `public/screenshots/` directory created
- [ ] Real or placeholder images added:
  - [ ] `app-home.webp`
  - [ ] `app-program.webp`
  - [ ] `app-progress.webp`
  - [ ] `app-workout.webp`
  - [ ] `app-meals.webp`
- [ ] `AppScreenshots.astro` component updated to use new images
- [ ] Alt text added in both Arabic and English for each image
- [ ] Original mock images preserved in `public/assets/images/` (not deleted)
- [ ] Images are optimized WebP and responsive

---

## Phase 8 — SEO + Analytics (Module 8)

### SEO

- [ ] `public/robots.txt` created
- [ ] `public/sitemap.xml` created (or `@astrojs/sitemap` integration configured)
- [ ] `BaseLayout.astro` includes:
  - [ ] `<link rel="canonical" href="...">` (correct per page + locale)
  - [ ] `<link rel="alternate" hreflang="ar" href="...ar/">` 
  - [ ] `<link rel="alternate" hreflang="en" href="...en/">`
  - [ ] `<link rel="alternate" hreflang="x-default" href="...ar/">`
  - [ ] Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
  - [ ] Twitter Card tags
- [ ] Program pages include Product JSON-LD
- [ ] Homepage includes LocalBusiness / Organization JSON-LD
- [ ] `<title>` is localized per page and locale

### Analytics

- [ ] GA4 snippet (or GTM) added to `BaseLayout.astro`
- [ ] `page_view` event fires on each page load
- [ ] `program_card_click` event fires when program card CTA is clicked
- [ ] `checkout_open` event fires when modal opens
- [ ] `checkout_submit` event fires on form submit
- [ ] `purchase` event fires on redirect to `/thank-you/`
- [ ] `whatsapp_click` event fires on WhatsApp CTA click
- [ ] `language_switch` event fires on language toggle

---

## Phase 9 — Security Hardening (Module 9)

- [ ] No secrets in any tracked file (`git secrets --scan` or manual grep passes)
- [ ] `.gitignore` finalized and comprehensive
- [x] `.vscode/sftp.json` credentials rotated — completed by owner; old password invalidated ✅
- [ ] Git history purged of old SFTP credentials (recommended hygiene — old password already invalidated; requires BFG or `git filter-repo` + coordinated force-push to `origin`)
- [ ] `api/config.php` (WC credentials) NOT in git
- [ ] `.env` (Astro env vars) NOT in git
- [ ] `.htaccess` created with security headers:
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`
  - [ ] `X-Frame-Options: SAMEORIGIN`
  - [ ] `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- [ ] WooCommerce Consumer Key and Secret not present in any JS or HTML file
- [ ] `api/create-order.php` returns no WC credentials in its response
- [ ] CSP headers moved from `<meta>` to `.htaccess` HTTP headers
- [ ] WordPress admin: unused plugins removed
- [ ] WordPress admin: strong password confirmed
- [ ] `test.html` removed from production server (not tracked; remove via SFTP)

---

## Phase 10 — Pre-Production Deployment Verification

*(Complete all items before initiating any SFTP upload)*

- [ ] `npm run build` passes without errors or warnings
- [ ] `npm run preview` serves the full site locally
- [ ] All Astro build output is in `dist/`
- [ ] `dist/` contains no `.env`, `api/config.php`, or secret files
- [ ] DEPLOYMENT_CHECKLIST.md manual checks all passed in local preview
- [ ] `uploadOnSave: false` confirmed in `.vscode/sftp.json`
- [ ] Deployment plan agreed: which files to upload (`dist/` only, plus `public/api/` PHP files)
- [ ] Maintenance window / backup of current production taken before upload

---

## i18n Consolidation Checklist (Parallel Task — Can Run During Module 5)

- [ ] All translation keys in `scripts/translations.js` migrated to `locales/ar.json` and `locales/en.json`
- [ ] `scripts/landing-events.js`: `applyLanguage()` calls replaced with `i18n.t()` or Astro i18n utility
- [ ] `scripts/landing-programs.js`: inline AR/EN string lookups replaced with i18n JSON keys
- [ ] `scripts/checkout-modal.js`: `checkoutTranslations` object replaced with i18n JSON keys
- [ ] `scripts/translations.js` deleted after all callers confirmed migrated
- [ ] No text visible in browser that differs between i18n sources (visual regression check)

---

## Program Data Consolidation Checklist (Parallel Task — Can Run During Module 5)

- [ ] All 6 programs have ACF fields populated in WordPress (from Module 4)
- [ ] `src/lib/wordpress.ts` → `getPrograms(locale)` fetches from WC REST + ACF fields
- [ ] `api/programs.php` updated to use WordPress REST data OR marked as deprecated fallback
- [ ] `scripts/constants.js` → `EMBEDDED_PROGRAMS_DATA` removed or reduced to minimal emergency fallback only
- [ ] Program change in WordPress admin is reflected on site without any code change required

---

*All boxes must be checked before triggering the first production deployment.*
