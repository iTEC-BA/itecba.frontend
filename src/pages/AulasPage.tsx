import React, { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { Icons } from "@/components/ui/icons/Icons";
import { usePageTitle } from "@hooks/usePageTitle";

interface Aula {
  numero: string;
  piso: string;
  ala: string;
  sede: string;
  capacidad: number;
  referencias: string;
}

const AULAS: Aula[] = [
  { numero: "101", piso: "1.° piso", ala: "Ala central", sede: "Medrano", capacidad: 40, referencias: "Al subir la escalera, primer aula a la derecha." },
  { numero: "204", piso: "2.° piso", ala: "Ala norte", sede: "Medrano", capacidad: 60, referencias: "Subís por el ascensor, giras a la izquierda." },
  { numero: "304", piso: "3.° piso", ala: "Ala norte", sede: "Medrano", capacidad: 35, referencias: "Escalera central, a la derecha." },
  { numero: "Lab-A", piso: "1.° piso", ala: "Ala sur", sede: "Medrano", capacidad: 25, referencias: "Laboratorio de informática, requiere credencial." },
  { numero: "C101", piso: "1.° piso", ala: "Ala central", sede: "Campus", capacidad: 80, referencias: "Edificio central, al fondo del pasillo." },
  { numero: "C203", piso: "2.° piso", ala: "Ala este", sede: "Campus", capacidad: 50, referencias: "Sube por escalera este, tercera puerta." },
];

export const AulasPage: React.FC = () => {
  usePageTitle("Buscar Aula");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Aula | null>(null);
  const [sede, setSede] = useState("Todas");

  const filtered = AULAS.filter((a) => {
    const matchQuery =
      a.numero.toLowerCase().includes(query.toLowerCase()) ||
      a.piso.toLowerCase().includes(query.toLowerCase());
    const matchSede = sede === "Todas" || a.sede === sede;
    return matchQuery && matchSede;
  });

  return (
    <MainLayout>
      <PageHeader
        title="Buscar Aula"
        description="Encontrá cualquier aula de Medrano o Campus en segundos, con referencias visuales para llegar."
        iconType="map-pin"
        colorTheme="red"
      />

      {/* Buscador + filtro sede */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-itec-card border border-white/7 rounded-xl px-4 py-3 focus-within:border-itec-blue-skye transition-colors">
          <div className="w-4 h-4 text-[#5a6475] shrink-0">
            <Icons type="map-pin" className="w-full h-full" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
            placeholder="Ej: 304, Lab-A, C203..."
            className="flex-1 bg-transparent text-itec-text text-sm placeholder-[#5a6475] outline-none"
          />
        </div>
        <select
          value={sede}
          onChange={(e) => setSede(e.target.value)}
          className="bg-itec-card border border-white/7 text-[#9aa3b0] text-sm px-4 py-3 rounded-xl outline-none focus:border-itec-blue-skye transition-colors"
        >
          <option value="Todas">Todas las sedes</option>
          <option value="Medrano">Medrano</option>
          <option value="Campus">Campus</option>
        </select>
      </div>

      {/* Aula seleccionada — detalle */}
      {selected && (
        <div className="mb-5 bg-itec-card border border-itec-red/30 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium bg-itec-red/15 text-[#e01540] px-2 py-0.5 rounded-md">{selected.sede}</span>
                <span className="text-xs text-[#5a6475]">{selected.piso} · {selected.ala}</span>
              </div>
              <h2 className="text-2xl font-bold text-itec-text">Aula {selected.numero}</h2>
            </div>
            <button onClick={() => setSelected(null)} className="text-[#5a6475] hover:text-itec-text text-xl leading-none shrink-0">×</button>
          </div>
          {/* Mini mapa visual */}
          <div className="relative h-28 bg-[#0C1014] rounded-xl border border-white/5 overflow-hidden mb-3 flex items-center justify-center">
            <div className="grid grid-cols-8 grid-rows-4 gap-1 absolute inset-2 opacity-20">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="bg-[#1a2230] rounded-sm" />
              ))}
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-6 h-6 text-[#e01540]"><Icons type="map-pin" className="w-full h-full" /></div>
              <span className="text-xs font-bold text-itec-text">Aula {selected.numero}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 text-[#5a6475] shrink-0 mt-0.5"><Icons type="info" className="w-full h-full" /></div>
            <p className="text-sm text-[#9aa3b0]">{selected.referencias}</p>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-[#5a6475]">
            <div className="w-3 h-3"><Icons type="users" className="w-full h-full" /></div>
            <span>Capacidad: {selected.capacidad} personas</span>
          </div>
        </div>
      )}

      {/* Lista de resultados */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-itec-red/10 flex items-center justify-center text-[#e01540]">
              <div className="w-5 h-5"><Icons type="map-pin" className="w-full h-full" /></div>
            </div>
            <p className="text-[#5a6475] text-sm">No encontramos el aula "{query}".<br/>Probá con otro número o sede.</p>
          </div>
        ) : (
          filtered.map((a) => (
            <button
              key={a.numero}
              onClick={() => setSelected(a)}
              className={`text-left w-full bg-itec-card border rounded-xl p-3.5 flex items-center gap-3 transition-colors ${
                selected?.numero === a.numero ? "border-itec-red/40" : "border-white/7 hover:border-white/12"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-itec-red/12 text-[#e01540] flex items-center justify-center shrink-0">
                <div className="w-5 h-5"><Icons type="map-pin" className="w-full h-full" /></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-itec-text">Aula {a.numero}</p>
                  <span className="text-[10px] text-[#5a6475] bg-white/5 px-1.5 py-0.5 rounded">{a.sede}</span>
                </div>
                <p className="text-xs text-[#5a6475] mt-0.5">{a.piso} · {a.ala} · {a.capacidad} personas</p>
              </div>
              <div className="w-4 h-4 text-[#5a6475]"><Icons type="arrowLeft" className="w-full h-full rotate-180" /></div>
            </button>
          ))
        )}
      </div>
    </MainLayout>
  );
};
