/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{astro,html,js,ts,jsx,tsx}',
        './public/**/*.html'
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
                'secondary-red-pale': '#F9C8CA',
                // Demo specific colors
                'base': '#FAFAF9',
                'surface': '#FFFFFF',
                'surface-soft': '#F7F9F8',
                'text': '#1B3624',
                'text-muted': '#5A5A5A',
                'text-faint': '#6A6A6A',
                'primary': '#C6FF34',
                'primary-hover': '#D9FF66',
                'accent': '#5F7D1F',
                'on-primary': '#0E2A23',
                'border': '#E7E7E4',
                'error-bg': '#F9C8CA',
                'error-border': '#CF3033',
                'error-text': '#CF3033'
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
                'glow': '0 4px 12px rgba(198, 255, 52, 0.1)',
                'glow-soft': '0 2px 8px rgba(198, 255, 52, 0.05)',
                // Demo specific shadows
                'card-resting': '0 2px 8px rgba(27,54,36,0.04)',
                'card-hover': '0 8px 24px rgba(27,54,36,0.08)',
                'glow-demo': '0 4px 12px rgba(198,255,52,0.1)',
                'focus-ring': '0 0 0 3px rgba(198,255,52,0.35)',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-16px)' }
                },
                shimmer: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '100% 50%' }
                },
                // Demo keyframes
                floatDemo: {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(-8px)' }
                },
                orbitSlow: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                growBar: {
                    '0%': { height: '0%' }
                }
            },
            animation: {
                float: 'float 8s ease-in-out infinite',
                shimmer: 'shimmer 6s ease-in-out infinite',
                // Demo animations
                'float-demo': 'floatDemo 3s ease-in-out infinite alternate',
                'orbit-slow': 'orbitSlow 20s linear infinite',
                'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'grow-bar': 'growBar 1.2s cubic-bezier(0.16, 1, 0.3, 1) backwards'
            },
            maxWidth: {
                'container': '1280px' /* 1280px */
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
