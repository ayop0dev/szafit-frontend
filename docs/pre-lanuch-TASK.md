# SZAFIT — Full Pre-Launch Fix Sprint

## Your Role

You are working on the **SZAFIT** fitness landing page. A full deploy audit has been completed and documented in `CHECKPOINT-DEPLOY.md`. Your job is to resolve **every open issue** in that file — blockers, required fixes, and post-launch items — then update the checkpoint to reflect the new state, and **stop for review**.

Read each file before editing it. Do not refactor unrelated code. Do not add features not listed here.

---

## Project Context

- **Stack:** Vanilla JS, HTML, CSS/Tailwind — no build framework, no JSX.
- **Brand primary color:** `#C6FF34` (lime). Secondary: `#9ac527`. Dark bg: `#171717`. Light bg: `#fafaf9`.
- **Language:** Arabic default (RTL). English toggle available (LTR). `<html>` attribute controls direction.
- **Payment gateway active now:** Cash on Delivery — WooCommerce slug `cod`. Use this everywhere until further notice.
- **Programs count:** Exactly 6. Four exist in embedded fallback. Two are missing (see below).
- **Avatar images on disk:** Only `man-1.webp` and `woman-1.webp` exist under `assets/images/avatars/`.

---

## Missing Programs — Add to Embedded Fallback

These two must be added to `EMBEDDED_PROGRAMS_DATA` in `constants.js`. Match the exact data shape of the existing four entries.

**After Pregnancy (بعد الحمل)**
- Price: `550` SAR
- Short description: برنامج مخصص للرجوع التدريجي بعد الحمل، يساعد على تقوية الجسم، شد بسيط، وتحسين اللياقة بدون ضغط على البطن أو الحوض.
- Image: follow the existing URL pattern on `z.szafit.com/wp-content/uploads/` — use a reasonable filename guess or leave a clearly marked placeholder comment.

**Challenge (تحدي)**
- Price: `150` SAR
- Short description: تحدي قوي ومتحمس للي يبغى نتائج سريعة خلال مدة قصيرة. فيه جدول مكثف وتمارين متنوعة مع نظام غذائي واضح.
- Image: same approach as above.

---

## Issues to Fix

Work through these in the order listed. Read each relevant file in full before making any change.

---

### 🔴 BLOCKERS

**1. Broken avatar images**
`index.html` references `man-2.webp` and `woman-2.webp` in the hero social proof area and the stories section (around lines 171, 172, 503, 516). These files do not exist. Resolve the broken image state — read the markup to decide the best approach.

**2. Non-functional WhatsApp CTA**
Around `index.html:544`, the "احجز مكالمتك الخاصة" button contains a placeholder phone number (`+966xxxxx`). Replace it with `+966500000000` as a temporary stand-in and add an inline comment marking it for easy replacement with the real number later.

**3. Invalid payment method slug**
`scripts/checkout-modal.js` around line 306 sends `payment_method: 'woocommerce'` in the order POST. Replace with `payment_method: 'cod'`.

**4. No post-order redirect**
After `result.success` in the order creation handler (`checkout-modal.js:317–320`), the modal just closes. For `cod`, the correct UX is: show a brief success state, then redirect to `thank-you.html?order_id=<id>` (use the order ID from the API response if available). If `thank-you.html` does not exist, create a minimal page that confirms the order, shows the order ID, and tells the user payment will be collected on delivery. Style it consistently with the existing site (use the same CSS files already linked).

---

### 🟡 REQUIRED

**5. Remove debug console statements**
`scripts/index.js` lines ~25–113 contains emoji-prefixed `console.log` calls for every DOM init step. Remove all of them. Retain only genuine error-handling `console.warn` / `console.error` calls.

**6. Fix duplicate event listeners**
`scripts/index.js` registers click handlers for `themeToggle` and `langToggle` twice — once inside `bindEvents()` and again in a separate block a few lines later. Remove the duplicate registration. Keep only one.

