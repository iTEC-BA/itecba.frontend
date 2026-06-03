import React, { useState } from "react";
import {
  Search,
  Loader2,
  Info,
  MapPin,
  GraduationCap,
  Vote,
  CheckCircle2,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { fetchPadronUTN } from "@features/padron/api/padron.api";
import { PadronData } from "@features/padron/types/padron.types";
import { LayoutModal } from "@components/templates/LayoutModal";

// ─── Datos completos de mesas por especialidad ───────────────────────────────
// Fuente: fiscales en campo, 3/6/26

interface Mesa {
  mesa: string;
  apellidos: string;
  ubicacion: string;
  piso?: string;
}

interface Especialidad {
  nombre: string;
  icon: string;
  accentClass: string;         // border + text accent color
  bgAccentClass: string;       // subtle bg tint for header
  mesas: Mesa[];
}

const especialidades: Especialidad[] = [
  {
    nombre: "Sistemas",
    icon: "💻",
    accentClass: "border-itec-red text-itec-red",
    bgAccentClass: "bg-itec-red/10",
    mesas: [
      { mesa: "C77K", apellidos: "Abadia – Arnaudain", ubicacion: "Oficina 11", piso: "PB" },
      { mesa: "C78K", apellidos: "Arnes – Bolañio",    ubicacion: "Oficina 11", piso: "PB" },
      { mesa: "C79K", apellidos: "Bole – Caseta",      ubicacion: "Pasillo Oficina 11 / Aula 115", piso: "1°" },
      { mesa: "C80K", apellidos: "C – D",              ubicacion: "Oficina 11", piso: "PB" },
      { mesa: "C81K", apellidos: "Crespo – Escobar",   ubicacion: "Aula 4", piso: "PB" },
      { mesa: "C82K", apellidos: "Escobar – Garragua",  ubicacion: "Aula 4", piso: "PB" },
      { mesa: "C83K", apellidos: "Garavagno – Grosso", ubicacion: "Pasillo Principal", piso: "PB" },
      { mesa: "C84K", apellidos: "G – L",              ubicacion: "Subsuelo", piso: "SS" },
      { mesa: "C85K", apellidos: "L – M",              ubicacion: "Subsuelo", piso: "SS" },
      { mesa: "C86K", apellidos: "L – N",              ubicacion: "Aula 131", piso: "1°" },
      { mesa: "C87K", apellidos: "N – P",              ubicacion: "Aula 115", piso: "1°" },
      { mesa: "C88K", apellidos: "P – R",              ubicacion: "Aula 134", piso: "1°" },
      { mesa: "C89K", apellidos: "Q – R",              ubicacion: "Aula 102", piso: "1°" },
      { mesa: "C90K", apellidos: "R – S",              ubicacion: "Aula 284", piso: "2°" },
      { mesa: "C91K", apellidos: "S – T",              ubicacion: "Aula 262", piso: "2°" },
      { mesa: "C92K", apellidos: "T – Z",              ubicacion: "Aula 282", piso: "2°" },
    ],
  },
  {
    nombre: "Mecánica",
    icon: "⚙️",
    accentClass: "border-itec-rewards text-itec-rewards",
    bgAccentClass: "bg-itec-rewards/10",
    mesas: [
      { mesa: "C60S", apellidos: "A – C",  ubicacion: "Subsuelo",          piso: "SS" },
      { mesa: "C61S", apellidos: "C – G",  ubicacion: "Subsuelo",          piso: "SS" },
      { mesa: "C62S", apellidos: "G – M",  ubicacion: "Aula 165",          piso: "1°" },
      { mesa: "C63S", apellidos: "M – R",  ubicacion: "Control Impresiones / Lab 4", piso: "1°" },
      { mesa: "C64S", apellidos: "R – Z",  ubicacion: "Lab 4 (Laboratorio)", piso: "1°" },
    ],
  },
  {
    nombre: "Electrónica",
    icon: "⚡",
    accentClass: "border-itec-groups text-itec-groups",
    bgAccentClass: "bg-itec-groups/10",
    mesas: [
      { mesa: "C54Q", apellidos: "A – L",   ubicacion: "Aula 57 (Edif. Eléctrica)", piso: "PB" },
      { mesa: "C55Q", apellidos: "L – Z",   ubicacion: "Edif. Eléctrica",            piso: "PB" },
      { mesa: "C56R", apellidos: "A – L",   ubicacion: "Consultorio Médico",         piso: "1°" },
      { mesa: "C57R", apellidos: "C – LL",  ubicacion: "Lab 2 (Edif. Física)",       piso: "PB" },
      { mesa: "C58R", apellidos: "LL – R",  ubicacion: "Lab 4 (Edif. Física)",       piso: "PB" },
      { mesa: "C59R", apellidos: "R – Z",   ubicacion: "Jefatura de Lab",            piso: "PB" },
    ],
  },
  {
    nombre: "Civil",
    icon: "🏗️",
    accentClass: "border-itec-red-skye text-itec-red-skye",
    bgAccentClass: "bg-itec-red-skye/10",
    mesas: [
      { mesa: "C69O", apellidos: "A – C",  ubicacion: "Subsuelo",                     piso: "SS" },
      { mesa: "C70O", apellidos: "L – Q",  ubicacion: "Edif. Eléctrica (1° der.)",    piso: "1°" },
      { mesa: "C71O", apellidos: "Q – Z",  ubicacion: "1° piso, mano derecha",        piso: "1°" },
      { mesa: "C690", apellidos: "A – L",  ubicacion: "Aula 113",                     piso: "1°" },
      { mesa: "C700", apellidos: "Lesca – Quiroz", ubicacion: "Frente al Zoom / Aula 153", piso: "1°" },
    ],
  },
  {
    nombre: "Eléctrica",
    icon: "🔌",
    accentClass: "border-itec-red text-itec-red",
    bgAccentClass: "bg-itec-red/10",
    mesas: [
      { mesa: "C54Q", apellidos: "A – L",  ubicacion: "Aula 57",         piso: "PB" },
      { mesa: "C55Q", apellidos: "L – Z",  ubicacion: "Edif. Eléctrica", piso: "PB" },
    ],
  },
  {
    nombre: "Química",
    icon: "🧪",
    accentClass: "border-itec-groups text-itec-groups",
    bgAccentClass: "bg-itec-groups/10",
    mesas: [
      { mesa: "C65V", apellidos: "A – F",  ubicacion: "Subsuelo",           piso: "SS" },
      { mesa: "C66V", apellidos: "F – O",  ubicacion: "Aula 28",            piso: "PB" },
      { mesa: "C67V", apellidos: "O – Z",  ubicacion: "Sala de Estudio",    piso: "PB" },
    ],
  },
  {
    nombre: "Industrial",
    icon: "🏭",
    accentClass: "border-itec-rewards text-itec-rewards",
    bgAccentClass: "bg-itec-rewards/10",
    mesas: [
      { mesa: "C73I", apellidos: "C – G",  ubicacion: "Sala de Prof. Industrial", piso: "PB" },
      { mesa: "C74I", apellidos: "G – M",  ubicacion: "Sala de Prof. Industrial", piso: "PB" },
      { mesa: "C75I", apellidos: "M – R",  ubicacion: "Sala de Prof. Industrial", piso: "PB" },
      { mesa: "C76I", apellidos: "R – Z",  ubicacion: "Sala de Prof. Industrial", piso: "PB" },
      { mesa: "C72I", apellidos: "A – C",  ubicacion: "Altura Aula 117",          piso: "1°" },
      { mesa: "6721", apellidos: "Industrial general", ubicacion: "Altura Aula 117", piso: "1°" },
    ],
  },
  {
    nombre: "Naval",
    icon: "⚓",
    accentClass: "border-itec-blue text-itec-text",
    bgAccentClass: "bg-itec-blue/20",
    mesas: [
      { mesa: "C93W", apellidos: "A – M",  ubicacion: "Aula 114",           piso: "1°" },
      { mesa: "C94U", apellidos: "M – Z",  ubicacion: "Aula 116",           piso: "1°" },
    ],
  },
  {
    nombre: "Textil",
    icon: "🧵",
    accentClass: "border-itec-groups text-itec-groups",
    bgAccentClass: "bg-itec-groups/10",
    mesas: [
      { mesa: "C93W", apellidos: "General", ubicacion: "Aula 114",          piso: "1°" },
    ],
  },
];

// ─── Componente tarjeta de especialidad ──────────────────────────────────────

interface TarjetaEspecialidadProps {
  esp: Especialidad;
}

const PisoTag: React.FC<{ piso?: string }> = ({ piso }) => {
  if (!piso) return null;
  const colorMap: Record<string, string> = {
    SS: "bg-itec-blue/30 text-itec-text border-itec-blue/40",
    PB: "bg-itec-card border-itec-border text-itec-gray",
    "1°": "bg-itec-sidebar border-itec-border text-itec-text",
    "2°": "bg-itec-box border-itec-border text-itec-gray",
  };
  const cls = colorMap[piso] ?? "bg-itec-card border-itec-border text-itec-gray";
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md border text-[10px] font-bold whitespace-nowrap ${cls}`}>
      {piso}
    </span>
  );
};

const TarjetaEspecialidad: React.FC<TarjetaEspecialidadProps> = ({ esp }) => {
  const [expandida, setExpandida] = useState(false);
  const visible = expandida ? esp.mesas : esp.mesas.slice(0, 3);

  return (
    <div className={`bg-itec-card border-2 ${esp.accentClass.split(" ")[0]} rounded-2xl overflow-hidden shadow-sm flex flex-col transition-shadow hover:shadow-lg hover:shadow-black/30`}>
      {/* Cabecera de tarjeta */}
      <div className={`${esp.bgAccentClass} border-b border-itec-border px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{esp.icon}</span>
          <div>
            <h3 className={`font-extrabold text-sm uppercase tracking-wide ${esp.accentClass.split(" ")[1]}`}>
              {esp.nombre}
            </h3>
            <p className="text-[10px] text-itec-gray mt-0.5">{esp.mesas.length} mesa{esp.mesas.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <Building2 size={16} className="text-itec-gray opacity-50" />
      </div>

      {/* Filas de mesas */}
      <div className="flex flex-col divide-y divide-itec-border/60 flex-1">
        {visible.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 hover:bg-itec-box/60 transition-colors"
          >
            {/* Badge de mesa */}
            <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold whitespace-nowrap ${esp.accentClass}`}>
              {m.mesa}
            </span>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-itec-text truncate">
                {m.apellidos}
              </p>
              <p className="text-[11px] text-itec-gray truncate mt-0.5 flex items-center gap-1">
                <MapPin size={10} className="shrink-0" />
                {m.ubicacion}
              </p>
            </div>

            {/* Piso */}
            <PisoTag piso={m.piso} />
          </div>
        ))}
      </div>

      {/* Ver más / menos */}
      {esp.mesas.length > 3 && (
        <button
          onClick={() => setExpandida(!expandida)}
          className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-t border-itec-border transition-colors ${esp.bgAccentClass} ${esp.accentClass.split(" ")[1]} hover:opacity-80`}
        >
          {expandida ? (
            <><ChevronUp size={14} /> Mostrar menos</>
          ) : (
            <><ChevronDown size={14} /> Ver {esp.mesas.length - 3} mesas más</>
          )}
        </button>
      )}
    </div>
  );
};

