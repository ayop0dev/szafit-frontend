// ========================= PRODUCT PAGE =========================

import { EMBEDDED_PROGRAMS_DATA, SAR_ICON_SVG } from './constants.js';
import { mapWooProduct } from './utils.js';

const API_PRODUCT_ENDPOINT = 'https://z.szafit.com/wp-json/wc/v3/products';

function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

async function loadProduct(id) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        const response = await fetch(`${API_PRODUCT_ENDPOINT}/${id}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return mapWooProduct(data);
    } catch (error) {
        console.warn('Product API fetch failed:', error.message);
        const fallback = EMBEDDED_PROGRAMS_DATA.find(p => String(p.id) === String(id));
        return fallback ? mapWooProduct(fallback) : null;
    }
}

function renderProduct(product) {
    const lang = document.documentElement.lang || 'ar';
    const isAr = lang === 'ar';

    const title = isAr ? (product.nameAr || product.name) : (product.nameEn || product.name);
    const summary = isAr ? (product.summaryAr || product.summary) : (product.summaryEn || product.summary);
    const description = isAr ? (product.descriptionAr || product.description) : (product.descriptionEn || product.description);
    const requirements = isAr ? product.requirementsAr : product.requirementsEn;
    const tag = isAr ? (product.tagAr || '') : (product.tagEn || '');
    const currency = isAr ? (product.currencyAr || 'ر.س') : (product.currencyEn || 'SAR');
    const priceLabel = (currency === 'ر.س' || currency === 'SAR')
        ? `${SAR_ICON_SVG}${product.price}`
        : `${product.price} ${currency}`;

    const imgEl = document.getElementById('productImage');
    const nameEl = document.getElementById('productName');
    const tagEl = document.getElementById('productTag');
    const summaryEl = document.getElementById('productSummary');
    const descEl = document.getElementById('productDescription');
    const priceEl = document.getElementById('productPrice');
    const reqList = document.getElementById('productRequirements');
    const reqSection = document.getElementById('requirementsSection');

    if (imgEl) {
        imgEl.src = product.image || product.cover || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80';
        imgEl.alt = title;
    }
    if (nameEl) nameEl.textContent = title;
    if (tagEl) tagEl.textContent = tag || (isAr ? 'برنامج' : 'Program');
    if (summaryEl) summaryEl.textContent = summary || '';
    if (descEl) descEl.textContent = description || '';
    if (priceEl) priceEl.innerHTML = priceLabel;

    if (reqList && requirements && requirements.length) {
        reqList.innerHTML = requirements.map(req => `
            <li class="flex items-start gap-2">
                <i class="fas fa-check-circle mt-0.5 text-primary-green"></i>
                <span>${req}</span>
            </li>
        `).join('');
        if (reqSection) reqSection.classList.remove('hidden');
    } else if (reqSection) {
        reqSection.classList.add('hidden');
    }

    // Wire enroll button
    const enrollBtn = document.getElementById('enrollBtn');
    if (enrollBtn) {
        // Remove old listeners by cloning
        const newBtn = enrollBtn.cloneNode(true);
        enrollBtn.parentNode.replaceChild(newBtn, enrollBtn);
        newBtn.addEventListener('click', () => {
            const checkoutData = {
                id: product.id,
                name: title,
                price: product.price,
                currency: currency
            };
            if (typeof openCheckoutModal === 'function') {
                openCheckoutModal(checkoutData);
            } else {
                console.warn('Checkout modal not initialized');
            }
        });
    }

    document.title = `${title} | SZA Fit`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const productId = getQueryParam('id') || getQueryParam('product_id');
    const container = document.getElementById('productContainer');
    const notFound = document.getElementById('notFound');

    if (!productId) {
        if (container) container.classList.add('hidden');
        if (notFound) notFound.classList.remove('hidden');
        return;
    }

    const product = await loadProduct(productId);
    if (!product) {
        if (container) container.classList.add('hidden');
        if (notFound) notFound.classList.remove('hidden');
        return;
    }

    window.currentProduct = product;
    renderProduct(product);
});

// Re-render when language changes
window.addEventListener('languageChanged', () => {
    if (window.currentProduct) {
        renderProduct(window.currentProduct);
    }
    if (typeof window.updateCheckoutModalLanguage === 'function') {
        window.updateCheckoutModalLanguage();
    }
});
