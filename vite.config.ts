// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// Importaciones nativas de Node para resolver rutas en ESM
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Mapea el alias '@' a la carpeta 'src'
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // (Opcional) Puedes crear alias más específicos para tu nueva arquitectura
      '@components': fileURLToPath(new URL('./src/components/', import.meta.url)),
      '@templates': fileURLToPath(new URL('./src/components/templates/', import.meta.url)),
      '@ui': fileURLToPath(new URL('./src/components/ui', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      // Agregar las features de las funcionalidades de cada pagina.
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@features/about': fileURLToPath(new URL('./src/features/about', import.meta.url))
    }
  }
})