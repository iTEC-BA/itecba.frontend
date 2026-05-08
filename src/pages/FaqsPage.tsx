import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { ChatInterface } from "@features/faqs/components/organisms/ChatInterface";
import { usePageTitle } from "@hooks/usePageTitle";

export const FaqsPage: React.FC = () => {
  usePageTitle("Asistente ITEC");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const showMainLayout = windowWidth > 370;
  return (
    <MainLayout>
      {showMainLayout ? (
        <ChatInterface />
      ) : (
        <div className="fixed inset-0 z-100 flex flex-col bg-itec-background">
          <div className="flex h-full w-full flex-col overflow-hidden bg-itec-background">
            <ChatInterface /> 
          </div>
        </div>
      )}
    </MainLayout>
  );
};