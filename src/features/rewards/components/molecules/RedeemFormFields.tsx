import React from "react";
import { Input } from "@components/ui/Input";
import type { RewardType, RedemptionPayload } from "../../types/rewards";

interface Props {
  type: RewardType;
  value: Partial<RedemptionPayload>;
  onChange: (v: Partial<RedemptionPayload>) => void;
}

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-[11px] font-bold text-itec-text/50 uppercase tracking-wider mb-1.5">
    {children}
  </label>
);

export const RedeemFormFields: React.FC<Props> = ({ type, value, onChange }) => {
  const update = (patch: Partial<RedemptionPayload>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-4">
      {type === "mentorship" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Fecha preferida *</Label>
              <Input
                type="date"
                required
                fullWidth
                value={value.date ?? ""}
                onChange={(e) => update({ date: e.target.value })}
              />
            </div>
            <div>
              <Label>Hora preferida *</Label>
              <Input
                type="time"
                required
                fullWidth
                value={value.time ?? ""}
                onChange={(e) => update({ time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Temas / dudas *</Label>
            <textarea
              required
              rows={3}
              placeholder="Ej: Ayuda con punteros, arquitectura MVC..."
              value={value.notes ?? ""}
              onChange={(e) => update({ notes: e.target.value })}
              className="w-full bg-itec-bg border border-white/8 text-itec-text text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-itec-blue-skye transition-colors resize-none placeholder:text-itec-text/25"
            />
          </div>
        </>
      )}

      {type === "event" && (
        <div>
          <Label>Nota adicional</Label>
          <textarea
            rows={2}
            placeholder="Algo que quieras aclarar sobre tu asistencia..."
            value={value.notes ?? ""}
            onChange={(e) => update({ notes: e.target.value })}
            className="w-full bg-itec-bg border border-white/8 text-itec-text text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-itec-blue-skye transition-colors resize-none placeholder:text-itec-text/25"
          />
        </div>
      )}

      <div>
        <Label>
          {type === "group_access"
            ? "Tu WhatsApp (con código de área) *"
            : type === "mentorship"
            ? "Email o teléfono de contacto *"
            : "Email de contacto *"}
        </Label>
        <Input
          type="text"
          required
          fullWidth
          placeholder={
            type === "group_access"
              ? "+54 9 11 1234-5678"
              : "tucorreo@frba.utn.edu.ar"
          }
          value={value.contact ?? ""}
          onChange={(e) => update({ contact: e.target.value })}
        />
      </div>
    </div>
  );
};
