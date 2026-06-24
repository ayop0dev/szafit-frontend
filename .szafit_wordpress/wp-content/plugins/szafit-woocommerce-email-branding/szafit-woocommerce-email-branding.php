<?php
/**
 * Plugin Name: SZAFIT — WooCommerce Email Branding
 * Plugin URI:  https://szafit.com
 * Description: Rewrites all WooCommerce transactional email identities and backend URLs to the public frontend domain. Zero backend-domain leakage in email output.
 * Version:     1.0.2
 * Author:      SZAFIT
 * License:     GPL v2 or later
 * Text Domain: szafit-email-branding
 * Requires at least: 6.0
 * Requires Plugins: woocommerce
 *
 * =============================================================================
 * MANUAL TEST CHECKLIST
 * =============================================================================
 *
 * Run these tests on a staging instance (never production). Use WooCommerce >
 * Settings > Emails > [Email] > Preview / Resend, or a staging checkout flow.
 *
 * 1. Customer — New Account email
 *    SEND:    Create a new customer account via WooCommerce.
 *    EXPECT:  From: noreply@szafit.com  Name: "SZAFIT"
 *    EXPECT:  "My Account" link → https://szafit.com/{lang}/account/
 *    EXPECT:  No z.szafit.com anywhere in headers, body, or footer.
 *    EXPECT:  No wp-admin URL in body.
 *
 * 2. Customer — Processing Order email
 *    SEND:    Place a test order; or WC > Orders > Resend "Processing order".
 *    EXPECT:  Order link / "View Order" → https://szafit.com/{lang}/orders/
 *    EXPECT:  No z.szafit.com in body or footer.
 *
 * 3. Customer — Password Reset email
 *    SEND:    Trigger lost-password from /my-account/lost-password/.
 *    EXPECT:  Reset link → https://szafit.com/{lang}/reset-password/?key=XXX&id=NNN&login=YYY
 *    EXPECT:  key, id, AND login tokens preserved verbatim.
 *    VERIFY:  Inspect the raw href — confirm no &amp; corruption in query args.
 *
 * 4. Customer — Order On-Hold / Pay Now email
 *    SEND:    Create a pending/on-hold order.
 *    EXPECT:  Pay link → https://szafit.com/{lang}/checkout/pay/?order_id=N&key=XXX
 *    EXPECT:  pay_for_order param preserved if present.
 *
 * 5. Admin — New Order notification
 *    SEND:    WC > Settings > Emails > New Order > Send test email.
 *    EXPECT:  From: noreply@szafit.com  Name: "SZAFIT"
 *    EXPECT:  No wp-admin URL visible; plain anchor text (e.g. "View Order") is
 *             preserved without a link. If the anchor text itself was a URL it is
 *             replaced with "Manage this from the Szafit operations dashboard".
 *    EXPECT:  No z.szafit.com and no wp-admin text visible anywhere in the email.
 *
 * 6. Header logo (if set)
 *    SEND:    Any email where WC > Settings > Emails > Header Image is configured
 *             with a z.szafit.com URL.
 *    EXPECT:  Logo src rewrites to szafit.com equivalent.
 *
 * VALIDATION COMMANDS (run locally before deploying)
 * ---------------------------------------------------
 *   php -l wp-content/plugins/szafit-woocommerce-email-branding/szafit-woocommerce-email-branding.php
 *
 *   # Must return zero hits (only SZAFIT_EB_BACKEND_URL and test/comment lines allowed):
 *   grep -n "z\.szafit\.com" wp-content/plugins/szafit-woocommerce-email-branding/szafit-woocommerce-email-branding.php
 *
 *   # Confirm no WooCommerce templates were modified:
 *   grep -rl "szafit-email-branding\|szafit_eb_" wp-content/plugins/woocommerce/
 *
 * =============================================================================
 */

defined( 'ABSPATH' ) || exit;

// =============================================================================
// CONSTANTS
// SZAFIT_EB_BACKEND_URL is used ONLY as a match pattern — never echoed/output.
// =============================================================================

