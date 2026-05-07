// src/features/profile/data/carreras.ts
// Lista de carreras ITEC-FRBA para el selector de perfil
import type { CareerOption } from "@features/profile/components/molecules/CareerSelector";

export const CARRERAS_LIST: CareerOption[] = [
  { code: "E",  name: "Ingreso",        colorClass: "bg-green-500/15  border-green-500/30  text-green-400"  },
  { code: "I",  name: "Industrial",     colorClass: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400" },
  { code: "K",  name: "Sistemas",       colorClass: "bg-itec-sky/15   border-itec-sky/30   text-itec-sky"   },
  { code: "O",  name: "Civil",          colorClass: "bg-orange-500/15 border-orange-500/30 text-orange-400" },
  { code: "Q",  name: "Eléctrica",      colorClass: "bg-amber-500/15  border-amber-500/30  text-amber-400"  },
  { code: "R",  name: "Electrónica",    colorClass: "bg-red-500/15    border-red-500/30    text-red-400"    },
  { code: "S",  name: "Mecánica",       colorClass: "bg-gray-400/15   border-gray-400/30   text-gray-300"   },
  { code: "U",  name: "Naval",          colorClass: "bg-cyan-500/15   border-cyan-500/30   text-cyan-400"   },
  { code: "V",  name: "Química",        colorClass: "bg-purple-500/15 border-purple-500/30 text-purple-400" },
  { code: "W",  name: "Textil",         colorClass: "bg-pink-500/15   border-pink-500/30   text-pink-400"   },
];

export default CARRERAS_LIST;
