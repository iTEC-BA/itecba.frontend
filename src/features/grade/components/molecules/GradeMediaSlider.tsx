// GradeMediaSlider.tsx — Carrusel de imágenes y videos (<100 líneas)
import React, { useState } from 'react';
import type { GradeConfig } from '../../types/grade.types';

interface Props { media: GradeConfig['media'] }

export const GradeMediaSlider: React.FC<Props> = ({ media }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = media[activeIdx];

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-itec-border shadow-lg bg-itec-bg">
        {current.tipo === 'video' ? (
          <iframe
            key={current.url}
            src={current.url}
            title={current.titulo}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            key={current.url}
            src={current.url}
            alt={current.titulo}
            className="w-full h-full object-cover"
          />
        )}
        {current.titulo && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
            <p className="text-white text-xs font-medium">{current.titulo}</p>
          </div>
        )}
      </div>
      {media.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === activeIdx
                  ? 'border-itec-blue-skye shadow-[0_0_8px_rgba(0,74,173,0.5)]'
                  : 'border-itec-border hover:border-itec-blue-skye/50'
              }`}
            >
              {item.tipo === 'video' ? (
                <div className="w-full h-full bg-itec-box flex items-center justify-center">
                  <span className="text-itec-blue-skye text-sm">▶</span>
                </div>
              ) : (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
