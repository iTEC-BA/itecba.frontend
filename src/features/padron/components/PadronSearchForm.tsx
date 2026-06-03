import React, { useState } from "react";
import { Search }  from "lucide-react";
import { Button }  from "@components/ui/Button";
import { Input }   from "@components/ui/Input";

interface Props {
  onSearch:  (dni: string) => void;
  isLoading: boolean;
}

export const PadronSearchForm: React.FC<Props> = ({ onSearch, isLoading }) => {
  const [docNumber, setDocNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docNumber.trim().length >= 6) onSearch(docNumber.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-itec-muted mb-2">
          Número de Documento o Legajo
        </label>
        <Input
          type="number"
          value={docNumber}
          onChange={(e) => setDocNumber(e.target.value)}
          placeholder="Ej. 12345678"
          required
          fullWidth
          className="bg-itec-bg border-2 border-itec-border focus:border-itec-sky rounded-xl p-4 text-lg transition-colors"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        hierarchy="solid"
        fullWidth
        isLoading={isLoading}
        disabled={docNumber.length < 6}
        icon={<Search size={18} />}
        className="py-3 text-sm"
      >
        {isLoading ? "Procesando consulta..." : "Buscar en el Padrón"}
      </Button>
    </form>
  );
};
