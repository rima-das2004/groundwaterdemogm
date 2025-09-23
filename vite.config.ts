import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 👇 Very important for Vercel (ensures correct asset paths)
  base: '/',

  plugins: [react()],

  build: {
    target: 'esnext',      // Modern output
    outDir: 'dist',        // Default folder Vercel expects
    chunkSizeWarningLimit: 1000 // Optional: raises warning limit to avoid big-chunk warnings
  },

  server: {
    port: 3000,            // Local dev port
    open: true             // Opens browser automatically on `npm run dev`
  },

  resolve: {
    alias: {
      '@': '/src'          // Example alias if you use @ imports
    }
  }
})
