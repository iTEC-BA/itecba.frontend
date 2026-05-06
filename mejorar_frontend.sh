#!/usr/bin/env bash
# =============================================================================
# mejorar_frontend.sh
# Script de auditoría y mejora del frontend iTEC BA
# Ejecutar desde la raíz del proyecto: bash mejorar_frontend.sh
# =============================================================================

set -euo pipefail

# ── Colores ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Archivo de reporte ────────────────────────────────────────────────────────
REPORT="reporte_mejora_frontend.txt"
> "$REPORT"  # Limpiar reporte anterior

log()    { echo -e "$1"; echo "$1" | sed 's/\x1b\[[0-9;]*m//g' >> "$REPORT"; }
ok()     { log "${GREEN}  ✔ $1${RESET}"; }
warn()   { log "${YELLOW}  ⚠ $1${RESET}"; }
err()    { log "${RED}  ✖ $1${RESET}"; }
title()  { log "\n${BOLD}${BLUE}══════════════════════════════════════════${RESET}"; log "${BOLD}${CYAN}  $1${RESET}"; log "${BOLD}${BLUE}══════════════════════════════════════════${RESET}"; }
section(){ log "\n${BOLD}── $1 ──${RESET}"; }

# ─────────────────────────────────────────────────────────────────────────────
title "🚀 mejorar_frontend.sh — Auditoría iTEC BA"
log "Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
log "Directorio raíz: $(pwd)"
# ─────────────────────────────────────────────────────────────────────────────


# =============================================================================
# 1. VERIFICAR Y CREAR ESTRUCTURA DE CARPETAS
# =============================================================================
title "1. Estructura de carpetas (Feature-Driven + Atomic Design)"

