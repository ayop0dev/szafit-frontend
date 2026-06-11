# IMPLEMENTATION_PLAN.md — SZAFIT Migration & Stabilization Plan

## 0. Context

Current project state:

* Existing frontend: Vanilla HTML/CSS/JS multi-page site.
* Backend/CMS: WordPress + WooCommerce on `z.szafit.com`.
* Hosting: Hostinger with Node.js app deployment support.
* Required target framework: Astro.
* Required language routing: `/ar/` and `/en/`.
* Checkout target: WooCommerce Cash on Delivery.
* Content editing target: WordPress admin using ACF Free.
* Deployment workflow: local development first, controlled SFTP/production upload windows only.

Important:

* Do not delete project files immediately.
* Archive first.
* Do not keep `uploadOnSave` enabled during development.
* Enable production upload only during controlled testing windows.

---

# 1. Execution Rules for Claude Code

## 1.1 Hard Rules

* Do not delete existing files unless explicitly listed under an Archive step.
* Do not expose secrets, passwords, API keys, or credentials in logs or Markdown.
* Do not modify production credentials directly in code.
* Do not commit `.env`, `.vscode/sftp.json`, secrets, or Hostinger credentials.
* All destructive operations must be replaced with archive/move operations.
* Create a backup before migration.
* Keep the current site restorable until Astro is verified.

## 1.2 Required Output

Claude Code must create/update:

```bash
IMPLEMENTATION_LOG.md
MIGRATION_CHECKLIST.md
DEPLOYMENT_CHECKLIST.md
```

Each completed module must be logged with:

* Files changed
* Commands run
* Result
* Known issues
* Next action

---

# 2. Initial Safety Setup

## 2.1 Create Backup Branch / Snapshot

```bash
git status
git branch backup/pre-astro-migration
git checkout -b feature/astro-migration
```

If git is not initialized:

```bash
git init
git add .
git commit -m "Initial inherited project snapshot before Astro migration"
git branch backup/pre-astro-migration
git checkout -b feature/astro-migration
```

## 2.2 Disable Auto Upload

Find `.vscode/sftp.json`.

Set:

```json
"uploadOnSave": false
```

If this file contains credentials:

* Do not print them.
* Move it to a safe local-only location.
* Create `.vscode/sftp.example.json` without credentials.

## 2.3 Create `.gitignore`

Create/update `.gitignore`:

```gitignore
node_modules/
dist/
.astro/
.env
.env.*
!.env.example

.vscode/sftp.json
.claude/
.DS_Store
Thumbs.db

docs/_archive/
screenshots/_raw/
```

Then:

```bash
git rm --cached .vscode/sftp.json || true
git status
```

---

# 3. Documentation Cleanup Module

## Goal

Clean `docs/` without losing useful inherited context.

## Rules

* Do not delete docs.
* Create archive folder.
* Keep core documentation visible.
* Move old/duplicate/scratch docs to archive only after review.

## Commands

```bash
mkdir -p docs/_archive
mkdir -p docs/_active
```

## Keep in `docs/_active`

Move/copy these files if they exist:

```bash
checkpoint.md
PRD.md
ARCHITECTURE.md
TEST-CHECKLIST.md
CHECKPOINT-DEPLOY.md
Brand-colors.md
website_complete_description.md
programs_descrption.md
wc-product-export-*.csv
```

## Archive Candidates

Move these only if confirmed as old/duplicate:

```bash
mv docs/*old* docs/_archive/ 2>/dev/null || true
mv docs/*backup* docs/_archive/ 2>/dev/null || true
mv docs/*pre-used* docs/_archive/ 2>/dev/null || true
```

## Output

Create:

```bash
docs/DOCS_INDEX.md
```

It must include:

* Active docs
* Archived docs
* Unknown docs
* Why each file matters

---

# 4. Astro Migration Module

## Goal

Migrate the frontend to Astro while preserving current design and functionality.

## Target Structure

```bash
src/
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    ar/
      index.astro
      programs/
        [slug].astro
      thank-you.astro
    en/
      index.astro
      programs/
        [slug].astro
      thank-you.astro
  components/
    Nav.astro
    Footer.astro
    Hero.astro
    ProgramsGrid.astro
    ProgramCard.astro
    CheckoutModal.astro
    AppScreenshots.astro
  lib/
    config.ts
    wordpress.ts
    woocommerce.ts
    i18n.ts
    programMapper.ts
  styles/
    global.css
public/
  assets/
  screenshots/
  api/
```

## Install Astro

```bash
npm create astro@latest . -- --template minimal --typescript strict
npm install
npm install @astrojs/tailwind tailwindcss
npx astro add tailwind
```

If current package.json already exists, merge carefully. Do not overwrite existing scripts blindly.

## Required Scripts

