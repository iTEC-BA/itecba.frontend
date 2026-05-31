// src/pages/AulasPage.tsx
import React, { useState } from "react";
import { MainLayout }       from "@components/templates/MainLayout";
import { PageHeader }       from "@components/ui/PageHeader";
import { CardSkeletonGrid } from "@components/ui/skeletons/CardSkeleton";
import { useAuth }          from "@context/AuthContext";
import { useAulas, invalidateAulasCache } from "@features/aulas/hooks/useAulas";
import { AulaCard }         from "@features/aulas/components/molecules/AulaCard";
import { AulaFormModal }    from "@features/aulas/components/organisms/AulaFormModal";
import { DeleteAulaModal }  from "@features/aulas/components/organisms/DeleteAulaModal";
import { Plus, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { CustomSelect } from "@components/ui/CustomSelect";
import type { AulaResumen, SedeAula, FuncionAula } from "@features/aulas/types/aulas.types";

const SEDES_OPTS = [
  { value: "",        label: "Todas las sedes" },
  { value: "medrano", label: "Medrano"         },
  { value: "campus",  label: "Campus"          },
];

const FUNCIONES_OPTS = [
  { value: "",                         label: "Todas las funciones"      },
  { value: "aula_comun",               label: "Aula común"               },
  { value: "laboratorio_informatica",  label: "Lab. Informática"         },
  { value: "laboratorio_especialidad", label: "Laboratorio especialidad" },
  { value: "departamento",             label: "Departamentos"            },
  { value: "bedelia",                  label: "Bedelías"                 },
  { value: "ceit",                     label: "CEIT"                     },
  { value: "sala_reunion",             label: "Salas de reunión"         },
  { value: "secretaria",               label: "Secretarías"              },
  { value: "otro",                     label: "Otros"                    },
];

export const AulasPage: React.FC = () => {
  const { isAdmin }    = useAuth();
  const { filtered, loading, error, filters, setFilters, reload } = useAulas();

  const [showForm,   setShowForm]   = useState(false);
  const [editAula,   setEditAula]   = useState<AulaResumen | null>(null);
  const [deleteAula, setDeleteAula] = useState<AulaResumen | null>(null);

  const handleEdit    = (aula: AulaResumen) => { setEditAula(aula); setShowForm(true); };
  const handleDelete  = (aula: AulaResumen) => setDeleteAula(aula);
  const handleSaved   = () => { setEditAula(null); reload(); };
  const handleDeleted = () => { setDeleteAula(null); reload(); };

  return (
    <MainLayout>
      <PageHeader
        title="Buscador de Aulas"
        description="Encontrá cualquier aula, laboratorio, departamento o espacio de la facultad con toda la información para llegar."
        iconType="map-pin"
        colorTheme="teal"
      >
        {isAdmin && (
          <button
            onClick={() => { setEditAula(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-itec-blue text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} /> Nueva aula
          </button>
        )}
      </PageHeader>

      {/* ── Filtros ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Buscador texto libre */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-itec-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Buscá por número, nombre, carrera..."
            value={filters.texto ?? ""}
            onChange={(e) => setFilters({ ...filters, texto: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-2xl bg-itec-surface border border-itec-border text-itec-text focus:outline-none focus:border-itec-sky transition-colors placeholder:text-itec-muted/60"
          />
        </div>

        {/* Filtro sede */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={14} className="text-itec-muted shrink-0" />
          <div className="w-48">
            <CustomSelect
              value={filters.sede ?? ""}
              options={SEDES_OPTS}
              onChange={(val) => setFilters({ ...filters, sede: val as SedeAula | "" })}
            />
          </div>
        </div>

        {/* Filtro función */}
        <div className="w-72">
          <CustomSelect
            value={filters.funcion ?? ""}
            options={FUNCIONES_OPTS}
            onChange={(val) => setFilters({ ...filters, funcion: val as FuncionAula | "" })}
          />
        </div>

        {/* Reload / invalidar caché */}
        <button
          onClick={() => { invalidateAulasCache(); reload(); }}
          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-itec-surface border border-itec-border text-itec-muted hover:text-white hover:border-white/20 transition-colors shrink-0"
          title="Actualizar lista"
        >
          <RotateCcw size={14} />
        </button>
      </section>

      {/* ── Error ───────────────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-400 mb-4">
          {error}
        </div>
      )}

      {/* ── Grid de aulas ───────────────────────────────────────────────────── */}
      {loading ? (
        <CardSkeletonGrid count={8} cols="grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-itec-muted">
          <span className="text-4xl">🏫</span>
          <p className="text-sm">No se encontraron aulas con los filtros actuales.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((aula) => (
            <AulaCard
              key={aula._id}
              aula={aula}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Contador de resultados */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-itec-muted mt-4 text-right">
          {filtered.length} espacio{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── Modales admin ───────────────────────────────────────────────────── */}
      <AulaFormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditAula(null); }}
        onSaved={handleSaved}
        aula={editAula as unknown as import("@features/aulas/types/aulas.types").Aula | null}
      />
      <DeleteAulaModal
        isOpen={!!deleteAula}
        onClose={() => setDeleteAula(null)}
        onDeleted={handleDeleted}
        aula={deleteAula}
      />
    </MainLayout>
  );
};
