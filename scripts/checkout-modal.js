// ================================================
// CHECKOUT MODAL - HEADLESS COMMERCE
// ================================================

const CHECKOUT_FIELDS_ENDPOINT = 'https://z.szafit.com/wp-json/wc/v3/checkout';
const CREATE_ORDER_ENDPOINT = 'https://z.szafit.com/wp-json/wc/v3/orders';

// Saudi Riyal SVG icon (inherits current text color via CSS)
var SAR_ICON_SVG = '<span class="sar-currency-symbol" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39"><path class="cls-1" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/><path class="cls-1" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/></svg></span>';

let checkoutState = {
    fields: {},
    selectedProgram: null,
    isSubmitting: false
};

const checkoutTranslations = {
    ar: {
        'checkout.title': 'إكمال الدفع',
        'checkout.close': 'إغلاق',
        'checkout.program': 'البرنامج',
        'checkout.price': 'السعر',
        'checkout.total': 'الإجمالي',
        'checkout.submit': 'إتمام الشراء',
        'checkout.loading': 'جاري التحميل...',
        'checkout.error': 'خطأ في التحميل',
        'checkout.success': 'تم إنشاء الطلب بنجاح',
        'checkout.fullName': 'الاسم الكامل',
        'checkout.phone': 'رقم الجوال',
        'checkout.email': 'البريد الإلكتروني',
        'checkout.contactInfo': 'بيانات التواصل',
        'checkout.loadingForm': 'جاري تحميل نموذج الدفع...',
        'checkout.select': 'اختر...',
        'checkout.orderError': 'خطأ في إنشاء الطلب',
        'checkout.processingError': 'حدث خطأ أثناء معالجة طلبك'
    },
    en: {
        'checkout.title': 'Complete Payment',
        'checkout.close': 'Close',
        'checkout.program': 'Program',
        'checkout.price': 'Price',
        'checkout.total': 'Total',
        'checkout.submit': 'Complete Purchase',
        'checkout.loading': 'Loading...',
        'checkout.error': 'Loading error',
        'checkout.success': 'Order created successfully',
        'checkout.fullName': 'Full Name',
        'checkout.phone': 'Phone Number',
        'checkout.email': 'Email',
        'checkout.contactInfo': 'Contact Information',
        'checkout.loadingForm': 'Loading payment form...',
        'checkout.select': 'Select...',
        'checkout.orderError': 'Order creation error',
        'checkout.processingError': 'An error occurred while processing your order'
    }
};

function getCheckoutLang() {
    return document.documentElement.getAttribute('lang') || (window.state && window.state.lang) || 'ar';
}

function t(key) {
    const lang = getCheckoutLang();
    return checkoutTranslations[lang]?.[key] || checkoutTranslations['ar']?.[key] || key;
}

function updateCheckoutModalLanguage() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;

    const lang = getCheckoutLang();
    const content = modal.querySelector('.modal-content');
    if (content) content.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const title = document.getElementById('checkoutTitle');
    if (title) title.textContent = t('checkout.title');

    const closeBtn = document.getElementById('closeCheckout');
    if (closeBtn) closeBtn.setAttribute('aria-label', t('checkout.close'));

    const programLabel = document.getElementById('summaryProgramLabel');
    if (programLabel) programLabel.textContent = t('checkout.program');

    const priceLabel = document.getElementById('summaryPriceLabel');
    if (priceLabel) priceLabel.textContent = t('checkout.price');

    const totalLabel = document.getElementById('summaryTotalLabel');
    if (totalLabel) totalLabel.textContent = t('checkout.total');

    const submitBtn = document.getElementById('submitCheckout');
    if (submitBtn && !submitBtn.disabled) submitBtn.textContent = t('checkout.submit');

    const loadingText = modal.querySelector('.loading-spinner p');
    if (loadingText) loadingText.textContent = t('checkout.loadingForm');

    const legend = modal.querySelector('.form-section legend');
    if (legend) legend.textContent = t('checkout.contactInfo');
}

window.updateCheckoutModalLanguage = updateCheckoutModalLanguage;

