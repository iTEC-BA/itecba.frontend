import React, { useState } from "react";
import { ProgressTable } from "../molecules/ProgressTable";
import { GradeModal } from "../molecules/GradeModal";
import { MetricCard, StressMonitor, PromocionadasCard } from "../atoms/Widgets";
import { Button } from "@components/ui/Button";
import { CustomSelect } from "@components/ui/CustomSelect";
import { CAREER_NAMES } from "../../data/careers.data";
import type {
  CareerProgress,
  Subject,
  UpdateSubjectArgs,
} from "../../types/progress";

interface Props {
  data: CareerProgress;
  onUpdateStatus: (args: UpdateSubjectArgs) => void;
  onSwitchCareer: (careerId: string) => void;
  onRemoveCareer: (careerId: string) => void;
}

type ModalState =
  | { isOpen: false }
  | {
      isOpen: true;
      subject: Subject;
      targetStatus: "aprobada" | "regular" | "promocionada";
    };

// ── Inner component con clave de carrera para remount limpio ──────────────────
const DashboardContent: React.FC<Props> = ({
  data,
  onUpdateStatus,
  onSwitchCareer,
  onRemoveCareer,
}) => {
  const [modal, setModal] = useState<ModalState>({ isOpen: false });
  const { metrics, subjects } = data;

  const levels = Array.from(new Set(subjects.map((s) => s.level))).sort(
    (a, b) => a - b,
  );
  const [activeLevel, setActiveLevel] = useState<number>(levels[0] ?? 1);

  const availableCareersToAdd = Object.keys(CAREER_NAMES).filter(
    (c) => !data.enrolledCareers.includes(c),
  );

  const handleActionClick = (subject: Subject, action: string) => {
    if (
      action === "aprobada" ||
      action === "regular" ||
      action === "promocionada"
    ) {
      setModal({ isOpen: true, subject, targetStatus: action });
      return;
    }
    onUpdateStatus({ id: subject.id, status: action });
  };

  const handleModalConfirm = (
    id: string,
    status: string,
    grade?: number,
    year?: number,
  ) => {
    onUpdateStatus({ id, status, grade, year });
    setModal({ isOpen: false });
  };

  const levelSubjects = subjects.filter((s) => s.level === activeLevel);
  const addCareerOptions = availableCareersToAdd.map((c) => ({
    value: c,
    label: CAREER_NAMES[c] ?? c,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-itec-text tracking-tight">
            Progreso Académico
          </h1>
          <p className="text-sm text-gray-500 mt-1">{data.careerName}</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {data.enrolledCareers.map((careerId) => (
            <Button
              key={careerId}
              onClick={() => onSwitchCareer(careerId)}
              variant={
                careerId === data.activeCareerId ? "danger" : "danger"
              }
              hierarchy={careerId === data.activeCareerId ? "solid" : "dashed"}
              text={
                careerId
              }
              className="uppercase"
            />
          ))}

          {data.enrolledCareers.length < 2 && addCareerOptions.length > 0 && (
            <CustomSelect
              value=""
              options={addCareerOptions}
              onChange={(val) => {
                if (val) onSwitchCareer(val);
              }}
              placeholder="+ Agregar carrera"
            />
          )}

          {data.enrolledCareers.length > 1 && (
            <Button
              onClick={() => onRemoveCareer(data.activeCareerId)}
              variant="danger"
              hierarchy="ghost"
              text="− Quitar carrera"
            />
          )}
        </div>
      </div>

      {/* ── Estado vacío: carrera sin plan de estudios cargado ──── */}
      {subjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center border border-dashed border-itec-gray/40 rounded-xl">
          <span className="text-5xl">📋</span>
          <div>
            <p className="text-itec-text font-semibold text-lg">
              Plan de estudios no disponible
            </p>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">
              El plan para <strong>{data.careerName}</strong> no está cargado en
              este momento. Seleccioná otra carrera o contactá al equipo de
              iTEC.
            </p>
          </div>
        </div>
      )}

      {/* ── Métricas (solo si hay materias) ──────────────────────── */}
      {subjects.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-3">
              <MetricCard
                title="Avance Plan"
                value={`${metrics.porcentajeAvance}%`}
                subtitle={`${metrics.aprobadas + metrics.promocionadas} / ${metrics.total} materias`}
                icon="🎓"
                highlight="text-itec-blue-skye"
              />
              <MetricCard
                title="Aprobadas"
                value={metrics.aprobadas}
                subtitle="Final rendido"
                icon="✅"
                highlight="text-green-400"
              />
              <MetricCard
                title="Regularizadas"
                value={metrics.regulares}
                subtitle="Pendiente final"
                icon="📋"
              />
              <MetricCard
                title="Promedio"
                value={metrics.promedio}
                subtitle="Sobre materias aprobadas"
                icon="📊"
                highlight="text-yellow-400"
              />
              <MetricCard
                title="Cursando"
                value={metrics.cursando}
                subtitle="Materias este cuatrimestre"
                icon="📚"
                highlight="text-fuchsia-400"
              />
            </div>
            <div className="flex gap-3 md:flex-col">
              <PromocionadasCard count={metrics.promocionadas} />
              <StressMonitor
                horas={metrics.horasSemanales}
                nivel={metrics.nivelEstres}
              />
            </div>
          </div>
          {metrics.vencimientosProximos.length > 0 && (
            <div className="bg-itec-accent/5 border border-itec-accent/20 rounded-xl p-5 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-itec-accent mb-2">
                ⚠️ Vencimientos
              </span>
              <div className="space-y-1">
                {metrics.vencimientosProximos.slice(0, 3).map((s) => (
                  <div key={s.id} className="text-xs text-itec-text truncate">
                    {s.name}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                Regularidad &gt; 3 años
              </p>
            </div>
              )}
          {/* ── Tabs de año — usa Button global ───────────────────── */}
          <div className="flex flex-wrap gap-2">
            {levels.map((lvl) => {
              const lvlSubs = subjects.filter((s) => s.level === lvl);
              const aprobadas = lvlSubs.filter(
                (s) => s.status === "aprobada" || s.status === "promocionada",
              ).length;
              const pct =
                lvlSubs.length > 0
                  ? Math.round((aprobadas / lvlSubs.length) * 100)
                  : 0;
              const isActive = activeLevel === lvl;
              return (
                <Button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  variant="primary"
                  hierarchy={isActive ? "outline" : "ghost"}
                  className={`rounded-t-xl rounded-b-none border-b-2 ${
                    isActive
                      ? "border-itecBlue"
                      : "border-transparent text-gray-500 hover:text-itec-text"
                  }`}
                >
                  <span>{lvl === 0 ? "Ingreso" : `Año ${lvl}`}</span>
                  <span
                    className={`text-[10px] font-mono ml-1 ${pct === 100 ? "text-green-400" : "text-gray-500"}`}
                  >
                    {pct}%
                  </span>
                </Button>
              );
            })}
          </div>

          {/* ── Tabla del año activo ───────────────────────────────── */}
          <ProgressTable
            level={activeLevel}
            subjects={levelSubjects}
            allSubjects={subjects}
            onActionClick={handleActionClick}
          />
        </>
      )}

      {/* ── Modal de confirmación ─────────────────────────────────── */}
      {modal.isOpen && (
        <GradeModal
          subject={modal.subject}
          targetStatus={modal.targetStatus}
          onClose={() => setModal({ isOpen: false })}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
};

// Wrapper con `key` para forzar remount limpio al cambiar carrera.
export const ProgressDashboard: React.FC<Props> = (props) => (
  <DashboardContent key={props.data.activeCareerId} {...props} />
);