define( 'SZAFIT_EB_VERSION',     '1.0.2' );
define( 'SZAFIT_EB_PUBLIC_URL',  'https://szafit.com' );
define( 'SZAFIT_EB_BACKEND_URL', 'https://z.szafit.com' ); // match target only

// =============================================================================
// EMAIL CONTEXT TRACKING
// Three-tier capture strategy:
//
// Tier 1 — woocommerce_email_header (classic HTML path, priority 0)
//   Fires inside the HTML template during WC_Email::get_content(). Sets
//   szafit_eb_current_email before woocommerce_mail_content runs, allowing
//   correct language/is_admin context during the content rewrite.
//
// Tier 2 — woocommerce_mail_callback_params (plain-text and block-editor path)
//   Fires inside WC_Email::send() AFTER woocommerce_mail_content, and receives
//   the WC_Email object as its second argument. Plain-text templates and the
//   block email editor do not call woocommerce_email_header, so this filter is
//   the authoritative rewrite point for those paths.
//
// Tier 3 — wp_mail catch-all
//   Catches wp_mail() calls made by third-party plugins during a WC email flow.
//   Gated by szafit_eb_in_email to prevent firing outside email context.
//
// Context is cleared by woocommerce_email_sent (per-email) and shutdown (fallback).
// =============================================================================

$GLOBALS['szafit_eb_in_email']      = false;
$GLOBALS['szafit_eb_current_email'] = null;

// =============================================================================
// HELPERS — public API
// =============================================================================

/**
 * @return string  e.g. "https://szafit.com"
 */
function szafit_eb_public_base_url() {
	return SZAFIT_EB_PUBLIC_URL;
}

/**
 * @return string  The backend base URL (match target only — never output).
 */
function szafit_eb_backend_base_url() {
	return SZAFIT_EB_BACKEND_URL;
}

/**
 * Detect the email language ('ar' or 'en').
 * Checks order meta set by the headless checkout plugin (_szafit_language),
 * then falls back to billing country, then defaults to 'ar'.
 *
 * @param WC_Email|null $email
 * @param WC_Order|null $order
 * @return string 'ar'|'en'
 */
function szafit_eb_detect_language( $email = null, $order = null ) {
	if ( is_null( $order ) && $email instanceof WC_Email && ! empty( $email->object ) ) {
		if ( $email->object instanceof WC_Abstract_Order ) {
			$order = $email->object;
		}
	}

	if ( $order instanceof WC_Abstract_Order ) {
		$stored = $order->get_meta( '_szafit_language', true );
		if ( in_array( $stored, [ 'ar', 'en' ], true ) ) {
			return $stored;
		}

		// Arabic-speaking billing countries
		$arabic = [ 'SA', 'EG', 'AE', 'KW', 'BH', 'QA', 'OM', 'JO', 'LB', 'SY', 'IQ', 'YE', 'LY', 'DZ', 'MA', 'TN' ];
		$country = strtoupper( (string) $order->get_billing_country() );
		if ( $country && ! in_array( $country, $arabic, true ) ) {
			return 'en';
		}
	}

	return 'ar';
}

/**
 * Rewrite a single backend URL to the correct public frontend URL.
 * Preserves all security tokens (key, login, order_id, etc.).
 * Returns the original $url unchanged if host is not the backend domain.
 *
 * @param string $url
 * @param array  $context { lang: string, is_admin: bool }
 * @return string
 */