/**
 * Create and inject checkout modal into page
 */
function initializeCheckoutModal() {
    const modalHTML = `
        <div id="checkoutModal" class="modal-overlay" style="display: none;">
            <div class="modal-content" dir="rtl" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">
                <div class="modal-header">
                    <h2 id="checkoutTitle">${t('checkout.title')}</h2>
                    <button class="modal-close" id="closeCheckout" aria-label="${t('checkout.close')}">✕</button>
                </div>
                
                <div class="modal-body">
                    <!-- Program Summary -->
                    <div class="checkout-summary" id="checkoutSummary">
                        <div class="summary-item">
                            <span id="summaryProgramLabel">${t('checkout.program')}</span>
                            <span id="summaryProgram">-</span>
                        </div>
                        <div class="summary-item">
                            <span id="summaryPriceLabel">${t('checkout.price')}</span>
                            <span id="summaryPrice">-</span>
                        </div>
                        <div class="summary-total">
                            <span id="summaryTotalLabel">${t('checkout.total')}</span>
                            <span id="summaryTotal">-</span>
                        </div>
                    </div>

                    <!-- Checkout Form -->
                    <form id="checkoutForm" class="checkout-form">
                        <div id="checkoutFields">
                            <div class="loading-spinner">
                                <div class="spinner"></div>
                                <p>${t('checkout.loadingForm')}</p>
                            </div>
                        </div>

                        <button type="submit" class="btn-primary" id="submitCheckout" disabled>
                            ${t('checkout.submit')}
                        </button>
                    </form>

                    <!-- Messages -->
                    <div id="checkoutMessages"></div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    attachCheckoutEventListeners();
}

/**
 * Attach event listeners to checkout modal
 */
function attachCheckoutEventListeners() {
    const modal = document.getElementById('checkoutModal');
    const closeBtn = document.getElementById('closeCheckout');
    const form = document.getElementById('checkoutForm');

    closeBtn.addEventListener('click', closeCheckoutModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCheckoutModal();
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitCheckoutForm();
    });
}

/**
 * Load checkout fields from WooCommerce API
 */
async function loadCheckoutFields() {
    try {
        const response = await fetch(CHECKOUT_FIELDS_ENDPOINT, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            console.error('Failed to load checkout fields, using default form');
            renderCheckoutFields(getDefaultCheckoutFields());
            return;
        }

        const data = await response.json();
        checkoutState.fields = data.fields || getDefaultCheckoutFields();
        renderCheckoutFields(checkoutState.fields);

    } catch (error) {
        console.error('Checkout fields error:', error);
        // Use default form if API fails
        renderCheckoutFields(getDefaultCheckoutFields());
    }
}

/**
 * Get default checkout fields if API fails
 */
function getDefaultCheckoutFields() {
    return {
        billing: {
            full_name: {
                type: 'text',
                label: t('checkout.fullName'),
                placeholder: t('checkout.fullName'),
                required: true
            },
            phone: {
                type: 'tel',
                label: t('checkout.phone'),
                placeholder: '+966...',
                required: true
            },
            email: {
                type: 'email',
                label: t('checkout.email'),
                placeholder: 'your@email.com',
                required: true
            }
        }
    };
}

/**
 * Render checkout fields dynamically
 */
function renderCheckoutFields(fields) {
    const container = document.getElementById('checkoutFields');
    container.innerHTML = '';

    // Billing section
    if (fields.billing) {
        const billingSection = document.createElement('fieldset');
        billingSection.className = 'form-section';
        billingSection.innerHTML = `<legend>${t('checkout.contactInfo')}</legend>`;

        const billingGrid = document.createElement('div');
        billingGrid.className = 'form-grid';

        for (const [key, field] of Object.entries(fields.billing)) {
            const fieldHTML = createFormField(`billing[${key}]`, field);
            billingGrid.insertAdjacentHTML('beforeend', fieldHTML);
        }

        billingSection.appendChild(billingGrid);
        container.appendChild(billingSection);
    }

    // Enable submit button
    document.getElementById('submitCheckout').disabled = false;
}

/**
 * Create individual form field HTML
 */
function createFormField(name, field) {
    const required = field.required ? 'required' : '';
    const placeholder = field.placeholder || field.label;
    
    if (field.type === 'email') {
        return `
            <div class="form-group">
                <label for="${name}">${field.label}</label>
                <input 
                    type="email" 
                    id="${name}" 
                    name="${name}" 
                    placeholder="${placeholder}"
                    ${required}
                    class="form-input"
                >
            </div>
        `;
    } else if (field.type === 'tel') {
        return `
            <div class="form-group">
                <label for="${name}">${field.label}</label>
                <input 
                    type="tel" 
                    id="${name}" 
                    name="${name}" 
                    placeholder="${placeholder}"
                    ${required}
                    class="form-input"
                >
            </div>
        `;
    } else if (field.type === 'select') {
        const options = Object.entries(field.options || {})
            .map(([key, label]) => `<option value="${key}">${label}</option>`)
            .join('');
        return `
            <div class="form-group">
                <label for="${name}">${field.label}</label>
                <select id="${name}" name="${name}" ${required} class="form-input">
                    <option value="">${t('checkout.select')}</option>
                    ${options}
                </select>
            </div>
        `;
    } else {
        return `
            <div class="form-group">
                <label for="${name}">${field.label}</label>
                <input 
                    type="text" 
                    id="${name}" 
                    name="${name}" 
                    placeholder="${placeholder}"
                    ${required}
                    class="form-input"
                >
            </div>
        `;
    }
}

/**
 * Submit checkout form
 */
async function submitCheckoutForm() {
    if (checkoutState.isSubmitting) return;

    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    checkoutState.isSubmitting = true;
    document.getElementById('submitCheckout').disabled = true;

    try {
        // Parse form data into structured object
        const billingData = {};
        const shippingData = {};

        formData.forEach((value, key) => {
            if (key.startsWith('billing[')) {
                const fieldName = key.slice(8, -1);
                billingData[fieldName] = value;
            } else if (key.startsWith('shipping[')) {
                const fieldName = key.slice(9, -1);
                shippingData[fieldName] = value;
            }
        });

        // Prepare order payload
        const orderPayload = {
            billing: billingData,
            shipping: shippingData,
            line_items: checkoutState.selectedProgram ? [
                {
                    product_id: checkoutState.selectedProgram.id,
                    quantity: 1
                }
            ] : [],
            notes: formData.get('order_notes'),
            payment_method: 'cod'
        };

        // Send order to API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(CREATE_ORDER_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const result = await response.json();

        if (response.ok && result.success) {
            showCheckoutMessage(`${t('checkout.success')}${result.order_id ? ` #${result.order_id}` : ''}`, 'success');
            setTimeout(() => {
                if (result.payment_url) {
                    window.location.href = result.payment_url;
                } else {
                    window.location.href = `thank-you.html?order_id=${result.order_id || ''}`;
                }
            }, 1500);
        } else {
            showCheckoutMessage(result.message || t('checkout.orderError'), 'error');
        }

    } catch (error) {
        if (error.name === 'AbortError') {
            showCheckoutMessage(t('checkout.processingError'), 'error');
        } else {
            console.error('Order submission error:', error);
            showCheckoutMessage(t('checkout.processingError'), 'error');
        }
    } finally {
        checkoutState.isSubmitting = false;
        const submitBtn = document.getElementById('submitCheckout');
        if (submitBtn) submitBtn.disabled = false;
    }
}

/**
 * Show checkout message
 */
function showCheckoutMessage(message, type = 'info') {
    const messageContainer = document.getElementById('checkoutMessages');
    const messageHTML = `
        <div class="checkout-message checkout-message-${type}">
            ${message}
        </div>
    `;
    messageContainer.insertAdjacentHTML('beforeend', messageHTML);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageContainer.querySelector('.checkout-message')?.remove();
    }, 5000);
}

/**
 * Format price with Saudi Riyal SVG icon
 */
function formatPriceWithSymbol(price, currency) {
    if (currency === 'SAR' || currency === 'ر.س') {
        return `${SAR_ICON_SVG}${price}`;
    }
    return `${price} ${currency}`;
}

/**
 * Open checkout modal with program data
 */
function openCheckoutModal(program) {
    checkoutState.selectedProgram = program;

    // Update summary
    document.getElementById('summaryProgram').textContent = program.name;
    document.getElementById('summaryPrice').innerHTML = formatPriceWithSymbol(program.price, program.currency);
    document.getElementById('summaryTotal').innerHTML = formatPriceWithSymbol(program.price, program.currency);

    // Ensure modal language matches current page language
    updateCheckoutModalLanguage();

    // Show modal using class
    const modal = document.getElementById('checkoutModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Load fields if not already loaded
    if (Object.keys(checkoutState.fields).length === 0) {
        loadCheckoutFields();
    }
}

/**
 * Close checkout modal
 */
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear message
    document.getElementById('checkoutMessages').innerHTML = '';
}

// ================================================
// MODAL STYLING
// ================================================

/**
 * Inject modal styles
 */
function injectCheckoutStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(4px);
        }

        .modal-overlay.active {
            display: flex !important;
        }

        .modal-content {
            background: var(--surface-base);
            border-radius: 1rem;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-subtle);
        }

        .modal-header h2 {
            margin: 0;
            font-size: 1.5rem;
            color: var(--text-primary);
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
            transition: color 0.3s ease;
        }

        .modal-close:hover {
            color: var(--text-primary);
        }

        .modal-body {
            padding: 1.5rem;
        }

        .checkout-summary {
            background: var(--shadow-subtle);
            border: 1px solid var(--border-subtle);
            border-radius: 0.75rem;
            padding: 1rem;
            margin-bottom: 1.5rem;
        }

        .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            color: var(--text-primary);
            font-size: 0.875rem;
        }

        .summary-total {
            padding-top: 1rem;
            margin-top: 1rem;
            border-top: 2px solid var(--primary-green);
            font-weight: 700;
            font-size: 1.125rem;
            color: var(--primary-green);
            display: flex;
            justify-content: space-between;
        }

        .checkout-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .form-section {
            border: none;
            padding: 0;
            margin: 0;
        }

        .form-section legend {
            font-size: 0.875rem;
            font-weight: 700;
            color: var(--text-primary);
            padding: 0 0 0.75rem 0;
            border-bottom: 1px solid var(--border-subtle);
            width: 100%;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-top: 1rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 0.25rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .form-input,
        .form-textarea {
            padding: 0.75rem;
            border: 1px solid var(--border-subtle);
            border-radius: 0.5rem;
            background: var(--surface-base);
            color: var(--text-primary);
            font-size: 0.875rem;
            font-family: inherit;
            transition: border-color 0.3s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
            outline: none;
            border-color: var(--primary-green);
            box-shadow: 0 0 0 3px rgba(1, 208, 154, 0.1);
        }

        .form-textarea {
            resize: vertical;
        }

        .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            gap: 1rem;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-subtle);
            border-top-color: var(--primary-green);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .checkout-message {
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            font-size: 0.875rem;
        }

        .checkout-message-success {
            background: rgba(76, 175, 80, 0.1);
            color: #4CAF50;
            border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .checkout-message-error {
            background: rgba(211, 47, 47, 0.1);
            color: #d32f2f;
            border: 1px solid rgba(211, 47, 47, 0.3);
        }

        .checkout-message-info {
            background: rgba(33, 150, 243, 0.1);
            color: #2196F3;
            border: 1px solid rgba(33, 150, 243, 0.3);
        }

        @media (max-width: 640px) {
            .form-grid {
                grid-template-columns: 1fr;
            }

            .modal-content {
                width: 95%;
            }
        }
    `;
    document.head.appendChild(styles);
}

// ================================================
// INITIALIZE ON PAGE LOAD
// ================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        injectCheckoutStyles();
        initializeCheckoutModal();
    });
} else {
    injectCheckoutStyles();
    initializeCheckoutModal();
}
