// ========================= PROGRAMS RENDERING & API =========================

import { PROGRAMS_ENDPOINT, SAR_ICON_SVG, PROGRAM_COVERS, DEFAULT_PROGRAMS, EMBEDDED_PROGRAMS_DATA } from './constants.js';
import { mapWooProduct } from './utils.js';

/**
 * Render program cards to the grid
 */
export function renderPrograms(list, state, translations) {
    const programsGrid = document.getElementById('programsGrid');
    if (!programsGrid) return;
    programsGrid.innerHTML = '';

    // Use provided list or default if empty
    const programsToRender = list && list.length > 0 ? list : DEFAULT_PROGRAMS;

    const totalPrograms = programsToRender.length;
    programsToRender.forEach((program, index) => {
        const card = document.createElement('article');
        card.className = 'package-card card card--compact soft-lift w-full';
        card.setAttribute('data-reveal', 'fade-up');
        card.setAttribute('data-mouse', '0.08');

        const title = state.lang === 'ar' ? program.nameAr : program.nameEn;
        const tag = state.lang === 'ar' ? program.tagAr : program.tagEn;
        const currency = state.lang === 'ar' ? program.currencyAr : program.currencyEn;
        const summary = state.lang === 'ar' ? program.summaryAr : program.summaryEn;
        const description = state.lang === 'ar' ? program.descriptionAr : program.descriptionEn;
        const requirements = state.lang === 'ar' ? program.requirementsAr : program.requirementsEn;
        const requirementsLabel = translations[state.lang]['programs.requirements'];
        const indexLabel = String(index + 1).padStart(2, '0');
        const totalLabel = String(totalPrograms).padStart(2, '0');
        const packageLabel = state.lang === 'ar'
            ? `باقة ${indexLabel} / ${totalLabel}`
            : `Package ${indexLabel} / ${totalLabel}`;
        const levelLabel = state.lang === 'ar' ? 'المستوى' : 'Level';
        const reqCountLabel = state.lang === 'ar' ? 'عدد الشروط' : 'Requirements';
        const isFeatured = program.tagEn?.toLowerCase() === 'vip' || program.nameEn?.toLowerCase().includes('vip');
        const ctaLabel = state.lang === 'ar' ? 'احجز هذه الباقة' : 'Reserve This Package';
        // Format price with Saudi Riyal SVG icon
        const priceLabel = currency === 'ر.س' || currency === 'SAR'
            ? `${SAR_ICON_SVG}${program.price}`
            : `${program.price} ${currency}`;
        const cover = program.image || program.cover || PROGRAM_COVERS[index % PROGRAM_COVERS.length];

        card.innerHTML = `
            <div class="relative z-10 flex flex-col gap-4 h-full">
                <div class="cover-frame">
                    <img class="h-54 w-full object-cover" src="${cover}" alt="${title}" loading="lazy" decoding="async">
                </div>
                <div class="flex-1 space-y-2">
                    <div class="flex items-center justify-between gap-3">
                        <h3 class="text-2xl font-black text-neutral-lightest">${title}</h3>
                        <span class="price-badge text-lg font-bold text-primary-green">${priceLabel}</span>
                    </div>
                    <p class="text-sm text-neutral-gray-light">${summary}</p>
                </div>
                <div class="neo-divider"></div>
                ${requirements && requirements.length ? `
                    <div class="space-y-3">
                        <p class="req-label text-xs uppercase tracking-[0.25em] text-primary-green">${requirementsLabel}</p>
                        <ul class="space-y-2 text-xs text-neutral-gray-light">
                            ${requirements.map(item => `
                                <li class="flex items-start gap-2">
                                    <i class="fas fa-check-circle mt-0.5 text-primary-green"></i>
                                    <span>${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                <a href="product.html?id=${program.id}" class="${isFeatured ? 'btn-primary' : 'btn-secondary'} w-full mt-auto inline-flex items-center justify-center">
                    ${ctaLabel}
                </a>
            </div>
        `;

        programsGrid.appendChild(card);
    });
}

/**
 * Load programs from WooCommerce API with comprehensive error handling
 * 
 * @param {Function} onSuccess - Callback function to receive mapped programs
 * @returns {Promise<void>}
 * 
 * Flow:
 * 1. Attempts multiple endpoints (local PHP → WooCommerce REST → fallback)
 * 2. Validates response structure
 * 3. Maps each product via mapWooProduct()
 * 4. Calls onSuccess with mapped array
 * 5. If all failed, logs error but continues silently (fallback data used)
 * 
 * API Response Expected: Array<WooCommerce Product Object>
 * - Must contain: id, name, price, description
 * - Optional: meta_data (bilingual), attributes, images, tags, categories
 */
export async function loadProgramsFromApi(onSuccess) {
    // Try multiple endpoints in order
    const endpoints = [
        '/api/programs.php',  // Local PHP endpoint (primary - no CORS/auth issues)
        'https://z.szafit.com/wp-json/wc/v3/products',  // WooCommerce with authentication
        'https://szafit.com/wp-json/wc/v3/products'  // Production WooCommerce endpoint
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    for (let i = 0; i < endpoints.length; i++) {
        try {
            const endpoint = endpoints[i];
            // Attempting API endpoint
            
            const response = await fetch(endpoint, { 
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                signal: controller.signal 
            });

            if (!response.ok) {
                console.warn(`⚠️ Endpoint ${endpoint} returned status ${response.status}. Trying next endpoint...`);
                continue;
            }

            const data = await response.json();
            // API returned data

            // Validate response is an array and not empty
            if (!Array.isArray(data)) {
                console.warn('⚠️ API response is not an array. Trying next endpoint...');
                continue;
            }

            if (data.length === 0) {
                console.warn('⚠️ API returned empty array. Trying next endpoint...');
                continue;
            }

            // Map each product to internal format
            const mapped = data
                .map((product, idx) => {
                    const mapped = mapWooProduct(product);
                    if (!mapped) {
                        console.warn(`⚠️ Product at index ${idx} failed to map:`, product);
                    }
                    return mapped;
                })
                .filter(Boolean); // Remove null/failed mappings

            if (mapped.length === 0) {
                console.warn('⚠️ No products successfully mapped from this endpoint. Trying next...');
                continue;
            }

            // Successfully mapped programs

            // Call success callback with mapped data
            if (typeof onSuccess === 'function') {
                onSuccess(mapped);
            }
            
            return; // Exit on success

        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn(`⏱️ Endpoint request timed out (7s). Trying next endpoint...`);
            } else if (error instanceof SyntaxError) {
                console.warn(`⚠️ Invalid JSON response. Trying next endpoint...`);
            } else {
                console.warn(`⚠️ Endpoint fetch failed (${error.message}). Trying next endpoint...`);
            }
        }
    }

    // All endpoints failed - try embedded test data
    // All API endpoints failed, attempting embedded test data
    
    try {
        // Map embedded data same way as API data
        const mapped = EMBEDDED_PROGRAMS_DATA
            .map((product, idx) => {
                const mapped = mapWooProduct(product);
                if (!mapped) {
                    console.warn(`⚠️ Embedded product at index ${idx} failed to map:`, product);
                }
                return mapped;
            })
            .filter(Boolean);

        if (mapped && mapped.length > 0) {
            // Successfully mapped programs from embedded data
            if (typeof onSuccess === 'function') {
                onSuccess(mapped);
            }
            clearTimeout(timeoutId);
            return;
        }
    } catch (error) {
        console.warn('⚠️ Embedded data mapping failed:', error.message);
    }
    
    console.warn('⚠️ All data sources failed. Using minimal fallback placeholder.');
    clearTimeout(timeoutId);
}
