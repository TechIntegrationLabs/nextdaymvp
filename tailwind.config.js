/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif']
      },
      colors: {
        custom: {
          blue: '#36a3ec'
        }
      },
      animation: {
        'progress-indeterminate': 'progress-indeterminate 1.5s ease-in-out infinite',
        'pulse-down': 'pulse-down 2s infinite ease-in-out',
      },
      keyframes: {
        'progress-indeterminate': {
          '0%': { 'transform': 'translateX(-100%)' },
          '100%': { 'transform': 'translateX(100%)' }
        },
        'pulse-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' }
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'white',
            a: {
              color: '#36a3ec',
              '&:hover': {
                color: '#60aef0',
              },
            },
            h1: {
              color: '#36a3ec',
            },
            h2: {
              color: '#36a3ec',
            },
            h3: {
              color: '#36a3ec',
            },
            strong: {
              color: 'white',
            },
            code: {
              color: 'white',
            },
            blockquote: {
              color: '#e2e8f0',
              borderLeftColor: '#36a3ec',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
