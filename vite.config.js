import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/mtg/',
  plugins: [react()],
  server: {
    proxy: {
      '/archidekt-api': {
        target: 'https://archidekt.com/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/archidekt-api/, ''),
      },
    },
  },
})
