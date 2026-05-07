import React from 'react';
import { Button } from '@components/ui/Button';

interface Props { onAddClick: () => void }

export const EmptyResources: React.FC<Props> = ({ onAddClick }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-20 h-20 rounded-3xl bg-itec-box border border-itec-gray/40 flex items-center justify-center mb-6 text-4xl shadow-inner">
      📂
    </div>
    <h3 className="text-lg font-bold text-itec-text mb-2">Sin resultados</h3>
    <p className="text-sm text-itec-gray mb-8 max-w-xs leading-relaxed">
      No hay apuntes que coincidan con tu búsqueda. ¡Sé el primero en aportar!
    </p>
    <Button variant="orange" hierarchy="solid" onClick={onAddClick} icon="plus">Aportar Archivo · +1 Punto</Button>
  </div>
);
