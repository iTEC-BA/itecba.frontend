import React from 'react';

interface Props {
  userName?: string;
}

export const WelcomeWidget: React.FC<Props> = ({ userName }) => {
  const firstName = userName ? userName.split(' ')[0] : 'Estudiante';

  return (
    <section className="mb-6">
      <h1 className="text-2xl md:text-4xl font-bold mb-1 text-white">
        ¡Hola, <span className="text-itec-red-skye">{firstName}</span>! 👋
      </h1>
      <p className="text-gray-400 text-sm">Tu progreso en la UTN BA, en un solo lugar.</p>
    </section>
  );
};