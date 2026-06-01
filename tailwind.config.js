/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Brand ── */
        primary:      '#0051D5',
        primaryHover: '#316BF3',
        primaryLight: '#EFF6FF',

        /* ── Semantic ── */
        success:      '#006947',
        successLight: 'rgba(0,105,71,0.10)',
        danger:       '#BA1A1A',
        dangerLight:  'rgba(186,26,26,0.10)',

        /* ── Text ── */
        textPrimary:   '#191C1E',
        textSecondary: '#424754',

        /* ── Surfaces ── */
        appBg:  '#F2F4F6',
        border: '#E5E7EB',
        inputBorder: '#DCE0E5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { transform: 'translateX(-8px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
