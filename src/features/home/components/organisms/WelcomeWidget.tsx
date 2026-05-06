import React from "react";
import { useAuth } from "@context/AuthContext";
interface Props {
  userName?: string;
}

export const WelcomeWidget: React.FC<Props> = () => {
  const { user  } = useAuth();
  const firstName = user?.name ? user?.name .split(" ")[0] : "Estudiante";
  return (
    <section className="mb-6">
      <h1 className="text-2xl md:text-4xl font-bold mb-1 text-itec-text">
        ¡Hola, <span className="text-itec-red-skye">{firstName}</span>! 👋
      </h1>
      <p className="text-itec-text text-sm">
        Tu progreso en la UTN BA, en un solo lugar.
      </p>
    </section>
  );
};
