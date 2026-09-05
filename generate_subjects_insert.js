#!/usr/bin/env node
/**
 * generate_subjects_insert.js
 *
 * Lee src/data/subject.ts (la fuente única y actualizada de materias) y
 * genera un archivo .sql con los INSERT necesarios para poblar las tablas
 * `subjects` y `subjects_correlativas` creadas por supabase_migration.sql.
 *
 * USO:
 *   node generate_subjects_insert.js /ruta/a/src/data/subject.ts > subjects_data.sql
 *
 * No requiere transpilar TypeScript: parsea el archivo como texto usando
 * expresiones regulares sobre los literales de objeto (subject.ts es data
 * estática, no lógica), así que no hace falta ts-node ni compilar nada.
 *
 * Es idempotente: usa INSERT ... ON CONFLICT (subject_key) DO UPDATE,
 * por lo que correrlo de nuevo tras editar subject.ts actualiza en vez de
 * duplicar filas.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Uso: node generate_subjects_insert.js /ruta/a/subject.ts > subjects_data.sql");
  process.exit(1);
}

const src = readFileSync(inputPath, "utf8");

// ── 1) Extraer el diccionario CARRERAS_DATA para saber qué export const
//       corresponde a qué carreraValue ────────────────────────────────────
const carrerasDataMatch = src.match(
  /export const CARRERAS_DATA:\s*Record<string,\s*Subject\[\]>\s*=\s*\{([\s\S]*?)\};/
);
if (!carrerasDataMatch) {
  console.error("❌ No se encontró CARRERAS_DATA en el archivo. ¿Es el subject.ts correcto?");
  process.exit(1);
}

const carreraToVar = {};
const carreraEntryRegex = /['"]([a-z]+)['"]\s*:\s*([A-Z_]+)/g;
let m;
while ((m = carreraEntryRegex.exec(carrerasDataMatch[1]))) {
  const [, carreraValue, varName] = m;
  carreraToVar[varName] = carreraValue;
}

if (Object.keys(carreraToVar).length === 0) {
  console.error("❌ CARRERAS_DATA está vacío o no se pudo parsear.");
  process.exit(1);
}

// ── 2) Para cada array exportado de tipo Subject[], extraer sus objetos ────
const arrayRegex = /export const ([A-Z_]+):\s*Subject\[\]\s*=\s*\[([\s\S]*?)\n\];/g;

// Un objeto Subject por línea, ej:
//   { id: '082021', name: 'Algorítmos y Estructuras de Datos', codigo: '082021',
//     level: 1, sigla: 'AyED', reqCursada: [], reqAprobada: [] },
const objectRegex =
  /\{\s*id:\s*'([^']*)'\s*,\s*name:\s*'((?:[^'\\]|\\.)*)'\s*,\s*codigo:\s*(null|'[^']*')\s*,\s*level:\s*(\d+)\s*,\s*sigla:\s*'([^']*)'\s*,\s*reqCursada:\s*\[([^\]]*)\]\s*,\s*reqAprobada:\s*\[([^\]]*)\]\s*\}/g;

const parseIdList = (raw) =>
  raw
    .split(",")
    .map((s) => s.trim().replace(/^'|'$/g, ""))
    .filter(Boolean);

const sqlEscape = (str) => str.replace(/'/g, "''");

const subjectsRows = [];
const correlativasRows = [];
let totalArrays = 0;

let arrMatch;
while ((arrMatch = arrayRegex.exec(src))) {
  const [, varName, body] = arrMatch;
  const carrera = carreraToVar[varName];
  if (!carrera) continue; // arrays que no están en CARRERAS_DATA (no deberían existir, pero por las dudas)
  totalArrays++;

  let objMatch;
  objectRegex.lastIndex = 0;
  while ((objMatch = objectRegex.exec(body))) {
    const [, id, name, codigoRaw, level, sigla, reqCursadaRaw, reqAprobadaRaw] = objMatch;
    const codigo = codigoRaw === "null" ? null : codigoRaw.replace(/^'|'$/g, "");

    subjectsRows.push({
      subject_key: id,
      carrera,
      nivel: parseInt(level, 10),
      materia: name,
      codigo,
      sigla: sigla || null,
    });

    for (const reqId of parseIdList(reqCursadaRaw)) {
      correlativasRows.push({ subject_key: id, requisito: reqId, tipo: "cursada" });
    }
    for (const reqId of parseIdList(reqAprobadaRaw)) {
      correlativasRows.push({ subject_key: id, requisito: reqId, tipo: "aprobada" });
    }
  }
}

if (subjectsRows.length === 0) {
  console.error("❌ No se extrajo ninguna materia. Revisá que el formato de subject.ts no haya cambiado.");
  process.exit(1);
}

// ── 3) Generar el SQL ────────────────────────────────────────────────────────
const lines = [];
lines.push("-- ============================================================================");
lines.push(`-- subjects_data.sql — generado automáticamente desde ${basename(inputPath)}`);
lines.push(`-- Fecha de generación: ${new Date().toISOString()}`);
lines.push(`-- Materias: ${subjectsRows.length} | Correlatividades: ${correlativasRows.length} | Carreras: ${totalArrays}`);
lines.push("-- Este archivo se corre en el SQL Editor de Supabase DESPUÉS de supabase_migration.sql");
lines.push("-- ============================================================================");
lines.push("");
lines.push("BEGIN;");
lines.push("");
lines.push("-- ── Carga / actualización de subjects ──────────────────────────────────────");
lines.push(
  "INSERT INTO subjects (subject_key, carrera, nivel, materia, codigo, sigla) VALUES"
);

const subjectValues = subjectsRows.map((r, i) => {
  const codigoSql = r.codigo === null ? "NULL" : `'${sqlEscape(r.codigo)}'`;
  const siglaSql = r.sigla === null ? "NULL" : `'${sqlEscape(r.sigla)}'`;
  const comma = i === subjectsRows.length - 1 ? "" : ",";
  return `  ('${sqlEscape(r.subject_key)}', '${sqlEscape(r.carrera)}', ${r.nivel}, '${sqlEscape(
    r.materia
  )}', ${codigoSql}, ${siglaSql})${comma}`;
});
lines.push(...subjectValues);
lines.push("ON CONFLICT (subject_key) DO UPDATE SET");
lines.push("  carrera    = EXCLUDED.carrera,");
lines.push("  nivel      = EXCLUDED.nivel,");
lines.push("  materia    = EXCLUDED.materia,");
lines.push("  codigo     = EXCLUDED.codigo,");
lines.push("  sigla      = EXCLUDED.sigla,");
lines.push("  updated_at = now();");
lines.push("");

if (correlativasRows.length > 0) {
  lines.push("-- ── Carga de correlatividades (requiere que subjects ya esté cargada) ──────");
  lines.push("-- Se resuelve subject_id a partir de subject_key vía subquery.");
  lines.push(
    "INSERT INTO subjects_correlativas (subject_id, requisito_subject_key, tipo)"
  );
  lines.push("SELECT s.id, v.requisito_subject_key, v.tipo");
  lines.push("FROM (VALUES");
  const correlativasValues = correlativasRows.map((r, i) => {
    const comma = i === correlativasRows.length - 1 ? "" : ",";
    return `  ('${sqlEscape(r.subject_key)}', '${sqlEscape(r.requisito)}', '${r.tipo}')${comma}`;
  });
  lines.push(...correlativasValues);
  lines.push(") AS v(subject_key, requisito_subject_key, tipo)");
  lines.push("JOIN subjects s ON s.subject_key = v.subject_key");
  lines.push("ON CONFLICT (subject_id, requisito_subject_key, tipo) DO NOTHING;");
  lines.push("");
}

lines.push("COMMIT;");
lines.push("");
lines.push(`-- Resumen: ${subjectsRows.length} materias, ${correlativasRows.length} correlatividades, ${totalArrays} carreras.`);

const output = lines.join("\n");
console.log(output);

// También informar por stderr para no ensuciar el stdout que se redirige a un archivo
console.error(`✅ Generado: ${subjectsRows.length} materias, ${correlativasRows.length} correlatividades, ${totalArrays} carreras.`);
console.error("   Redirigí la salida a un archivo, ej:");
console.error("   node generate_subjects_insert.js subject.ts > subjects_data.sql");
