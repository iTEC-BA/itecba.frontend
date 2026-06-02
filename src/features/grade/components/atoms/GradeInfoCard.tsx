// GradeInfoCard.tsx — Usa el Card global de src/components/atoms/Card.tsx
import React from 'react';
import type { InfoItem } from '../../types/grade.types';

interface Props { item: InfoItem }

export const GradeInfoCard: React.FC<Props> = ({ item }) => (
  <div className="bg-itec-card border border-itec-border rounded-xl p-4 flex items-start gap-3 hover:border-itec-blue-skye/30 transition-colors duration-200">
    <span className="text-2xl flex-shrink-0">{item.icono}</span>
    <div>
      <h4 className="text-sm font-bold text-itec-text mb-1">{item.titulo}</h4>
      <p className="text-xs text-itec-description leading-relaxed">{item.descripcion}</p>
    </div>
  </div>
);
