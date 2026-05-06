#!/bin/bash

echo "Corrigiendo errores finales de TypeScript..."

replace_in_file() {
    local file=$1
    local search=$2
    local replace=$3
    # Usar comillas dobles en sed y # como delimitador para evitar problemas con barras /
    sed -i.bak "s#$search#$replace#g" "$file" && rm -f "${file}.bak"
}

# 1. src/features/admin/hooks/useAnnouncements.ts: Faltaba un argumento (isCritical: false)
replace_in_file "src/features/admin/hooks/useAnnouncements.ts" "parseInt(form.hours));" "parseInt(form.hours), false);"

# 2. src/features/admin/services/adminService.ts: Faltaba importar 'updateDoc' que borramos sin querer
# Buscamos la primera línea de importaciones de firestore y le agregamos updateDoc
replace_in_file "src/features/admin/services/adminService.ts" "import { collection, getDocs, doc, query, where, limit }" "import { collection, getDocs, doc, updateDoc, query, where, limit }"

# 3. src/features/faqs/components/molecules/ChatMessage.tsx: Manejo de undefined en text
replace_in_file "src/features/faqs/components/molecules/ChatMessage.tsx" "navigator.clipboard.writeText(text);" "navigator.clipboard.writeText(text || '');"

# 4. src/features/faqs/hooks/useChatbot.ts: Validar que text no sea undefined antes de trim()
replace_in_file "src/features/faqs/hooks/useChatbot.ts" "if (!text.trim()) return;" "if (!text || !text.trim()) return;"
replace_in_file "src/features/faqs/hooks/useChatbot.ts" "if (text.toLowerCase().trim() === \"reset ai\")" "if (text \&\& text.toLowerCase().trim() === \"reset ai\")"
replace_in_file "src/features/faqs/hooks/useChatbot.ts" "chatbotService.askAdvancedAI(text, messages);" "chatbotService.askAdvancedAI(text || '', messages);"
replace_in_file "src/features/faqs/hooks/useChatbot.ts" "includes(text.toLowerCase().trim());" "includes(text ? text.toLowerCase().trim() : '');"
replace_in_file "src/features/faqs/hooks/useChatbot.ts" "chatbotService.searchFaqAnswer(text);" "chatbotService.searchFaqAnswer(text || '');"

# 5. src/features/faqs/services/chatbotService.ts: Validar undefined
replace_in_file "src/features/faqs/services/chatbotService.ts" "(text?: string) => text.toLowerCase()" "(text?: string) => (text || '').toLowerCase()"

# 6. src/features/groups/services/groupsService.ts: Poner guion bajo a variable no usada
replace_in_file "src/features/groups/services/groupsService.ts" "isAdmin: boolean" "_isAdmin: boolean"

# 7. src/features/resources/components/organisms/AddResourceModal.tsx: Poner guion bajo a variable no usada
replace_in_file "src/features/resources/components/organisms/AddResourceModal.tsx" "isAdmin })" "_isAdmin })"

# 8. src/features/resources/services/resourcesService.ts: Poner guion bajo a variable no usada
replace_in_file "src/features/resources/services/resourcesService.ts" "isDirectPublish: boolean" "_isDirectPublish: boolean"

# 9. src/features/rewards/hooks/useRewards.ts: Quitar el false (solo recibe un argumento)
replace_in_file "src/features/rewards/hooks/useRewards.ts" "addPoints(-cost, false);" "addPoints(-cost);"

# 10. src/pages/CourseEditDetail.tsx: Arreglar tipados rotos de la playlist y de course.image
replace_in_file "src/pages/CourseEditDetail.tsx" "course.thumbnail ||" "(course as any).thumbnail ||"
replace_in_file "src/pages/CourseEditDetail.tsx" "fetchedVideos.length > 0" "fetchedVideos.videos \&\& fetchedVideos.videos.length > 0"
replace_in_file "src/pages/CourseEditDetail.tsx" "setVideos(fetchedVideos);" "setVideos(fetchedVideos.videos as any);"
replace_in_file "src/pages/CourseEditDetail.tsx" "image: imageUrl as any," "" # Se borra porque image no existe en el typo Partial<CourseData>

echo "================================================================"
echo "¡Listo! Ejecuta 'npm run build' de nuevo para confirmar."
echo "================================================================"