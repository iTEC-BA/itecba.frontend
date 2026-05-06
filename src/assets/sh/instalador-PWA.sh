#!/usr/bin/env bash
# =============================================================================
#  iTEC BA — PWA Setup Script
#  Convierte el proyecto en una Progressive Web App instalable
#  Ejecutar desde la RAÍZ del proyecto: bash setup-pwa.sh
# =============================================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()   { echo -e "${CYAN}[iTEC PWA]${NC} $1"; }
ok()    { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo -e "${RED}██╗████████╗███████╗ ██████╗${NC}"
echo -e "${RED}██║╚══██╔══╝██╔════╝██╔════╝${NC}"
echo -e "${RED}██║   ██║   █████╗  ██║${NC}"
echo -e "${RED}██║   ██║   ██╔══╝  ██║${NC}"
echo -e "${RED}██║   ██║   ███████╗╚██████╗${NC}"
echo -e "${RED}╚═╝   ╚═╝   ╚══════╝ ╚═════╝${NC}"
echo -e "${CYAN}  PWA Setup — UTN FRBA${NC}"
echo ""

# ─── 0. VERIFICACIONES PREVIAS ──────────────────────────────────────────────
log "Verificando entorno..."
[ ! -f "package.json" ] && error "Ejecutá este script desde la raíz del proyecto."
command -v node >/dev/null 2>&1 || error "Node.js no encontrado."
command -v npm  >/dev/null 2>&1 || error "npm no encontrado."
ok "Entorno verificado."

# ─── 1. INSTALAR DEPENDENCIA: vite-plugin-pwa ───────────────────────────────
log "Instalando vite-plugin-pwa y workbox-window..."
npm install --save-dev vite-plugin-pwa workbox-window
ok "Dependencias PWA instaladas."

# ─── 2. BACKUP vite.config.ts ───────────────────────────────────────────────
log "Haciendo backup de vite.config.ts..."
cp vite.config.ts vite.config.ts.bak
ok "Backup guardado en vite.config.ts.bak"

# ─── 3. REESCRIBIR vite.config.ts ───────────────────────────────────────────
log "Configurando vite.config.ts con PWA plugin..."
cat > vite.config.ts << 'VITE_EOF'
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
VITE_EOF
ok "vite.config.ts actualizado."

# ─── 4. ACTUALIZAR index.html ────────────────────────────────────────────────
log "Actualizando index.html con meta tags PWA..."
cp index.html index.html.bak

cat > index.html << 'HTML_EOF'
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />

    <!-- ── Viewport & Mobile ──────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

    <!-- ── PWA Meta Tags ──────────────────────────────────────────────── -->
    <meta name="theme-color" content="#1A1A1A" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="iTEC BA" />
    <meta name="application-name" content="iTEC BA" />
    <meta name="msapplication-TileColor" content="#1A1A1A" />
    <meta name="msapplication-TileImage" content="/icons/pwa-192.png" />

    <!-- ── SEO ────────────────────────────────────────────────────────── -->
    <meta name="description" content="La plataforma estudiantil de la UTN Buenos Aires. Cursos, recursos, grupos y más." />
    <meta name="keywords" content="UTN, FRBA, iTEC, estudiantes, cursos, recursos, campus" />
    <meta name="author" content="iTEC BA" />

    <!-- ── Open Graph ─────────────────────────────────────────────────── -->
    <meta property="og:title" content="iTEC BA — UTN FRBA" />
    <meta property="og:description" content="La plataforma estudiantil de la UTN Buenos Aires." />
    <meta property="og:image" content="/icons/pwa-512.png" />
    <meta property="og:type" content="website" />

    <!-- ── Icons ──────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" sizes="64x64"   href="/icons/pwa-64.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/pwa-192.png" />
    <link rel="apple-touch-icon"      sizes="180x180" href="/icons/apple-touch-icon.png" />

    <!-- ── Safe area (iPhone con notch / Dynamic Island) ─────────────── -->
    <style>
      :root {
        --sat: env(safe-area-inset-top);
        --sab: env(safe-area-inset-bottom);
        --sal: env(safe-area-inset-left);
        --sar: env(safe-area-inset-right);
      }
      body {
        padding-top:    env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
        padding-left:   env(safe-area-inset-left);
        padding-right:  env(safe-area-inset-right);
      }
    </style>

    <title>iTEC BA — UTN FRBA</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HTML_EOF
ok "index.html actualizado."

# ─── 5. CREAR HOOK useInstallPWA ────────────────────────────────────────────
log "Creando hook useInstallPWA..."
mkdir -p src/hooks
cat > src/hooks/useInstallPWA.ts << 'HOOK_EOF'
// src/hooks/useInstallPWA.ts
// Hook para manejar el prompt de instalación de la PWA
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

export const useInstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled]     = useState(false);
  const [isInstalling, setIsInstalling]   = useState(false);

  useEffect(() => {
    // Detectar si ya está instalada (modo standalone)
    const mq = window.matchMedia('(display-mode: standalone)');
    setIsInstalled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
    mq.addEventListener('change', onChange);

    // Capturar el evento beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Detectar instalación completada
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      mq.removeEventListener('change', onChange);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return false;
    setIsInstalling(true);
    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        return true;
      }
    } finally {
      setIsInstalling(false);
    }
    return false;
  };

  // canInstall: hay prompt disponible Y no está instalada
  const canInstall = !!installPrompt && !isInstalled;

  return { canInstall, isInstalled, isInstalling, install };
};
HOOK_EOF
ok "Hook useInstallPWA creado."

