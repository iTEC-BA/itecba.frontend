import React from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { usePageTitle } from "@hooks/usePageTitle";
import { useAuth } from "@context/AuthContext";

import { PageHeader } from "@components/ui/PageHeader";
import { ChatInterface } from "@features/faqs/components/organisms/ChatInterface";
import { ImportantDatesWidget } from "@features/faqs/components/organisms/ImportantDatesWidget";

export const FaqsPage: React.FC = () => {
  usePageTitle("Preguntas Frecuentes");
  const { isAdmin } = useAuth();

  return (
    <MainLayout>
      <PageHeader
        title="Ayuda y Consultas"
        description="Resuelve tus dudas rápidas con nuestro Asistente ITEC o revisa el calendario académico."
        iconType="users"
        colorTheme="teal"
      />
      
      {/* Grid para separar Chat y Calendario en Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* Columna Izquierda: Chat (Ocupa 2/3 en Desktop) */}
        <div className="lg:col-span-2">
          <ChatInterface />
        </div>

        {/* Columna Derecha: Calendario (Ocupa 1/3 en Desktop) */}
        <div className="lg:col-span-1">
          <ImportantDatesWidget isAdmin={isAdmin} />
        </div>
        
      </div>
    </MainLayout>
  );
};