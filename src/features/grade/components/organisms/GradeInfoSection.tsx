// GradeInfoSection.tsx — Grid de tarjetas de información clave
import React from 'react';
import type { InfoItem } from '../../types/grade.types';
import { GradeInfoCard } from '../atoms/GradeInfoCard';

interface Props { info: InfoItem[] }

export const GradeInfoSection: React.FC<Props> = ({ info }) => (
  <section>
    <div className="flex items-center gap-2.5 mb-4">
      <span className="w-1 h-6 bg-itec-blue-skye rounded-full" />
      <h2 className="text-base font-bold text-itec-text">Información Importante</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {info.map((item, i) => (
        <GradeInfoCard key={i} item={item} />
      ))}
    </div>
  </section>
);