REQUIRED_DIRS=(
  "src/features"
  "src/components/atoms"
  "src/components/molecules"
  "src/components/organisms"
  "src/components/templates"
  "src/pages"
  "src/hooks"
  "src/services"
  "src/types"
  "src/context"
  "src/lib"
  "src/data"
  "src/assets"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    ok "$dir → existe"
  else
    mkdir -p "$dir"
    warn "$dir → NO existía — creado automáticamente"
  fi
done


# =============================================================================
# 2. AUDITAR IMPORTS RELATIVOS LARGOS
# =============================================================================
title "2. Auditoría de imports relativos largos (../../../)"

section "Archivos con imports ../../.. o más profundos"

DEEP_IMPORTS=()
while IFS= read -r -d '' file; do
  if grep -qP '\.\.(/\.\.){2,}' "$file" 2>/dev/null; then
    DEEP_IMPORTS+=("$file")
  fi
done < <(find src -type f \( -name "*.tsx" -o -name "*.ts" \) -print0 2>/dev/null)

if [ ${#DEEP_IMPORTS[@]} -eq 0 ]; then
  ok "No se encontraron imports con 3+ niveles relativos. ¡Aliases bien usados!"
else
  for f in "${DEEP_IMPORTS[@]}"; do
    warn "Import largo en: $f"
    grep -nP '\.\.(/\.\.){2,}' "$f" | while IFS= read -r line; do
      log "    ${YELLOW}$line${RESET}"
    done
  done
  log ""
  warn "Sugerencia: reemplazar rutas largas con aliases ya definidos:"
  log "    @components  →  src/components"
  log "    @features    →  src/features"
  log "    @pages       →  src/pages"
  log "    @hooks       →  src/hooks"
  log "    @services    →  src/services"
  log "    @context     →  src/context"
  log "    @lib         →  src/lib"
  log "    @data        →  src/data"
fi

section "Verificando aliases en vite.config.ts y tsconfig.app.json"

ALIASES=("@components" "@features" "@pages" "@hooks" "@services" "@context" "@lib" "@data" "@assets")
VITE_CONFIG="vite.config.ts"
TS_CONFIG="tsconfig.app.json"

for alias in "${ALIASES[@]}"; do
  if [ -f "$VITE_CONFIG" ] && grep -q "$alias" "$VITE_CONFIG"; then
    ok "$alias configurado en $VITE_CONFIG"
  else
    err "$alias NO encontrado en $VITE_CONFIG"
  fi
done


# =============================================================================
# 3. DETECTAR PÁGINAS SIN LAZY LOADING
# =============================================================================
title "3. Detección de páginas sin React.lazy()"

section "Páginas registradas en App.tsx vs lazy()"

APP_FILE="src/App.tsx"
PAGES_DIR="src/pages"

if [ ! -f "$APP_FILE" ]; then
  err "No se encontró $APP_FILE"
else
  # Listar archivos de páginas
  PAGES_WITHOUT_LAZY=()
  while IFS= read -r -d '' page_file; do
    page_name=$(basename "$page_file" | sed 's/\.\(tsx\|ts\|jsx\|js\)$//')
    if ! grep -q "lazy.*$page_name\|$page_name.*lazy" "$APP_FILE" 2>/dev/null; then
      PAGES_WITHOUT_LAZY+=("$page_name")
    fi
  done < <(find "$PAGES_DIR" -maxdepth 1 -type f \( -name "*.tsx" -o -name "*.ts" \) -print0 2>/dev/null)

  if [ ${#PAGES_WITHOUT_LAZY[@]} -eq 0 ]; then
    ok "Todas las páginas están usando React.lazy() en App.tsx"
  else
    for page in "${PAGES_WITHOUT_LAZY[@]}"; do
      warn "Sin lazy(): $page"
    done
    log ""
    warn "Patrón recomendado para agregar lazy loading:"
    log '    const MiPagina = lazy(() => import("@pages/MiPagina").then(m => ({ default: m.MiPagina })));'
    log '    <Route path="/ruta" element={<Suspense fallback={<LoadingState />}><MiPagina /></Suspense>} />'
  fi
fi

section "Verificando uso de <Suspense> en App.tsx"
if grep -q "Suspense" "$APP_FILE" 2>/dev/null; then
  ok "<Suspense> encontrado en App.tsx"
else
  err "<Suspense> NO encontrado en App.tsx — las páginas lazy pueden romperse"
fi


# =============================================================================
# 4. DETECTAR SIDEBAR NO RESPONSIVE
# =============================================================================
title "4. Auditoría de responsividad del Sidebar"

SIDEBAR_FILES=$(find src -type f \( -name "*.tsx" -o -name "*.ts" \) | xargs grep -l -i "sidebar\|Sidebar" 2>/dev/null || true)

if [ -z "$SIDEBAR_FILES" ]; then
  err "No se encontraron archivos relacionados con Sidebar"
else
  section "Archivos relacionados con Sidebar"
  for f in $SIDEBAR_FILES; do
    log "  📄 $f"
  done

  section "Verificando toggle/isOpen para mobile"
  HAS_TOGGLE=false
  HAS_ISOPEN=false
  HAS_HAMBURGER=false
  HAS_DRAWER=false
  HAS_OVERLAY=false

  for f in $SIDEBAR_FILES; do
    grep -q "isOpen\|toggleSidebar\|useSidebarMobile\|toggle" "$f" 2>/dev/null && HAS_TOGGLE=true && HAS_ISOPEN=true
    grep -q "hamburger\|MenuIcon\|≡\|☰\|strokeLinecap" "$f" 2>/dev/null && HAS_HAMBURGER=true
    grep -q "translate-x\|drawer\|-translate-x" "$f" 2>/dev/null && HAS_DRAWER=true
    grep -q "overlay\|backdrop\|inset-0.*fixed\|fixed.*inset-0" "$f" 2>/dev/null && HAS_OVERLAY=true
  done

  $HAS_TOGGLE   && ok "Estado isOpen/toggle detectado" || err "No se detectó estado toggle para mobile"
  $HAS_HAMBURGER && ok "Botón hamburguesa detectado" || warn "No se detectó botón hamburguesa (puede estar en TopNavbar)"
  $HAS_DRAWER   && ok "Animación drawer (translate-x) detectada" || warn "No se detectó clase translate-x para drawer mobile"
  $HAS_OVERLAY  && ok "Overlay/backdrop detectado" || warn "No se detectó overlay para cerrar el drawer al tocar fuera"

  section "Verificando clases responsive en Sidebar"
  for f in $SIDEBAR_FILES; do
    if grep -q "hidden md:flex\|md:block\|sm:flex\|lg:flex" "$f" 2>/dev/null; then
      ok "Clases responsive (md:/lg:) encontradas en: $f"
    else
      warn "Sin clases responsive detectadas en: $f"
    fi
  done
fi


# =============================================================================
# 5. AUDITORÍA ADICIONAL: ATOMIC DESIGN
# =============================================================================
title "5. Auditoría de Atomic Design por feature"

section "Verificando estructura atoms/molecules/organisms en cada feature"
if [ -d "src/features" ]; then
  for feature_dir in src/features/*/; do
    feature_name=$(basename "$feature_dir")
    has_atoms=$([ -d "${feature_dir}components/atoms" ] && echo "✔" || echo "✖")
    has_molecules=$([ -d "${feature_dir}components/molecules" ] && echo "✔" || echo "~")
    has_organisms=$([ -d "${feature_dir}components/organisms" ] && echo "✔" || echo "✖")
    has_hooks=$([ -d "${feature_dir}hooks" ] && echo "✔" || echo "~")
    has_services=$([ -d "${feature_dir}services" ] && echo "✔" || echo "~")
    has_types=$([ -d "${feature_dir}types" ] && echo "✔" || echo "~")

    log "  ${CYAN}$feature_name${RESET}  atoms:$has_atoms  molecules:$has_molecules  organisms:$has_organisms  hooks:$has_hooks  services:$has_services  types:$has_types"
  done
else
  err "src/features/ no existe"
fi

section "Posibles componentes genéricos duplicados en features"
GENERIC_ATOMS=("Button" "Input" "Badge" "Spinner" "Avatar" "Modal" "Card" "Select" "Tooltip" "Tag")
for atom in "${GENERIC_ATOMS[@]}"; do
  MATCHES=$(find src/features -name "${atom}.tsx" -o -name "${atom}.ts" 2>/dev/null | head -5)
  if [ -n "$MATCHES" ]; then
    warn "Componente genérico '${atom}' encontrado en features — considera moverlo a src/components/atoms/ o molecules/:"
    echo "$MATCHES" | while IFS= read -r m; do
      log "    $m"
    done
  fi
done


# =============================================================================
# 6. VERIFICAR HOOK useSidebarMobile
# =============================================================================
title "6. Verificando hook useSidebarMobile"

HOOK_FILE="src/hooks/useSidebarMobile.ts"
if [ -f "$HOOK_FILE" ]; then
  ok "Hook useSidebarMobile.ts encontrado en $HOOK_FILE"
else
  err "useSidebarMobile.ts NO encontrado en $HOOK_FILE"
  warn "Acción requerida: copiar el archivo desde las mejoras propuestas."
  warn "Este hook es necesario para que el drawer mobile funcione."
fi


# =============================================================================
# RESUMEN FINAL
# =============================================================================
title "📋 RESUMEN"
log "Reporte completo guardado en: ${BOLD}${GREEN}$REPORT${RESET}"
log ""
log "${BOLD}Archivos a reemplazar/agregar según las mejoras propuestas:${RESET}"
log "  • src/App.tsx                              → Suspense por ruta (granular)"
log "  • src/hooks/useSidebarMobile.ts            → Hook de estado mobile (NUEVO)"
log "  • src/components/organisms/Sidebar.tsx     → Drawer mobile + overlay"
log "  • src/components/molecules/TopNavbar.tsx   → Botón hamburguesa"
log "  • src/components/molecules/SidebarItem.tsx → Prop onNavigate para cerrar drawer"
log "  • src/components/templates/SidebarLayout.tsx → Ajuste z-index y relative"
log ""
log "${GREEN}${BOLD}✔ Auditoría completada.${RESET}"
