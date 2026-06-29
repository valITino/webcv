/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Case-file / film-noir palette
        ink: '#0c0b09',        // near-black background
        coal: '#15130f',
        paper: '#e8e2d4',      // aged document paper
        paperdark: '#cabd9f',
        sepia: '#d8c7a0',
        lamp: '#ffebb3',       // warm desk-lamp glow (from reference)
        brass: '#d2ac41',      // desk hardware / accents
        evidence: '#c0392b',   // evidence-string / stamp red
        redink: '#ff2a2a',
        cyber: '#2cc9ff',      // terminal cyan accent
        olive: '#6b6a3a',
      },
      fontFamily: {
        headline: ['"Playfair Display"', 'serif'],
        type: ['"Special Elite"', '"Courier New"', 'monospace'],
        stencil: ['Oswald', 'Impact', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.35em',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.65' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.85' },
          '97%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        stampin: {
          '0%': { transform: 'scale(2.4) rotate(-18deg)', opacity: '0' },
          '60%': { opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-12deg)', opacity: '1' },
        },
      },
      animation: {
        flicker: 'flicker 6s infinite',
        scan: 'scan 6s linear infinite',
        blink: 'blink 1.1s step-end infinite',
        stampin: 'stampin 0.5s cubic-bezier(.2,1.4,.4,1) forwards',
      },
    },
  },
  plugins: [],
}
