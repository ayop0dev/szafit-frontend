// Temporary static content layer for SZAFIT Astro frontend.
//
// HOW TO MIGRATE TO WORDPRESS (Module 6.3)
// ─────────────────────────────────────────
// Replace each fallback import with a fetch() call to the corresponding
// REST endpoint. The return types stay identical — no page components need
// to change.
//
//   getAllPrograms()       → GET /wp-json/szafit/v1/programs
//   getProgramBySlug()    → GET /wp-json/szafit/v1/programs/{slug}
//   getLocalizedProgram() → client-side transform, no fetch needed
//   getSiteSettings()     → GET /wp-json/szafit/v1/settings
//   getPageContent()      → GET /wp-json/szafit/v1/pages/{slug}
//
// For a static Astro build, wrap each fetch() in a top-level await inside
// getStaticPaths() or the frontmatter block — do not call at module level.

import type {
    WpProgram,
    LocalizedProgram,
    WpSiteSettings,
    WpPageSlug,
    WpPageContentMap,
} from '../types/wp';

export type { Lang } from '../types/wp';
export type { LocalizedProgram } from '../types/wp';

import { fallbackPrograms } from '../data/fallback/programs';
import { fallbackSiteSettings } from '../data/fallback/site-settings';
import {
    fallbackAbout,
    fallbackContact,
    fallbackPrivacy,
    fallbackTerms,
    fallbackThankYou,
} from '../data/fallback/pages';

type Lang = 'ar' | 'en';

export function getAllPrograms(): WpProgram[] {
    return fallbackPrograms;
}

export function getProgramBySlug(slug: string): WpProgram | undefined {
    return fallbackPrograms.find((p) => p.slug === slug);
}

export function getProgramsSorted(): WpProgram[] {
    return [...fallbackPrograms].sort((a, b) => a.order - b.order);
}

export function getLocalizedProgram(program: WpProgram, lang: Lang): LocalizedProgram {
    return {
        id: program.id,
        productId: program.productId,
        slug: program.slug,
        title: lang === 'ar' ? program.titleAr : program.titleEn,
        shortDescription: lang === 'ar' ? program.shortDescriptionAr : program.shortDescriptionEn,
        description: lang === 'ar' ? program.descriptionAr : program.descriptionEn,
        requirements: lang === 'ar' ? program.requirementsAr : program.requirementsEn,
        price: program.price,
        currency: program.currency,
        image: program.image,
        tag: program.tag,
        ctaLabel: lang === 'ar' ? program.ctaLabelAr : program.ctaLabelEn,
        order: program.order,
    };
}

export function getSiteSettings(): WpSiteSettings {
    return fallbackSiteSettings;
}

export function getPageContent<K extends WpPageSlug>(slug: K): WpPageContentMap[K] {
    const map: WpPageContentMap = {
        about: fallbackAbout,
        contact: fallbackContact,
        privacy: fallbackPrivacy,
        terms: fallbackTerms,
        'thank-you': fallbackThankYou,
    };
    return map[slug];
}
