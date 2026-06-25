// WordPress/ACF data contract types for SZAFIT.
//
// EXPECTED FUTURE WORDPRESS RESPONSE SHAPE
// ─────────────────────────────────────────
// These interfaces mirror the JSON returned by the custom REST endpoints
// that will be built in Module 6.3 (Custom REST Endpoints):
//
//   Programs list:   GET /wp-json/szafit/v1/programs
//                    → WpProgram[]
//                    Each item = one ACF-enabled Custom Post Type ("szafit_program").
//                    Fields come from the ACF field group "Program Fields".
//
//   Single program:  GET /wp-json/szafit/v1/programs/{slug}
//                    → WpProgram
//
//   Site settings:   GET /wp-json/szafit/v1/settings
//                    → WpSiteSettings
//                    Backed by ACF Options Page (slug: "global-settings").
//
//   Page content:    GET /wp-json/szafit/v1/pages/{slug}
//                    → WpAboutPage | WpContactPage | WpPrivacyPage |
//                      WpTermsPage | WpThankYouPage
//                    Each slug maps to a WP Page with ACF fields attached.
//
// When Module 6.3 endpoints are live, replace the fallback imports in
// src/lib/content.ts with fetch() calls. The interfaces below must not change
// — they are the contract between the REST layer and the Astro frontend.

export type Lang = 'ar' | 'en';

export interface WpProgram {
  id: number;
  slug: string;
  // Arabic fields
  titleAr: string;
  shortDescriptionAr: string;
  descriptionAr: string;
  requirementsAr: string[];
  ctaLabelAr: string;
  // English fields
  titleEn: string;
  shortDescriptionEn: string;
  descriptionEn: string;
  requirementsEn: string[];
  ctaLabelEn: string;
  // Shared fields — tag is not localized (Foundation, Sculpt, Burn, VIP)
  price: number;
  currency: 'SAR';
  image: string;
  tag: string;
  order: number;
  productId: number;
}

// Frontend-friendly flattened shape returned by getLocalizedProgram()
export interface LocalizedProgram {
  id: number;
  productId: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  requirements: string[];
  price: number;
  currency: 'SAR';
  image: string;
  tag: string;
  ctaLabel: string;
  order: number;
}

export interface WpSocialLinks {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
}


export interface WpSiteSettings {
  whatsappNumber: string;
  socialLinks: WpSocialLinks;
  footerText: string;
  appDownloadUrl: string;
}

export interface WpAboutPage {
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  ctaLabelAr: string;
  ctaLabelEn: string;
}

export interface WpContactPage {
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  whatsappLabelAr: string;
  whatsappLabelEn: string;
}

export interface WpPrivacyPage {
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
}

export interface WpTermsPage {
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
}

export interface WpThankYouPage {
  headingAr: string;
  subheadingAr: string;
  bodyAr: string;
  nextStepsAr: string[];
  whatsappLabelAr: string;
  appDownloadLabelAr: string;
  headingEn: string;
  subheadingEn: string;
  bodyEn: string;
  nextStepsEn: string[];
  whatsappLabelEn: string;
  appDownloadLabelEn: string;
}

export type WpPageSlug = 'about' | 'contact' | 'privacy' | 'terms' | 'thank-you';

export type WpPageContentMap = {
  about: WpAboutPage;
  contact: WpContactPage;
  privacy: WpPrivacyPage;
  terms: WpTermsPage;
  'thank-you': WpThankYouPage;
};
