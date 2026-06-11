# I18n Implementation Guide - SZA Fit Bilingual Project

## Overview
This document guides the bilingual (Arabic/English) i18next implementation for SZA Fit project.

**Status:** ✅ Foundation Complete | 🟡 Integration In Progress

---

## What's Done

### 1. **Translation Files Created**
- ✅ `/locales/ar.json` - Complete Arabic translations (500+ keys)
- ✅ `/locales/en.json` - Complete English translations (500+ keys)
- Includes: nav, hero, programs, methods, app, stories, checkout, pages sections

### 2. **i18n Configuration**
- ✅ `scripts/i18n-config.js` - i18next initialization
- ✅ `package.json` updated with i18next dependencies
- ✅ HTML files updated with i18next script tags (index.html, checkout.html, 404.html)

### 3. **Translation Structure**
```
{
  "nav": { "programs": "البرامج", ... },
  "hero": { "line1": "خلي جسمك", ... },
  "programs": { "label": "البرامج المدفوعة", ... },
  "programs_data": {
    "starter": { "name": "برنامج البداية", ... },
    "toning": { "name": "شد الجسم", ... },
    ...
  },
  "pages": {
    "about": { "title": "عن Elite Coaching", ... },
    "contact": { "title": "تواصل معنا", ... },
    ...
  }
}
```

---

## What's Next (To Complete)

### Phase 2: JavaScript Integration
**Files to update:**
- `scripts/premium-landing.js` - Replace translations object with i18n.t()
- `scripts/checkout.js` - Replace hardcoded strings with i18n.t()
- `scripts/checkout-modal.js` - Replace modal HTML strings

**Expected changes:**
```javascript
// OLD:
const text = translations[state.lang]['nav.programs'];

// NEW:
const text = i18n.t('nav.programs');
```

### Phase 3: HTML Pages
**Create/update untranslated pages:**
- ✅ about.html → Add data-i18n attributes
- ✅ app.html → Add data-i18n attributes
- ✅ contact.html → Add data-i18n attributes
- ✅ booking.html → Add data-i18n attributes
- ✅ products.html → Add data-i18n attributes
- ✅ product-single.html → Add data-i18n attributes

Each page needs:
```html
<!-- i18next Library & Backend -->
<script src="https://cdn.jsdelivr.net/npm/i18next@23.7.6/dist/umd/i18next.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/i18next-http-backend@2.4.2/dist/umd/i18nextHttpBackend.min.js"></script>

<!-- Configuration -->
<script src="./scripts/i18n-config.js"></script>
```

---

## API Reference

### Global Functions (from i18n-config.js)

```javascript
// Get translated string
t('nav.programs')  // Returns: "البرامج" or "Programs"

// Toggle language (ar ↔ en)
toggleLanguage()  // Returns new language code

// Get current language
getCurrentLanguage()  // Returns: 'ar' or 'en'

// Apply language globally
applyLanguageWithI18n('en')  // Changes everything to English

// Get program translations
getProgramTranslation('starter', 'name')  // Returns: "برنامج البداية"

// Get all programs data
getAllProgramsData()  // Returns array of all 6 programs with translations

// Listen to language changes
onLanguageChange((lang) => {
  console.log('Language changed to:', lang);
});

// Update all data-i18n elements
updateDataI18nElements('en');
```

### HTML Usage

```html
<!-- Simple text translation -->
<button data-i18n="nav.cta">احجز برنامجك</button>

<!-- Nested keys -->
<span data-i18n="hero.card.label">نتائج أول 30 يوم</span>

<!-- Arrays (requirements list) -->
<ul id="requirements"></ul>
<script>
  const reqs = i18n.t('programs_data.starter.requirements', { returnObjects: true });
  reqs.forEach(req => {
    document.querySelector('#requirements').innerHTML += `<li>${req}</li>`;
  });
</script>
```

---

## Language Toggle Integration

The existing language toggle button (`#langToggle`) should be updated in `premium-landing.js`:

```javascript
// OLD implementation
document.getElementById('langToggle').addEventListener('click', () => {
  state.lang = state.lang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('lang', state.lang);
  applyLanguage(state.lang);
});

// NEW implementation (compatible with i18next)
document.getElementById('langToggle').addEventListener('click', () => {
  const newLang = toggleLanguage();
  // i18next handles everything automatically
});
```

---

## localStorage Persistence

Both old and new systems use `localStorage.lang`:

```javascript
// Reading current language
const lang = localStorage.getItem('lang') || 'ar';

// Setting language
localStorage.setItem('lang', 'en');

// This persists across page reloads and syncs across tabs
```

---

## Currency & Locale-Specific Data

Program prices and currencies are now in translations:

```json
{
  "programs_data": {
    "starter": {
      "price": "99",
      "currency": "ر.س"  // Arabic
    }
  }
}
```

And in English:
```json
{
  "programs_data": {
    "starter": {
      "price": "99",
      "currency": "SAR"  // English
    }
  }
}
```

---

## Troubleshooting

### Issue: Translations not loading
**Solution:**
1. Check that locales/ folder exists with ar.json and en.json
2. Verify i18n-config.js is loaded before other scripts
3. Check browser console for CORS errors
4. Ensure paths are relative: `./locales/{{lng}}.json`

### Issue: data-i18n elements not updating
**Solution:**
1. Call `applyLanguageWithI18n(lang)` doesn't update all elements
2. Make sure data-i18n attributes are set BEFORE i18n loads
3. Call `updateDataI18nElements(lang)` manually if needed

### Issue: Language not persisting
**Solution:**
1. Check if localStorage is enabled in browser
2. Verify i18n-config.js sets localStorage properly
3. Check for incognito/private mode (may not persist)

---

## Performance Notes

- Translation files are loaded once and cached
- i18next uses in-memory storage (fast lookups)
- No database calls required
- Language toggle is instant (<1ms)

---

## Rollback Strategy

If needed to revert to old system:
1. Remove i18next script tags from HTML
2. Revert scripts/premium-landing.js, checkout.js to originals
3. Keep locales/ directory (useful reference)
4. Old `translations` object still in code is ignored when i18next loads

---

## Files Summary

| File | Status | Purpose |
|------|--------|---------|
| `locales/ar.json` | ✅ Done | All Arabic translations |
| `locales/en.json` | ✅ Done | All English translations |
| `scripts/i18n-config.js` | ✅ Done | i18next setup & helpers |
| `package.json` | ✅ Updated | i18next dependencies |
| `index.html` | ✅ Updated | Includes i18next scripts |
| `checkout.html` | ✅ Updated | Includes i18next scripts |
| `404.html` | ✅ Updated | Includes i18next scripts |
| `scripts/premium-landing.js` | 🟡 Pending | Replace translations usage |
| `scripts/checkout.js` | 🟡 Pending | Replace hardcoded strings |
| `scripts/checkout-modal.js` | 🟡 Pending | Replace modal strings |
| `about.html` → `product-single.html` | 🟡 Pending | Create with i18n support |

---

## Next Steps

1. **Update JavaScript files** to use i18n.t() instead of translation objects
2. **Create untranslated pages** with full bilingual support
3. **Test language switching** across all pages
4. **Verify localStorage persistence** across sessions
5. **Check mobile responsiveness** with RTL/LTR
6. **Deploy** with new dependencies

---

## Support Resources

- i18next docs: https://www.i18next.com
- i18next HTTP Backend: https://github.com/i18next/i18next-http-backend
- Browser localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

**Last Updated:** April 6, 2026  
**Status:** Implementation Phase 2 Ready
