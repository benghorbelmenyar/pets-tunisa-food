import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    host: true,
    allowedHosts: [
  'five-secondary-que-ace.trycloudflare.com',
  'colony-frequent-dan-universe.trycloudflare.com',
  'localhost'
],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})