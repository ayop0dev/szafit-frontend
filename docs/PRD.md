# Product Requirements Document — SZAFIT
**Date:** 2026-06-11  
**Version:** 1.0 (inferred from codebase — no prior PRD found)  
**Status:** Active product, post-launch  

---

## 1. Product Overview

**SZAFIT** is a bilingual (Arabic/English) fitness coaching e-commerce website for a personal trainer operating under the brand name "Coach SZA" (كوتش سزا). The product sells six structured fitness programs delivered via a mobile app. The primary market is Saudi Arabia and the broader Arabic-speaking Gulf region.

The website is a **direct-to-consumer (DTC) sales funnel**: visitors learn about the coach, browse six paid programs, view program details, and purchase via a WooCommerce-powered checkout. Post-purchase, customers gain access to programs through a mobile app (referenced prominently in the site but not built within this codebase).

**Inferred from code and content — no separate product brief was found.**

---

## 2. Goals

Based on the codebase, content, and design:

1. **Convert visitors to paying customers** — all CTAs drive to program enrollment (WhatsApp booking or WooCommerce checkout)
2. **Establish premium brand positioning** — design aesthetic is "Neo Athletic / Minimal Luxury"; copy emphasizes elite discipline, not accessibility
3. **Serve Saudi Arabian / Gulf Arabic market** — default language Arabic (RTL), SAR currency, Saudi names in testimonials
4. **Operate headlessly on WooCommerce** — WordPress handles products and orders; the frontend is the sole user-facing experience
5. **Support bilingual audience** — Arabic-first with English toggle for expatriates or English-preferring users

---

## 3. Target Users

