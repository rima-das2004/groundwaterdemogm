// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 👇 Use relative paths for production
  base: './',

  plugins: [react()],

  build: {
    target: 'esnext',
    outDir: 'dist',
    chunkSizeWarningLimit: 1000
  },

  server: {
    port: 3000,
    open: true
  },

  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
