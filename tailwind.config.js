/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        screens: {
            sm: '640px',
            // => @media (min-width: 640px) { ... }

            md: '768px',
            // => @media (min-width: 768px) { ... }

            lg: '1024px',
            // => @media (min-width: 1024px) { ... }

            xl: '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        },
        extend: {
            colors: {
                // primary: '#0d99a6',
                primary: '#2e74bf',
                camdat: '#f28b30',
                'primary-bold': '#1b61ad',
                link: '#00bfa5',
                secondary: '#2b6bb5',
                background: '#fcfcfc',
            },
            keyframes: {
                shrink: {
                    '0%, 100%': { width: '100%' },
                    '50%': { width: '0%' },
                },
                'animate-gradient': {
                    '0%': { 'background-position': '0%' },
                    '50%': { 'background-position': '100%' },
                    '100%': { 'background-position': '0%' },
                },
                'blink-blink': {
                    '0%': {
                        transform: 'rotate(-5deg)',
                        'font-size': '1.125rem',
                    },
                    '100%': { transform: 'rotate(5deg)', 'font-size': '1.25rem' },
                },
            },
            animation: {
                shrink: 'shrink 3s ease-in-out infinite',
                'animate-gradient': 'animate-gradient 3s ease-in-out infinite',
                'blink-blink': 'blink-blink 1s ease-in-out infinite',
                'blink-blink-gradient':
                    'blink-blink 2s ease-in-out infinite alternate, animate-gradient 3s ease-in-out infinite',
            },
        },
    },
    // plugins: [
    //     require('tailwind-scrollbar'),
    //     function ({ addUtilities }) {
    //         addUtilities({
    //             '.break-inside-avoid': {
    //                 breakInside: 'avoid',
    //             },
    //         });
    //     },
    // ],
};
