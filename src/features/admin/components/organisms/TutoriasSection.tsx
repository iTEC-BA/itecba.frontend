// src/features/admin/components/organisms/TutoriasSection.tsx
// Gestión de tutorías/mentorías (feature sugerida en chats i-TEC)
import React, { useState } from "react";
import { GlassCard }       from "@features/profile/components/atoms/GlassCard";
import { cn }              from "@/lib/utils";

interface Tutoria {
  id:       string;
  alumno:   string;
  tutor:    string;
  materia:  string;
  fecha:    string;
  estado:   "pendiente" | "confirmada" | "completada" | "cancelada";
  tipo:     "virtual" | "presencial";
}

// Datos demo — en producción vendrían del backend
const DEMO_TUTORIAS: Tutoria[] = [
  { id: "1", alumno: "Ramón García", tutor: "Jairo Tumiri", materia: "Álgebra I",         fecha: "2026-05-10", estado: "confirmada",  tipo: "virtual"    },
  { id: "2", alumno: "Gabi Niz",     tutor: "Jairo Tumiri", materia: "AM I",              fecha: "2026-05-12", estado: "pendiente",   tipo: "presencial" },
  { id: "3", alumno: "Juan M.",      tutor: "Santiago",     materia: "Sistemas Operativos", fecha: "2026-05-14", estado: "pendiente", tipo: "virtual"    },
];

const ESTADO_MAP: Record<Tutoria["estado"], { label: string; cls: string }> = {
  pendiente:   { label: "Pendiente",   cls: "bg-itec-amber/15  text-itec-amber  border-itec-amber/30"   },
  confirmada:  { label: "Confirmada",  cls: "bg-itec-sky/15    text-itec-sky    border-itec-sky/30"     },
  completada:  { label: "Completada",  cls: "bg-itec-emerald/15 text-itec-emerald border-itec-emerald/30" },
  cancelada:   { label: "Cancelada",   cls: "bg-itec-accent/15 text-itec-accent border-itec-accent/30" },
};

export const TutoriasSection: React.FC = () => {
  const [filter, setFilter] = useState<Tutoria["estado"] | "todas">("todas");

  const filtered = DEMO_TUTORIAS.filter(
    (t) => filter === "todas" || t.estado === filter
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-itec-text font-display tracking-tight mb-1">
          🎓 Tutorías
        </h2>
        <p className="text-xs text-itec-muted">
          Sesiones personalizadas entre tutores y alumnos de la UTN.
        </p>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Pendientes",  value: DEMO_TUTORIAS.filter((t) => t.estado === "pendiente").length,  accent: "text-itec-amber",   emoji: "⏳" },
          { label: "Confirmadas", value: DEMO_TUTORIAS.filter((t) => t.estado === "confirmada").length, accent: "text-itec-sky",     emoji: "✅" },
          { label: "Completadas", value: DEMO_TUTORIAS.filter((t) => t.estado === "completada").length, accent: "text-itec-emerald", emoji: "🏆" },
          { label: "Total",       value: DEMO_TUTORIAS.length,                                          accent: "text-itec-text",    emoji: "📊" },
        ].map((s) => (
          <GlassCard key={s.label} className="p-4 flex flex-col gap-1">
            <span className="text-xl">{s.emoji}</span>
            <span className={cn("text-3xl font-bold", s.accent)}>{s.value}</span>
            <span className="text-[11px] text-itec-muted font-bold">{s.label}</span>
          </GlassCard>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {(["todas", "pendiente", "confirmada", "completada", "cancelada"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
              filter === f
                ? "bg-itec-sky text-white"
                : "bg-itec-surface border border-itec-border text-itec-muted hover:text-itec-text"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Lista */}
      <GlassCard variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-itec-border bg-itec-surface/50">
                {["Alumno", "Tutor", "Materia", "Fecha", "Tipo", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold text-itec-muted uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-itec-border/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-itec-muted text-sm">
                    Sin tutorías en este estado.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const est = ESTADO_MAP[t.estado];
                  return (
                    <tr key={t.id} className="hover:bg-itec-surface/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-itec-text whitespace-nowrap">{t.alumno}</td>
                      <td className="px-4 py-3 text-sm text-itec-muted whitespace-nowrap">{t.tutor}</td>
                      <td className="px-4 py-3 text-sm text-itec-text whitespace-nowrap">{t.materia}</td>
                      <td className="px-4 py-3 text-xs text-itec-muted whitespace-nowrap font-mono">{t.fecha}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-itec-muted">
                          {t.tipo === "virtual" ? "🖥️" : "🏫"} {t.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg border", est.cls)}>
                          {est.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button className="text-[10px] font-bold text-itec-sky hover:text-itec-blue transition-colors">
                            Confirmar
                          </button>
                          <span className="text-itec-border">|</span>
                          <button className="text-[10px] font-bold text-itec-accent hover:text-red-400 transition-colors">
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <p className="text-[10px] text-itec-border text-center">
        ⚠️ Sección en desarrollo — conectar con endpoint <code>/api/tutorias</code>
      </p>
    </div>
  );
};