# ─── 6. CREAR COMPONENTE InstallPWABanner ───────────────────────────────────
log "Creando componente InstallPWABanner..."
mkdir -p src/components/molecules
cat > src/components/molecules/InstallPWABanner.tsx << 'BANNER_EOF'
// src/components/molecules/InstallPWABanner.tsx
// Banner de instalación PWA — estilo iTEC (rojo/negro)
import React, { useState } from 'react';
import { useInstallPWA } from '@hooks/useInstallPWA';

export const InstallPWABanner: React.FC = () => {
  const { canInstall, isInstalling, install } = useInstallPWA();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div
      role="banner"
      className="fixed bottom-0 left-0 right-0 z-[9999] flex items-center gap-3 px-4 py-3
                 bg-[#1A1A1A] border-t border-[#D41313]/40 shadow-[0_-4px_24px_rgba(212,19,19,0.15)]
                 sm:bottom-4 sm:left-4 sm:right-auto sm:rounded-xl sm:max-w-sm sm:border sm:border-[#D41313]/40"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      {/* Ícono */}
      <div className="shrink-0 w-10 h-10 rounded-lg bg-[#D41313]/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#D41313]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v13M8 11l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-white leading-tight">
          Instalá iTEC BA
        </p>
        <p className="text-[11px] text-[#9aa3b0] mt-0.5">
          Accedé como una app, sin navegador
        </p>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setDismissed(true)}
          aria-label="Cerrar"
          className="p-1.5 rounded-lg text-[#5a6475] hover:text-white hover:bg-[#333] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
          </svg>
        </button>

        <button
          onClick={install}
          disabled={isInstalling}
          className="px-3 py-1.5 rounded-lg bg-[#D41313] hover:bg-[#b30f0f] active:scale-95
                     text-white text-[12px] font-semibold transition-all disabled:opacity-60
                     disabled:cursor-not-allowed"
        >
          {isInstalling ? 'Instalando...' : 'Instalar'}
        </button>
      </div>
    </div>
  );
};
BANNER_EOF
ok "Componente InstallPWABanner creado."

