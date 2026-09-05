#!/bin/bash

if [ -z "$1" ]; then
  echo "❌ Error: Debes indicar el nombre del feature."
  echo "💡 Uso: ./empaquetar_contexto_full.sh forum"
  exit 1
fi

FEATURE_NAME=$1
OUTPUT="contexto_frontend_seccion_${FEATURE_NAME}.txt"

echo "🚀 Generando contexto maestro para el feature: $FEATURE_NAME..."
> "$OUTPUT"

# Array para almacenar las carpetas a ignorar
EXCLUDES=()

# Función para agregar carpetas a la lista de ignoradas
ignorar_carpeta() {
  local dir_name=$1
  # Añade la sintaxis de exclusión para el comando 'find'
  EXCLUDES+=("-name" "$dir_name" "-prune" "-o")
  echo "🚫 Ignorando carpeta: $dir_name"
}

# Carpetas ignoradas por defecto (agregá las que necesites)
ignorar_carpeta "node_modules"
ignorar_carpeta "dist"
ignorar_carpeta ".git"
ignorar_carpeta ".cache"

# Función para volcar un archivo al consolidado
agregar_archivo() {
  local file=$1
  if [ -f "$file" ]; then
    echo "==================================================" >> "$OUTPUT"
    echo "ARCHIVO: $file" >> "$OUTPUT"
    echo "==================================================" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
    echo -e "\n\n" >> "$OUTPUT"
  fi
}

# Función para volcar una carpeta completa (Recursiva) con su contenido (solo código)
agregar_carpeta() {
  local dir=$1
  if [ -d "$dir" ]; then
    find "$dir" "${EXCLUDES[@]}" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" \) -print \
      | while read -r file; do
          agregar_archivo "$file"
      done
  fi
}

# Función para listar SOLO los nombres de los archivos en una carpeta
agregar_carpeta_nombres() {
  local dir=$1
  if [ -d "$dir" ]; then
    echo "==================================================" >> "$OUTPUT"
    echo "📂 ESTRUCTURA (Solo nombres): $dir" >> "$OUTPUT"
    echo "==================================================" >> "$OUTPUT"
    # Se quitó el filtro de extensión para que atrape .png, .webp, .svg, etc.
    find "$dir" "${EXCLUDES[@]}" -type f -print >> "$OUTPUT"
    echo -e "\n\n" >> "$OUTPUT"
  else
    echo "⚠️ Directorio no encontrado: $dir"
  fi
}

echo "1/5 Agregando núcleo de la App (Rutas y Config)..."
agregar_archivo "README.md"
agregar_archivo "src/main.tsx"
agregar_archivo "src/App.tsx"
agregar_carpeta "src/routes/"
agregar_carpeta "src/stores/"

echo "2/5 Agregando a estilo"
agregar_archivo "src/index.css"
agregar_archivo "./tsconfig.app.json"

echo "3/5 Agregando Componentes universales"
# Ruta corregida según tu captura de pantalla
agregar_carpeta_nombres "public/mascot/"
agregar_carpeta "src/components/"
agregar_carpeta "src/hooks/"
agregar_carpeta "src/lib/"
agregar_carpeta "src/services/"
agregar_carpeta "src/data/"

echo "4/5 Agregando Feature globales"
agregar_carpeta "src/features/notifications/"

echo "5/5 Agregando el Feature específico: $FEATURE_NAME..."
agregar_carpeta "src/features/$FEATURE_NAME"
agregar_carpeta "src/features/profile"
agregar_archivo "src/pages/profilePage.tsx"
# agregar_archivo "src/pages/ErrorPage.tsx"

# Agregar la página (View) principal del feature
PAGE_FILE="src/pages/${FEATURE_NAME^}Page.tsx"
if [ -f "$PAGE_FILE" ]; then
  agregar_archivo "$PAGE_FILE"
fi

echo "============================================="
echo "✅ ¡Listo! El ADN de tu UI y el Feature están en: $OUTPUT"
echo "============================================="