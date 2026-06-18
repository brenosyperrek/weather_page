/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta neutra e quase-preta, inspirada nas paginas de produto da Apple no
        // modo escuro (apple.com/macbook-pro, keynote): preto profundo de fundo,
        // cinzas neutros para os cards de vidro.
        surface: {
          950: '#000000',
          900: '#0a0a0c',
          800: '#141417',
          700: '#1f1f23',
          600: '#2c2c30',
        },
        // Azul "Apple system blue", usado como cor de acento principal (links, botoes,
        // marcador ativo no globo).
        accent: {
          DEFAULT: '#0a84ff',
          soft: '#5ac8fa',
        },
      },
      fontFamily: {
        // -apple-system / BlinkMacSystemFont fazem o navegador usar a fonte do sistema
        // (San Francisco) em Mac/iOS; Inter e o fallback para outras plataformas.
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
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
