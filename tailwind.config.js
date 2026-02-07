/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rose & Cream theme colors
        primary: {
          50: '#fff1f2',   // Rose 50 - subtle backgrounds
          100: '#ffe4e6',  // Rose 100
          200: '#fecdd3',  // Rose 200
          300: '#fda4af',  // Rose 300
          400: '#fb7185',  // Rose 400
          500: '#f43f5e',  // Rose 500
          600: '#e11d48',  // Rose 600 - primary CTAs and active states
          700: '#be123c',  // Rose 700
          800: '#9f1239',  // Rose 800
          900: '#881337',  // Rose 900
        },
        cream: {
          50: '#fefcf3',   // Cream 50
          100: '#fef7e0',  // Cream 100
          200: '#fdecc8',  // Cream 200
          300: '#fbdba7',  // Cream 300
          400: '#f7c27a',  // Cream 400
          500: '#f2a54a',  // Cream 500
          600: '#e88c30',  // Cream 600
          700: '#d97706',  // Cream 700
          800: '#b45309',  // Cream 800
          900: '#92400e',  // Cream 900
        },
        text: {
          primary: '#1e293b',   // Slate 800 - primary text
          secondary: '#64748b', // Slate 500 - secondary text
          muted: '#94a3b8',     // Slate 400 - muted text
        }
      },
      // Mobile-first breakpoints
      screens: {
        'xs': '360px',   // Baseline mobile width
        'sm': '640px',   // Small tablets
        'md': '768px',   // Tablets
        'lg': '1024px',  // Desktop
        'xl': '1280px',  // Large desktop
        '2xl': '1536px', // Extra large desktop
      },
      // Touch-friendly sizing
      minHeight: {
        'touch': '48px', // Minimum touch target height
      },
      minWidth: {
        'touch': '48px', // Minimum touch target width
      },
      // Custom border radius for design system
      borderRadius: {
        'card': '1.5rem',  // 24px for cards
        'button': '9999px', // Full rounded for primary buttons
      },
      // Custom spacing for mobile-optimized layouts
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      }
    },
  },
  plugins: [],
}