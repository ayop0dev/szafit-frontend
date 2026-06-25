import type { Lang } from '../types/wp';

export function getAlternateLangUrl(currentPath: string, currentLang: Lang): string {
    const alt: Lang = currentLang === 'ar' ? 'en' : 'ar';
    const prefix = `/${currentLang}`;
    if (currentPath.startsWith(prefix)) {
        const rest = currentPath.slice(prefix.length);
        return `/${alt}${rest || '/'}`;
    }
    return `/${alt}/`;
}

export function formatPrice(price: number, currency: string, lang: Lang): string {
    if (currency === 'SAR') {
        const svgIcon = `<span class="inline-block w-[0.9em] h-[1em] align-middle bg-current translate-y-[-1px]" style="-webkit-mask: url(/assets/Saudi_Riyal_Symbol-2.svg) no-repeat center; -webkit-mask-size: contain; mask: url(/assets/Saudi_Riyal_Symbol-2.svg) no-repeat center; mask-size: contain;" aria-label="SAR"></span>`;
        return lang === 'ar' ? `${svgIcon} ${price}` : `${svgIcon} ${price}`;
    }
    return `${price} ${currency}`;
}
