# DEPLOYMENT_CHECKLIST.md — SZAFIT Production Deployment

**Project:** SZAFIT  
**Plan source:** `docs/IMPLEMENTATION_PLAN.md § 12`  
**Created:** 2026-06-11  

> This checklist must be completed IN ORDER before and after every production deployment.
> Do not upload files while `uploadOnSave` is enabled.
> Do not skip items. Do not deploy automatically.

---

## STOP — Confirm These Before Opening Any SFTP Connection

- [ ] `MIGRATION_CHECKLIST.md` — all boxes checked
- [ ] All modules in `IMPLEMENTATION_LOG.md` show status ✅ COMPLETE
- [ ] `uploadOnSave: false` confirmed in `.vscode/sftp.json`
  ```bash
  grep "uploadOnSave" .vscode/sftp.json
  ```
- [ ] No pending uncommitted changes that affect production output
  ```bash
  git status
  ```
- [ ] Team / owner notified of upcoming deployment window
- [ ] Backup of current production taken (SFTP download of `public_html/` or Hostinger snapshot)

---

## Section 1 — Local Build Verification

### 1.1 Clean Build

```bash
npm install
npm run build
```

- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors
- [ ] `dist/` directory created and non-empty
- [ ] No TypeScript errors (`npm run check` if available)

### 1.2 Local Preview

```bash
npm run preview
```

- [ ] Preview server starts without errors
- [ ] Preview URL accessible in browser (typically `http://localhost:4321`)

---

## Section 2 — Manual Functional Checks (Local Preview)

Run through each item in local preview before uploading anything.

### 2.1 Routing

- [ ] `/` redirects to `/ar/` automatically (no visible flash)
- [ ] `/ar/` loads Arabic homepage (RTL, Arabic text)
- [ ] `/en/` loads English homepage (LTR, English text)
- [ ] `/ar/programs/zero-to-fit` (or any valid slug) loads program detail in Arabic
- [ ] `/en/programs/zero-to-fit` loads program detail in English
- [ ] `/ar/thank-you?order_id=123` loads with order ID visible
- [ ] `/en/thank-you?order_id=123` loads with order ID visible
- [ ] `404.html` or equivalent loads for an invalid URL
- [ ] `/api/programs.php` returns valid JSON (PHP served from `public/`)

### 2.2 Homepage Sections

- [ ] Hero section: headline, subheadline, CTA buttons visible and styled
- [ ] Hero marquee: infinite scroll animation running
- [ ] Programs grid: 6 program cards visible with correct names, prices (SAR), images
- [ ] Stats strip: animated counters visible and animate on scroll
- [ ] Method section: 4 feature cards visible
- [ ] App section: phone mockup or screenshots visible
- [ ] Stories section: testimonial cards visible and scrolling
- [ ] Final CTA section: WhatsApp button visible and links to correct number

### 2.3 Program Detail Page

- [ ] Program name, tag, price, description rendered correctly
- [ ] Requirements checklist rendered
- [ ] "Enroll Now" button visible
- [ ] Clicking "Enroll Now" opens checkout modal

### 2.4 Checkout Modal

- [ ] Checkout modal opens correctly
- [ ] Program name and price shown in modal summary
- [ ] Form fields visible: Name, Phone, Email
- [ ] Form validation: empty fields prevent submission
- [ ] Submit button triggers API call to `/api/create-order.php`
- [ ] Success: modal closes; redirect to `/ar/thank-you?order_id=N`
- [ ] No WC Consumer Key or Secret visible in browser DevTools → Network tab

### 2.5 Language Toggle

- [ ] AR/EN toggle button visible in nav
- [ ] Clicking EN on `/ar/` navigates to `/en/`
- [ ] Clicking AR on `/en/` navigates to `/ar/`
- [ ] All visible text updates (nav links, headlines, program names, CTA text)
- [ ] Direction flips: Arabic = RTL, English = LTR
- [ ] Program cards re-render with correct locale text
- [ ] Checkout modal copy matches current locale

### 2.6 Dark/Light Mode Toggle

- [ ] Theme toggle button visible in nav
- [ ] Clicking toggles between dark and light
- [ ] Theme persists after page navigation (localStorage)
- [ ] No flash of wrong theme on page load

### 2.7 Mobile Responsive

- [ ] Nav collapses to hamburger on mobile viewport (≤768px)
- [ ] Hamburger opens/closes mobile menu drawer
- [ ] Program cards stack correctly on mobile
- [ ] Hero section readable on mobile
- [ ] Checkout modal fits within mobile viewport
- [ ] No horizontal scrollbar on any page

### 2.8 SEO / Meta

- [ ] `<title>` is localized and specific to each page
- [ ] `<meta name="description">` is present on all pages
- [ ] Open Graph tags present on homepage and program pages
- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] `sitemap.xml` accessible at `/sitemap.xml`
- [ ] Hreflang tags present in `<head>` (check source)
- [ ] JSON-LD `Product` schema present on program pages (check source)

### 2.9 Analytics

