import React from "react";
import { useEmailExceptions } from "@features/emailExceptions/hooks/useEmailExceptions";
import { EmailExceptionForm } from "@features/emailExceptions/components/molecules/EmailExceptionForm";
import { EmailExceptionsTable } from "@features/emailExceptions/components/molecules/EmailExceptionsTable";
import { Icons } from "@components/ui/icons/Icons";

export const EmailExceptionsManagement: React.FC = () => {
  const { entries, isLoading, addMutation, removeMutation } = useEmailExceptions();

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted mb-1">Control de acceso</p>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Icons type="lock" className="w-5 h-5" /> Excepciones de correo
        </h2>
        <p className="text-xs text-itec-muted mt-1">
          Autorizá correos no institucionales a ingresar con contraseña.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.8fr] items-start">
        <EmailExceptionForm addMutation={addMutation} />
        <EmailExceptionsTable entries={entries} isLoading={isLoading} removeMutation={removeMutation} />
      </div>
    </div>
  );
};

export default EmailExceptionsManagement;
