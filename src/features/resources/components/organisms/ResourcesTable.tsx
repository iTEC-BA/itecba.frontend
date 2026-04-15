import React from 'react';
import { Icons } from '../../../../components/atoms/Icons';
import { Button } from '../../../../components/atoms/Button';
import type { ResourceData } from '../../services/resourcesService';

interface Props {
  resources: ResourceData[];
  isLoading: boolean;
  onAddClick: () => void;
}

export const ResourcesTable: React.FC<Props> = ({ resources, isLoading, onAddClick }) => {
  const getFormatIcon = (format: string) => {
    if (format === 'PDF') return <span className="text-red-400 font-bold">PDF</span>;
    if (format === 'Drive') return <span className="text-green-400 font-bold">DRV</span>;
    return <span className="text-blue-400 font-bold">WEB</span>;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-itec-gray border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-gray-400 mt-4 text-sm font-medium">Cargando aportes de la comunidad...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          Mostrando {resources.length} Aporte{resources.length !== 1 ? 's' : ''}
        </h3>
      </div>

      {resources.length > 0 ? (
        <div className="bg-itec-surface border border-itec-gray rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-itec-bg border-b border-itec-gray">
                <tr>
                  <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Archivo / Título</th>
                  <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Materia & Nivel</th>
                  <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right pr-6">Acción</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((res) => (
                  <tr key={res.id} className="border-b border-itec-gray/30 hover:bg-itec-gray/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-itec-sidebar border border-itec-gray flex items-center justify-center shrink-0 text-gray-400 group-hover:text-orange-400 transition-colors">
                          <div className="w-5 h-5"><Icons type="documentFill" /></div>
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm truncate max-w-[250px] sm:max-w-sm">{res.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                            Formato: {getFormatIcon(res.formato)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-300 font-medium text-sm truncate max-w-[150px]">{res.materia}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5"><span className="capitalize text-orange-400">{res.carrera}</span> • Nivel {res.nivel}</p>
                    </td>
                    <td className="p-4">
                      <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-md text-xs font-bold">
                        {res.tipo}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <a 
                          href={res.link} 
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2.5 bg-itec-bg hover:bg-itec-sidebar border border-itec-gray text-gray-300 hover:text-white rounded-xl transition-all"
                          title="Ver Archivo"
                        >
                          <div className="w-4 h-4"><Icons type="externalLink" /></div>
                        </a>
                        <a 
                          href={res.link} 
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-itec-bg hover:bg-orange-600 border border-itec-gray hover:border-orange-500 text-gray-300 hover:text-white py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          <div className="w-4 h-4"><Icons type="download" /></div>
                          Descargar
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center bg-itec-surface border border-itec-gray rounded-xl p-16">
          <span className="text-5xl block mb-4 opacity-50">📂</span>
          <p className="text-gray-300 text-lg font-bold mb-2">No se encontraron resultados</p>
          <p className="text-gray-500 mb-6 text-sm">No hay apuntes que coincidan con la materia o filtro aplicado.</p>
          <Button variant="primary" onClick={onAddClick} className="bg-orange-600 border-none hover:bg-orange-500 shadow-lg px-6">
            ¡Sé el primero en subir un apunte! (+1 Punto)
          </Button>
        </div>
      )}
    </div>
  );
};