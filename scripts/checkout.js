// ========================= PAGE: CHECKOUT =========================
// Context: Embedded WooCommerce checkout for selected program
// ==================================================================

// ========================= BLOCK: STATE & TRANSLATIONS =========================
const state = {
    lang: localStorage.getItem('lang') || 'ar',
    theme: localStorage.getItem('theme') || 'dark',
    programData: null
};

// Saudi Riyal SVG icon (inherits current text color via CSS)
const SAR_ICON_SVG = '<span class="sar-currency-symbol" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39"><path class="cls-1" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/><path class="cls-1" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/></svg></span>';

const translations = {
    ar: {
        'checkout.title': 'إكمال الدفع',
        'checkout.loading': 'جاري تحميل صفحة الدفع...',
        'checkout.error': 'خطأ في تحميل صفحة الدفع',
        'checkout.summary': 'ملخص الطلب',
        'checkout.program': 'البرنامج',
        'checkout.price': 'السعر',
        'checkout.currency': 'العملة',
        'checkout.total': 'الإجمالي: '
    },
    en: {
        'checkout.title': 'Complete Payment',
        'checkout.loading': 'Loading payment page...',
        'checkout.error': 'Error loading payment page',
        'checkout.summary': 'Order Summary',
        'checkout.program': 'Program',
        'checkout.price': 'Price',
        'checkout.currency': 'Currency',
        'checkout.total': 'Total: '
    }
};

// ========================= BLOCK: HELPERS (URL & LOCALE) =========================
/** Parse URL parameters */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        program_id: params.get('program_id'),
        name: params.get('name'),
        price: params.get('price'),
        currency: params.get('currency')
    };
}

/** Apply language */
function applyLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    
    // Update back button label
    const backLabel = document.getElementById('backLabel');
    if (backLabel) {
        backLabel.textContent = state.lang === 'ar' ? 'العودة إلى البرامج' : 'Back to Programs';
    }
}

/** Apply theme */
function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'light') {
        html.classList.remove('dark');
    } else {
        html.classList.add('dark');
    }
}

// ========================= BLOCK: PROGRAM DATA & SUMMARY =========================
/** Load and display program data */
function loadProgramData() {
    const params = getUrlParams();
    
    if (!params.program_id || !params.name || !params.price) {
        showError('بيانات البرنامج غير موجودة');
        return null;
    }

    state.programData = params;
    displaySummary(params);
    return params;
}

/**
 * Display order summary
 */
function displaySummary(data) {
    document.getElementById('programName').textContent = data.name;
    const priceEl = document.getElementById('programPrice');
    const totalEl = document.getElementById('totalPrice');

    // Reset contents
    priceEl.innerHTML = '';
    totalEl.innerHTML = '';

    if (data.currency === 'SAR' || data.currency === 'ر.س') {
        // Insert SVG icon then numeric price (icon stays on the left visually)
        priceEl.insertAdjacentHTML('beforeend', SAR_ICON_SVG);
        priceEl.appendChild(document.createTextNode(data.price));

        totalEl.insertAdjacentHTML('beforeend', SAR_ICON_SVG);
        totalEl.appendChild(document.createTextNode(data.price));
    } else {
        priceEl.textContent = data.price;
        totalEl.textContent = `${data.price} ${data.currency}`;
    }
    document.getElementById('programCurrency').textContent = data.currency;
}

// ========================= BLOCK: CHECKOUT IFRAME =========================
/** Load checkout iframe from z.szafit.com */
function loadCheckoutFrame() {
    const frame = document.getElementById('checkoutFrame');
    const params = getUrlParams();
    
    if (!params.program_id) {
        showError('معرف البرنامج غير موجود');
        return;
    }

    // Create iframe pointing to z.szafit.com/checkout with product ID
    const checkoutUrl = `https://z.szafit.com/checkout?add-to-cart=${params.program_id}`;
    const iframe = document.createElement('iframe');
    
    iframe.src = checkoutUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.minHeight = '600px';
    iframe.setAttribute('title', 'Payment Form');
    iframe.setAttribute('allow', 'payment *');

    iframe.onload = () => {
        console.log('Checkout page loaded');
    };

    iframe.onerror = () => {
        showError('خطأ في تحميل صفحة الدفع. حاول مرة أخرى.');
    };

    frame.innerHTML = '';
    frame.appendChild(iframe);
}

// ========================= BLOCK: ERROR HANDLING =========================
/** Show error message */
function showError(message) {
    const frame = document.getElementById('checkoutFrame');
    frame.innerHTML = `
        <div class="error-card">
            <h4>⚠️ خطأ</h4>
            <p>${message}</p>
            <a href="index.html" class="btn-back" style="margin-top: 1rem; display: inline-block;">
                <span>←</span>
                العودة
            </a>
        </div>
    `;
}

// ========================= BLOCK: INIT & EVENT BINDINGS =========================
/** Initialize checkout page */
function initCheckout() {
    try {
        // Apply theme and language
        applyTheme(state.theme);
        applyLanguage(state.lang);

        // Load program data from URL
        const programData = loadProgramData();
        if (!programData) return;

        // Load checkout frame
        loadCheckoutFrame();

        // Add back button handler
        const backBtn = document.querySelector('.btn-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.history.back();
            });
        }

    } catch (error) {
        console.error('Checkout initialization error:', error);
        showError('خطأ في تحميل صفحة الدفع');
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCheckout);
} else {
    initCheckout();
}

// Monitor theme changes from parent window
window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
        state.theme = e.newValue || 'dark';
        applyTheme(state.theme);
    }
    if (e.key === 'lang') {
        state.lang = e.newValue || 'ar';
        applyLanguage(state.lang);
    }
});
