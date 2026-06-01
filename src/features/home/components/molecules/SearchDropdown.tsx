import React from 'react';
import { SearchResultItem } from '@components/molecules/SearchResultItem';

interface SearchResults {
  cursos: any[];
  aportes: any[];
  grupos: any[];
}

interface Props {
  results: SearchResults | null;
  isLoading: boolean;
  query: string;
  onClose: () => void;
}

export const SearchDropdown: React.FC<Props> = ({ results, isLoading, query, onClose }) => {
  const hasResults = results && (
    results.cursos.length > 0 || results.aportes.length > 0 || results.grupos.length > 0
  );

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-itec-box border border-white/[0.08] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-50 max-h-[70vh] flex flex-col">
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="w-5 h-5 border-2 border-itec-border border-t-itec-blue-skye rounded-full animate-spin" />
          <p className="text-xs text-itec-gray">Buscando...</p>
        </div>
      )}

      {!isLoading && !hasResults && (
        <div className="py-10 text-center px-4">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm font-semibold text-itec-text">Sin resultados para "{query}"</p>
          <p className="text-xs text-itec-gray mt-1">Probá con otro término</p>
        </div>
      )}

      {!isLoading && hasResults && (
        <div className="overflow-y-auto p-3 flex flex-col gap-4">
          {results!.cursos.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-2 px-1">Cursos</p>
              {results!.cursos.map((c: any) => (
                <SearchResultItem
                  key={c.id || c._id}
                  type="curso"
                  title={c.title}
                  subtitle="Ver ruta de aprendizaje"
                  link={`/cursos/${c.id || c._id}`}
                  onClick={onClose}
                />
              ))}
            </div>
          )}
          {results!.aportes.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-2 px-1">Apuntes</p>
              {results!.aportes.map((a: any) => (
                <SearchResultItem
                  key={a.id || a._id}
                  type="aporte"
                  title={a.title}
                  subtitle={`${a.materia} · ${a.tipo}`}
                  link={a.link}
                  isExternal
                  onClick={onClose}
                />
              ))}
            </div>
          )}
          {results!.grupos.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-2 px-1">Grupos</p>
              {results!.grupos.map((g: any) => (
                <SearchResultItem
                  key={g.id || g._id}
                  type="grupo"
                  title={g.materia}
                  subtitle={`Comisión: ${g.comision} · ${(g.carrera || '').toUpperCase()}`}
                  link={g.link}
                  isExternal
                  onClick={onClose}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