function szafit_eb_rewrite_url( $url, $context = [] ) {
	$lang = $context['lang'] ?? 'ar';

	// Decode HTML entities before parsing so &amp; in href values does not corrupt
	// query string parsing (e.g. &amp;key= would otherwise become amp;key=).
	$url = html_entity_decode( $url, ENT_QUOTES | ENT_HTML5, 'UTF-8' );

	$parsed = wp_parse_url( $url );
	if ( empty( $parsed['host'] ) ) {
		return $url; // relative — don't touch
	}

	// Only rewrite backend-origin URLs
	if ( strcasecmp( $parsed['host'], 'z.szafit.com' ) !== 0 ) {
		return $url;
	}

	$path  = $parsed['path']  ?? '/';
	$query = $parsed['query'] ?? '';
	parse_str( $query, $params );

	$pub = szafit_eb_public_base_url();

	// wp-admin / wp-login: handled by the HTML/text rewriters before URL rewrite;
	// if we reach here it is a bare mention — return empty string.
	if (
		strpos( $path, '/wp-admin' ) === 0 ||
		strpos( $path, '/wp-login.php' ) === 0
	) {
		return '';
	}

	// Lost password / reset password
	// z.szafit.com/my-account/lost-password/?action=rp&key=K&id=ID&login=L
	// WC generates key, id, AND login — all three must be forwarded.
	if ( strpos( $path, '/my-account/lost-password' ) === 0 ) {
		$keep = array_filter( [
			'action' => $params['action'] ?? null,
			'key'    => $params['key']    ?? null,
			'id'     => $params['id']     ?? null,
			'login'  => $params['login']  ?? null,
		] );
		$qs = $keep ? '?' . http_build_query( $keep ) : '';
		return "{$pub}/{$lang}/reset-password/{$qs}";
	}

	// Order pay
	// z.szafit.com/checkout/order-pay/{ID}/?pay_for_order=true&key=K
	if ( preg_match( '#^/checkout/order-pay/(\d+)/?#', $path, $m ) ) {
		$keep = array_filter( [
			'order_id'      => $m[1],
			'key'           => $params['key']           ?? null,
			'pay_for_order' => $params['pay_for_order'] ?? null,
		] );
		$qs = $keep ? '?' . http_build_query( $keep ) : '';
		return "{$pub}/{$lang}/checkout/pay/{$qs}";
	}

	// Checkout root
	if ( strpos( $path, '/checkout' ) === 0 ) {
		return "{$pub}/{$lang}/checkout/";
	}

	// Orders list (my-account/orders or view-order sub-pages)
	if (
		strpos( $path, '/my-account/orders' ) === 0 ||
		strpos( $path, '/my-account/view-order' ) === 0
	) {
		return "{$pub}/{$lang}/orders/";
	}

	// My Account root and sub-pages (edit-address, edit-account, etc.)
	if ( strpos( $path, '/my-account' ) === 0 ) {
		return "{$pub}/{$lang}/account/";
	}

	// All other backend URLs (downloads, REST, media, etc.): rewrite host only.
	$new_query = $query ? "?{$query}" : '';
	$fragment  = isset( $parsed['fragment'] ) ? "#{$parsed['fragment']}" : '';
	return $pub . $path . $new_query . $fragment;
}

/**
 * Rewrite all backend URLs inside an HTML email body.
 * Three-pass approach:
 *   1. Strip / neutralize wp-admin and wp-login anchors.
 *   2. Smart-rewrite all remaining z.szafit.com URLs (href, src, bare text).
 *   3. Safety fallback — catch any bare "z.szafit.com" domain references left.
 *
 * @param string $html
 * @param array  $context { lang: string, is_admin: bool }
 * @return string
 */