# ─── 7. CREAR COMPONENTE UpdatePWAToast ─────────────────────────────────────
log "Creando componente UpdatePWAToast..."
cat > src/components/molecules/UpdatePWAToast.tsx << 'UPDATE_EOF'
// src/components/molecules/UpdatePWAToast.tsx
// Notificación de nueva versión disponible
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const UpdatePWAToast: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('[iTEC PWA] Service Worker registrado:', r);
    },
    onRegisterError(error) {
      console.error('[iTEC PWA] Error al registrar SW:', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 py-3
                    bg-[#1A1A1A] border border-[#D41313]/40 rounded-xl shadow-xl
                    animate-fade-in max-w-[calc(100vw-2rem)]">
      {/* Ícono */}
      <div className="shrink-0 w-8 h-8 rounded-lg bg-[#D41313]/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#D41313]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-white">Nueva versión disponible</p>
        <p className="text-[10px] text-[#9aa3b0]">Recargá para actualizar iTEC BA</p>
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setNeedRefresh(false)}
          className="px-2 py-1 rounded text-[11px] text-[#5a6475] hover:text-white transition-colors"
        >
          Más tarde
        </button>
        <button
          onClick={() => updateServiceWorker(true)}
          className="px-3 py-1.5 rounded-lg bg-[#D41313] hover:bg-[#b30f0f] text-white text-[11px] font-semibold transition-all active:scale-95"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
};
UPDATE_EOF
ok "Componente UpdatePWAToast creado."

# ─── 8. CREAR DIRECTORIO DE ÍCONOS Y PLACEHOLDER ────────────────────────────
log "Creando directorio public/icons con instrucciones..."
mkdir -p public/icons public/screenshots

cat > public/icons/README.md << 'ICONS_EOF'
# Íconos PWA — iTEC BA

Generá estos archivos con tu logo (public/logo.png) usando:
  npx pwa-asset-generator logo.png ./public/icons --background "#1A1A1A" --padding "10%"

O manualmente, necesitás:

| Archivo                  | Tamaño    | Uso                             |
|--------------------------|-----------|----------------------------------|
| pwa-64.png               | 64×64     | Favicon                         |
| pwa-192.png              | 192×192   | Android home screen             |
| pwa-512.png              | 512×512   | Splash screen / store           |
| pwa-512-maskable.png     | 512×512   | Android adaptive icon           |
| apple-touch-icon.png     | 180×180   | iOS home screen                 |
| shortcut-tarjetec.png    | 96×96     | Shortcut TarjeTEC               |
| shortcut-buscatec.png    | 96×96     | Shortcut BuscaTEC               |
| shortcut-cursos.png      | 96×96     | Shortcut Cursos                 |

Screenshots:
  screenshots/mobile.png  — 390×844 — Captura de pantalla del home
ICONS_EOF

# Generar íconos automáticamente si existe el logo
if [ -f "public/logo.png" ]; then
  log "Logo encontrado. Intentando generar íconos automáticamente..."
  if npx pwa-asset-generator public/logo.png public/icons \
      --background "#1A1A1A" \
      --padding "15%" \
      --favicon \
      --maskable \
      --type png 2>/dev/null; then
    ok "Íconos generados automáticamente."
  else
    warn "No se pudieron generar íconos automáticamente. Seguí las instrucciones en public/icons/README.md"
  fi
else
  warn "No se encontró public/logo.png. Seguí las instrucciones en public/icons/README.md"
fi

# ─── 9. AGREGAR TIPO VIRTUAL PARA TypeScript ────────────────────────────────
log "Agregando tipos de vite-plugin-pwa para TypeScript..."
cat > src/vite-pwa.d.ts << 'TS_EOF'
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />
TS_EOF
ok "Tipos TypeScript agregados."

# ─── 10. PATCH App.tsx — Agregar los componentes PWA ────────────────────────
log "Verificando si App.tsx necesita los componentes PWA..."

# Solo patchea si los componentes no están ya importados
if ! grep -q "InstallPWABanner\|UpdatePWAToast" src/App.tsx 2>/dev/null; then
  warn "App.tsx no incluye los componentes PWA todavía."
  echo ""
  echo -e "${YELLOW}──────────────────────────────────────────────────────${NC}"
  echo -e "${YELLOW}  PASO MANUAL REQUERIDO — Editar src/App.tsx${NC}"
  echo -e "${YELLOW}──────────────────────────────────────────────────────${NC}"
  echo ""
  echo "  1. Agregá estos imports al inicio de src/App.tsx:"
  echo ""
  echo -e "     ${CYAN}import { InstallPWABanner } from '@components/molecules/InstallPWABanner';${NC}"
  echo -e "     ${CYAN}import { UpdatePWAToast }  from '@components/molecules/UpdatePWAToast';${NC}"
  echo ""
  echo "  2. Agregá los componentes dentro del <AuthProvider>, antes del cierre:"
  echo ""
  echo -e "     ${CYAN}<InstallPWABanner />${NC}"
  echo -e "     ${CYAN}<UpdatePWAToast />${NC}"
  echo ""
  echo "  Ejemplo del bloque final de App.tsx:"
  echo ""
  cat << 'EXAMPLE_EOF'
     return (
       <AuthProvider>
         <BrowserRouter>
           <Suspense fallback={<LoadingState />}>
             <Routes>
               {/* ... tus rutas ... */}
             </Routes>
           </Suspense>
         </BrowserRouter>
         <InstallPWABanner />
         <UpdatePWAToast />
       </AuthProvider>
     );
EXAMPLE_EOF
  echo -e "${YELLOW}──────────────────────────────────────────────────────${NC}"
  echo ""
else
  ok "App.tsx ya incluye los componentes PWA."
fi

# ─── 11. VERIFICAR Y PATCHEAR index.css / global CSS ────────────────────────
log "Asegurando estilos móviles en el CSS global..."

GLOBAL_CSS=""
for f in src/index.css src/App.css src/styles/global.css; do
  [ -f "$f" ] && GLOBAL_CSS="$f" && break
done

MOBILE_PATCH='
/* ── iTEC PWA: Mobile-first & Safe Areas ──────────────────────────── */
html, body, #root {
  height: 100%;
  overflow-x: hidden;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* Scroll suave en iOS */
* { -webkit-overflow-scrolling: touch; }

/* Evitar zoom en inputs en iOS */
input, select, textarea {
  font-size: max(16px, 1em);
}

/* Área segura para iPhone con notch */
.safe-top    { padding-top:    env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-left   { padding-left:   env(safe-area-inset-left); }
.safe-right  { padding-right:  env(safe-area-inset-right); }

/* Ocultar scrollbar en sidebar (mantiene funcionalidad) */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Smooth scroll global */
html { scroll-behavior: smooth; }
'

if [ -n "$GLOBAL_CSS" ]; then
  if ! grep -q "iTEC PWA: Mobile-first" "$GLOBAL_CSS"; then
    echo "$MOBILE_PATCH" >> "$GLOBAL_CSS"
    ok "Estilos móviles agregados a $GLOBAL_CSS"
  else
    ok "Estilos móviles ya presentes en $GLOBAL_CSS"
  fi
else
  warn "No se encontró CSS global. Creando src/styles/mobile-pwa.css..."
  mkdir -p src/styles
  echo "$MOBILE_PATCH" > src/styles/mobile-pwa.css
  echo ""
  warn "Importá manualmente en tu entry point:"
  echo -e "  ${CYAN}import './styles/mobile-pwa.css'${NC}"
fi

# ─── 12. VERIFICAR tailwind.config.js — Safe area plugin ────────────────────
log "Verificando tailwind.config.js..."
if grep -q "tailwindcss-safe-area\|safe-area" tailwind.config.js 2>/dev/null; then
  ok "Safe area ya configurado en Tailwind."
else
  warn "Para usar safe area con clases Tailwind (pb-safe, pt-safe), instalá el plugin:"
  echo -e "  ${CYAN}npm install --save-dev tailwindcss-safe-area${NC}"
  echo ""
  echo "  Y en tailwind.config.js, agregá en plugins:"
  echo -e "  ${CYAN}require('tailwindcss-safe-area')${NC}"
fi

# ─── 13. VERIFICAR DEEPLINKS / .htaccess para historyAPI ────────────────────
log "Creando public/_redirects para hosting (Netlify / Vercel)..."
cat > public/_redirects << 'REDIR_EOF'
/* /index.html 200
REDIR_EOF

cat > public/vercel.json << 'VERCEL_EOF'
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
VERCEL_EOF
ok "Reglas de redirects creadas para Netlify y Vercel."

# ─── 14. RESUMEN FINAL ───────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅  iTEC BA PWA — Setup completado${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}Archivos creados/modificados:${NC}"
echo "   • vite.config.ts          — Plugin PWA + Workbox configurado"
echo "   • index.html              — Meta tags PWA + safe-area"
echo "   • src/hooks/useInstallPWA.ts"
echo "   • src/components/molecules/InstallPWABanner.tsx"
echo "   • src/components/molecules/UpdatePWAToast.tsx"
echo "   • src/vite-pwa.d.ts       — Tipos TypeScript"
echo "   • public/icons/README.md  — Instrucciones de íconos"
echo "   • public/_redirects       — Para Netlify"
echo "   • public/vercel.json      — Para Vercel"
echo ""
echo -e "  ${YELLOW}Próximos pasos:${NC}"
echo "   1. Generá los íconos: npx pwa-asset-generator public/logo.png public/icons"
echo "   2. Editá App.tsx para agregar <InstallPWABanner /> y <UpdatePWAToast />"
echo "   3. npm run dev  →  abrí en Chrome → F12 → Application → Service Workers"
echo "   4. npm run build && npm run preview  →  testeá la instalación completa"
echo ""
echo -e "  ${CYAN}En móvil:${NC} Chrome Android → menú ⋮ → 'Agregar a pantalla de inicio'"
echo -e "  ${CYAN}En iOS:${NC}  Safari → compartir □↑ → 'Agregar a pantalla de inicio'"
echo ""
