<?php
/**
 * Plugin Name: Custom SMTP Loader
 * Description: Secure SMTP loader using credentials from wp-config-local.php
 * Version: 1.3
 */

add_action('phpmailer_init', function ($phpmailer) {

    // Skip if another plugin already configured SMTP transport.
    if ($phpmailer->Mailer === 'smtp') {
        return;
    }

    // Credentials are required; everything else has safe defaults.
    if (
        !defined('CUSTOM_SMTP_USERNAME') ||
        !defined('CUSTOM_SMTP_PASSWORD')
    ) {
        return;
    }

    $phpmailer->isSMTP();
    $phpmailer->Host       = defined('CUSTOM_SMTP_HOST')   ? CUSTOM_SMTP_HOST          : 'smtp.hostinger.com';
    $phpmailer->SMTPAuth   = true;
    $phpmailer->Port       = defined('CUSTOM_SMTP_PORT')   ? (int) CUSTOM_SMTP_PORT    : 465;
    $phpmailer->SMTPSecure = defined('CUSTOM_SMTP_SECURE') ? CUSTOM_SMTP_SECURE        : 'ssl';

    $phpmailer->Username  = CUSTOM_SMTP_USERNAME;
    $phpmailer->Password  = CUSTOM_SMTP_PASSWORD;

    // From / FromName are intentionally not set here.
    // Sender identity is owned by WooCommerce email branding filters
    // (woocommerce_email_from_address / woocommerce_email_from_name),
    // which WordPress applies before phpmailer_init fires. Overriding
    // those properties here would expose the SMTP credential domain in
    // the From header of every outgoing email.
});