#!/bin/bash

OUTPUT="codigo_frontend_ia.txt"

echo "Generando archivo de código consolidado en $OUTPUT..."

# Vaciar el archivo si ya existe
> $OUTPUT

# Buscar archivos excluyendo carpetas, dependencias, imágenes y variables de entorno
find . -type f \
    -not -path "*/.itec_backup_20260506_105108/*" \
    -not -path "codigo_frontend_ia.txt" \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/dist/*" \
    -not -path "*/build/*" \
    -not -path "*/public/*" \
    -not -path "*/src/assets/*" \
    -not -name "*.gif" \
    -not -name "*.ico" \
    -not -name "*.pdf" \
    -not -name ".env*" \
    -not -name "package-lock.json" \
    -not -name "yarn.lock" \
    -not -name "pnpm-lock.yaml" \
    -not -name "*.sh" \
    -not -name "*.txt" \
    -not -name "$OUTPUT" \
    | while read file; do
        # Escribir el nombre del archivo como cabecera
        echo "==================================================" >> $OUTPUT
        echo "ARCHIVO: $file" >> $OUTPUT
        echo "==================================================" >> $OUTPUT
        
        # Volcar el contenido del archivo
        cat "$file" >> $OUTPUT
        
        # Añadir un par de saltos de línea al final
        echo -e "\n\n" >> $OUTPUT
    done

echo "============================================="
echo "¡Listo! Todo tu código está en: $OUTPUT"
echo "============================================="1