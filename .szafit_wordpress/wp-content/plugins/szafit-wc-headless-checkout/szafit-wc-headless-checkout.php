<?php
/**
 * Plugin Name: SZAFIT - WooCommerce Headless Commerce Endpoint
 * Plugin URI: https://z.szafit.com
 * Description: REST API endpoints for headless checkout and order creation
 * Version: 1.2.0
 * Author: SZAFIT
 * License: GPL v2 or later
 * Text Domain: szafit-headless
 */

// ================================================
// ALLOWED ORIGINS
// ================================================

function szafit_allowed_origins() {
    return [
        'https://szafit.com',
        'https://www.szafit.com',
    ];
}

function szafit_frontend_base_url() {
    return apply_filters('szafit_frontend_base_url', 'https://szafit.com');
}

add_filter('allowed_redirect_hosts', 'szafit_allowed_redirect_hosts');

function szafit_allowed_redirect_hosts($hosts) {
    $frontend_host = wp_parse_url(szafit_frontend_base_url(), PHP_URL_HOST);
    if (empty($frontend_host)) {
        return $hosts;
    }

    $frontend_host = strtolower($frontend_host);
    $hosts[] = $frontend_host;

    if (strpos($frontend_host, 'www.') === 0) {
        $hosts[] = substr($frontend_host, 4);
    } else {
        $hosts[] = 'www.' . $frontend_host;
    }

    return array_values(array_unique(array_filter($hosts)));
}

function szafit_frontend_thank_you_url($locale, $order_id = 0) {
    $locale = in_array($locale, ['ar', 'en'], true) ? $locale : 'ar';
    $base_url = trailingslashit(szafit_frontend_base_url()) . $locale . '/thank-you/';

    if ($order_id > 0) {
        return add_query_arg('order_id', (int) $order_id, $base_url);
    }

    return $base_url;
}

function szafit_get_gateway($gateway_id) {
    if (!function_exists('WC') || !WC()->payment_gateways()) {
        return null;
    }

    $gateways = WC()->payment_gateways()->payment_gateways();
    $gateway   = $gateways[$gateway_id] ?? null;

    if (!$gateway || !method_exists($gateway, 'is_available') || !$gateway->is_available()) {
        return null;
    }

    return $gateway;
}

function szafit_get_client_ip() {
    $header_candidates = [
        'HTTP_CF_CONNECTING_IP',
        'HTTP_X_REAL_IP',
    ];

    foreach ($header_candidates as $header_name) {
        if (!empty($_SERVER[$header_name])) {
            $ip = sanitize_text_field(wp_unslash($_SERVER[$header_name]));
            if (!empty($ip)) {
                return $ip;
            }
        }
    }

    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $forwarded_for = sanitize_text_field(wp_unslash($_SERVER['HTTP_X_FORWARDED_FOR']));
        $forwarded_ips = array_filter(array_map('trim', explode(',', $forwarded_for)));
        if (!empty($forwarded_ips)) {
            return $forwarded_ips[0];
        }
    }

    return sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
}

function szafit_checkout_rate_limit_key($client_ip) {
    // Bump the version suffix to intentionally reset any old buckets after rate-limit tuning.
    return 'szafit_checkout_rate_v2_' . md5((string) $client_ip);
}

function szafit_checkout_rate_limit_max_attempts() {
    return max(1, (int) apply_filters('szafit_checkout_rate_limit_max_attempts', 20));
}

function szafit_checkout_rate_limit_window() {
    return max(60, (int) apply_filters('szafit_checkout_rate_limit_window', HOUR_IN_SECONDS));
}

// ================================================
// CORS — OPTIONS PREFLIGHT
// Fires at init (priority 1) — before WP routing — so the browser
// preflight gets a clean 200 + headers without hitting the REST dispatcher.
// ================================================

add_action('init', 'szafit_handle_cors_preflight', 1);

