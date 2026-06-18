/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta exata do tema Gruvbox Material em uso neste computador
        // (~/.config/omarchy/current/theme/colors.toml), a mesma do wallpaper com os
        // triangulos coloridos -- fundo quente e escuro, em vez do preto puro anterior.
        surface: {
          950: '#1d2021',
          900: '#282828',
          800: '#3c3836',
          700: '#504945',
          600: '#665c54',
        },
        // Acento principal (links, foco, destaque de cidade) = "accent" do tema.
        accent: {
          DEFAULT: '#7daea3',
          soft: '#89b482',
        },
        // Texto secundario quente (em vez de branco com opacidade).
        muted: '#a89984',
        // Cores vivas do Gruvbox, usadas para colorir cada parametro meteorologico e os
        // triangulos decorativos inspirados no wallpaper.
        gruvbox: {
          red: '#ea6962',
          green: '#a9b665',
          yellow: '#d8a657',
          blue: '#7daea3',
          purple: '#d3869b',
          aqua: '#89b482',
          orange: '#d65d0e',
          fg: '#d4be98',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'fade-in-up': {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