function szafit_eb_rewrite_html( $html, $context = [] ) {
	$is_admin = $context['is_admin'] ?? false;

	// --- Pass 1: wp-admin / wp-login anchors ---
	// Anchor pattern: <a ... href="...wp-admin..."...>inner</a>
	$admin_link_pattern = '#<a(?:\s[^>]*)?\shref=["\'][^"\']*(?:/wp-admin|/wp-login\.php)[^"\']*["\'][^>]*>(.*?)</a>#is';

	if ( $is_admin ) {
		// Keep inner text — admin gets "View Order" as plain text, no link
		$html = preg_replace( $admin_link_pattern, '$1', $html );
	} else {
		// Remove anchor entirely — customers never see wp-admin fragments
		$html = preg_replace( $admin_link_pattern, '', $html );
	}

	// Replace ALL remaining wp-admin / wp-login URLs — including any backend URLs that
	// were the visible inner text of an admin anchor (preserved by the strip above).
	// Scope is any host so a URL like https://z.szafit.com/wp-admin/... in anchor text
	// is caught even after the domain-level anchor strip already ran.
	// Admin: replace with neutral copy that gives context without revealing backend.
	// Customer: remove entirely.
	$html = preg_replace(
		'#https?://[^\s"\'<>]*(?:wp-admin|wp-login\.php)[^\s"\'<>]*#i',
		$is_admin ? 'Manage this from the Szafit operations dashboard' : '',
		$html
	);

	// --- Pass 2: smart-rewrite all remaining backend URLs ---
	// Matches http(s)://z.szafit.com[optional path+query+fragment] up to
	// whitespace or HTML delimiter.
	$html = preg_replace_callback(
		'#https?://z\.szafit\.com[^\s"\'<>]*#i',
		function ( $m ) use ( $context ) {
			// Strip trailing punctuation that is unlikely to be part of the URL
			$url = rtrim( $m[0], '.,;:!?)>' );
			return esc_url( szafit_eb_rewrite_url( $url, $context ) );
		},
		$html
	);

	// --- Pass 3: safety fallback for bare domain text ---
	$html = str_ireplace( 'z.szafit.com', 'szafit.com', $html );

	return $html;
}

/**
 * Rewrite all backend URLs inside a plain-text email body.
 *
 * @param string $text
 * @param array  $context { lang: string, is_admin: bool }
 * @return string
 */
function szafit_eb_rewrite_plain_text( $text, $context = [] ) {
	$is_admin = $context['is_admin'] ?? false;

	// Neutralize wp-admin and wp-login URLs
	$text = preg_replace(
		'#https?://z\.szafit\.com(?:/wp-admin|/wp-login\.php)[^\s]*#i',
		$is_admin ? '[SZAFIT Admin]' : '',
		$text
	);

	// Smart-rewrite remaining backend URLs
	$text = preg_replace_callback(
		'#https?://z\.szafit\.com[^\s]*#i',
		function ( $m ) use ( $context ) {
			$url = rtrim( $m[0], '.,;:!?)>' );
			return szafit_eb_rewrite_url( $url, $context );
		},
		$text
	);

	// Safety fallback
	$text = str_ireplace( 'z.szafit.com', 'szafit.com', $text );

	return $text;
}

// =============================================================================
// CONTEXT CAPTURE — Tier 1: classic HTML template path
// woocommerce_email_header fires inside the HTML template during
// WC_Email::get_content(), before woocommerce_mail_content runs. This gives us
// the WC_Email object early so szafit_eb_mail_content can rewrite immediately
// with correct language/is_admin context.
// Plain-text and block-editor emails skip this action — their context is
// captured later by szafit_eb_mail_callback_params (Tier 2).
// =============================================================================

add_action( 'woocommerce_email_header', 'szafit_eb_capture_context', 0, 2 );
function szafit_eb_capture_context( $email_heading, $email = null ) {
	if ( $email instanceof WC_Email ) {
		$GLOBALS['szafit_eb_current_email'] = $email;
	}
	$GLOBALS['szafit_eb_in_email'] = true;
}

// Primary clear: woocommerce_email_sent fires inside WC_Email::send() after
// wp_mail() returns — once per email, preventing context bleed across batches.
add_action( 'woocommerce_email_sent', 'szafit_eb_clear_context', 999, 0 );

// Fallback clear: classic HTML emails fire woocommerce_email_footer inside the
// template, which schedules a shutdown clear as a belt-and-suspenders guard.
// Plain-text and block emails do not call woocommerce_email_footer, so the
// woocommerce_email_sent hook above is their sole clear mechanism.
add_action( 'woocommerce_email_footer', 'szafit_eb_schedule_context_clear', 999, 1 );
function szafit_eb_schedule_context_clear( $email = null ) {
	add_action( 'shutdown', 'szafit_eb_clear_context', 999 );
}

function szafit_eb_clear_context() {
	$GLOBALS['szafit_eb_in_email']      = false;
	$GLOBALS['szafit_eb_current_email'] = null;
}

/**
 * Build a $context array for the currently active email.
 *
 * @param WC_Email|null $email  Override; falls back to captured global.
 * @return array { lang: string, is_admin: bool }
 */
