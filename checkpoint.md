# Checkpoint - WooCommerce Email Identity Hardening

## Date
2026-06-24

## Goal
Make all WooCommerce transactional emails safe for the SZAFIT headless architecture:

- Public domain shown to users/admins: `szafit.com`
- Backend domain hidden from all email output: `z.szafit.com`
- Sender identity: `SZAFIT <noreply@szafit.com>`
- WooCommerce core/templates untouched
- Email design kept close to native WooCommerce while cleaning identity and links

## Completed

1. **Created isolated email branding plugin**
   - Path: `.szafit_wordpress/wp-content/plugins/szafit-woocommerce-email-branding/`
   - Rewrites email content, subjects, footer text, logo links, customer links, admin links, reset-password links, and order-pay links.
   - Preserves reset-password tokens: `key`, `id`, `login`.
   - Preserves order payment tokens: `order_id`, `key`, `pay_for_order`.
   - Handles classic HTML, plain-text, and WooCommerce block email rendering paths.

2. **Protected against backend leakage**
   - `z.szafit.com` is rewritten to `szafit.com`.
   - `wp-admin` and `wp-login.php` links/text are neutralized.
   - Admin emails also receive public-domain-safe wording.
   - Logo/header click URL points to the public frontend domain.

3. **Created frontend facade routes**
   - `/ar/account/`
   - `/en/account/`
   - `/ar/orders/`
   - `/en/orders/`
   - `/ar/reset-password/`
   - `/en/reset-password/`
   - `/ar/checkout/pay/`
   - `/en/checkout/pay/`
   - Build reported clean: 33 pages, 0 errors.

4. **Fixed SMTP transport identity conflict**
   - Updated `.szafit_wordpress/wp-content/plugins/Custom SMTP Loader/custom-smtp-loader.php`.
   - SMTP loader is now transport-only.
   - It no longer sets `From`, `FromName`, `Sender`, `Reply-To`, or `Return-Path`.
   - Sender identity is owned by WooCommerce/email branding filters.

5. **Moved SMTP secrets out of tracked config**
   - Removed old `admin@z.szafit.com` SMTP credentials from `.szafit_wordpress/wp-config.php`.
   - Added private local include support:
     - `.szafit_wordpress/wp-config-local.php`
   - Added safe example file:
     - `.szafit_wordpress/wp-config-local.example.php`
   - Added `.szafit_wordpress/wp-config-local.php` to `.gitignore`.

6. **Configured provider-side email auth**
   - Created `noreply@szafit.com` mailbox in Hostinger.
   - Enabled Custom DKIM.
   - SPF verified as present and valid.
   - DKIM verified at selector `hostingermail1`.
   - DMARC created and updated with reporting mailbox `dmarc@szafit.com`.

7. **Manual tests passed**
   - Multiple test emails were sent successfully.
   - User confirmed all tested emails worked.
   - No production blocker remains from the email identity work.

## Validation Reported

- `php -l` clean for involved PHP files.
- WooCommerce core plugin files untouched.
- `wp-config-local.php` is ignored and not tracked.
- Real SMTP password is not present in tracked files.
- Email branding plugin body/link rewriting passed review.
- SMTP Loader transport-only behavior passed review.
- DNS:
  - SPF: PASS
  - DKIM: PASS
  - DMARC: created; reporting mailbox added

## Deployment Notes

Use SFTP sync for code files, but exclude:

- `.szafit_wordpress/wp-config-local.php`

This file is environment-specific and secret-bearing. Create it manually on each server.

Required production files:

- `.szafit_wordpress/wp-config.php`
- `.szafit_wordpress/wp-config-local.php` (manual, not committed)
- `.szafit_wordpress/wp-config-local.example.php`
- `.szafit_wordpress/wp-content/plugins/Custom SMTP Loader/custom-smtp-loader.php`
- `.szafit_wordpress/wp-content/plugins/szafit-woocommerce-email-branding/`

## Current Status

Email identity and deliverability hardening is ready for production use, assuming the same tested files and `wp-config-local.php` exist on the production server.

## Next Recommended Work

1. Implement frontend/API handlers for:
   - `POST /api/reset-password`
   - `POST /api/pay-order`
2. Run one raw-header check after production deployment:
   - `From: SZAFIT <noreply@szafit.com>`
   - `spf=pass`
   - `dkim=pass`
   - `dmarc=pass` or aligned with `p=none`
   - no `z.szafit.com`
   - no `wp-admin`
   - no `wp-login`
3. After 2-4 weeks of clean DMARC reports, consider moving DMARC from `p=none` to `p=quarantine`, then later `p=reject`.
