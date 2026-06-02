// GradeDetailPage.tsx — Vista informativa de carrera (<100 líneas)
import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { MainLayout }       from '@components/templates/MainLayout';
import { PageHeader }       from '@components/ui/PageHeader';
import { MarkdownContent }  from '@components/ui/MarkdownContent';
import { Button }           from '@components/ui/Button';
import { Icons }            from '@components/ui/icons/Icons';
import { GRADE_CONFIGS }    from '@features/grade/config';
import { useMaterias }      from '@features/grade/hooks/useMaterias';
import { GradeMediaSlider } from '@features/grade/components/molecules/GradeMediaSlider';
import { GradePlanSection } from '@features/grade/components/organisms/GradePlanSection';
import { GradeInfoSection } from '@features/grade/components/organisms/GradeInfoSection';

const GradeDetailPage: React.FC = () => {
  const { carreraId } = useParams<{ carreraId: string }>();
  const config = carreraId ? GRADE_CONFIGS[carreraId] : null;
  const { byCode, loading: loadingDB } = useMaterias(carreraId ?? '');

  if (!config) return <Navigate to="/grado" replace />;

  return (
    <MainLayout>
      <div className="w-full max-w-4xl mx-auto px-1 py-2 space-y-8">

        {/* Botón volver */}
        <Link to="/grado">
          <Button
            variant="secondary"
            hierarchy="ghost"
            icon={<Icons type="arrowLeft" className="w-3.5 h-3.5" />}
            text="Volver a carreras"
            className="text-xs"
          />
        </Link>

        {/* 1. Header de página */}
        <PageHeader
          title={config.titulo}
          description={config.descripcion}
          icon={<Icons type="degree" className="w-6 h-6" />}
          colorTheme="blue"
        >
          <div className="flex gap-2 flex-wrap">
            <span className="text-[11px] bg-itec-box border border-itec-border text-itec-description font-medium px-3 py-1.5 rounded-lg">
              🕐 {config.duracion}
            </span>
            <span className="text-[11px] bg-itec-box border border-itec-border text-itec-description font-medium px-3 py-1.5 rounded-lg">
              🎓 {config.grado}
            </span>
          </div>
        </PageHeader>

        {/* 2. Descripción en Markdown */}
        {config.descripcionMd && (
          <div className="bg-itec-card border border-itec-border rounded-xl p-5">
            <MarkdownContent content={config.descripcionMd} />
          </div>
        )}

        {/* 3. Media Slider */}
        {config.media.length > 0 && <GradeMediaSlider media={config.media} />}

        {/* 4. Plan de Estudios */}
        <GradePlanSection plan={config.plan} byCode={byCode} loadingDB={loadingDB} />

        {/* 5. Información importante */}
        <GradeInfoSection info={config.info} />

      </div>
    </MainLayout>
  );
};

export default GradeDetailPage;