**7. Wire checkout modal translations**
`scripts/checkout-modal.js` has a complete `checkoutTranslations` object (`ar`/`en`) already defined but never used. All modal strings (title, labels, submit button, summary fields) are hardcoded Arabic. Wire the translations object into the modal render functions so that switching language updates the modal copy correctly.

**8. Add AbortController timeout to checkout fetch**
`scripts/checkout-modal.js:309` — the order `fetch()` call has no timeout. Add an `AbortController` with a 10–15 second timeout. On abort, re-enable the submit button and show a user-facing error message using the existing error display mechanism in the modal.

**9. Add missing programs to embedded fallback**
`scripts/constants.js:27–68` — `EMBEDDED_PROGRAMS_DATA` contains only 4 programs. Add After Pregnancy and Challenge as described in the "Missing Programs" section above. The site stat strip claims 6 programs — the fallback must match.

**10. Fix placeholder social media links**
`index.html:556–559` — footer social links point to root domains (`instagram.com`, `twitter.com`, etc.). Replace with the real SZAFIT account URLs. If you do not know the real URLs, replace with `#` and add a comment clearly marking each one as `TODO: replace with real SZAFIT profile URL`.

---

### 🟢 POST-LAUNCH

**11. Define `.neo-grid-bg` CSS class**
`index.html:98` applies `.neo-grid-bg` to the fixed background layer. The class does not exist in any CSS file. Add a definition to `css/style.css` — a subtle CSS grid pattern using the brand color at low opacity is appropriate. Keep it lightweight.

**12. Fix cursor color**
`scripts/index.js:134` hardcodes the cursor border as `#01D09A` (old teal). Update to `#C6FF34` (current brand primary).

**13. i18n Phase 2 — remaining files**
The `checkoutTranslations` wiring in issue #7 covers `checkout-modal.js`. Check `checkout.js` and `scripts/premium-landing.js` as well — if hardcoded strings exist that should be translatable, apply the same pattern. Do not over-engineer; match whatever i18n approach is already in use across the project.

**14. Document vendor CDN dependency risk**
`/vendor` folder is referenced in project docs but does not exist. GSAP and Font Awesome are CDN-only. Do not create the folder. Instead, add a clearly marked comment block in `index.html` near the CDN `<script>` and `<link>` tags explaining that these have no local fallback and will break if the CDN is unreachable. This is a documentation/awareness fix only.

**15. WCAG accessibility gaps**
Based on the audit in `DESIGN-AUDIT-REPORT.md`, three gaps remain:
- Missing focus rings on secondary nav links — add visible `:focus-visible` styles in `css/style.css`.
- Missing `<label>` associations on checkout form fields — read the modal markup and add `for`/`id` pairs or `aria-label` attributes where labels are absent.
- Checkout modal missing `role="dialog"` and `aria-modal="true"` — add to the modal root element.

**16. Audit `api/programs.php`**
Read the file. Verify it returns all 6 programs and that its response schema matches what `scripts/landing-programs.js` expects. If gaps exist, note them clearly as comments in the PHP file and flag them in the checkpoint update.

---

## After All Fixes Are Applied

Update `CHECKPOINT-DEPLOY.md` as follows:

1. Change the top-level **Verdict** line to reflect current status (e.g., `READY FOR TEST` if all blockers and required items are resolved, or list what remains).
2. For each resolved issue, mark it with `✅ RESOLVED — <one-line summary of what was done>`.
3. For any issue you could not fully resolve (e.g., real social URLs not known, real WhatsApp number not known), mark it `⚠️ PARTIAL — <reason>` and leave the TODO comment in the code.
4. Update the **Launch Checklist** checkboxes to reflect what is now passing.
5. Add a new section at the bottom: `## Sprint Log — <today's date>` with a bullet list of every file touched and what changed.

Then **stop**. Do not proceed to deployment or any further changes. Wait for the developer to review.
