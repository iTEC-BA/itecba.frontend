// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'favicon.ico', 'apple-touch-icon.png', '*.png'],
      // ── Manifest ──────────────────────────────────────────────────────────
      manifest: {
        name: 'iTEC BA — UTN FRBA',
        short_name: 'iTEC BA',
        description: 'La plataforma estudiantil de UTN Buenos Aires',
        theme_color: '#1A1A1A',
        background_color: '#1A1A1A',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'es',
        categories: ['education', 'utilities'],
        icons: [
          {
            src: '/icons/pwa-64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/pwa-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        // ── Shortcuts (accesos rápidos al instalar) ───────────────────────
        shortcuts: [
          {
            name: 'TarjeTEC',
            url: '/perfil',
            description: 'Mi tarjeta de estudiante',
            icons: [{ src: '/icons/shortcut-tarjetec.png', sizes: '96x96' }],
          },
          {
            name: 'BuscaTEC',
            url: '/buscatec',
            description: 'Buscar materias',
            icons: [{ src: '/icons/shortcut-buscatec.png', sizes: '96x96' }],
          },
          {
            name: 'Cursos',
            url: '/cursos',
            description: 'Cursos estudiantiles',
            icons: [{ src: '/icons/shortcut-cursos.png', sizes: '96x96' }],
          },
        ],
        // ── Screenshots para Google Play / iOS install prompt ─────────────
        screenshots: [
          {
            src: '/screenshots/mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Home de iTEC BA',
          },
        ],
      },
      // ── Workbox: estrategia de caché ──────────────────────────────────────
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Cache-first para assets estáticos
        runtimeCaching: [
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          // API del backend (Network-first para datos frescos)
          {
            urlPattern: /^https:\/\/.*\.itec\.ba\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 5 },
              networkTimeoutSeconds: 10,
            },
          },
          // Supabase + Firebase (StaleWhileRevalidate)
          {
            urlPattern: /^https:\/\/(.*\.supabase\.co|.*\.firebaseio\.com)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'backend-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
            },
          },
          // Imágenes
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      // Muestra el prompt de actualización
      devOptions: {
        enabled: true, // También activa PWA en dev para testear
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@features':   fileURLToPath(new URL('./src/features', import.meta.url)),
      '@pages':      fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@assets':     fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@hooks':      fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@services':   fileURLToPath(new URL('./src/services', import.meta.url)),
      '@context':    fileURLToPath(new URL('./src/context', import.meta.url)),
      '@lib':        fileURLToPath(new URL('./src/lib', import.meta.url)),
      '@data':       fileURLToPath(new URL('./src/data', import.meta.url)),
    },
  },
})
