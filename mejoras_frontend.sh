#!/bin/bash

echo "🚀 Iniciando migración masiva de botones en el frontend..."

# Usamos la extensión .cjs para evitar el error de "type: module" en tu package.json
cat << 'EOF' > refactor_buttons.cjs
const fs = require('fs');
const path = require('path');

// Todos los directorios donde buscaremos archivos .tsx
const directories = [
  './src/components',
  './src/features',
  './src/pages'
];

function getFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.tsx')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const allFiles = [];
directories.forEach(dir => getFiles(dir, allFiles));

// Definimos las reglas exactas de transformación
const rules = [
  // 1. Modales de Recursos (EmptyResources y ResourceFilters)
  {
    find: /<Button[^>]*onClick=\{onAddClick\}[^>]*>[^<]*\+\s*Aportar Archivo[^\<]*<\/Button>/g,
    replace: `<Button variant="orange" hierarchy="solid" onClick={onAddClick} icon="plus">Aportar Archivo · +1 Punto</Button>`
  },
  {
    find: /<Button\s*onClick=\{onClear\}\s*className="[^"]*bg-itec-red\/10[^"]*"\s*>\s*Limpiar filtros\s*<\/Button>/g,
    replace: `<Button variant="danger" hierarchy="ghost" onClick={onClear} icon="trash">Limpiar filtros</Button>`
  },

  // 2. ChatInputs (General y FAQs)
  {
    find: /<Button\s*type="submit"\s*disabled=\{!input\.trim\(\) \|\| disabled\}\s*className="[^"]*bg-itec-blue[^"]*"\s*>\s*<div[^>]*><Icons type="send" \/><\/div>\s*<\/Button>/g,
    replace: `<Button type="submit" variant="primary" hierarchy="solid" disabled={!input.trim() || disabled} icon="send" />`
  },
  {
    find: /<Button\s*type="submit"\s*disabled=\{!input\.trim\(\) \|\| disabled\}\s*className="[^"]*bg-teal-600[^"]*"\s*>\s*<div[^>]*><Icons type="send" \/><\/div>\s*<\/Button>/g,
    replace: `<Button type="submit" variant="teal" hierarchy="solid" disabled={!input.trim() || disabled} icon="send" />`
  },
  {
    find: /<Button type="submit" disabled=\{isLoading \|\| !input\.trim\(\)\} className="[^"]*">\s*<div[^>]*>\s*<Icons type="send" \/>\s*<\/div>\s*<\/Button>/g,
    replace: `<Button type="submit" variant="primary" hierarchy="solid" isLoading={isLoading} disabled={!input.trim()} icon="send" />`
  },

  // 3. Botones con lógica de Carga Compleja (News, Profile, Rewards)
  {
    find: /<Button\s*type="submit"\s*disabled=\{createMutation\.isPending\}\s*className="[^"]*bg-orange-500[^"]*"\s*>\s*\{createMutation\.isPending \? 'PUBLICANDO AVISO\.\.\.' : 'PUBLICAR EN LA PLATAFORMA'\}\s*<\/Button>/g,
    replace: `<Button type="submit" variant="orange" hierarchy="solid" fullWidth isLoading={createMutation.isPending}>PUBLICAR EN LA PLATAFORMA</Button>`
  },
  {
    find: /<Button type="submit" disabled=\{isSaving\} className="[^"]*bg-sky-600[^"]*">\s*\{isSaving \? 'Generando\.\.\.' : 'Generar Credencial'\}\s*<\/Button>/g,
    replace: `<Button type="submit" variant="primary" hierarchy="solid" fullWidth isLoading={isSaving}>Generar Credencial</Button>`
  },
  {
    find: /<Button\s*type="submit"\s*variant="primary"[^>]*disabled=\{isLoading\}[^>]*>\s*\{isLoading \?\s*\([\s\S]*?Procesando\.\.\.\s*<\/span>\s*\)\s*:\s*\(\s*"Confirmar canje"\s*\)\s*\}\s*<\/Button>/g,
    replace: `<Button type="submit" variant="primary" hierarchy="solid" fullWidth isLoading={isLoading}>Confirmar canje</Button>`
  },
  {
    find: /<Button\s*type="button"\s*variant="primary"\s*onClick=\{[^}]*handleSubmit[^}]*\}\s*fullWidth\s*disabled=\{isLoading\}\s*className="[^"]*"\s*>\s*\{isLoading \?\s*\([\s\S]*?\{isEditing \? "Guardando\.\.\." : "Creando\.\.\."\}\s*<\/span>\s*\)\s*:\s*\(\s*isEditing \? "Guardar cambios" : "Crear beneficio"\s*\)\s*\}\s*<\/Button>/g,
    replace: `<Button type="button" variant="primary" hierarchy="solid" fullWidth onClick={(e) => { e.preventDefault(); handleSubmit({ preventDefault: () => {} } as React.FormEvent); }} isLoading={isLoading}>{isEditing ? "Guardar cambios" : "Crear beneficio"}</Button>`
  },

  // 4. Modales de Cursos y FAQs
  {
    find: /<Button type="button" onClick=\{onFetchPlaylist\} disabled=\{isFetching \|\| !playlistUrl\} className="[^"]*bg-red-600[^"]*">\s*\{isFetching \? "Extrayendo\.\.\." : "Importar"\}\s*<\/Button>/g,
    replace: `<Button type="button" variant="danger" hierarchy="solid" onClick={onFetchPlaylist} isLoading={isFetching} disabled={!playlistUrl}>Importar</Button>`
  },
  {
    find: /<Button type="submit" variant="primary" disabled=\{isPending\} className="[^"]*bg-itec-blue-skye[^"]*">\s*\{isPending \? "Guardando\.\.\." : existingCourse \? "Guardar cambios" : "Publicar curso"\}\s*<\/Button>/g,
    replace: `<Button type="submit" variant="primary" hierarchy="solid" fullWidth isLoading={isPending}>{existingCourse ? "Guardar cambios" : "Publicar curso"}</Button>`
  },
  {
    find: /<Button type="submit" variant="primary" className="[^"]*bg-orange-600[^"]*">Guardar Fecha<\/Button>/g,
    replace: `<Button type="submit" variant="orange" hierarchy="solid">Guardar Fecha</Button>`
  },
  {
    find: /<Button\s*type="submit"\s*disabled=\{isSubmitting \|\| !eventName \|\| !targetDate\}\s*className="[^"]*bg-purple-600[^"]*"\s*>\s*\{isSubmitting \? 'Guardando\.\.\.' : 'Agregar Evento'\}\s*<\/Button>/g,
    replace: `<Button type="submit" variant="purple" hierarchy="solid" fullWidth isLoading={isSubmitting} disabled={!eventName || !targetDate}>Agregar Evento</Button>`
  },

  // 5. El gran reemplazo: Todos los botones secundarios genéricos
  {
    find: /variant="secondary"/g,
    replace: `variant="slate" hierarchy="ghost"`
  }
];

let updatedFiles = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  rules.forEach(rule => {
    content = content.replace(rule.find, rule.replace);
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    updatedFiles++;
    console.log(`✔️  Actualizado: ${file}`);
  }
});

console.log(`\n✅ Migración completada. ${updatedFiles} archivos fueron actualizados con el nuevo componente Button.`);
EOF

# Ejecutamos el script y luego lo borramos
node refactor_buttons.cjs
rm refactor_buttons.cjs