Update `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

## Migration Steps

1. Convert current `index.html` into Astro components.
2. Move shared head/meta/nav/footer into `BaseLayout.astro`.
3. Move current assets into `public/assets`.
4. Move app screenshots into `public/screenshots`.
5. Replace duplicated HTML pages with Astro route pages.
6. Preserve dark/light mode.
7. Preserve RTL/LTR.
8. Preserve current visual design first.
9. Refactor later.

## Acceptance Criteria

* `/ar/` loads Arabic homepage.
* `/en/` loads English homepage.
* `/ar/programs/[slug]` loads Arabic program page.
* `/en/programs/[slug]` loads English program page.
* Build passes:

```bash
npm run build
npm run preview
```

---

# 5. WordPress + ACF Content Module

## Goal

Make all Arabic and English written content editable from WordPress admin using ACF Free.

## Required WordPress Plugins

Install:

* Advanced Custom Fields Free
* WooCommerce
* Optional: Application Passwords / JWT only if needed
* Optional: caching plugin after migration is stable

## ACF Field Groups

### Product Fields

Attach to WooCommerce Product.

Fields:

```text
program_slug
program_name_ar
program_name_en
program_short_description_ar
program_short_description_en
program_full_description_ar
program_full_description_en
program_requirements_ar
program_requirements_en
program_features_ar
program_features_en
program_badge_ar
program_badge_en
program_cta_ar
program_cta_en
program_duration_ar
program_duration_en
program_level_ar
program_level_en
program_app_screenshot
program_gallery
```

### Homepage Fields

Create an options page if possible. If ACF Free does not support options pages, create a WordPress page called:

```text
Homepage Settings
```

Fields:

```text
hero_title_ar
hero_title_en
hero_subtitle_ar
hero_subtitle_en
hero_primary_cta_ar
hero_primary_cta_en
hero_secondary_cta_ar
hero_secondary_cta_en
method_title_ar
method_title_en
app_section_title_ar
app_section_title_en
stories_title_ar
stories_title_en
final_cta_title_ar
final_cta_title_en
final_cta_description_ar
final_cta_description_en
whatsapp_number
```

## API Requirement

Expose ACF fields through WordPress REST API.

Check whether ACF REST exposure is available. If not, add PHP code to expose needed meta safely.

## Required Output

Create:

```bash
docs/ACF_FIELD_MAP.md
```

Include:

* Field name
* Field type
* Attached object
* Used in frontend file
* Arabic/English behavior

---

# 6. API & Data Layer Module

## Goal

Create one reliable data layer between Astro and WordPress/WooCommerce.

## Files

Create:

```bash
src/lib/config.ts
src/lib/wordpress.ts
src/lib/woocommerce.ts
src/lib/programMapper.ts
```

## Environment Variables

Create `.env.example`:

```env
PUBLIC_SITE_URL=https://szafit.com
WORDPRESS_URL=https://z.szafit.com
WC_CONSUMER_KEY=
WC_CONSUMER_SECRET=
```

Do not commit real `.env`.

## Data Source Rules

* Product content source: WooCommerce + ACF.
* Do not use hardcoded product data except as emergency fallback.
* Remove triple-source dependency gradually.
* Keep old PHP `api/programs.php` only as temporary fallback.

## Required Functions

```ts
getPrograms(locale)
getProgramBySlug(slug, locale)
mapWooProductToProgram(product, locale)
```

## Acceptance Criteria

* Program cards render from WordPress/WooCommerce data.
* Arabic content comes from ACF Arabic fields.
* English content comes from ACF English fields.
* Missing fields have safe fallbacks.

---

# 7. URL-Based Translation Module

## Goal

Replace localStorage-only language switching with URL-based language routing.

## Required URLs

```text
/ar/
/en/
/ar/programs/[slug]/
/en/programs/[slug]/
/ar/thank-you/
/en/thank-you/
```

## Rules

* Arabic is default.
* `/` redirects to `/ar/`.
* Language switch preserves equivalent page when possible.
* HTML attributes must be correct:

  * Arabic: `lang="ar" dir="rtl"`
  * English: `lang="en" dir="ltr"`

## Redirects

Implement in Astro or server config:

```text
/ → /ar/
```

## Acceptance Criteria

* Language switch does not rely only on localStorage.
* Direct URL sharing works for both languages.
* Program pages have language-specific URLs.

---

# 8. Checkout Module

## Goal

Make product purchase work using WooCommerce Cash on Delivery.

## Required Architecture

Never create WooCommerce orders directly from browser using exposed credentials.

Use server-side endpoint:

```text
/api/create-order
```

If Astro SSR supports endpoint deployment on Hostinger Node.js, create:

```bash
src/pages/api/create-order.ts
```

If Hostinger Node deployment is unreliable, use PHP fallback:

```bash
public/api/create-order.php
```

## Required Request

```json
{
  "product_id": 123,
  "locale": "ar",
  "billing": {
    "first_name": "Customer Name",
    "phone": "+966...",
    "email": "customer@example.com"
  }
}
```

## Required WooCommerce Order

```json
{
  "payment_method": "cod",
  "payment_method_title": "Cash on Delivery",
  "set_paid": false,
  "billing": {
    "first_name": "...",
    "phone": "...",
    "email": "..."
  },
  "line_items": [
    {
      "product_id": 123,
      "quantity": 1
    }
  ]
}
```

## Acceptance Criteria

* Test order is created in WooCommerce.
* No WooCommerce secret appears in frontend JS.
* User redirects to:

  * `/ar/thank-you/?order_id=xxx`
  * `/en/thank-you/?order_id=xxx`

---

# 9. Screenshots / Images Module

## Goal

Replace current generic images with real app screenshots.

## Folder

Create:

```bash
public/screenshots/
```

User will add screenshots there.

Suggested naming:

```bash
public/screenshots/app-home.webp
public/screenshots/app-program.webp
public/screenshots/app-progress.webp
public/screenshots/app-workout.webp
public/screenshots/app-meals.webp
```

## Rules

* Use WebP if possible.
* Add alt text in both Arabic and English.
* Do not overwrite original assets.
* Keep originals in archive until approval.

## Acceptance Criteria

* Hero/app section uses screenshots.
* Program pages can display relevant screenshot/gallery.
* Images are optimized and responsive.

---

# 10. Security Module

## Goal

Secure the project before final production release.

## Required Actions

### Credentials

```bash
git rm --cached .vscode/sftp.json || true
```

* Rotate SFTP password from Hostinger.
* Remove credentials from git history later using BFG or filter-repo.
* Never expose WooCommerce keys client-side.

### Headers

Add security headers via Hostinger / `.htaccess` if applicable:

```apache
Header set X-Content-Type-Options "nosniff"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set X-Frame-Options "SAMEORIGIN"
Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"
```

### WordPress

* Update WordPress core/plugins/themes.
* Remove unused plugins.
* Use strong admin passwords.
* Disable file editing from dashboard if possible.
* Limit REST exposure to needed fields.
* Ensure backups are active.

### Frontend

* Remove inline secrets.
* Avoid unsafe direct API calls.
* Add form validation.
* Add rate limiting if possible on order endpoint.

## Acceptance Criteria

* No secrets in repo.
* Checkout endpoint server-side only.
* Production credentials rotated.
* Basic security headers active.

---

# 11. SEO & Analytics Module

## SEO Requirements

Create:

```bash
public/robots.txt
public/sitemap.xml
```

Add:

* Canonical URLs
* Open Graph tags
* Twitter Card tags
* Product JSON-LD
* Organization/LocalBusiness JSON-LD
* Arabic/English hreflang tags

Example hreflang:

```html
<link rel="alternate" hreflang="ar" href="https://szafit.com/ar/" />
<link rel="alternate" hreflang="en" href="https://szafit.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://szafit.com/ar/" />
```

## Analytics

Add GA4 or GTM.

Events:

```text
page_view
program_view
program_card_click
checkout_open
checkout_submit
purchase
whatsapp_click
language_switch
```

## Acceptance Criteria

* Sitemap exists.
* robots.txt exists.
* hreflang works.
* Purchase event can be tracked.

---

# 12. Deployment Module

## Goal

Controlled production deployment without accidental upload-on-save mistakes.

## Local Build

```bash
npm install
npm run build
npm run preview
```

## Pre-Deploy Checklist

```bash
git status
npm run build
```

Manual checks:

* `/ar/`
* `/en/`
* program pages
* checkout modal
* order creation
* thank-you page
* mobile responsive
* language switch
* dark mode

## Controlled SFTP Upload Window

Only during deployment/testing:

1. Confirm local build passes.
2. Enable SFTP temporarily or upload manually.
3. Upload built output only, not source secrets.
4. Test production.
5. Disable `uploadOnSave` again immediately.

## Production Test Checklist

* Homepage Arabic loads.
* Homepage English loads.
* Program page loads.
* Screenshot images load.
* Checkout creates COD test order.
* WooCommerce receives order.
* Thank-you URL works.
* No console errors.
* No secrets visible in page source.

---

# 13. Module Order

Recommended order:

1. Safety Setup
2. Documentation Cleanup
3. Checkout Fix
4. ACF Field Mapping
5. Astro Migration
6. URL-Based Translation
7. Screenshots Replacement
8. SEO + Analytics
9. Security Hardening
10. Controlled Production Deployment
11. Final QA

---

# 14. Final Acceptance Criteria

The project is considered complete when:

* Astro build passes.
* `/ar/` and `/en/` are live.
* WooCommerce products feed the frontend.
* ACF fields control Arabic and English content.
* Checkout creates COD WooCommerce orders.
* App screenshots replace old placeholder images.
* No secrets exist in repo.
* SFTP auto-upload is disabled except controlled deploy windows.
* Docs are archived, not deleted.
* Production passes QA checklist.
* Client can edit content from WordPress without touching code.

---

# 15. Claude Code Final Instruction

Execute this plan module by module.

After each module:

1. Stop.
2. Update `IMPLEMENTATION_LOG.md`.
3. Show changed files.
4. Show commands run.
5. Show risks before continuing.

Do not skip safety steps.
Do not delete files without archiving.
Do not expose secrets.
Do not deploy automatically.
