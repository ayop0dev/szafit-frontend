// ========================= UTILITY FUNCTIONS =========================

/**
 * Remove HTML tags and normalize whitespace
 */
export function stripHtml(text) {
    if (!text) return '';
    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Parse requirements from description text
 * Extracts bullet points starting with * or - or 📌
 * 
 * Example:
 * "برنامج تدريبي
 *  📌 الشروط
 *  * مناسب للمبتدئ 100%
 *  * الالتزام 3 أيام..."
 * 
 * Returns: ["مناسب للمبتدئ 100%", "الالتزام 3 أيام..."]
 */
export function parseRequirementsFromText(text) {
    if (!text || typeof text !== 'string') return [];
    
    // Split by lines
    const lines = text.split(/[\n\r]+/);
    
    // Extract lines that start with bullet markers (remove markers)
    const requirements = lines
        .map(line => {
            // Remove leading/trailing whitespace
            let cleaned = line.trim();
            // Remove bullet markers: *, -, •, 📌, etc.
            cleaned = cleaned.replace(/^[\s*\-•📌🔸]+\s*/, '').trim();
            return cleaned;
        })
        .filter(line => {
            // Keep only non-empty lines that aren't section headers
            return line.length > 0 && !line.match(/^(الشروط|Requirements|الوصف|Description|Summary)$/i);
        });
    
    return requirements;
}

/**
 * Extract Arabic name from bilingual product name
 * Handles formats like:
 * - "Zero to Fit من الصفر إلى اللياقة"
 * - "NAME_EN NAME_AR"
 * 
 * Returns the Arabic part
 */
export function extractArabicName(bilingualName) {
    if (!bilingualName) return '';
    
    // Look for Arabic characters (Unicode range for Arabic)
    const arabicMatch = bilingualName.match(/[\u0600-\u06FF]+(?:\s+[\u0600-\u06FF]+)*/);
    if (arabicMatch) {
        return stripHtml(arabicMatch[0]).trim();
    }
    
    return stripHtml(bilingualName).trim();
}

/**
 * Extract English name from bilingual product name
 * Handles formats like:
 * - "Zero to Fit من الصفر إلى اللياقة"
 * - "NAME_EN NAME_AR"
 * 
 * Returns the English part
 */
export function extractEnglishName(bilingualName) {
    if (!bilingualName) return '';
    
    // Remove Arabic characters to get English part
    const englishPart = bilingualName.replace(/[\u0600-\u06FF\s]+/g, '').trim();
    
    // If we got something, return it; otherwise return original
    return englishPart.length > 0 ? stripHtml(englishPart).trim() : stripHtml(bilingualName).trim();
}

/**
 * Extract bilingual data from WooCommerce product meta_data
 * Looks for custom fields like: name_ar, description_ar, requirements_ar, etc.
 */
function extractBilingualData(product) {
    const metadata = {};
    if (Array.isArray(product.meta_data)) {
        product.meta_data.forEach(item => {
            metadata[item.key] = item.value;
        });
    }
    return metadata;
}

/**
 * Map WooCommerce product to program format
 * 
 * Handles bilingual extraction from:
 * 1. Product attributes (as fallback)
 * 2. Meta data fields (preferred)
 * 3. Standard fields (name, description, etc.)
 * 
 * Expected WooCommerce structure:
 * - name: English program name
 * - description: English description (or bilingual JSON)
 * - meta_data: Custom fields with _ar suffixes for Arabic
 * - attributes: Program requirements/tags
 * - price, regular_price: Pricing
 * - images: Product images
 * - tags, categories: Taxonomy
 */
export function mapWooProduct(product) {
    if (!product || !product.name) return null;

    // Get image (prefer first image, fallback to empty)
    const image = product.images && product.images.length ? product.images[0].src : '';

    // Extract price - handle both direct price and regular_price
    const price = String(product.price || product.regular_price || '0').trim();

    // Extract currency - SAR is default for Saudi market
    const currencyEn = 'SAR';
    const currencyAr = 'ر.س';

    // Extract bilingual metadata
    const metadata = extractBilingualData(product);

    // Extract Arabic and English names
    // For bilingual names like "Zero to Fit من الصفر إلى اللياقة"
    const bilingual = product.name || '';
    const nameEn = extractEnglishName(bilingual);
    const nameAr = extractArabicName(bilingual) || bilingual; // Fallback to full name if no Arabic found

    // Extract descriptions
    // Check if description is JSON (bilingual) or plain text
    let descriptionEn = '';
    let descriptionAr = '';

    try {
        if (product.description && product.description.includes('{')) {
            const parsed = JSON.parse(product.description);
            descriptionEn = stripHtml(parsed.en || '');
            descriptionAr = stripHtml(parsed.ar || '');
        }
    } catch (e) {
        // Not JSON, treat as plain text
        descriptionEn = stripHtml(product.description || '');
        descriptionAr = stripHtml(metadata.description_ar || product.description || '');
    }

    // Extract short description/summary
    let summaryEn = '';
    let summaryAr = '';

    try {
        if (product.short_description && product.short_description.includes('{')) {
            const parsed = JSON.parse(product.short_description);
            summaryEn = stripHtml(parsed.en || '');
            summaryAr = stripHtml(parsed.ar || '');
        }
    } catch (e) {
        summaryEn = stripHtml(product.short_description || descriptionEn.substring(0, 150) || '');
        summaryAr = stripHtml(metadata.summary_ar || product.short_description || descriptionAr.substring(0, 150) || '');
    }

    // Extract requirements from metadata, attributes, or description text
    let requirementsEn = [];
    let requirementsAr = [];

    // Try metadata first (preferred)
    if (metadata.requirements_en && typeof metadata.requirements_en === 'string') {
        try {
            requirementsEn = JSON.parse(metadata.requirements_en);
        } catch {
            requirementsEn = [metadata.requirements_en];
        }
    }

    if (metadata.requirements_ar && typeof metadata.requirements_ar === 'string') {
        try {
            requirementsAr = JSON.parse(metadata.requirements_ar);
        } catch {
            requirementsAr = [metadata.requirements_ar];
        }
    }

    // If no metadata requirements, try parsing from description text (CSV data structure)
    if (!requirementsAr.length && descriptionAr) {
        requirementsAr = parseRequirementsFromText(descriptionAr);
    }

    // Fallback to attributes if no metadata or description requirements
    if (!requirementsEn.length || !requirementsAr.length) {
        const attributes = Array.isArray(product.attributes) ? product.attributes : [];
        const extractedReqs = attributes
            .flatMap((attr) => Array.isArray(attr.options) ? attr.options : (attr.options ? [attr.options] : []))
            .map((item) => stripHtml(String(item)))
            .filter(Boolean);
        
        // If we have extracted requirements but no metadata, use for both languages as fallback
        if (extractedReqs.length && !requirementsEn.length) {
            requirementsEn = extractedReqs;
        }
        if (extractedReqs.length && !requirementsAr.length) {
            requirementsAr = extractedReqs;
        }
    }

    // Extract tag/category
    let tagEn = '';
    let tagAr = '';

    if (product.tags && product.tags[0]) {
        tagEn = stripHtml(product.tags[0].name || '');
        tagAr = stripHtml(metadata.tag_ar || product.tags[0].name || '');
    } else if (product.categories && product.categories[0]) {
        tagEn = stripHtml(product.categories[0].name || '');
        tagAr = stripHtml(metadata.tag_ar || product.categories[0].name || '');
    }

    return {
        id: product.id || String(Math.random()),
        nameAr: stripHtml(nameAr),
        nameEn: stripHtml(nameEn),
        price,
        currencyAr,
        currencyEn,
        summaryAr: stripHtml(summaryAr),
        summaryEn: stripHtml(summaryEn),
        descriptionAr: stripHtml(descriptionAr),
        descriptionEn: stripHtml(descriptionEn),
        requirementsAr: Array.isArray(requirementsAr) ? requirementsAr.map(r => stripHtml(String(r))) : [],
        requirementsEn: Array.isArray(requirementsEn) ? requirementsEn.map(r => stripHtml(String(r))) : [],
        tagAr: stripHtml(tagAr),
        tagEn: stripHtml(tagEn),
        image
    };
}

/**
 * Safe DOM element getter with error handling
 */
export function safeGetElement(id) {
    try {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Element with id "${id}" not found`);
        return el;
    } catch (error) {
        console.warn('Safe element access error:', error.message);
        return null;
    }
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price, sarIcon = '', currency = 'SAR') {
    if (currency === 'ر.س' || currency === 'SAR') {
        return `${sarIcon}${price}`;
    }
    return `${price} ${currency}`;
}
