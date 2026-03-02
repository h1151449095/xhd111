import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/vps-api': {
        target: 'http://158.178.232.80:39217',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vps-api/, '/api')
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
