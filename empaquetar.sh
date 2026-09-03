#!/usr/bin/env bash
# fix_frontend.sh
# Corrige 4 llamadas obsoletas a services que ya obtienen el token
# internamente (Firebase auth.currentUser.getIdToken() vía getHeaders()),
# pero que todavía reciben "token" como argumento desde componentes viejos.
#
# No cambia ninguna lógica de negocio ni contrato con el backend:
# solo elimina el argumento "token" sobrante en las 4 llamadas afectadas.
#
# Uso:
#   Copiar este script a la raíz de itecba-frontend y ejecutar:
#   bash fix_frontend.sh

set -euo pipefail

# --- Detectar raíz del proyecto ---------------------------------------
if [ -f "package.json" ] && [ -d "src/features" ]; then
  ROOT="."
elif [ -f "../package.json" ] && [ -d "../src/features" ]; then
  ROOT=".."
else
  echo "❌ No encuentro la raíz del proyecto itecba-frontend."
  echo "   Ejecutá este script desde la carpeta del proyecto (donde está package.json y src/)."
  exit 1
fi

UNREAD_HOOK="$ROOT/src/features/notifications/hooks/useUnreadCount.ts"
CONTACT_MODAL="$ROOT/src/features/trueketec/components/organisms/ContactModal.tsx"

fail=0

check_file() {
  if [ ! -f "$1" ]; then
    echo "❌ No se encontró: $1"
    fail=1
  fi
}

check_file "$UNREAD_HOOK"
check_file "$CONTACT_MODAL"

if [ "$fail" -eq 1 ]; then
  echo "Abortando: faltan archivos esperados."
  exit 1
fi

backup() {
  cp "$1" "$1.bak.$(date +%Y%m%d%H%M%S)"
}

echo "📦 Creando backups..."
backup "$UNREAD_HOOK"
backup "$CONTACT_MODAL"

echo "🔧 Corrigiendo useUnreadCount.ts..."
# getMyMessages(token) -> getMyMessages()
sed -i \
  -e 's/inboxService\.getMyMessages(token)/inboxService.getMyMessages()/' \
  "$UNREAD_HOOK"

# El "token" ya no se usa para esta llamada, pero puede seguir existiendo
# la variable "token" sin uso. La dejamos si TS no la marca como error
# (noUnusedLocals suele ser warning, no error de build). Si tu tsconfig
# tiene noUnusedLocals estricto y falla el build, descomentá la siguiente
# línea para eliminar la variable completa:
# sed -i '/const token = await user.getIdToken();/d' "$UNREAD_HOOK"

echo "🔧 Corrigiendo ContactModal.tsx..."
# getPostulantes(token, post._id) -> getPostulantes(post._id)
sed -i \
  -e 's/trueketecService\.getPostulantes(token, post\._id)/trueketecService.getPostulantes(post._id)/' \
  "$CONTACT_MODAL"

# changeEstado(token, post._id, estado) -> changeEstado(post._id, estado)
sed -i \
  -e 's/trueketecService\.changeEstado(token, post\._id, estado)/trueketecService.changeEstado(post._id, estado)/' \
  "$CONTACT_MODAL"

# postular(token, post._id) -> postular(post._id)
sed -i \
  -e 's/trueketecService\.postular(token, post\._id)/trueketecService.postular(post._id)/' \
  "$CONTACT_MODAL"

echo ""
echo "✅ Cambios aplicados. Verificando resultado..."
echo ""
echo "--- useUnreadCount.ts ---"
grep -n "getMyMessages" "$UNREAD_HOOK" || true
echo ""
echo "--- ContactModal.tsx ---"
grep -n "getPostulantes\|changeEstado\|postular(" "$CONTACT_MODAL" || true

echo ""
echo "🏗️  Ahora podés correr: npm run build"
echo "   Si algo falló, restaurá los backups .bak.<timestamp> generados junto a cada archivo."