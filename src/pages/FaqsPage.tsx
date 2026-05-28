import React from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { lazy, Suspense } from "react";
import { ChatSkeleton } from "@components/ui/skeletons/ChatSkeleton";

const ChatInterface = lazy(() =>
  import("@features/faqs/components/organisms/ChatInterface").then(m => ({ default: m.ChatInterface }))
);
import { usePageTitle } from "@hooks/usePageTitle";

// Hook seguro para detectar breakpoint mobile (evita window.innerWidth directo)
const useMobileBreakpoint = (breakpoint: number) => {
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
};

export const FaqsPage: React.FC = () => {
  usePageTitle("Asistente ITEC");
  const isMobile = useMobileBreakpoint(448);
  const showMainLayout = !isMobile;
  return (
    <MainLayout>
      {showMainLayout ? (
        <section className="w-full max-w-3xl mx-auto h-[calc(100dvh-80px)] flex flex-col">
          <Suspense fallback={<ChatSkeleton />}>
            <ChatInterface />
          </Suspense>
        </section>
      ) : (
        <div className="fixed inset-0 z-100 flex flex-col bg-itec-bg">
          <div className="flex h-full w-full flex-col overflow-hidden bg-itec-bg">
            <Suspense fallback={<ChatSkeleton />}>
            <ChatInterface />
          </Suspense>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