function szafit_eb_build_context( $email = null ) {
	if ( is_null( $email ) ) {
		$email = $GLOBALS['szafit_eb_current_email'] ?? null;
	}

	$order    = null;
	$is_admin = false;

	if ( $email instanceof WC_Email ) {
		$is_admin = ! $email->is_customer_email();
		if ( ! empty( $email->object ) && $email->object instanceof WC_Abstract_Order ) {
			$order = $email->object;
		}
	}

	return [
		'lang'     => szafit_eb_detect_language( $email, $order ),
		'is_admin' => $is_admin,
	];
}

// =============================================================================
// IDENTITY FILTERS
// =============================================================================

add_filter( 'woocommerce_email_from_name', 'szafit_eb_from_name', 99, 2 );
function szafit_eb_from_name( $name, $email ) {
	return 'SZAFIT';
}

/**
 * Override from address to prevent z.szafit.com leaking in email headers.
 *
 * NOTE: noreply@szafit.com must be authorised in your SMTP/SPF/DKIM records.
 * If your SMTP provider enforces a different authenticated sender, adjust
 * this to match — but ensure @z.szafit.com is never the output.
 */
add_filter( 'woocommerce_email_from_address', 'szafit_eb_from_address', 99, 2 );
function szafit_eb_from_address( $address, $email ) {
	return 'noreply@szafit.com';
}

add_filter( 'woocommerce_email_footer_text', 'szafit_eb_footer_text', 99, 2 );
function szafit_eb_footer_text( $text, $email = null ) {
	// The footer text may still hold {site_url} tokens at this stage;
	// replace both the token and any already-resolved backend URL.
	$text = str_replace( '{site_url}', szafit_eb_public_base_url(), $text );
	$text = str_ireplace( 'z.szafit.com', 'szafit.com', $text );
	return $text;
}

// =============================================================================
// HEADER LOGO
// Handles the case where WC email header image is set to a backend URL.
// Also caught by the HTML rewriter as belt-and-suspenders.
// Filter name: woocommerce_email_header_image (WC 4.0+).
// =============================================================================

add_filter( 'woocommerce_email_header_image', 'szafit_eb_header_image', 99, 3 );
function szafit_eb_header_image( $image_url, $email = null, $mailer = null ) {
	if ( ! empty( $image_url ) && strpos( $image_url, 'z.szafit.com' ) !== false ) {
		return szafit_eb_rewrite_url( $image_url, [ 'lang' => 'ar', 'is_admin' => false ] );
	}
	return $image_url;
}

// woocommerce_email_header_image_url controls the <a href> that wraps the logo image.
// Without this WC falls back to home_url() which resolves to z.szafit.com — leaking
// the backend domain as a clickable link in every email header.
add_filter( 'woocommerce_email_header_image_url', 'szafit_eb_header_image_url', 99, 2 );
function szafit_eb_header_image_url( $url, $email = null ) {
	$context = szafit_eb_build_context( $email );
	return szafit_eb_public_base_url() . '/' . $context['lang'] . '/';
}

// =============================================================================
// FORMAT STRING (subject line / email heading tokens)
// =============================================================================

add_filter( 'woocommerce_email_format_string', 'szafit_eb_format_string', 99, 2 );
function szafit_eb_format_string( $string, $email ) {
	$string = str_replace( '{site_url}', szafit_eb_public_base_url(), $string );
	$string = str_ireplace( 'z.szafit.com', 'szafit.com', $string );
	return $string;
}

// =============================================================================
// PRIMARY CONTENT REWRITE — classic HTML path
// woocommerce_mail_content fires inside WC_Email::send(). For classic HTML
// emails, szafit_eb_current_email is already set by szafit_eb_capture_context
// so the rewrite uses correct language and is_admin context.
// For plain-text and block emails the guard below short-circuits and defers
// the rewrite to szafit_eb_mail_callback_params (Tier 2).
// =============================================================================