### Primary: Arabic-speaking fitness clients (Saudi Arabia / Gulf)
- Women seeking structured, goal-oriented fitness coaching (women's programs: After Pregnancy, Tone your Body; testimonials skew female)
- Professionals / high-income earners ("CEO", "Founder", "CFO" in testimonials; VIP program at 600 SAR)
- Individuals who want structured remote coaching delivered via an app (not in-person gym)

### Secondary: English-preferring users in the same market
- Expatriates or bilingual Saudis who prefer English content

### Admin: Coach SZA (content manager)
- Updates programs in WooCommerce WordPress admin
- Receives orders via WooCommerce dashboard
- Handles customer follow-up via WhatsApp

---

## 4. Core Features

### Currently Implemented
| Feature | Status | Notes |
|---------|--------|-------|
| Bilingual landing page (AR/EN) | Implemented | Arabic default; toggle via button |
| Dark/light theme toggle | Implemented | Persisted in localStorage |
| 6 program cards with dynamic data | Implemented | Loaded from PHP API / WC / embedded fallback |
| Single program detail page | Implemented | `product.html?id=N` |
| WooCommerce checkout modal | Implemented | Cash on Delivery only; auth status unclear |
| Thank-you / confirmation page | Implemented | Shows order ID from URL param |
| GSAP scroll animations | Implemented | Reveal, parallax, mouse tracking |
| Infinite marquee (hero) | Implemented | GSAP-driven |
| Infinite testimonial loop (stories) | Implemented | GSAP-driven; 7 cards, 2 avatar images |
| Animated stats counters | Implemented | IntersectionObserver + rAF |
| WhatsApp CTA | Implemented | Links to `+966550150445` |
| Custom cursor (desktop) | Implemented | Green circle follows mouse |
| Saudi Riyal symbol rendering | Implemented | Custom SVG font + inline SVG |

### Planned / Referenced But Not Implemented
| Feature | Evidence |
|---------|----------|
| Mobile app (iOS/Android) | Referenced extensively in copy and app section mockup; not linked |
| Real payment gateway (non-COD) | `pre-lanuch-TASK.md` mentions HyperPay / Stripe as future options |
| Analytics tracking | No tracking code found anywhere |
| Blog / content section | No evidence |
| Social media login | No evidence |
| Affiliate / referral system | No evidence |

---

## 5. Content Model

### WooCommerce Products (Programs)

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | WC product ID |
| `name` | string | Bilingual: "English Name اسم عربي" in one field |
| `description` | text | Arabic description with requirements list (📌 pattern) |
| `short_description` | text | Arabic one-liner summary |
| `price` | string | SAR amount as string |
| `regular_price` | string | Same as price (no sale pricing detected) |
| `images[0].src` | URL | Product cover image (hosted on `z.szafit.com`) |
| `tags[0].name` | string | Program type (Foundation / Sculpt / Burn / VIP / Postpartum / Challenge) |

**Custom meta fields (optional, used by `mapWooProduct()` if present):**
- `name_ar`, `description_ar`, `summary_ar` — Arabic overrides
- `requirements_ar`, `requirements_en` — JSON arrays of requirement strings
- `tag_ar` — Arabic tag label

### Pages
- All pages are static HTML; content managed in code, not CMS
- No CMS-driven page creation

### Menus
- Navigation is hardcoded in each HTML file — not CMS-driven

### Media
- Product images: `z.szafit.com/wp-content/uploads/2026/02/`
- Hero, avatars: `assets/images/` (self-hosted)
- Fonts: self-hosted Changa (7 weights) + Saudi Riyal symbol font

### SEO Fields
- `<title>` — static, not CMS-driven
- `<meta name="description">` — hardcoded per page
- No Open Graph, Twitter Card, or JSON-LD

### Custom Fields / ACF
- No ACF detected. Custom meta fields are handled via `product.meta_data` array mapping in `utils.js:mapWooProduct()`

---

## 6. User Journeys

### Journey 1: Visitor browses homepage and enrolls
1. Visitor arrives at `szafit.com` (RTL Arabic landing page)
2. Reads hero section with coach CTA and stats
3. Scrolls to Programs grid — sees 6 program cards loaded from PHP API
4. Clicks "احجز هذه الباقة" on a program card → navigates to `product.html?id=N`
5. Reads program details, requirements, and price
6. Clicks "انضم الآن" / "Enroll Now" → checkout modal opens
7. Fills in name, phone, email → clicks submit
8. Order created in WooCommerce → redirected to `thank-you.html?order_id=X`
9. Sees confirmation with WhatsApp CTA to contact coach

### Journey 2: Visitor uses WhatsApp CTA instead
1. Visitor scrolls to Final CTA section (`#final`)
2. Clicks "احجز مكالمتك الخاصة" button
3. Opens WhatsApp with pre-filled conversation to `+966550150445`
4. Contacts coach directly to book

### Journey 3: Visitor switches to English
1. Visitor clicks "EN" button in nav
2. Page direction flips to LTR
3. All `data-i18n` elements update to English
4. Program cards re-render with English name/text variants
5. Product page re-renders on language change event

### Journey 4: Admin updates a program
1. Admin logs into WordPress (`z.szafit.com/wp-admin`)
2. Updates product name, description, price, or image in WooCommerce
3. No deploy needed — frontend fetches live from WC API on each page load
4. **Note:** Embedded fallback in `constants.js` and PHP API (`api/programs.php`) must be manually updated separately

### Journey 5: Admin creates a new order review
1. Customer submits checkout form on site
2. WooCommerce receives POST to `/wp-json/wc/v3/orders`
3. Order appears in WooCommerce admin dashboard
4. Admin reviews and contacts customer via phone/WhatsApp for COD payment

---

## 7. Functional Requirements

| ID | Requirement | Source / Evidence | Priority | Status |
|----|-------------|-------------------|----------|--------|
| FR-001 | Site must display in Arabic (RTL) by default | `index.html:2` `lang="ar" dir="rtl"` | Must | Done |
| FR-002 | User can toggle between Arabic (RTL) and English (LTR) | `scripts/landing-events.js`, lang toggle button | Must | Done |
| FR-003 | Theme (dark/light) must persist across page navigation | `localStorage.getItem('theme')`, pre-init script | Must | Done |
| FR-004 | Display 6 fitness programs with name, price, summary, image | Program grid in `index.html` | Must | Done |
| FR-005 | Program cards link to individual program detail page | `product.html?id=N` | Must | Done |
| FR-006 | Program detail page shows description, requirements, price, enroll CTA | `product.html` + `product-page.js` | Must | Done |
| FR-007 | Checkout modal collects name, phone, email | `checkout-modal.js:getDefaultCheckoutFields()` | Must | Done |
| FR-008 | Checkout submission creates WooCommerce order | POST `/wp-json/wc/v3/orders` | Must | Uncertain — auth status unknown |
| FR-009 | After successful checkout, redirect to thank-you page with order ID | `checkout-modal.js:389` | Must | Done (code) / Unverified (live) |
| FR-010 | Thank-you page displays order ID and WhatsApp CTA | `thank-you.html` | Must | Done |
| FR-011 | 404 page exists | `404.html` | Should | Done |
| FR-012 | Program data must fall back gracefully if API is unreachable | 4-level fallback chain | Must | Done |
| FR-013 | Site must be mobile-responsive | Tailwind responsive classes throughout | Must | Done |
| FR-014 | WhatsApp CTA must link to correct Saudi business number | `index.html:544`, `thank-you.html` | Must | Done (number updated 2026-05-06) |
| FR-015 | Language switch must update checkout modal copy | `window.updateCheckoutModalLanguage` | Should | Done |
| FR-016 | Pricing displayed in Saudi Riyal (SAR) with official symbol | Custom SAR SVG font + inline SVG | Must | Done |
| FR-017 | GSAP animations should respect `prefers-reduced-motion` | `landing-animations.js:18-29` | Should | Done |
| FR-018 | Nav must have accessible mobile menu (aria-expanded, role) | `index.html:125-126` | Should | Done |
| FR-019 | Checkout modal must have `role="dialog"` and `aria-modal="true"` | `checkout-modal.js:108` | Should | Done |
| FR-020 | Programs page must show "program not found" if invalid ID used | `product-page.js:106-110` | Should | Done |
| FR-021 | Analytics tracking for conversions | No tracking found | Should | **Missing** |
| FR-022 | robots.txt to control crawler access | No file found | Should | **Missing** |
| FR-023 | sitemap.xml for SEO | No file found | Should | **Missing** |
| FR-024 | Open Graph meta tags for social sharing | No OG tags found | Should | **Missing** |

---

## 8. Non-Functional Requirements

### Performance
- **Target:** Largest Contentful Paint < 2.5s on mobile (3G)
- **Current risk:** 3 CDN dependencies (GSAP ×2, Font Awesome) with no fallback; 7 font weights loaded
- **Quick win:** Subset Changa font to weights actually used (400, 600, 700, 800)

### SEO
- **Requirement:** All 6 programs indexable by search engines
- **Current state:** Programs rendered by JS — may not be indexed. No sitemap, robots.txt, OG tags, or structured data
- **Required:** Server-side render program content OR add pre-rendered static fallback

### Accessibility
- **Standard:** WCAG 2.1 AA
- **Current:** Arabic RTL support ✓, aria labels on nav ✓, focus visible on buttons ✓, `role="dialog"` on modal ✓
- **Gaps:** Only 2 avatar images reused with identical alt text (poor screen reader experience); title doesn't update on language switch

### Security
- **Requirement:** No sensitive credentials in version control
- **Current state:** SFTP credentials in `.vscode/sftp.json` — **Critical failure**
- **Requirement:** WooCommerce order creation authenticated
- **Current state:** No auth in client-side requests — **High risk**

### Responsiveness
- **Mobile-first Tailwind:** All pages use responsive breakpoints (`md:`, `lg:`)
- **RTL support:** Tailwind + manual `dir="rtl"` / `dir="ltr"` switching
- **Status:** Good; tested per `docs/TEST-CHECKLIST.md`

### Maintainability
- **Current pain:** Dual i18n systems, triple data sources, no TypeScript, no tests
- **Recommendation:** Consolidate before adding features

### Analytics
- **Requirement:** Track program views, checkout initiations, order completions
- **Current state:** Zero tracking implemented

### Localization
- **Supported:** Arabic (AR), English (EN)
- **Default:** Arabic
- **Direction:** RTL for AR, LTR for EN
- **Currency:** SAR only; no multi-currency support
- **Potential market:** Saudi Arabia, UAE, Kuwait, Bahrain, Qatar, Oman

---

## 9. Pages / Sitemap

```
szafit.com/
├── index.html              (Homepage)
│   ├── #programs           (Programs section anchor)
│   ├── #method             (Method section anchor)
│   ├── #app                (App section anchor)
│   ├── #stories            (Stories section anchor)
│   └── #final              (Final CTA section anchor)
│
├── product.html?id=1       (Zero to Fit — Foundation)
├── product.html?id=2       (Tone your Body — Sculpt)
├── product.html?id=3       (Burn X — Burn)
├── product.html?id=4       (VIP Fit Club — VIP)
├── product.html?id=5       (After Pregnancy — Postpartum)
├── product.html?id=6       (Challenge — Challenge)
│
├── thank-you.html          (Post-checkout confirmation)
├── 404.html                (Error page)
│
├── [REVIEW NEEDED]
│   ├── checkout.html       (Standalone checkout — may be orphaned)
│   ├── products.html       (Product listing — may be orphaned)
│   ├── product-single.html (Product detail variant — may be orphaned)
│   ├── about.html          (About coach — not in nav)
│   ├── success-stories.html (Stories — not in nav)
│   ├── booking.html        (Booking — not in nav)
│   ├── contact.html        (Contact — not in nav)
│   └── app.html            (App info — not in nav)
│
└── api/programs.php        (Internal JSON API — not a user page)
```

---

## 10. Integrations

| Integration | Type | Status | Notes |
|-------------|------|--------|-------|
| WooCommerce REST API v3 | Commerce backend | Active | Products + Orders; auth unverified |
| i18next v23 | Internationalization | Active | AR/EN; loaded from CDN |
| i18next-http-backend v2 | i18n JSON loader | Active | Fetches `./locales/*.json` |
| GSAP 3.12.5 + ScrollTrigger | Animations | Active | CDN; no local fallback |
| Font Awesome 6.5.2 | Icons | Active | CDN; no local fallback |
| WhatsApp Business | Customer communication | Active | `wa.me/+966550150445` |
| Hostinger shared hosting | Web hosting | Active | SFTP deployment |
| Google Fonts / Changa | Typography | Avoided — self-hosted | Correct approach for performance |
| Analytics | None | **Not implemented** | GA4 / Plausible recommended |
| Email | None detected | **Not implemented** | No contact form email handling |
| Payment (non-COD) | None | **Not implemented** | HyperPay / Stripe mentioned in docs |
| SMS / OTP | None | **Not implemented** | |
| Maps | None | **Not implemented** | |
| Search | None | **Not implemented** | |

---

## 11. Analytics & Tracking

**Current state: Zero analytics implementation.**

No Google Analytics, Google Tag Manager, Meta Pixel, TikTok Pixel, Snapchat Pixel, Hotjar, Plausible, or any other tracking code was found in any HTML file or JavaScript.

### Recommended events to track (when analytics are added):
| Event | Trigger |
|-------|---------|
| `page_view` | All pages |
| `program_card_click` | Click on program card CTA |
| `product_view` | `product.html` load with valid `?id` |
| `checkout_open` | Checkout modal opened |
| `checkout_submit` | Form submitted |
| `purchase` | Redirect to `thank-you.html` with `order_id` |
| `language_switch` | AR↔EN toggle |
| `whatsapp_click` | Any `wa.me/` link click |

---

## 12. SEO Requirements

### Current State
| Requirement | Status |
|-------------|--------|
| `<title>` per page | Partial — static; not updated on language switch (except product.html) |
| `<meta name="description">` | Partial — generic; not optimized per page |
| Open Graph (`og:title`, `og:description`, `og:image`) | **Missing** |
| Twitter Card tags | **Missing** |
| `sitemap.xml` | **Missing** |
| `robots.txt` | **Missing** |
| JSON-LD structured data (Product, LocalBusiness) | **Missing** |
| Canonical URL tags | **Missing** |
| Alt text on images | Partial — hero image has descriptive alt; avatar alts are generic |
| `lang` attribute | Done — `<html lang="ar">` default |
| `dir` attribute | Done — `<html dir="rtl">` default, updated on switch |

### Recommended Priority Actions
1. Create `robots.txt` (quick win)
2. Create `sitemap.xml` listing all HTML pages
3. Add Open Graph tags to all pages
4. Add JSON-LD `Product` schema to `product.html`
5. Add JSON-LD `LocalBusiness` schema to `index.html`
6. Update `<title>` via JS on language switch for all pages

---

## 13. Admin / CMS Requirements

The WordPress admin at `z.szafit.com/wp-admin` must support:

| Capability | Current Support | Notes |
|------------|-----------------|-------|
| Add / edit / delete programs | Yes — WooCommerce Products | Frontend auto-fetches live data |
| Set program price | Yes — WooCommerce price fields | SAR assumed |
| Upload program images | Yes — WooCommerce media | Hosted on `z.szafit.com` |
| Add bilingual product name | Partial — bilingual name in single field (e.g. "Zero to Fit من الصفر") | Brittle; requires specific format |
| View and manage orders | Yes — WooCommerce Orders | COD orders; no payment processing |
| Manage product tags | Yes — WooCommerce Tags | Used for program type labels |
| Enable/disable a program | Partial — unpublish product removes it from WC API | PHP hardcoded API unaffected |
| Change payment gateway | Yes — WooCommerce Payments settings | Frontend must also update `checkout-modal.js:365` |

**Critical gap:** Changing anything in WooCommerce does NOT update:
- `api/programs.php` (hardcoded PHP array)
- `scripts/constants.js` (`EMBEDDED_PROGRAMS_DATA`)

These must be updated manually to stay in sync with WooCommerce.

---

## 14. Technical Architecture

### Frontend
- **Type:** Multi-page application (MPA), vanilla HTML/CSS/JS
- **No framework:** No React, Vue, Next.js, Astro, or similar
- **Module system:** ES Modules (`type="module"`) for homepage; non-module scripts for checkout modal and i18n
- **CSS:** Tailwind CSS v3 (compiled) + custom CSS variables (theme tokens)
- **Rendering:** Client-side; no SSR; programs rendered by JS after page load
- **State:** Simple plain object (`state`) in `index.js`; `localStorage` for persistence
- **Build step:** Only `npm run build:css` (Tailwind compilation); no JS bundler

### Backend / CMS
- **Platform:** WordPress + WooCommerce on Hostinger shared hosting at `z.szafit.com`
- **Usage:** Headless — only WooCommerce REST API is consumed; WP admin for content management
- **PHP API:** `api/programs.php` runs on same Hostinger account as frontend; serves as primary data source

### API Layer
- **WooCommerce REST API v3** — products, orders, checkout fields
- **Local PHP** — `/api/programs.php` (no auth required; same-origin)
- **Authentication:** Not implemented — critical gap for order creation

### Rendering Mode
- **CSR (Client-Side Rendering)** — all dynamic content rendered by JavaScript after initial HTML load
- **No SSR, no SSG, no ISR**

### Caching
- **No caching layer implemented** — each page load fetches fresh from API
- **Browser caching:** Default browser caching for static assets; no explicit cache-control headers set by PHP

### Hosting / Deployment
- **Hosting:** Hostinger shared hosting
- **Frontend deployment:** SFTP via VS Code extension (auto-upload on save)
- **Backend:** WordPress hosted on same Hostinger account
- **CDN:** Cloudflare (GSAP, Font Awesome) — external, not controlled by project

---

## 15. Risks & Open Questions

### Product Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| No analytics = no conversion data | High | High | Add GA4 before any optimization decisions |
| WhatsApp number wrong = lost leads | Low | High | Verify `+966550150445` is correct business number |
| WooCommerce auth failure = checkout broken | Medium | Critical | Test live on production immediately; implement PHP proxy |
| CDN outage (GSAP/FA) = broken animations/icons | Low | Medium | Add local fallback copies |
| Program data divergence across 3 sources | High | Medium | Consolidate to single source |

### Technical Risks
| Risk | Likelihood | Impact |
|------|-----------|--------|
| SFTP credentials already used maliciously | Unknown | Critical |
| Shared hosting performance degradation | Medium | Medium |
| WooCommerce WordPress version vulnerabilities | Unknown | High |
| i18n divergence causes wrong text in either language | Medium | Medium |

### Open Questions
1. What is the business model for the mobile app? Is it a third-party platform (e.g., Trainerize, True Coach) or a custom app?
2. Will Cash on Delivery remain the only payment method? What is the activation plan for HyperPay?
3. Are the secondary pages (`checkout.html`, `products.html`, etc.) part of a planned feature set?
4. Is there a defined plan for growing past 6 programs?
5. What is the client acquisition channel? (The site has no analytics, so traffic source is unknown)

---

## 16. Roadmap

### Immediate (Week 1)
- Rotate SFTP credentials + gitignore
- Implement WooCommerce order authentication (PHP proxy)
- Add analytics (GA4)
- Add `robots.txt` and `sitemap.xml`
- Verify full checkout flow on production

### Short-term (Month 1)
- Consolidate i18n to single system
- Add Open Graph + JSON-LD structured data
- Implement non-COD payment gateway (HyperPay or Stripe)
- Clarify and link (or remove) secondary orphaned pages
- Add more avatar images to testimonials

### Medium-term (Months 2–3)
- Server-side rendered program cards for SEO
- Implement conversion funnel analytics (program view → checkout open → purchase)
- Add email confirmation after purchase
- Build or integrate mobile app access flow post-purchase
- Add a blog / content section to drive organic traffic

### Long-term (Months 4–6)
- Custom customer portal for program access
- Subscription / recurring payment programs
- Multi-currency support (AED, KWD, QAR)
- Loyalty / referral system

---

## 17. Acceptance Criteria

The project is ready for continued stable development when:

- [ ] SFTP credentials rotated and removed from git history
- [ ] `.gitignore` created and applied
- [ ] Checkout flow verified working end-to-end on production (order created in WC, redirect to thank-you page)
- [ ] Analytics tracking installed and reporting conversions
- [ ] `robots.txt` and `sitemap.xml` created and deployed
- [ ] All 6 program cards load and link to correct product pages
- [ ] Language toggle correctly switches all visible text on index.html, product.html, and thank-you.html
- [ ] Dark mode toggle correctly applies to all pages
- [ ] Orphaned pages (`checkout.html`, `products.html`, `product-single.html`, etc.) either linked in nav or removed
- [ ] Single i18n system in use (i18next with JSON files, no parallel translations.js)
- [ ] Single program data source (WC or PHP proxy — not three independent copies)
- [ ] No plaintext credentials in any source file
