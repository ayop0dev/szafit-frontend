# 🎯 QUICK REFERENCE - Modular Script Files

## 📂 File Mapping (Old → New)

| Function | Old Location | New Location |
|----------|-------------|--------------|
| **Main entry point** | `premium-landing.js` | `index.js` |
| **Constants** | Inside premium-landing.js | `constants.js` |
| **Utils** | Inside premium-landing.js | `utils.js` |
| **Translations** | Inside premium-landing.js | `translations.js` |
| **Animations** | Inside premium-landing.js | `landing-animations.js` |
| **Events** | Inside premium-landing.js | `landing-events.js` |
| **Programs** | Inside premium-landing.js | `landing-programs.js` |

---

## 🔍 Where to Find Things

### Want to change **translations**? 
→ Edit `scripts/translations.js`

### Want to modify **animations**?
→ Edit `scripts/landing-animations.js`

### Want to change **event handlers**?
→ Edit `scripts/landing-events.js`

### Want to add **new constants**?
→ Edit `scripts/constants.js`

### Want to add **new utilities**?
→ Edit `scripts/utils.js`

### Want to change **program rendering**?
→ Edit `scripts/landing-programs.js`

### Want to change **initialization flow**?
→ Edit `scripts/index.js`

---

## 🚀 How to Use

### To add a new animation:
```javascript
// In landing-animations.js
export function initializeMyAnimation() {
    // Your code here
}

// In index.js, add to DOMContentLoaded:
initializeMyAnimation();
```

### To add a new translation:
```javascript
// In translations.js
ar: {
    'my.new.key': 'النص بالعربية'
},
en: {
    'my.new.key': 'English text'
}

// In HTML:
<h1 data-i18n="my.new.key"></h1>
```

### To fix an event listener:
```javascript
// In landing-events.js
// Add to bindEvents() function at the appropriate place
elements.myElement.addEventListener('click', () => {
    // Your handler
});
```

---

## 📊 File Sizes

The refactoring organizes code for **clarity**, not compression. Each file is small and focused:

- `index.js` - Main orchestrator (~80 lines)
- `constants.js` - Static data (~120 lines)
- `utils.js` - 4 helper functions (~70 lines)
- `translations.js` - All text strings (~250 lines)
- `landing-animations.js` - Animation logic (~280 lines)
- `landing-events.js` - Event handlers (~140 lines)
- `landing-programs.js` - Program UI logic (~80 lines)

**Total: ~1,020 lines** (same as original, just organized)

---

## ✨ Why This Structure?

```
ONE MONOLITHIC FILE          →    SEVEN FOCUSED FILES
(hard to navigate)                (easy to maintain)

premium-landing.js
├── Constants              ✓ → constants.js
├── Utilities              ✓ → utils.js
├── Translations           ✓ → translations.js
├── Animations (280 lines) ✓ → landing-animations.js
├── Event handlers         ✓ → landing-events.js
├── Program UI             ✓ → landing-programs.js
└── Initialization         ✓ → index.js
```

---

## 🔗 Import/Export Pattern

```javascript
// Example: If you want to use a function from another file

// 1. Export it from source file
export function myFunction() { }

// 2. Import in target file
import { myFunction } from './source.js';

// 3. Use it
myFunction();
```

---

## 📝 Common Tasks

### 🎨 Change theme colors?
→ Update `css/style.css` (colors defined there)

### 🌐 Add new language?
→ Add new object to `translations.js` and update HTML lang attribute logic

### 🏋️ Add new program?
→ Add to `constants.js` `DEFAULT_PROGRAMS` array

### 📱 Fix mobile menu?
→ Look in `landing-events.js` (mobile menu handler)

### 🔌 Change API endpoint?
→ Update `PROGRAMS_ENDPOINT` in `constants.js`

---

## ✅ Testing Checklist

After refactoring, verify:
- [x] Language toggle works (AR ↔ EN)
- [x] Theme toggle works (Dark → Light)
- [x] Programs render correctly
- [x] Animations play smoothly
- [x] Mobile menu closes on click
- [x] Checkout modal opens on program click
- [x] API loads and overwrites default programs
- [x] No console errors

---

## 🎓 Learning Points

This refactoring demonstrates:

1. **Module Pattern** - Organize code by functionality
2. **ES6 Imports/Exports** - Clean dependency management
3. **Single Responsibility** - Each file has one job
4. **Separation of Concerns** - Constants, utils, logic are separate
5. **Scalability** - Easy to add features without touching existing code

---

## 🔐 Backup

Your original file is safe:
```
scripts/archive/premium-landing-refactored.backup.js
```

---

**Happy coding!** 🚀
