// src/features/admin/components/organisms/TutoriasSection.tsx
import React, { useState } from "react";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { Icons } from "@components/ui/icons/Icons";
import { cn } from "@/lib/utils";

interface Tutoria {
  id:      string;
  alumno:  string;
  tutor:   string;
  materia: string;
  fecha:   string;
  estado:  "pendiente" | "confirmada" | "completada" | "cancelada";
  tipo:    "virtual" | "presencial";
}

// Datos demo — en producción vendrían del backend
const DEMO_TUTORIAS: Tutoria[] = [
  { id: "1", alumno: "Ramón García", tutor: "Jairo Tumiri",  materia: "Álgebra I",          fecha: "2026-05-10", estado: "confirmada",  tipo: "virtual"    },
  { id: "2", alumno: "Gabi Niz",     tutor: "Jairo Tumiri",  materia: "AM I",                fecha: "2026-05-12", estado: "pendiente",   tipo: "presencial" },
  { id: "3", alumno: "Juan M.",       tutor: "Santiago",      materia: "Sistemas Operativos", fecha: "2026-05-14", estado: "pendiente",   tipo: "virtual"    },
];

const ESTADO_MAP: Record<Tutoria["estado"], { label: string; cls: string }> = {
  pendiente:  { label: "Pendiente",  cls: "bg-itec-amber/15   text-itec-amber   border-itec-amber/30"   },
  confirmada: { label: "Confirmada", cls: "bg-itec-sky/15     text-itec-sky     border-itec-sky/30"     },
  completada: { label: "Completada", cls: "bg-itec-emerald/15 text-itec-emerald border-itec-emerald/30" },
  cancelada:  { label: "Cancelada",  cls: "bg-itec-accent/15  text-itec-accent  border-itec-accent/30"  },
};

type IconType = React.ComponentProps<typeof Icons>["type"];

const STATS: Array<{ label: string; key: Tutoria["estado"] | "total"; accent: string; icon: IconType }> = [
  { label: "Pendientes",  key: "pendiente",  accent: "text-itec-amber",   icon: "bell"   },
  { label: "Confirmadas", key: "confirmada", accent: "text-itec-sky",     icon: "check"  },
  { label: "Completadas", key: "completada", accent: "text-itec-emerald", icon: "star"   },
  { label: "Total",       key: "total",      accent: "text-itec-text",    icon: "chart"  },
];

export const TutoriasSection: React.FC = () => {
  const [filter, setFilter] = useState<Tutoria["estado"] | "todas">("todas");

  const filtered = DEMO_TUTORIAS.filter(
    (t) => filter === "todas" || t.estado === filter
  );

  const getCount = (key: typeof STATS[number]["key"]) =>
    key === "total"
      ? DEMO_TUTORIAS.length
      : DEMO_TUTORIAS.filter((t) => t.estado === key).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Módulo</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-itec-text font-display">
          Tutorías
        </h2>
        <p className="text-xs text-itec-muted mt-1">
          Sesiones personalizadas entre tutores y alumnos de la UTN.
        </p>
      </div>

      {/* Stats KPI */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-3xl border border-itec-border bg-itec-box p-5 shadow-glass"
          >
            <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full opacity-50 blur-2xl"
              style={{ background: "var(--itec-sky, #38bdf8)" }}
            />
            <div className={cn("mb-3 h-5 w-5", s.accent)}>
              <Icons type={s.icon} />
            </div>
            <span className={cn("text-3xl font-bold leading-none tracking-tight", s.accent)}>
              {getCount(s.key)}
            </span>
            <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-itec-muted">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {(["todas", "pendiente", "confirmada", "completada", "cancelada"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-2xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95",
              filter === f
                ? "bg-itec-sky/20 border border-itec-sky/30 text-itec-sky"
                : "border border-itec-border bg-itec-surface/60 text-itec-muted hover:bg-itec-surface hover:text-itec-text"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <GlassCard variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-itec-border bg-itec-box2/40">
                {["Alumno", "Tutor", "Materia", "Fecha", "Tipo", "Estado", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-itec-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-itec-muted">
                    Sin tutorías en este estado.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const est = ESTADO_MAP[t.estado];
                  return (
                    <tr key={t.id} className="transition-colors hover:bg-itec-surface/30">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-itec-text">
                        {t.alumno}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-itec-muted">
                        {t.tutor}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-itec-text">
                        {t.materia}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-itec-muted">
                        {t.fecha}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-itec-muted">
                          {t.tipo === "virtual"
                            ? <Icons type="video" className="h-3.5 w-3.5" />
                            : <Icons type="book"  className="h-3.5 w-3.5" />
                          }
                          {t.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("rounded-xl border px-2 py-1 text-[10px] font-bold", est.cls)}>
                          {est.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button className="rounded-xl border border-itec-sky/20 bg-itec-sky/10 px-2 py-1 text-[10px] font-bold text-itec-sky transition-all hover:bg-itec-sky/20 active:scale-95">
                            Confirmar
                          </button>
                          <button className="rounded-xl border border-itec-accent/20 bg-itec-accent/10 px-2 py-1 text-[10px] font-bold text-itec-accent transition-all hover:bg-itec-accent/20 active:scale-95">
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

      <p className="text-center text-[10px] text-itec-border">
        Seccion en desarrollo — conectar con endpoint /api/tutorias
      </p>
    </div>
  );
};
