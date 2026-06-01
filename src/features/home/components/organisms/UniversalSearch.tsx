import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Icons } from '@components/ui/icons/Icons';
import { SearchDropdown } from '@features/home/components/molecules/SearchDropdown';
import { coursesService } from '@features/courses/services/coursesService';
import { groupsService } from '@features/groups/services/groupsService';
import { resourcesService } from '@features/resources/services/resourcesService';

export const UniversalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [dbGroups, setDbGroups] = useState<any[]>([]);
  const [dbResources, setDbResources] = useState<any[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    if (hasFetched || isLoading) return;
    setIsLoading(true);
    try {
      const cached = sessionStorage.getItem('itec_search_cache');
      if (cached) {
        const { courses, groups, resources, ts } = JSON.parse(cached);
        if (Date.now() - ts < 600000) {
          setDbCourses(courses);
          setDbGroups(groups);
          setDbResources(resources);
          setHasFetched(true);
          setIsLoading(false);
          return;
        }
      }
      const [courses, groups, resources] = await Promise.all([
        coursesService.getCourses(),
        groupsService.getPendingGroups(),
        resourcesService.getApprovedResources(),
      ]);
      setDbCourses(courses);
      setDbGroups(groups);
      setDbResources(resources);
      setHasFetched(true);
      sessionStorage.setItem('itec_search_cache', JSON.stringify({
        courses, groups, resources, ts: Date.now(),
      }));
    } catch (e) {
      console.error('Error cargando datos de búsqueda', e);
    } finally {
      setIsLoading(false);
    }
  }, [hasFetched, isLoading]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return {
      cursos: dbCourses
        .filter(c => c.title.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q))
        .slice(0, 5),
      aportes: dbResources
        .filter(r => r.title.toLowerCase().includes(q) || r.materia.toLowerCase().includes(q))
        .slice(0, 4),
      grupos: dbGroups
        .filter(g => g.materia.toLowerCase().includes(q) || g.comision.toLowerCase().includes(q))
        .slice(0, 3),
    };
  }, [query, dbCourses, dbGroups, dbResources]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative w-full max-w-2xl" ref={wrapRef}>
      <div className={`flex items-center gap-2 bg-itec-box border rounded-xl px-4 py-2.5 transition-all duration-150 ${
        isOpen ? 'border-itec-blue-skye/40' : 'border-white/[0.08] hover:border-white/15'
      }`}>
        <div className="w-4 h-4 shrink-0 text-itec-gray">
          <Icons type="search" />
        </div>
        <input
          type="text"
          placeholder="Buscar materias, apuntes, grupos..."
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); fetchData(); }}
          onFocus={() => { setIsOpen(true); fetchData(); }}
          className="flex-1 bg-transparent text-itec-text text-sm placeholder:text-itec-gray/50 outline-none min-w-0"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="text-itec-gray hover:text-itec-text transition-colors shrink-0"
          >
            <Icons type="close" className="w-3.5 h-3.5" />
          </button>
        )}
        <span className="hidden sm:inline text-[10px] text-itec-gray/40 font-mono border border-itec-border rounded px-1 shrink-0">
          ⌘K
        </span>
      </div>

      {isOpen && query.trim() && (
        <SearchDropdown
          results={results}
          isLoading={isLoading && !hasFetched}
          query={query}
          onClose={() => { setIsOpen(false); setQuery(''); }}
        />
      )}
    </div>
  );
};
