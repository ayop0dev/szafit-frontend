/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './products.html',
        './product-single.html',
        './checkout.html',
        './contact.html',
        './about.html',
        './success-stories.html',
        './app.html',
        './booking.html',
        './thank-you.html',
        './404.html',
        './scripts/**/*.js'
    ],
    theme: {
        extend: {
            colors: {
                'primary-green-dark': '#6B8F1F',
                'primary-green': '#C6FF34',
                'primary-green-light': '#D9FF66',
                'primary-green-lighter': '#E8FF99',
                'primary-green-pale': '#F2FFCC',
                'primary-green-ultra-light': '#FAFFED',
                'accent-green': '#9ac527',
                'neutral-dark-1': '#171717',
                'neutral-dark-2': '#2D2D2D',
                'neutral-gray': '#7E7E7E',
                'neutral-gray-light': '#B1B1B1',
                'neutral-light': '#D4D5D4',
                'neutral-lightest': '#fafaf9',
                'secondary-red-dark-1': '#520F12',
                'secondary-red-dark-2': '#7E161A',
                'secondary-red': '#CF3033',
                'secondary-red-light': '#FE5356',
                'secondary-red-lighter': '#FC8782',
                'secondary-red-pale': '#F9C8CA'
            },
            spacing: {
                'section-tight': '2rem',       /* 32px */
                'section-normal': '3rem',      /* 48px */
                'section-spacious': '4rem',    /* 64px */
                'section-extra': '5rem',       /* 80px */
                'component-tight': '0.5rem',   /* 8px */
                'component-normal': '1rem',    /* 16px */
                'component-spacious': '1.5rem' /* 24px */
            },
            fontFamily: {
                sans: ['Changa', 'ui-sans-serif', 'system-ui', 'sans-serif']
            },
            boxShadow: {
                'glow': '0 8px 24px rgba(198, 255, 52, 0.22)',
                'glow-soft': '0 6px 18px rgba(198, 255, 52, 0.14)'
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-16px)' }
                },
                shimmer: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '100% 50%' }
                }
            },
            animation: {
                float: 'float 8s ease-in-out infinite',
                shimmer: 'shimmer 6s ease-in-out infinite'
            },
            maxWidth: {
                'container': '90rem' /* 1440px */
            },
            gridTemplateColumns: {
                'hero': '11fr 9fr',
                'hero-reverse': '9fr 11fr'
            },
            fontSize: {
                xs: '0.875rem',      // 14px
                sm: '1rem',          // 16px
                base: '1.125rem',    // 18px
                lg: '1.25rem',       // 20px
                xl: '1.5rem',        // 24px
            }
        }
    },
    plugins: []
};
