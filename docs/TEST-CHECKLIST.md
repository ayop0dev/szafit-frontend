# End-to-End Purchase Flow Test Checklist

**Date:** 2026-05-06  
**Tester:** Static code review + manual browser verification notes  
**Pages under test:** `index.html`, `product.html`, `thank-you.html`

---

## 1. Program Cards Navigation

**Test:** All 6 program cards on `index.html` link to `product.html?id={product_id}`  
**Expected:** Each card CTA is an `<a>` tag with `href="product.html?id={id}"`  
**Result:** PASS (code review)  
**Evidence:** `scripts/landing-programs.js:72` renders `<a href="product.html?id=${program.id}" ...>`  
**Browser Note:** Verify visually that clicking any card navigates to `product.html?id=X` where X is 1-6.

---

## 2. Product Page Rendering

**Test:** `product.html` fetches and renders correctly for each product  
**Expected:** Page reads `?id=X`, calls WooCommerce API, displays image, name, price, description, requirements  
**Result:** PASS (code review)  
**Evidence:** `scripts/product-page.js` implements:
- `getQueryParam('id')` parsing
- `fetch(${API_PRODUCT_ENDPOINT}/${id})` with 7s timeout
- `mapWooProduct()` mapping to bilingual fields
- Fallback to `EMBEDDED_PROGRAMS_DATA` if API fails
- `renderProduct()` populates all DOM elements

**Browser Note:** Test `product.html?id=1` through `id=6`. If CORS blocks the API, verify fallback data renders correctly.

---

## 3. Enroll Now → Checkout Modal

**Test:** "Enroll Now" on `product.html` opens checkout modal pre-filled with correct product  
**Expected:** Clicking "Enroll Now" calls `openCheckoutModal({id, name, price, currency})`  
**Result:** PASS (code review)  
**Evidence:** `scripts/product-page.js:92-104` wires button click to `openCheckoutModal()` with current product data.

**Browser Note:** Verify modal opens, summary shows correct program name and price, SAR symbol renders correctly.

---

## 4. Checkout Form Submission

**Test:** Checkout form submits to WooCommerce API and returns an order ID  
**Expected:** POST to `z.szafit.com/wp-json/wc/v3/orders` with billing data + line_items  
**Result:** PASS (code review)  
**Evidence:** `scripts/checkout-modal.js:372-377` sends `orderPayload` including `line_items: [{product_id, quantity: 1}]` and `payment_method: 'cod'`. Timeout set to 15s via `AbortController`.

**Browser Note:** Requires live API test. If API returns `success: true` + `order_id`, pass. If network/auth error, modal shows error message.

---

## 5. Order Confirmation Redirect

**Test:** Successful order redirects to `thank-you.html?order_id=X` correctly  
**Expected:** After API success, `window.location.href = thank-you.html?order_id=${result.order_id}`  
**Result:** PASS (code review)  
**Evidence:** `scripts/checkout-modal.js:388` performs redirect with order_id query param. `thank-you.html` parses `order_id` and displays it prominently.

**Browser Note:** Verify redirect occurs ~1.5s after success message, and thank-you page shows the order number.

---

## 6. Language Switch (AR/EN)

**Test:** Language switch works on `product.html` and `thank-you.html`  
**Expected:** Clicking EN/AR toggles `dir`, `lang`, re-renders text via i18next  
**Result:** PASS (code review)  
**Evidence:**
- Both pages load `scripts/i18n-config.js` which initializes i18next with `locales/{{lng}}.json`
- Both pages have `langToggle` button wired to `toggleLanguage()`
- `product.html` listens to `languageChanged` event and re-renders product content
- `thank-you.html` updates `data-i18n` elements via `updateDataI18nElements()`

**Browser Note:** Test toggling on both pages. Verify RTL/LTR flips, nav links update, product content switches language.

---

## 7. Dark/Light Theme Toggle

**Test:** Dark/Light theme toggle works on both new pages  
**Expected:** Toggle switches `dark` class on `<html>`, persists to localStorage, icons swap  
**Result:** PASS (code review)  
**Evidence:**
- Both pages have pre-init script that reads `localStorage.theme` before paint (prevents flash)
- Both pages have `themeToggle` wired to toggle `dark` class and update icon (sun/moon)
- All elements use `dark:` Tailwind prefixes

**Browser Note:** Toggle theme on both pages, verify no flash on reload, and all cards/backgrounds adapt.

---

## 8. Mobile Layout (375px Viewport)

**Test:** Mobile layout is correct on both pages  
**Expected:** No horizontal overflow, readable text, tappable buttons, stacked layouts  
**Result:** PASS (code review)  
**Evidence:**
- Both pages use `container-page`, responsive grid (`lg:grid-cols-2`, `md:` breakpoints)
- Nav collapses to hamburger menu at `lg:hidden`
- Product image uses `aspect-square` and scales to container width
- Buttons are full-width on mobile (`w-full`)
- Tailwind responsive utilities handle spacing (`py-section-spacious`, `px-6 md:px-12`)

**Browser Note:** Use DevTools device emulation at 375px width. Verify:
- No horizontal scroll
- Nav menu opens/closes correctly
- Product image stacks above text
- Thank-you page card fits within viewport
- WhatsApp CTA and Back Home buttons stack vertically (`flex-col sm:flex-row`)

---

## Summary

| # | Test | Code Review | Live Browser |
|---|------|-------------|--------------|
| 1 | Program cards link to product.html | PASS | Pending |
| 2 | Product page fetches & renders | PASS | Pending |
| 3 | Enroll Now opens checkout modal | PASS | Pending |
| 4 | Checkout submits to API | PASS | Pending |
| 5 | Redirect to thank-you.html | PASS | Pending |
| 6 | Language switch AR/EN | PASS | Pending |
| 7 | Dark/Light theme toggle | PASS | Pending |
| 8 | Mobile layout 375px | PASS | Pending |

**All 8 items pass static code review.** Live browser verification is required to confirm API connectivity, visual rendering, and interaction timing.
