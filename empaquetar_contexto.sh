#!/bin/bash

if [ -z "$1" ]; then
  echo "❌ Error: Debes indicar el nombre del feature."
  echo "💡 Uso: ./empaquetar_contexto_full.sh forum"
  exit 1
fi

FEATURE_NAME=$1
OUTPUT="contexto_ia_${FEATURE_NAME}.txt"

echo "🚀 Generando contexto maestro para el feature: $FEATURE_NAME..."
> $OUTPUT

# Función para volcar un archivo al consolidado
agregar_archivo() {
  local file=$1
  if [ -f "$file" ]; then
    echo "==================================================" >> $OUTPUT
    echo "ARCHIVO: $file" >> $OUTPUT
    echo "==================================================" >> $OUTPUT
    cat "$file" >> $OUTPUT
    echo -e "\n\n" >> $OUTPUT
  fi
}

# Función para volcar una carpeta completa (Recursiva)
agregar_carpeta() {
  local dir=$1
  if [ -d "$dir" ]; then
    find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" \) \
      | while read file; do
          agregar_archivo "$file"
      done
  fi
}

echo "📦 1/5 Agregando núcleo de la App (Rutas y Config)..."
agregar_archivo "src/App.tsx"
agregar_archivo "src/lib/firebase.ts"
agregar_archivo "src/lib/utils.ts"
agregar_archivo "src/context/AuthContext.tsx"

echo "🖼️  2/5 Agregando Componentes universales"
agregar_carpeta "src/components/"

echo "🛠️  3/5 Agregando Hooks Globales..."
agregar_carpeta "src/hooks"

echo "🧩 4/5 Agregando el Feature específico: $FEATURE_NAME..."
agregar_carpeta "src/features/$FEATURE_NAME"
agregar_carpeta "src/features/notifications/"

echo "📦 5/5 Agregando a estilo"
agregar_archivo "./package.json"
agregar_archivo "./tsconfig.app.json"
agregar_archivo "./vite.config.ts"
agregar_archivo "./src/index.css"
agregar_archivo "./src/pages/NotificationsPage.tsx"
# agregar_archivo "./add_classroom_frontend.sh"
# agregar_archivo "./src/pages/AulaDetallePage.tsx"
# agregar_archivo "./src/pages/TruekeTECPage.tsx"
# agregar_archivo "./src/pages/ForumThreadPage.tsx"
agregar_archivo "./src/pages/CourseDetail.tsx"
agregar_archivo "./src/pages/CourseEditDetail.tsx"
# agregar_archivo "./src/pages/CourseDetail.tsx"
# agregar_archivo "./src/pages/CourseDetail.tsx"

# Agregar la página (View) principal del feature
PAGE_FILE="src/pages/${FEATURE_NAME^}Page.tsx"
if [ -f "$PAGE_FILE" ]; then
  agregar_archivo "$PAGE_FILE"
fi

echo "============================================="
echo "✅ ¡Listo! El ADN de tu UI y el Feature están en: $OUTPUT"
echo "============================================="