// GradePage.tsx — Selector de carreras
import React, { useState } from 'react';
import { useNavigate }   from 'react-router-dom';
import { MainLayout }    from '@components/templates/MainLayout';
import { PageHeader }    from '@components/ui/PageHeader';
import { Input }         from '@components/ui/Input';
import { Icons }         from '@components/ui/icons/Icons';
import { InstitutionalInfo } from '@features/grade/components/InstitutionalInfo';
import { GRADE_CONFIGS } from '@features/grade/config';
import { institutional, resenias } from '@/features/grade/data/info';
import { LandPlot } from 'lucide-react';

const ALL_CAREER_IDS = ['sistemas', 'electronica', 'industrial', 'civil', 'electrica', 'mecanica', 'quimica', 'naval', 'textil'];

const CAREER_COLOR: Record<string, string> = {
  sistemas:    'border-itec-blue-skye/40 hover:border-itec-blue-skye hover:bg-itec-blue/5',
  electronica: 'border-itec-red/40 hover:border-itec-red-skye hover:bg-itec-red/5',
  default:     'border-itec-border hover:border-itec-border/80 hover:bg-itec-card',
};

export const GradePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = ALL_CAREER_IDS.filter(id => {
    const cfg  = GRADE_CONFIGS[id];
    const name = cfg ? cfg.titulo : id;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <MainLayout>
      <div className="px-1 py-3 flex flex-col gap-8 max-w-5xl mx-auto">

        <PageHeader
          title="Oferta Académica e Información Institucional"
          description="Seleccioná una carrera para ver el plan de estudios, materias y correlativas."
          icon={<LandPlot className="size-6" />}
          colorTheme="blue"
        />

        {/* Info institucional */}
        <section>
          <h2 className="text-sm font-bold text-itec-text flex items-center gap-2 mb-3">
            <span className="w-1 h-5 bg-itec-blue-skye rounded-full" />
            Información de la Facultad
          </h2>
          <InstitutionalInfo>{institutional}</InstitutionalInfo>
        </section>

        {/* Selector de carreras */}
        <section>
          <h2 className="text-sm font-bold text-itec-text flex items-center gap-2 mb-3">
            <span className="w-1 h-5 bg-itec-blue-skye rounded-full" />
            Especialidades de Ingeniería
          </h2>

          {/* Buscador */}
          <div className="relative max-w-sm mb-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-itec-description">
              <Icons type="search" className="w-3.5 h-3.5" />
            </div>
            <Input
              type="text"
              placeholder="Buscar carrera..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-itec-box border border-itec-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-itec-text placeholder-itec-description focus:border-itec-blue-skye transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(id => {
              const cfg       = GRADE_CONFIGS[id];
              const available = !!cfg;
              const colorCls  = CAREER_COLOR[id] ?? CAREER_COLOR.default;
              return (
                <div
                  key={id}
                  onClick={() => available && navigate(`/grado/${id}`)}
                  className={`bg-itec-box border rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 ${
                    available ? `${colorCls} cursor-pointer hover:-translate-y-0.5` : 'border-itec-border/30 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xl">📘</span>
                    {available
                      ? <span className="text-[10px] font-bold text-itec-groups bg-itec-groups/10 border border-itec-groups/20 px-2 py-0.5 rounded-full">Disponible</span>
                      : <span className="text-[10px] font-bold text-itec-description bg-itec-card border border-itec-border px-2 py-0.5 rounded-full">Próximamente</span>
                    }
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-itec-text leading-snug">
                      {cfg ? cfg.titulo : id.charAt(0).toUpperCase() + id.slice(1)}
                    </h3>
                    {cfg && <p className="text-[11px] text-itec-description mt-0.5">{cfg.duracion}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Oferta académica extendida */}
        <section>
          <h2 className="text-sm font-bold text-itec-text flex items-center gap-2 mb-3">
            <span className="w-1 h-5 bg-itec-blue-skye rounded-full" />
            Oferta Académica
          </h2>
          <InstitutionalInfo>{resenias}</InstitutionalInfo>
        </section>

      </div>
    </MainLayout>
  );
};

export default GradePage;