// ─── Componente principal ────────────────────────────────────────────────────

export const PadronPage: React.FC = () => {
  const [dni, setDni]               = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [padronData, setPadronData] = useState<PadronData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim() || dni.length < 7) return;

    setIsLoading(true);
    setError(null);

    const response = await fetchPadronUTN(dni.trim());

    if (response.success && response.data) {
      setPadronData(response.data);
      setIsModalOpen(true);
    } else {
      setError(response.error || "No te encontramos en el padrón. Verificá el DNI.");
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10 bg-itec-bg text-itec-text min-h-screen">

      {/* ── Cabecera ─────────────────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-itec-text tracking-tight flex items-center justify-center gap-3">
          <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-itec-red" />
          Padrón Estudiantil
        </h1>
        <p className="text-itec-gray text-sm md:text-lg">
          Consultá tu mesa exacta con tu DNI y encontrá tu aula en el mapa de especialidades.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">

        {/* ── Columna izquierda: Buscador + Recordatorio ───────────────── */}
        <div className="lg:col-span-4 space-y-4 top-24">

          {/* Buscador */}
          <div className="bg-itec-sidebar border border-itec-border p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-itec-text mb-6 flex items-center gap-2 border-b border-itec-border pb-4">
              <Search className="text-itec-red" size={20} /> Búsqueda Rápida
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-itec-gray mb-2">
                  Documento o Legajo
                </label>
                <input
                  type="number"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="Ingresá tu DNI..."
                  className="w-full bg-itec-bg border-2 border-itec-border text-itec-text rounded-xl p-4 text-lg focus:outline-none focus:border-itec-red focus:ring-1 focus:ring-itec-red transition-all outline-none placeholder:text-itec-gray/50"
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 text-sm text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-in fade-in zoom-in duration-200">
                  <Info size={18} className="mt-0.5 flex-shrink-0" />
                  <p className="leading-tight">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || dni.length < 7}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-itec-red text-white font-bold rounded-xl hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-lg shadow-lg shadow-itec-red/20"
              >
                {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Search size={22} />}
                {isLoading ? "Consultando..." : "Buscar mi Mesa"}
              </button>
            </form>
          </div>

          {/* Recordatorio de boletas */}
          <div className="bg-itec-card border-2 border-itec-red/40 rounded-2xl overflow-hidden">
            <div className="bg-itec-red/10 border-b border-itec-red/20 px-4 py-3 flex items-center gap-2">
              <Vote size={18} className="text-itec-red" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-itec-red">
                Recordatorio de Boletas
              </h3>
            </div>
            <div className="px-4 py-4 space-y-1">
              <p className="text-[11px] text-itec-gray mb-3 leading-relaxed">
                ⚠️ Las boletas de iTEC fueron <strong className="text-itec-text">cortadas</strong>.
                Para votarnos debés colocar las <strong className="text-itec-red">3 boletas juntas</strong> en el sobre.
              </p>
              {[
                { label: "CONSEJO BÁSICAS",   sub: "Universidades nacionales" },
                { label: "CONSEJO DE CARRERA", sub: "Tu especialidad" },
                { label: "CONSEJO DIRECTIVO",  sub: "Gobierno de la facultad" },
              ].map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-itec-box border border-itec-border rounded-xl px-3 py-2.5"
                >
                  <CheckCircle2 size={18} className="text-itec-red shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-itec-text leading-tight">{b.label}</p>
                    <p className="text-[10px] text-itec-gray">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Columna derecha: Grilla de tarjetas por especialidad ─────── */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2 text-itec-red border-b border-itec-border pb-4">
            <MapPin size={22} />
            <h2 className="text-xl font-bold text-itec-text">
              Distribución de Mesas — <span className="text-itec-red">Campus UTN FRBA</span>
            </h2>
          </div>

          {/* Leyenda de pisos */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            {[
              { label: "Subsuelo (SS)",  cls: "bg-itec-blue/30 text-itec-text border-itec-blue/40" },
              { label: "Planta Baja (PB)", cls: "bg-itec-card border-itec-border text-itec-gray" },
              { label: "1° Piso",        cls: "bg-itec-sidebar border-itec-border text-itec-text" },
              { label: "2° Piso",        cls: "bg-itec-box border-itec-border text-itec-gray" },
            ].map((p) => (
              <span key={p.label} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold ${p.cls}`}>
                {p.label}
              </span>
            ))}
          </div>

          {/* Grilla de tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
            {especialidades.map((esp, idx) => (
              <TarjetaEspecialidad key={idx} esp={esp} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal global reutilizable ────────────────────────────────────── */}
      {isModalOpen && padronData && (
        <LayoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Resultado del Padrón"
          description="Tu información de empadronamiento"
        >
          <div className="space-y-6 p-4">
            {/* Mesa asignada */}
            <div className="bg-itec-red/10 border border-itec-red/20 rounded-2xl p-6 flex flex-col items-center text-center gap-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-itec-red to-transparent opacity-50" />
              <p className="text-xs font-bold uppercase tracking-widest text-itec-gray">
                Tu Mesa Asignada
              </p>
              <p className="text-6xl md:text-7xl font-extrabold text-itec-red leading-none my-2 drop-shadow-sm">
                {padronData.mesa}
              </p>
              <p className="text-sm text-itec-text flex items-center gap-2 bg-itec-bg px-4 py-2 rounded-full border border-itec-border mt-2 shadow-sm font-medium">
                <MapPin size={16} className="text-itec-red" /> {padronData.sede}
              </p>
            </div>

            {/* Datos del estudiante */}
            <div className="bg-itec-sidebar border border-itec-border rounded-2xl p-6 space-y-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-itec-gray mb-1">
                  Estudiante Habilitado
                </p>
                <p className="text-xl font-bold text-itec-text capitalize">
                  {padronData.apellido.toLowerCase()}, {padronData.nombre.toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-itec-gray mb-1">
                  Especialidad
                </p>
                <p className="text-base font-semibold text-itec-red">
                  {padronData.especialidad}
                </p>
              </div>
            </div>

            {/* Recordatorio boletas en modal */}
            <div className="bg-itec-red/5 border border-itec-red/20 rounded-xl p-4">
              <p className="text-xs font-bold text-itec-red uppercase tracking-wider mb-3 flex items-center gap-2">
                <Vote size={14} /> No olvidés tus 3 boletas de iTEC
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {["CONSEJO\nBÁSICAS", "CONSEJO\nCARRERA", "CONSEJO\nDIRECTIVO"].map((b, i) => (
                  <div key={i} className="bg-itec-card border border-itec-red/20 rounded-lg px-2 py-2.5">
                    <CheckCircle2 size={14} className="text-itec-red mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-itec-text whitespace-pre-line leading-tight">{b}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-itec-gray bg-itec-bg/50 border border-itec-border p-4 rounded-xl flex items-center justify-center gap-2">
              <Info size={18} className="text-itec-red flex-shrink-0" />
              <span>Presentate con tu <strong className="text-itec-text">DNI físico</strong> o credencial universitaria.</span>
            </div>
          </div>
        </LayoutModal>
      )}
    </div>
  );
};

export default PadronPage;