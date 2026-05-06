import React, { useState, Suspense } from "react";
import { Icons } from "../components/ui/icons/Icons";
import { PageHeader } from "../components/ui/PageHeader";
import { MainLayout } from "../components/templates/MainLayout";
import { CareerGrid } from "@/features/grade/components/organisms/CareerGrid";
import { PLANES_DB } from "@/features/grade/types/correlativas";
import { usePageTitle } from "@/hooks/usePageTitle";

// Lazy Loading del Mapa Interactivo
const CareerGraph = React.lazy(() =>
  import("../features/grade/components/organisms/CareerGraph").then((m) => ({ default: m.CareerGraph }))
);

export const GradePage: React.FC = () => {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  usePageTitle(selectedCareer ? "Mapa Académico | ITEC" : "Planes de Estudio | ITEC");

  const containerClass = selectedCareer
    ? "h-[calc(100vh-80px)] flex flex-col w-full relative z-10 px-2 lg:px-4"
    : "min-h-[calc(100vh-100px)] flex flex-col w-full relative z-10 px-2 lg:px-4";

  return (
    <MainLayout>
      <div className={containerClass}>
        
        {/* Cabecera Inteligente: Se achica cuando estás viendo el mapa */}
        {!selectedCareer ? (
          <PageHeader
            title="Planes de Estudio"
            description="Encontrá tu carrera, analizá el plan de estudios y navegá por el mapa interactivo de correlativas."
            iconType="search"
            colorTheme="yellow"
          />
        ) : (
          <div className="flex items-center justify-between bg-itec-box/90 border border-itec-gray px-6 py-4 rounded-2xl mb-4 shadow-xl shrink-0 animate-in slide-in-from-top-4 duration-300">
            <h2 className="text-itec-textfont-bold hidden md:block">Mapa Interactivo de Correlativas</h2>
            <button
              onClick={() => setSelectedCareer(null)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.3)] w-full md:w-auto"
            >
              <div className="w-4 h-4"><Icons type="arrowLeft" /></div>
              Cambiar Carrera
            </button>
          </div>
        )}

        {/* CONTENEDOR PRINCIPAL */}
        <div className="flex-1 w-full relative flex flex-col">
          
          {/* MODO SELECCIÓN */}
          {!selectedCareer && <CareerGrid onSelect={setSelectedCareer} />}

          {/* MODO MAPA INTERACTIVO */}
          {selectedCareer && PLANES_DB[selectedCareer] && (
            <div className="w-full flex-1 bg-gradient-to-br from-itec-box to-itec-bg border border-itec-gray rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl relative ring-1 ring-white/5">
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-itec-box/90 z-50">
                    <div className="relative w-16 h-16 flex items-center justify-center mb-6">
                      <div className="absolute inset-0 border-4 border-itec-gray rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
                      <span className="text-xl">🗺️</span>
                    </div>
                    <p className="text-itec-textfont-bold text-lg mb-1">Cargando motor gráfico...</p>
                    <p className="text-itec-text text-xs uppercase tracking-widest">Preparando correlativas</p>
                  </div>
                }
              >
                <CareerGraph planData={PLANES_DB[selectedCareer]} />
              </Suspense>
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
};