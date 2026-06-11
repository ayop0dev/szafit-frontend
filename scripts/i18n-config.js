/**
 * ================================================
 * i18n CONFIGURATION & INITIALIZATION
 * ================================================
 * Setup for i18next library with localStorage persistence
 * Supports bilingual project: Arabic (default) + English
 */

// Initialize i18next instance
const i18n = i18next.createInstance({
    lng: localStorage.getItem('lang') || 'ar',
    fallbackLng: 'ar',
    ns: ['translation'],
    defaultNS: 'translation',
    debug: false,
    interpolation: {
        escapeValue: false
    },
    backend: {
        loadPath: './locales/{{lng}}.json'
    },
    load: 'languageOnly'
});

// Initialize backend plugin for fetching JSON files
i18n.use(i18nextHttpBackend).init({
    lng: localStorage.getItem('lang') || 'ar',
    fallbackLng: 'ar',
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
        loadPath: './locales/{{lng}}.json'
    },
    interpolation: {
        escapeValue: false
    }
}, function(err, t) {
    if (err) {
        console.error('i18next initialization error:', err);
        return;
    }
    
    // Initialize UI with current language on first load
    applyLanguageWithI18n(i18n.language);
});

/**
 * Apply language across the entire application
 * Updates DOM, localStorage, CSS classes, and triggers re-renders
 * @param {string} lang - Language code ('ar' or 'en')
 */
function applyLanguageWithI18n(lang) {
    // Update i18next language
    i18n.changeLanguage(lang);
    
    // Update localStorage
    localStorage.setItem('lang', lang);
    
    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update all data-i18n elements
    updateDataI18nElements(lang);
    
    // Update theme if dark mode
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Update all data-i18n elements in the DOM
 * @param {string} lang - Language code
 */
function updateDataI18nElements(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            const text = i18n.t(key);
            if (text && text !== key) {
                // Preserve HTML content if exists, only update text nodes
                if (el.children.length === 0) {
                    el.textContent = text;
                } else {
                    // For elements with children, be careful
                    const firstTextNode = Array.from(el.childNodes).find(node => node.nodeType === 3);
                    if (firstTextNode) {
                        firstTextNode.textContent = text;
                    }
                }
            }
        }
    });
}

/**
 * Get translated string
 * @param {string} key - Translation key
 * @param {object} options - Options for interpolation
 * @returns {string} Translated text
 */
function t(key, options = {}) {
    return i18n.t(key, options);
}

/**
 * Get current language
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
    return i18n.language || localStorage.getItem('lang') || 'ar';
}

/**
 * Toggle between Arabic and English
 * @returns {string} New language code
 */
function toggleLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    applyLanguageWithI18n(newLang);
    return newLang;
}

/**
 * Get program data translated
 * @param {string} programKey - Program key (e.g., 'starter', 'toning', etc.)
 * @param {string} field - Field to get (e.g., 'name', 'summary', 'requirements')
 * @returns {any} Translated program data
 */
function getProgramTranslation(programKey, field) {
    return i18n.t(`programs_data.${programKey}.${field}`);
}

/**
 * Get all program data in current language
 * @returns {object} Program data object
 */
function getAllProgramsData() {
    const programs = [];
    const programKeys = ['starter', 'toning', 'burn', 'after_pregnancy', 'challenge', 'vip'];
    
    programKeys.forEach(key => {
        const program = {
            id: key,
            name: getProgramTranslation(key, 'name'),
            price: getProgramTranslation(key, 'price'),
            currency: getProgramTranslation(key, 'currency'),
            summary: getProgramTranslation(key, 'summary'),
            description: getProgramTranslation(key, 'description'),
            tag: getProgramTranslation(key, 'tag'),
            requirements: getProgramTranslation(key, 'requirements')
        };
        programs.push(program);
    });
    
    return programs;
}

/**
 * Listen for language change events
 * @param {function} callback - Callback function
 */
function onLanguageChange(callback) {
    window.addEventListener('languageChanged', (e) => {
        callback(e.detail.lang);
    });
}

// Export functions globally
window.i18n = i18n;
window.t = t;
window.toggleLanguage = toggleLanguage;
window.applyLanguageWithI18n = applyLanguageWithI18n;
window.getCurrentLanguage = getCurrentLanguage;
window.getProgramTranslation = getProgramTranslation;
window.getAllProgramsData = getAllProgramsData;
window.onLanguageChange = onLanguageChange;
