import React, { useState, useMemo, useEffect, useRef } from "react";
import { Icons } from "../../../../components/atoms/Icons";
import { SearchResultItem } from "../../../../components/molecules/SearchResultItem";

import { coursesService, type CourseData } from "../../../courses/services/coursesService";
import { groupsService, type GroupData } from "../../../groups/services/groupsService";
import { resourcesService, type ResourceData } from "../../../resources/services/resourcesService";

export const UniversalSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Estados de datos
  const [dbCourses, setDbCourses] = useState<CourseData[]>([]);
  const [dbGroups, setDbGroups] = useState<GroupData[]>([]);
  const [dbResources, setDbResources] = useState<ResourceData[]>([]);
  
  // Estado para saber si ya pedimos los datos al servidor y evitar peticiones duplicadas
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔴 LAZY FETCHING: Solo cargamos la base de datos cuando el usuario interactúa
  const fetchSearchDataIfNeeded = async () => {
    if (hasFetchedData || isLoading) return; 
    
    setIsLoading(true);
    try {
      // 🛡️ 1. REVISAR EL CACHÉ PRIMERO
      const cachedData = sessionStorage.getItem('itec_search_cache');
      if (cachedData) {
        const { courses, groups, resources, timestamp } = JSON.parse(cachedData);
        // Si los datos tienen menos de 10 minutos (600000 milisegundos), usamos el caché
        if (Date.now() - timestamp < 600000) {
          setDbCourses(courses);
          setDbGroups(groups);
          setDbResources(resources);
          setHasFetchedData(true);
          setIsLoading(false);
          return; // Cortamos acá, no llamamos a la base de datos
        }
      }

      // 🌐 2. SI NO HAY CACHÉ O ESTÁ VIEJO, PEDIMOS AL SERVIDOR
      const [courses, groups, resources] = await Promise.all([
        coursesService.getCourses(),
        groupsService.getApprovedGroups(),
        resourcesService.getApprovedResources()
      ]);
      
      setDbCourses(courses);
      setDbGroups(groups);
      setDbResources(resources);
      setHasFetchedData(true); 

      // 💾 3. GUARDAMOS EN CACHÉ PARA LA PRÓXIMA VEZ
      sessionStorage.setItem('itec_search_cache', JSON.stringify({
        courses,
        groups,
        resources,
        timestamp: Date.now()
      }));

    } catch (error) {
      console.error("Error al cargar datos para el buscador", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrado 
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    return {
      cursos: dbCourses.filter((c) => c.title.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q)),
      aportes: dbResources.filter((r) => r.title.toLowerCase().includes(q) || r.materia.toLowerCase().includes(q)).slice(0, 4),
      grupos: dbGroups.filter((g) => g.materia.toLowerCase().includes(q) || g.comision.toLowerCase().includes(q)).slice(0, 3),
    };
  }, [searchQuery, dbCourses, dbGroups, dbResources]);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center mb-8 relative flex-col gap-4 lg:flex-row z-50">
      <div className="relative w-full max-w-2xl" ref={searchRef}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5">
          <Icons type="search" />
        </div>
        
        <input
          type="text"
          placeholder="Buscar apuntes, materias, grupos..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            fetchSearchDataIfNeeded(); // 🚀 Pedimos los datos solo cuando escribe
            setIsSearchOpen(true);
          }}
          onFocus={() => {
            setIsSearchOpen(true);
            fetchSearchDataIfNeeded(); // 🚀 O pedimos los datos si hace clic en el input
          }}
          className="bg-itec-surface border border-itec-gray text-white pl-12 pr-4 py-3 rounded-2xl w-full focus:outline-none focus:border-itec-blue transition-colors shadow-lg"
        />

        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute top-full mt-2 w-full bg-itec-surface border border-itec-gray rounded-xl shadow-2xl overflow-hidden max-h-[70vh] flex flex-col z-40">
            <div className="overflow-y-auto p-4 custom-scrollbar flex flex-col gap-6">
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                   <div className="w-6 h-6 border-2 border-itec-gray border-t-itec-blue rounded-full animate-spin"></div>
                   <p className="text-xs text-gray-500">Conectando a la base de datos...</p>
                </div>
              ) : searchResults ? (
                <>
                  {/* Categoría: Cursos */}
                  {searchResults.cursos.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Cursos & Clases</h4>
                      {searchResults.cursos.map((curso) => {
                        const cursoId = curso.id || (curso as any)._id;
                        return (
                          <SearchResultItem 
                            key={cursoId}
                            type="curso"
                            title={curso.title}
                            subtitle="Ver ruta de aprendizaje"
                            link={`/cursos/${cursoId}`}
                            onClick={() => setIsSearchOpen(false)}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Categoría: Aportes */}
                  {searchResults.aportes.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Apuntes & Resúmenes</h4>
                      {searchResults.aportes.map((aporte) => {
                        const aporteId = aporte.id || (aporte as any)._id;
                        return (
                          <SearchResultItem 
                            key={aporteId}
                            type="aporte"
                            title={aporte.title}
                            subtitle={`${aporte.materia} • ${aporte.tipo}`}
                            link={aporte.link}
                            isExternal
                            onClick={() => setIsSearchOpen(false)}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Categoría: Grupos */}
                  {searchResults.grupos.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Grupos de WhatsApp</h4>
                      {searchResults.grupos.map((grupo) => {
                        const grupoId = grupo.id || (grupo as any)._id;
                        return (
                          <SearchResultItem 
                            key={grupoId}
                            type="grupo"
                            title={grupo.materia}
                            subtitle={`Comisión: ${grupo.comision} • ${grupo.carrera.toUpperCase()}`}
                            link={grupo.link}
                            isExternal
                            onClick={() => setIsSearchOpen(false)}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Sin resultados */}
                  {searchResults.cursos.length === 0 && searchResults.aportes.length === 0 && searchResults.grupos.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-gray-500 text-sm">No encontramos resultados para "{searchQuery}"</p>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};