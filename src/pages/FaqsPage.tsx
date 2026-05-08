// src/pages/FaqsPage.tsx
import React from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { usePageTitle } from "@hooks/usePageTitle";
import { useAuth } from "@context/AuthContext";
import { ChatInterface } from "@features/faqs/components/organisms/ChatInterface";
import { ImportantDatesWidget } from "@features/faqs/components/organisms/ImportantDatesWidget";

export const FaqsPage: React.FC = () => {
  usePageTitle("Consultas — ITEC");
  const { isAdmin } = useAuth();

  return (
    <MainLayout>
      {/*
        Mobile: ChatInterface ocupa toda la pantalla disponible.
        El calendario está oculto. Se muestra un layout de "un solo panel".
        Desktop (lg+): Grid 2/3 chat + 1/3 calendario.
      */}
      <div className="grid grid-cols-1 gap-0 lg:gap-6 lg:grid-cols-3 max-w-7xl mx-auto">

        {/* Chat — fullscreen en mobile, 2/3 en desktop */}
        <div className="lg:col-span-2 h-[calc(100dvh-4rem)] lg:h-auto">
          <ChatInterface />
        </div>

        {/* Calendario — OCULTO en mobile, visible en lg+ */}
        <div className="hidden lg:block lg:col-span-1">
          <ImportantDatesWidget isAdmin={isAdmin} />
        </div>

      </div>
    </MainLayout>
  );
};
