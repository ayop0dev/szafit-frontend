// ========================= PAGE: PREMIUM LANDING =========================
// Context: Neo Athletic + Minimal Luxury single-page experience
// ========================================================================
// Main entry point - orchestrates all modules

import { DEFAULT_PROGRAMS } from './constants.js';
import { renderPrograms, loadProgramsFromApi } from './landing-programs.js';
import { bindEvents, applyTheme, applyLanguage } from './landing-events.js';
import { initializeAnimations, initializeCounters } from './landing-animations.js';
import translations from './translations.js';

// ========================= STATE =========================

const state = {
    lang: localStorage.getItem('lang') || 'ar',
    theme: localStorage.getItem('theme') || 'light'
};

let programsData = DEFAULT_PROGRAMS;

// ========================= INITIALIZATION =========================

document.addEventListener('DOMContentLoaded', () => {
    try {
        const elements = {
            langToggle: document.getElementById('langToggle'),
            themeToggle: document.getElementById('themeToggle'),
            mobileToggle: document.getElementById('mobileToggle'),
            mobileMenu: document.getElementById('mobileMenu'),
            programsGrid: document.getElementById('programsGrid'),
            heroPrimary: document.getElementById('heroPrimary'),
            heroSecondary: document.getElementById('heroSecondary'),
            navCTA: document.getElementById('navCTA')
        };

        applyTheme(state.theme, elements);
        applyLanguage(state.lang, elements, translations);
        renderPrograms(programsData, state, translations);
        bindEvents(state, elements, translations, programsData, renderPrograms, initializeAnimations);
        initializeAnimations();
        initializeCounters();

        // Load programs from API and update if successful
        loadProgramsFromApi((apiPrograms) => {
            programsData = apiPrograms;
            renderPrograms(programsData, state, translations);
            initializeAnimations();
        });

        window.state = state;
        window.elements = elements;
    } catch (error) {
        console.error('❌ CRITICAL ERROR:', error);
        console.error('Stack:', error.stack);
        document.body.innerHTML += `<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-center:center;z-index:9999;"><div style="background:#fff;padding:2rem;border-radius:8px;max-width:500px;"><h3 style="color:#d32f2f;margin:0 0 1rem;">Error: ${error.message}</h3><p style="color:#333;margin:0;white-space:pre-wrap;">${error.stack}</p></div></div>`;
    }
});

// ========================= LOADING ANIMATION =========================
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    document.body.style.opacity = '1';
});

// ========================= CURSOR EFFECT (PREMIUM) =========================
try {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (!isTouchDevice) {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            border: 2px solid #C6FF34;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s, opacity 0.3s;
            opacity: 0;
        `;

        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 20 + 'px';
            cursor.style.top = e.clientY - 20 + 'px';
            cursor.style.opacity = '0.5';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        const interactiveElements = document.querySelectorAll('a, button, .lux-card, .stat-pill, img');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderWidth = '3px';
            });

            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderWidth = '2px';
            });
        });
    }
} catch (error) {
    console.warn('Cursor effect initialization failed:', error);
}



// Make state and functions globally accessible
window.state = state;
window.translations = translations;
window.bindEvents = bindEvents;
