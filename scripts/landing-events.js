// ========================= EVENT HANDLERS =========================

/**
 * Bind all page event listeners
 */
export function bindEvents(state, elements, translations, programsData, renderPrograms, initializeAnimations) {
    if (elements.langToggle) {
        elements.langToggle.addEventListener('click', () => {
            try {
                state.lang = state.lang === 'ar' ? 'en' : 'ar';
                try {
                    localStorage.setItem('lang', state.lang);
                } catch (e) {
                    console.warn('localStorage unavailable');
                }
                applyLanguage(state.lang, elements, translations);
                renderPrograms(programsData, state, translations);
                // Re-initialize animations after DOM change
                setTimeout(() => {
                    if (window.gsap) {
                        gsap.killTweensOf('[data-reveal], [data-parallax], [data-mouse]');
                        initializeAnimations();
                    }
                }, 50);
            } catch (error) {
                console.error('Language toggle error:', error);
            }
        });
    }

    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', () => {
            try {
                state.theme = state.theme === 'dark' ? 'light' : 'dark';
                try {
                    localStorage.setItem('theme', state.theme);
                } catch (e) {
                    console.warn('localStorage unavailable for theme');
                }
                applyTheme(state.theme, elements);
            } catch (error) {
                console.error('Theme toggle error:', error);
            }
        });
    }

    // Mobile menu close function
    const closeMenu = () => {
        if (elements.mobileMenu) {
            elements.mobileMenu.classList.add('hidden');
            elements.mobileToggle?.setAttribute('aria-expanded', 'false');
        }
    };

    // Mobile menu toggle with aria-expanded
    if (elements.mobileToggle && elements.mobileMenu) {
        elements.mobileToggle.addEventListener('click', () => {
            const isHidden = elements.mobileMenu.classList.toggle('hidden');
            elements.mobileToggle.setAttribute('aria-expanded', !isHidden);
        });
    }

    // Close menu on navigation
    document.querySelectorAll('#mobileMenu a, #mobileMenu button').forEach(el => {
        el.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && !e.target.closest('#mobileMenu')) {
            closeMenu();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            event.preventDefault();
            try {
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    closeMenu();
                }
            } catch (error) {
                console.warn('Navigation error:', error);
            }
        });
    });

    // CTA buttons scroll to final section
    [elements.heroPrimary, elements.heroSecondary, elements.navCTA].forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            try {
                const target = document.getElementById('final');
                if (!target) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                closeMenu();
            } catch (error) {
                console.warn('Button click error:', error);
            }
        });
    });

    // Program card checkout buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-program]');
        if (!btn) return;

        try {
            const programId = btn.getAttribute('data-program');
            const program = programsData.find(p => p.id == programId);

            if (!program) {
                console.warn('Program not found:', programId);
                return;
            }

            // Prepare program data for checkout modal
            const checkoutData = {
                id: program.id,
                name: state.lang === 'ar' ? (program.nameAr || program.name) : (program.nameEn || program.name),
                price: program.price,
                currency: program.currency || 'SAR'
            };

            // Open checkout modal with program data
            if (typeof openCheckoutModal === 'function') {
                openCheckoutModal(checkoutData);
            } else {
                console.warn('Checkout modal not initialized');
            }
        } catch (error) {
            console.warn('Checkout modal error:', error);
        }
    });
}

/**
 * Apply theme (dark/light)
 */
export function applyTheme(theme, elements) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    if (elements.themeToggle) {
        elements.themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

/**
 * Apply language (Arabic/English)
 */
export function applyLanguage(lang, elements, translations) {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    if (elements.langToggle) {
        elements.langToggle.textContent = lang === 'ar' ? 'EN' : 'AR';
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        const text = translations[lang][key];
        if (text) {
            el.textContent = text;
        }
    });

    if (typeof window.updateCheckoutModalLanguage === 'function') {
        window.updateCheckoutModalLanguage();
    }
}
