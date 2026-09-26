/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rail: {
          base: '#14171C',        // Background base: Graphite
          dark: '#14171C',        // Background base: Graphite
          subtle: '#181C22',      // Subtle secondary surface
          card: '#1B1F26',        // Panel/card surface: Charcoal Panel
          cardHover: '#21262E',   // Card hover state
          raised: '#21262E',      // Raised surface: Steel Panel (primary focal element)
          border: '#2E343D',      // Border/hairline: Graphite Line (1px, flat, no glow)
          borderLight: '#3D4450', // Slightly lighter hairline for focus/focal borders
          muted: '#8A8F98',       // Secondary text: Instrument Grey
          text: '#E8E6DF',        // Primary text: Warm Signal White
          
          // Functional Railway Signal Colors (Desaturated / Matte)
          emerald: '#4F9A6E',     // Clear / healthy / available: Signal Green (muted)
          amber: '#C99A3B',       // Caution / scheduled maintenance: Signal Amber (muted)
          orange: '#C97A3B',      // Active block / medium risk: Signal Orange (muted)
          red: '#B4453F',         // Danger / critical conflict: Signal Red (muted)
          ai: '#5B7FA6',          // AI / primary interactive accent: Steel Blue (muted)
          cyan: '#5B7FA6',        // Mapped to Steel Blue (replaces old neon cyan)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        none: 'none',
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        inner: 'none',
      },
      dropShadow: {
        none: 'none',
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
      },
    },
  },
  plugins: [],
}

