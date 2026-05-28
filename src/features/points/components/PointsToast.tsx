// src/features/points/components/PointsToast.tsx
//
// Toast pequeño y efímero que muestra el feedback de puntos ganados.
// Uso:
//   const [toast, setToast] = useState<{points: number; label: string} | null>(null);
//   <PointsToast points={toast.points} label={toast.label} onDone={() => setToast(null)} />

import React, { useEffect, useState } from "react";

interface Props {
  points: number;
  label:  string;
  /** Callback cuando la animación termina — útil para limpiar el estado padre */
  onDone?: () => void;
  /** Posición del toast. Default: "bottom-right" */
  position?: "bottom-right" | "bottom-center" | "top-right";
}

const POSITION_CLASSES: Record<NonNullable<Props["position"]>, string> = {
  "bottom-right":  "fixed bottom-6 right-6 z-[500]",
  "bottom-center": "fixed bottom-6 left-1/2 -translate-x-1/2 z-[500]",
  "top-right":     "fixed top-20 right-6 z-[500]",
};

export const PointsToast: React.FC<Props> = ({
  points,
  label,
  onDone,
  position = "bottom-right",
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone?.(), 300); // esperar fade-out
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`
        ${POSITION_CLASSES[position]}
        flex items-center gap-2 px-4 py-2.5
        bg-itec-box border border-white/10 rounded-2xl
        shadow-lg backdrop-blur-sm
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
      `}
    >
      <span className="text-yellow-400 text-base leading-none">⭐</span>
      <span className="text-white text-sm font-semibold">
        +{points}
      </span>
      <span className="text-gray-400 text-sm">{label}</span>
    </div>
  );
};

