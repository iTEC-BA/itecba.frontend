#!/usr/bin/env bash
# =============================================================================
#  iTEC BA — Generador de íconos PWA
#  Este script genera TODOS los íconos necesarios para que Chrome
#  reconozca la app como PWA instalable.
#
#  REQUISITO: Tener public/logo.png (logo de iTEC BA en alta resolución)
#  EJECUTAR desde la raíz del proyecto: bash generate-icons.sh
# =============================================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${CYAN}[iTEC Icons]${NC} $1"; }
ok()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo -e "${RED}  iTEC BA — PWA Icon Generator${NC}"
echo ""

# ── Verificaciones ────────────────────────────────────────────────────────────
[ ! -f "package.json" ] && err "Ejecutá desde la raíz del proyecto."

LOGO=""
for candidate in "public/logo.png" "src/assets/logo.png" "public/favicon.png" "public/icon.png"; do
  [ -f "$candidate" ] && LOGO="$candidate" && break
done

if [ -z "$LOGO" ]; then
  err "No se encontró ningún logo PNG. Copiá tu logo a public/logo.png y volvé a ejecutar."
fi

ok "Logo encontrado: $LOGO"
mkdir -p public/icons public/screenshots

# ── Método 1: pwa-asset-generator (recomendado) ───────────────────────────────
log "Intentando con pwa-asset-generator..."
if npx --yes pwa-asset-generator "$LOGO" public/icons \
    --background "#1A1A1A" \
    --padding "12%" \
    --favicon \
    --maskable \
    --type png \
    --opaque false 2>/dev/null; then
  ok "Íconos generados con pwa-asset-generator."

  # Renombrar al esquema que espera el manifest
  [ -f "public/icons/manifest-icon-192.maskable.png" ] && cp "public/icons/manifest-icon-192.maskable.png" "public/icons/pwa-192.png"
  [ -f "public/icons/manifest-icon-512.maskable.png" ] && cp "public/icons/manifest-icon-512.maskable.png" "public/icons/pwa-512-maskable.png"
  [ -f "public/icons/manifest-icon-512.png" ]          && cp "public/icons/manifest-icon-512.png"          "public/icons/pwa-512.png"
  [ -f "public/icons/favicon-196.png" ]                && cp "public/icons/favicon-196.png"                "public/icons/pwa-192.png"
  [ -f "public/icons/apple-icon-180.png" ]             && cp "public/icons/apple-icon-180.png"             "public/icons/apple-touch-icon.png"

else
  # ── Método 2: sharp-cli ───────────────────────────────────────────────────
  warn "pwa-asset-generator falló. Intentando con sharp-cli..."
  if npx --yes sharp-cli --input "$LOGO" --output public/icons/pwa-512.png resize 512 512 2>/dev/null; then
    npx sharp-cli --input "$LOGO" --output public/icons/pwa-192.png resize 192 192
    npx sharp-cli --input "$LOGO" --output public/icons/pwa-64.png  resize 64  64
    npx sharp-cli --input "$LOGO" --output public/icons/apple-touch-icon.png resize 180 180
    cp public/icons/pwa-512.png public/icons/pwa-512-maskable.png
    ok "Íconos generados con sharp-cli."

  else
    # ── Método 3: Python Pillow ───────────────────────────────────────────────
    warn "sharp-cli falló. Intentando con Python Pillow..."
    if python3 -c "from PIL import Image; print('ok')" 2>/dev/null | grep -q ok; then
      python3 << PYEOF
from PIL import Image
import os

src = "$LOGO"
out = "public/icons"
os.makedirs(out, exist_ok=True)

sizes = {
  "pwa-64.png":              64,
  "pwa-192.png":             192,
  "pwa-512.png":             512,
  "pwa-512-maskable.png":    512,
  "apple-touch-icon.png":    180,
  "shortcut-tarjetec.png":    96,
  "shortcut-buscatec.png":    96,
  "shortcut-cursos.png":      96,
}

img = Image.open(src).convert("RGBA")

for name, size in sizes.items():
  resized = img.resize((size, size), Image.LANCZOS)

  # Para maskable: agregar fondo negro con 12% padding
  if "maskable" in name:
    padded_size = size
    pad = int(size * 0.12)
    inner_size = size - pad * 2
    bg = Image.new("RGBA", (padded_size, padded_size), (26, 26, 26, 255))
    icon = img.resize((inner_size, inner_size), Image.LANCZOS)
    bg.paste(icon, (pad, pad), icon)
    bg.save(os.path.join(out, name), "PNG")
  else:
    resized.save(os.path.join(out, name), "PNG")

  print(f"  ✓ {name} ({size}x{size})")
PYEOF
      ok "Íconos generados con Python Pillow."
    else
      err "No se pudo generar los íconos automáticamente.\nInstalá Pillow: pip install Pillow\nO generá los íconos manualmente (ver public/icons/README.md)"
    fi
  fi
fi

# ── Verificar que el 192 y 512 existen (son los que Chrome valida) ─────────────
MISSING=0
for required in "public/icons/pwa-192.png" "public/icons/pwa-512.png"; do
  if [ ! -f "$required" ]; then
    warn "Falta: $required"
    MISSING=1
  fi
done

# Si falta el 64, copiar del 192
[ ! -f "public/icons/pwa-64.png" ] && [ -f "public/icons/pwa-192.png" ] && cp "public/icons/pwa-192.png" "public/icons/pwa-64.png"

# Si falta la maskable, copiar del 512
[ ! -f "public/icons/pwa-512-maskable.png" ] && [ -f "public/icons/pwa-512.png" ] && cp "public/icons/pwa-512.png" "public/icons/pwa-512-maskable.png"

# Si falta apple-touch-icon, copiar del 192
[ ! -f "public/icons/apple-touch-icon.png" ] && [ -f "public/icons/pwa-192.png" ] && cp "public/icons/pwa-192.png" "public/icons/apple-touch-icon.png"

# Shortcuts (copiar del 192 si no existen)
for shortcut in "shortcut-tarjetec.png" "shortcut-buscatec.png" "shortcut-cursos.png"; do
  [ ! -f "public/icons/$shortcut" ] && [ -f "public/icons/pwa-192.png" ] && cp "public/icons/pwa-192.png" "public/icons/$shortcut"
done

# ── Resumen ────────────────────────────────────────────────────────────────────
echo ""
if [ "$MISSING" -eq 0 ]; then
  echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}  ✅  Íconos PWA listos${NC}"
  echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
  echo ""
  echo "  Archivos generados en public/icons/:"
  ls -1 public/icons/*.png 2>/dev/null | while read f; do echo "   • $(basename $f)"; done
  echo ""
  echo -e "  ${CYAN}Próximo paso:${NC}"
  echo "   npm run build && npm run preview"
  echo "   Luego abrí en Chrome mobile → menú ⋮ → 'Agregar a pantalla de inicio'"
else
  echo -e "${RED}  Algunos íconos no se generaron. Revisá los mensajes de error arriba.${NC}"
fi
echo ""