- [ ] GA4 snippet present in page `<head>` (check source or DevTools → Network)
- [ ] No analytics firing in preview that would pollute production data (use `?preview=true` filter if needed)

### 2.10 Security

- [ ] No secrets visible in page source (`view-source:`)
- [ ] No secrets in browser DevTools → Sources
- [ ] `/api/create-order.php` returns 405 on GET (accepts POST only)

---

## Section 3 — Pre-Upload File Checklist

Before enabling SFTP or running any upload command:

- [ ] `dist/` is the upload source — NOT the project root
- [ ] Confirm `dist/` does NOT contain:
  - [ ] `.env` or `.env.*` files
  - [ ] `api/config.php`
  - [ ] `.vscode/sftp.json`
  - [ ] `node_modules/`
  - [ ] `docs/` folder
  - [ ] `.git/` folder
  - [ ] `*.md` planning files (`IMPLEMENTATION_LOG.md`, `MIGRATION_CHECKLIST.md`, `DEPLOYMENT_CHECKLIST.md`)
- [ ] PHP files for `public/api/` are verified to be included in upload target

---

## Section 4 — Upload Procedure

> Only perform during an agreed maintenance window.

### 4.1 Enable SFTP (Temporarily)

1. Open `.vscode/sftp.json`
2. Set `"uploadOnSave": false` (already set — verify)
3. Use manual upload command only: VS Code → Command Palette → **SFTP: Upload Project** (or selected folder)

### 4.2 Upload Targets

| Local Path | Remote Path | Notes |
|------------|-------------|-------|
| `dist/` | `/home/u431418749/domains/szafit.com/public_html/` | Main Astro output |
| `public/api/` | `/home/u431418749/domains/szafit.com/public_html/api/` | PHP proxy files |

**Do NOT upload:**
- Project root `.md` files
- `docs/` folder
- `.vscode/` folder
- `.claude/` folder
- `node_modules/`
- `.env` files
- `api/config.php`

### 4.3 After Upload

- [ ] Browser-verify the production URL: `https://szafit.com`
- [ ] SFTP extension connection closed (or `uploadOnSave` confirmed still `false`)

---

## Section 5 — Production Verification

*(Repeat Section 2 checks against the live production URL)*

- [ ] `https://szafit.com/` redirects to `https://szafit.com/ar/`
- [ ] `https://szafit.com/ar/` loads Arabic homepage
- [ ] `https://szafit.com/en/` loads English homepage
- [ ] Program cards load (not placeholder/fallback data)
- [ ] Program detail page opens from card CTA
- [ ] Checkout modal opens
- [ ] **TEST ORDER**: Submit a test order; verify it appears in WooCommerce admin at `z.szafit.com/wp-admin/admin.php?page=wc-orders`
- [ ] Thank-you page loads with correct `order_id` from test order
- [ ] Language switch works in production
- [ ] Dark/light mode works in production
- [ ] Mobile layout correct in production (test on real device or BrowserStack)
- [ ] No console errors in DevTools (F12 → Console)
- [ ] No failed network requests in DevTools (F12 → Network)
- [ ] Page source does not contain any plaintext credentials

---

## Section 6 — Post-Deployment Cleanup

- [ ] Delete test order created during production verification (from WC admin)
- [ ] `uploadOnSave: false` confirmed in `.vscode/sftp.json` (double-check after upload)
- [ ] Deployment noted in `IMPLEMENTATION_LOG.md` (Module 10 log entry updated)
- [ ] Git commit with final state of all deployment files
  ```bash
  git add .
  git status  # verify no secrets staged
  git commit -m "deploy: Astro migration deployed to production"
  ```
- [ ] Git tag created for release
  ```bash
  git tag v1.0.0-astro
  git push origin v1.0.0-astro
  ```
- [ ] All stakeholders notified of successful deployment

---

## Section 7 — Rollback Procedure

If production is broken after deployment:

1. Do NOT make changes in panic. Investigate first.
2. If rollback is needed, restore from the pre-deployment backup (taken in Section 0).
3. Upload the backup to production via SFTP (manual, controlled).
4. Disable `uploadOnSave` immediately after rollback.
5. Document the failure in `IMPLEMENTATION_LOG.md` under the relevant module.
6. Identify root cause before attempting re-deploy.

### Quick Rollback Steps

```bash
# If old vanilla site is the backup:
# 1. Via SFTP, upload the backed-up public_html/ contents to restore previous state
# 2. Verify szafit.com is back to previous state
# 3. Note: WC orders created during the failed deploy window may need manual review
```

---

## Section 8 — Ongoing Deployment Protocol (Post-Launch)

After the initial Astro migration, use this protocol for every future change:

1. Make change on `feature/astro-migration` or a new feature branch
2. Run `npm run build` locally
3. Run through Section 2 manual checks
4. Commit change
5. If approved: run through Sections 3–5 above (abbreviated)
6. Never use `uploadOnSave: true` — always explicit manual deploy

---

*This checklist is authoritative. Any deviation must be documented and approved.*
