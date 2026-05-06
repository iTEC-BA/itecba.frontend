// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias base
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      
      // Alias de Arquitectura Principal
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@context': fileURLToPath(new URL('./src/context', import.meta.url)),
      '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url))
    }
  }
})