add_filter( 'woocommerce_mail_content', 'szafit_eb_mail_content', 99 );
function szafit_eb_mail_content( $content ) {
	// Only rewrite when a WC_Email object was already captured via
	// woocommerce_email_header (classic HTML template path). For plain-text and
	// block-editor emails that do not fire woocommerce_email_header, context is
	// not yet available here — those emails are rewritten by
	// szafit_eb_mail_callback_params which runs later in send() with the email
	// object available.
	if ( ! ( ( $GLOBALS['szafit_eb_current_email'] ?? null ) instanceof WC_Email ) ) {
		return $content;
	}

	$context = szafit_eb_build_context();
	$is_html = strpos( $content, '<' ) !== false;

	return $is_html
		? szafit_eb_rewrite_html( $content, $context )
		: szafit_eb_rewrite_plain_text( $content, $context );
}

// =============================================================================
// SEND-STAGE CONTEXT-AWARE REWRITE — Tier 2: plain-text and block-editor path
// woocommerce_mail_callback_params fires inside WC_Email::send() immediately
// after woocommerce_mail_content, and passes the WC_Email object as its second
// argument — the only reliable way to obtain it for all email types.
//
// For classic HTML emails: context was already captured via woocommerce_email_header
// and content was rewritten by szafit_eb_mail_content. Running the rewrite again
// here is a no-op (no z.szafit.com remains). The globals are updated to the
// authoritative email object anyway, which keeps the wp_mail catch-all gated.
//
// For plain-text emails: woocommerce_email_header is never called from plain-
// text templates, so this is the first (and only) rewrite opportunity.
//
// For block-editor emails: block rendering bypasses woocommerce_email_header,
// so this is likewise the authoritative rewrite point.
// =============================================================================

add_filter( 'woocommerce_mail_callback_params', 'szafit_eb_mail_callback_params', 99, 2 );
function szafit_eb_mail_callback_params( $params, $email ) {
	if ( ! $email instanceof WC_Email ) {
		return $params;
	}

	// Establish authoritative context for this send cycle so the wp_mail
	// catch-all and woocommerce_email_sent clear both see the right email.
	$GLOBALS['szafit_eb_current_email'] = $email;
	$GLOBALS['szafit_eb_in_email']      = true;

	$context = szafit_eb_build_context( $email );

	// $params[2] is the message body (post woocommerce_mail_content + style_inline).
	if ( ! empty( $params[2] ) ) {
		$is_html   = strpos( $params[2], '<' ) !== false;
		$params[2] = $is_html
			? szafit_eb_rewrite_html( $params[2], $context )
			: szafit_eb_rewrite_plain_text( $params[2], $context );
	}

	// $params[1] is the decoded subject line — scrub any backend domain fragments.
	if ( ! empty( $params[1] ) ) {
		$params[1] = str_ireplace( 'z.szafit.com', 'szafit.com', $params[1] );
	}

	return $params;
}

// =============================================================================
// SECONDARY CATCH-ALL (wp_mail filter)
// Guards against edge cases where a plugin calls wp_mail() directly during a
// WC email flow (e.g., a receipt plugin that sends a supplementary email).
// Gated by $GLOBALS['szafit_eb_in_email'] — set by szafit_eb_mail_callback_params
// for all email types — to prevent firing outside WC email context.
// Block-editor and plain-text paths are handled upstream by
// szafit_eb_mail_callback_params; this filter is an additional safety net.
// =============================================================================

add_filter( 'wp_mail', 'szafit_eb_wp_mail', 99 );
function szafit_eb_wp_mail( $args ) {
	if ( empty( $GLOBALS['szafit_eb_in_email'] ) ) {
		return $args;
	}

	$context = szafit_eb_build_context();

	if ( ! empty( $args['message'] ) ) {
		$is_html         = strpos( $args['message'], '<' ) !== false;
		$args['message'] = $is_html
			? szafit_eb_rewrite_html( $args['message'], $context )
			: szafit_eb_rewrite_plain_text( $args['message'], $context );
	}

	if ( ! empty( $args['subject'] ) ) {
		$args['subject'] = str_ireplace( 'z.szafit.com', 'szafit.com', $args['subject'] );
	}

	return $args;
}
