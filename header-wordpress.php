<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <header>
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package KY_Tech_Services
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="KY Tech Services Pvt Ltd">
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="<?php bloginfo('name'); ?> | <?php is_front_page() ? bloginfo('description') : wp_title(''); ?>">
    <meta property="og:description" content="We provide custom web development, app creation, content writing, and digital marketing to scale your brand.">
    <meta property="og:image" content="<?php echo esc_url( get_template_directory_uri() ); ?>/logo-icon.png">
    <meta property="og:url" content="<?php echo esc_url( home_url( '/' ) ); ?>">
    <meta property="og:type" content="website">

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?> data-theme="light">
<?php wp_body_open(); ?>

    <!-- Header Navbar -->
    <header class="header" id="main-header">
        <div class="container navbar">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>#home" class="logo-link" id="logo-anchor">
                <img src="<?php echo esc_url( get_template_directory_uri() ); ?>/logo-icon.png" alt="<?php bloginfo('name'); ?> Logo" class="logo-img-icon" style="height: 45px; width: auto; object-fit: contain; transition: transform var(--transition-normal);">
                <div class="logo-text">
                    <span style="font-family: var(--font-heading); font-weight: 800; font-size: 1.3rem; letter-spacing: 0.05em; color: var(--text-primary);"><?php bloginfo('name'); ?></span>
                    <span style="display: block; font-size: 0.55rem; font-weight: 700; letter-spacing: 0.28em; color: var(--text-light); text-transform: uppercase;">Innovate • Secure • Deliver</span>
                </div>
            </a>

            <!-- Menu items -->
            <nav class="nav-menu" id="nav-links">
                <?php
                if ( has_nav_menu( 'primary' ) ) {
                    wp_nav_menu( array(
                        'theme_location' => 'primary',
                        'container'      => false,
                        'items_wrap'     => '%3$s',
                        'fallback_cb'    => 'ky_tech_fallback_menu',
                    ) );
                } else {
                    // Fallback to hardcoded list if menu isn't set yet in wp-admin
                    ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>#home" class="nav-link active">Home</a>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>#about" class="nav-link">About Us</a>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>#services" class="nav-link">Services</a>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>#products" class="nav-link">Products</a>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>#contact" class="nav-link">Contact Us</a>
                    <?php
                }
                ?>
            </nav>

            <!-- Actions (Theme Toggle & CTA) -->
            <div class="nav-actions">
                <div class="theme-toggle" id="theme-btn" title="Toggle Theme" aria-label="Toggle Theme">
                    <svg class="theme-toggle-icon sun-icon" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                    <svg class="theme-toggle-icon moon-icon" viewBox="0 0 24 24">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                </div>
                <button class="btn btn-primary btn-cta" id="cta-quote-btn">
                    Get a Quote <i data-lucide="arrow-up-right" class="btn-icon"></i>
                </button>
                <div class="burger-menu" id="menu-toggle" aria-label="Toggle Menu">
                    <div class="burger-line"></div>
                    <div class="burger-line"></div>
                    <div class="burger-line"></div>
                </div>
            </div>
        </div>
    </header>
