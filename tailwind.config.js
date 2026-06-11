import tailwindAnimate from 'tailwindcss-animate';
import containerQuery from '@tailwindcss/container-queries';

export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
        './node_modules/streamdown/dist/**/*.js'
    ],
    safelist: ['border', 'border-border'],
    prefix: '',
    theme: {
                container: {
                        center: true,
                        padding: '1rem',
                        screens: {
                                '2xl': '1400px'
                        }
                },
                extend: {
                        colors: {
                                border: 'hsl(var(--border))',
                                input: 'hsl(var(--input))',
                                ring: 'hsl(var(--ring))',
                                background: 'hsl(var(--background))',
                                foreground: 'hsl(var(--foreground))',
                                primary: {
                                        DEFAULT: 'hsl(var(--primary))',
                                        foreground: 'hsl(var(--primary-foreground))'
                                },
                                secondary: {
                                        DEFAULT: 'hsl(var(--secondary))',
                                        foreground: 'hsl(var(--secondary-foreground))'
                                },
                                destructive: {
                                        DEFAULT: 'hsl(var(--destructive))',
                                        foreground: 'hsl(var(--destructive-foreground))'
                                },
                                muted: {
                                        DEFAULT: 'hsl(var(--muted))',
                                        foreground: 'hsl(var(--muted-foreground))'
                                },
                                accent: {
                                        DEFAULT: 'hsl(var(--accent))',
                                        foreground: 'hsl(var(--accent-foreground))'
                                },
                                popover: {
                                        DEFAULT: 'hsl(var(--popover))',
                                        foreground: 'hsl(var(--popover-foreground))'
                                },
                                card: {
                                        DEFAULT: 'hsl(var(--card))',
                                        foreground: 'hsl(var(--card-foreground))'
                                },
                                pixel: {
                                        blue: '#61DAFB',
                                        purple: '#9580FF',
                                        green: '#92D13D',
                                        red: '#FF5154',
                                        darkBlue: '#0A84FF'
                                },
                                sidebar: {
                                        DEFAULT: 'hsl(var(--sidebar-background))',
                                        foreground: 'hsl(var(--sidebar-foreground))',
                                        primary: 'hsl(var(--sidebar-primary))',
                                        'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                                        accent: 'hsl(var(--sidebar-accent))',
                                        'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                                        border: 'hsl(var(--sidebar-border))',
                                        ring: 'hsl(var(--sidebar-ring))'
                                }
                        },
                        borderRadius: {
                                none: '0',
                                DEFAULT: '0'
                        },
                        fontFamily: {
                                pixel: ['VT323', '"Press Start 2P"', 'monospace'],
                                mono: ['VT323', '"Press Start 2P"', 'monospace'],
                                sans: ['VT323', '"Press Start 2P"', 'monospace']
                        },
                        keyframes: {
                                'accordion-down': {
                                        from: { height: '0' },
                                        to: { height: 'var(--radix-accordion-content-height)' }
                                },
                                'accordion-up': {
                                        from: { height: 'var(--radix-accordion-content-height)' },
                                        to: { height: '0' }
                                },
                                blink: {
                                        '0%, 100%': { opacity: '1' },
                                        '50%': { opacity: '0' }
                                },
                                float: {
                                        '0%, 100%': { transform: 'translateY(0)' },
                                        '50%': { transform: 'translateY(-10px)' }
                                },
                                'pixel-spin': {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '25%': { transform: 'rotate(90deg)' },
                                        '50%': { transform: 'rotate(180deg)' },
                                        '75%': { transform: 'rotate(270deg)' },
                                        '100%': { transform: 'rotate(360deg)' }
                                },
                                typing: {
                                        '0%': { width: '0' },
                                        '100%': { width: '100%' }
                                },
                                'page-transition': {
                                        '0%': { transform: 'translateY(20px)', opacity: '0' },
                                        '100%': { transform: 'translateY(0)', opacity: '1' }
                                }
                        },
                        animation: {
                                'accordion-down': 'accordion-down 0.2s ease-out',
                                'accordion-up': 'accordion-up 0.2s ease-out',
                                blink: 'blink 1s step-start infinite',
                                float: 'float 3s ease-in-out infinite',
                                'pixel-spin': 'pixel-spin 4s steps(4) infinite',
                                typing: 'typing 3.5s steps(40, end)',
                                'page-transition': 'page-transition 0.5s ease-out'
                        }
                }
        },
    plugins: [
        tailwindAnimate,
        containerQuery,
        function ({addUtilities}) {
            addUtilities(
                {
                    '.border-t-solid': {'border-top-style': 'solid'},
                    '.border-r-solid': {'border-right-style': 'solid'},
                    '.border-b-solid': {'border-bottom-style': 'solid'},
                    '.border-l-solid': {'border-left-style': 'solid'},
                    '.border-t-dashed': {'border-top-style': 'dashed'},
                    '.border-r-dashed': {'border-right-style': 'dashed'},
                    '.border-b-dashed': {'border-bottom-style': 'dashed'},
                    '.border-l-dashed': {'border-left-style': 'dashed'},
                    '.border-t-dotted': {'border-top-style': 'dotted'},
                    '.border-r-dotted': {'border-right-style': 'dotted'},
                    '.border-b-dotted': {'border-bottom-style': 'dotted'},
                    '.border-l-dotted': {'border-left-style': 'dotted'},
                },
                ['responsive']
            );
        },
    ],
};
