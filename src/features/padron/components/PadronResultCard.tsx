import React from "react";
import { User, BookOpen, MapPin, CheckCircle } from "lucide-react";
import { Button }  from "@components/ui/Button";
import type { PadronData } from "../types/padron.types";

interface Props {
  data:    PadronData;
  onReset: () => void;
}

export const PadronResultCard: React.FC<Props> = ({ data, onReset }) => (
  <div className="bg-itec-box rounded-xl border border-itec-border overflow-hidden">
    <div className="bg-itec-emerald/10 border-b border-itec-emerald/20 p-6 flex items-center gap-3">
      <CheckCircle className="text-itec-emerald h-8 w-8 shrink-0" />
      <div>
        <h3 className="text-base font-bold text-itec-text">¡Empadronado/a para votar!</h3>
        <p className="text-sm text-itec-muted mt-0.5">
          <span className="font-semibold text-itec-text">{data.apellido}, {data.nombre}</span> está habilitado/a.
        </p>
      </div>
    </div>

    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="flex items-start gap-3">
          <MapPin className="text-itec-sky mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-itec-muted">Mesa</p>
            <p className="text-2xl font-extrabold text-itec-sky mt-0.5">{data.mesa}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="text-itec-muted mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-itec-muted">Sede</p>
            <p className="text-sm font-semibold text-itec-text mt-0.5">{data.sede}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <BookOpen className="text-itec-muted mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-itec-muted">Especialidad</p>
            <p className="text-sm font-semibold text-itec-text mt-0.5">{data.especialidad}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-itec-border pt-5 flex justify-center">
        <Button variant="slate" hierarchy="ghost" onClick={onReset} icon={<User size={15} />}>
          Nueva consulta
        </Button>
      </div>
    </div>
  </div>
);