function szafit_handle_cors_preflight() {
    if (strtoupper(sanitize_text_field(wp_unslash($_SERVER['REQUEST_METHOD'] ?? ''))) !== 'OPTIONS') {
        return;
    }

    $uri    = wp_unslash($_SERVER['REQUEST_URI'] ?? '');
    $origin = untrailingslashit(sanitize_text_field(wp_unslash($_SERVER['HTTP_ORIGIN'] ?? '')));

    // Only intercept our own namespace
    if (strpos($uri, '/wp-json/szafit/v1/') === false) {
        return;
    }

    if (!in_array($origin, szafit_allowed_origins(), true)) {
        return; // Not our origin — let WP handle or reject
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 3600');
    header('Vary: Origin');
    status_header(200);
    exit;
}

// ================================================
// CORS — RESPONSE HEADERS FOR POST / GET REQUESTS
// Priority 999: fires last, after WP core (rest_send_cors_headers) and any
// other plugin that hooks rest_pre_serve_request.
// header_remove() strips any CORS headers already written inside PHP before
// we set the authoritative value.
// NOTE: server-level headers added by LiteSpeed/Apache outside PHP are NOT
// removed by header_remove() — see the .htaccess note in DEPLOYMENT_MANIFEST.md
// if the wrong origin persists after deploying this version.
// ================================================

add_filter('rest_pre_serve_request', 'szafit_cors_response_headers', 999, 4);

function szafit_cors_response_headers($served, $result, $request, $server) {
    // Only apply to our namespace — leave all other REST routes untouched
    if (strpos($request->get_route(), '/szafit/v1/') !== 0) {
        return $served;
    }

    $origin = untrailingslashit((string) $request->get_header('origin'));

    // Strip any conflicting CORS headers set earlier in PHP (WP core, other plugins).
    header_remove('Access-Control-Allow-Origin');
    header_remove('Access-Control-Allow-Methods');
    header_remove('Access-Control-Allow-Headers');
    header_remove('Access-Control-Expose-Headers');
    header_remove('Access-Control-Allow-Credentials');

    if (!empty($origin) && in_array($origin, szafit_allowed_origins(), true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Vary: Origin');
    }

    return $served; // false = WP continues to send the response normally
}

// ================================================
// REGISTER REST ROUTES
// ================================================

add_action('rest_api_init', function () {
    // Checkout fields endpoint
    register_rest_route('szafit/v1', '/checkout-fields', [
        'methods'             => 'GET',
        'callback'            => 'szafit_get_checkout_fields',
        'permission_callback' => '__return_true',
    ]);

    // Create order endpoint
    register_rest_route('szafit/v1', '/checkout/create-order', [
        'methods'             => 'POST',
        'callback'            => 'szafit_create_order',
        'permission_callback' => '__return_true',
    ]);
});

// ================================================
// CHECKOUT FIELDS ENDPOINT
// ================================================

function szafit_get_checkout_fields(WP_REST_Request $request) {
    if (!function_exists('WC')) {
        return new WP_Error('wc_missing', 'WooCommerce is not available.', ['status' => 500]);
    }

    $fields = WC()->checkout()->get_checkout_fields();

    $formatted_fields = [];
    foreach ($fields as $section => $section_fields) {
        $formatted_fields[$section] = [];
        foreach ($section_fields as $field_key => $field_config) {
            $formatted_fields[$section][$field_key] = [
                'type'        => $field_config['type']        ?? 'text',
                'label'       => $field_config['label']       ?? '',
                'placeholder' => $field_config['placeholder'] ?? '',
                'required'    => $field_config['required']    ?? false,
                'class'       => $field_config['class']       ?? [],
                'default'     => isset($field_config['default']) ? $field_config['default'] : '',
                'options'     => $field_config['options']     ?? [],
                'clear'       => $field_config['clear']       ?? false,
            ];
        }
    }

    return rest_ensure_response([
        'fields'          => $formatted_fields,
        'currency'        => get_woocommerce_currency(),
        'currency_symbol' => get_woocommerce_currency_symbol(),
        'locale'          => get_locale(),
    ]);
}

// ================================================
// CREATE ORDER ENDPOINT
// ================================================

function szafit_create_order(WP_REST_Request $request) {
    if (!function_exists('wc_create_order')) {
        return new WP_Error('wc_missing', 'WooCommerce is not available.', ['status' => 500]);
    }

    try {
        // Origin validation — blocks requests from non-allowed origins.
        // CORS headers are added separately (rest_pre_serve_request filter above).
        $origin = untrailingslashit((string) $request->get_header('origin'));
        if (!empty($origin) && !in_array($origin, szafit_allowed_origins(), true)) {
            return new WP_Error('forbidden_origin', 'Origin not allowed.', ['status' => 403]);
        }

        // Rate limiting — keep retries reasonable while we test live payment flow.
        $client_ip    = szafit_get_client_ip();
        $rate_key     = szafit_checkout_rate_limit_key($client_ip);
        $attempts     = (int) get_transient($rate_key);
        $max_attempts = szafit_checkout_rate_limit_max_attempts();
        $rate_window  = szafit_checkout_rate_limit_window();

        if ($attempts >= $max_attempts) {
            return new WP_Error('rate_limited', 'Too many checkout attempts. Please try again later.', ['status' => 429]);
        }

        $data = $request->get_json_params();
        if (!is_array($data)) {
            return new WP_Error('invalid_payload', 'Invalid checkout payload.', ['status' => 400]);
        }

        // Product allowlist — 61, 62, 63, 66 only
        $allowed_product_ids = [61, 62, 63, 66];
        $product_id = absint($data['product_id'] ?? 0);
        $quantity   = isset($data['quantity']) ? absint($data['quantity']) : 1;

        if ($quantity < 1) $quantity = 1;
        if ($quantity > 1) $quantity = 1;

        if (!in_array($product_id, $allowed_product_ids, true)) {
            return new WP_Error('invalid_product', 'Product not available.', ['status' => 400]);
        }

        if (empty($data['billing']) || !is_array($data['billing'])) {
            return new WP_Error('missing_billing', 'Missing billing data.', ['status' => 400]);
        }

        $billing    = $data['billing'];
        $raw_locale = sanitize_text_field($data['locale'] ?? '');
        $locale     = in_array($raw_locale, ['ar', 'en'], true) ? $raw_locale : 'ar';

        $payment_gateway = szafit_get_gateway('paylink');
        if (!$payment_gateway) {
            return new WP_Error(
                'payment_gateway_unavailable',
                'Paylink payment gateway is unavailable.',
                ['status' => 503]
            );
        }

        $first_name = sanitize_text_field($billing['first_name'] ?? '');
        $phone      = sanitize_text_field($billing['phone']      ?? '');
        $email      = sanitize_email($billing['email']           ?? '');

        if (empty($first_name)) {
            return new WP_Error('missing_first_name', 'First name is required.', ['status' => 400]);
        }

        if (empty($phone)) {
            return new WP_Error('missing_phone', 'Phone number is required.', ['status' => 400]);
        }

        if (!empty($email) && !is_email($email)) {
            return new WP_Error('invalid_email', 'Email address is not valid.', ['status' => 400]);
        }

        set_transient($rate_key, $attempts + 1, $rate_window);

        $product = wc_get_product($product_id);
        if (!$product) {
            return new WP_Error('invalid_product', 'Product not available.', ['status' => 400]);
        }

        $order = wc_create_order();

        $order->set_billing_first_name($first_name);
        $order->set_billing_phone($phone);
        $order->set_billing_email($email);
        $order->set_payment_method($payment_gateway->id);
        $order->set_payment_method_title($payment_gateway->get_title() ?: 'Paylink Payment Gateway');
        $order->update_meta_data('_szafit_language', $locale);
        $order->update_meta_data('_szafit_return_url_base', szafit_frontend_thank_you_url($locale));
        $order->update_meta_data('_szafit_payment_gateway', 'paylink');

        $order->add_product($product, $quantity);

        $order->calculate_totals();

        $order_id = $order->save();

        // Sanitized response only — no order_key
        return new WP_REST_Response([
            'success'  => true,
            'order_id' => (int) $order_id,
            'status'   => sanitize_text_field($order->get_status()),
            'total'    => wc_format_decimal($order->get_total(), wc_get_price_decimals()),
            'redirect_url' => esc_url_raw($order->get_checkout_payment_url(true)),
        ], 201);

    } catch (Exception $e) {
        return new WP_Error('order_creation_failed', $e->getMessage(), ['status' => 500]);
    }
}
