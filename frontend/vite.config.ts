import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Em desenvolvimento (npm run dev), o Vite roda em outra porta que o backend
    // FastAPI (8000). Este proxy redireciona /api/* para o backend local, evitando
    // problemas de CORS e mantendo o mesmo caminho usado em produção (via Nginx).
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
