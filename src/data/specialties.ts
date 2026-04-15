export interface Specialty {
  code: string;
  name: string;
  colorClass: string;
  carreraValue: string; // El valor que usaremos para filtrar en la base de datos
}

export const ESPECIALIDADES_DB: Specialty[] = [
  { code: 'E', name: 'INGRESO', colorClass: 'border-green-500/30 hover:border-green-500 group-hover:text-green-400', carreraValue: 'ingreso' },
  { code: 'I', name: 'INDUSTRIAL', colorClass: 'border-yellow-500/30 hover:border-yellow-500 group-hover:text-yellow-400', carreraValue: 'industrial' },
  { code: 'K', name: 'SISTEMAS', colorClass: 'border-blue-500/30 hover:border-blue-500 group-hover:text-blue-400', carreraValue: 'sistemas' },
  { code: 'O', name: 'CIVIL', colorClass: 'border-orange-500/30 hover:border-orange-500 group-hover:text-orange-400', carreraValue: 'civil' },
  { code: 'Q', name: 'ELÉCTRICA', colorClass: 'border-amber-500/30 hover:border-amber-500 group-hover:text-amber-400', carreraValue: 'electrica' },
  { code: 'R', name: 'ELECTRÓNICA', colorClass: 'border-red-500/30 hover:border-red-500 group-hover:text-red-400', carreraValue: 'electronica' },
  { code: 'S', name: 'MECÁNICA', colorClass: 'border-gray-400/30 hover:border-gray-400 group-hover:text-gray-300', carreraValue: 'mecanica' },
  { code: 'U', name: 'NAVAL', colorClass: 'border-cyan-500/30 hover:border-cyan-500 group-hover:text-cyan-400', carreraValue: 'naval' },
  { code: 'V', name: 'QUÍMICA', colorClass: 'border-purple-500/30 hover:border-purple-500 group-hover:text-purple-400', carreraValue: 'quimica' },
  { code: 'W', name: 'TEXTIL', colorClass: 'border-pink-500/30 hover:border-pink-500 group-hover:text-pink-400', carreraValue: 'textil' },
  { code: 'Z', name: 'HOMOGÉNEAS I', colorClass: 'border-white/20 hover:border-white group-hover:text-white', carreraValue: 'homogeneas1' },
  { code: 'Z', name: 'HOMOGÉNEAS II', colorClass: 'border-white/20 hover:border-white group-hover:text-white', carreraValue: 'homogeneas2' },
];