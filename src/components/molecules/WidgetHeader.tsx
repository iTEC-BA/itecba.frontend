import React from 'react';
import { IconButton } from '../atoms/IconButton';

interface WidgetHeaderProps {
  title: string;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({ title }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-itec-text text-lg">{title}</h3>
      <IconButton aria-label="Opciones">
        {/* Icono de 3 puntos (Ellipsis) */}
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 12a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </IconButton>
    </div>
  );
};