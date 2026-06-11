You are working on the SZAFIT project. Read all project files first to understand the current state, then execute the following tasks step by step. **Stop after each phase and wait for review before continuing.**

---

## PHASE 1 — Complete Pre-Launch Manual Actions

1. the real WhatsApp number is +966550150445, replace the placeholder `+966501234567` in `index.html:544`.
2. Confirm the active WooCommerce payment gateway slug (COD, Stripe, HyperPay, etc.) and update `checkout-modal.js:365` accordingly.

---

## PHASE 2 — Create `thank-you.html`

1. Create a `thank-you.html` page that:
   - Reads `order_id` from the URL query string.
   - Displays a branded SZAFIT confirmation message (Arabic + English, RTL/LTR aware).
   - Shows the order ID prominently.
   - Includes a WhatsApp CTA button linking to the same number used in the checkout.
   - Matches the visual style of `index.html` (same fonts, colors, dark/light theme support).
2. Make sure the page is linked correctly from the redirect logic in `checkout-modal.js`.

---

## PHASE 3 — Single Product Page

1. Create a `product.html` page that:
   - Reads a `product_id` (or `slug`) from the URL query string.
   - Fetches product details from the WooCommerce REST API (`z.szafit.com`).
   - Displays: product image, name, description, price, and an "Enroll Now" button that opens the checkout modal.
   - Supports Arabic/English and RTL/LTR switching (reuse existing i18n logic).
   - Matches SZAFIT visual style.
2. Update every program card in `index.html` and `scripts/landing-programs.js` so clicking a card navigates to `product.html?id={product_id}`.

---

## PHASE 4 — End-to-End Purchase Flow Testing

1. Write a testing checklist covering:
   - All 6 program cards link correctly to `product.html`.
   - `product.html` fetches and renders correctly for each product.
   - "Enroll Now" on `product.html` opens the checkout modal pre-filled with the correct product.
   - Checkout form submits to the WooCommerce API and returns an order ID.
   - Successful order redirects to `thank-you.html?order_id=X` correctly.
   - Language switch (AR/EN) works on `product.html` and `thank-you.html`.
   - Dark/Light theme toggle works on both new pages.
   - Mobile layout is correct on both pages (375px viewport).
2. Execute each test manually in the browser and document results (pass/fail + notes).

---

## PHASE 5 — Button & UI Audit

1. Audit every button and CTA in `index.html`, `product.html`, and `thank-you.html`:
   - Each button must have a clear, wired action (no dead `href="#"` or empty `onclick`).
   - Hover and focus states must be visible.
   - Mobile tap targets must be at least 44×44px.
2. Fix any broken or placeholder buttons found.
3. Run a final JS console check — zero errors on page load for all three pages.


---

## General Rules
- Do not refactor working code unless a bug is found.
- Reuse existing CSS variables, JS modules, and i18n patterns already in the project.
- Do not install new dependencies — use what is already in the project.
- After each phase, clearly list: files modified, what changed, and what still needs manual input from me.