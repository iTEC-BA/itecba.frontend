// src/features/trueketec/hooks/useTrueketec.ts
import { useState, useEffect, useCallback } from "react";
import { trueketecService } from "../services/trueketec.service";
import type {
  TrueketecPost,
  TrueketecFilters,
  TrueketecFormData,
  EstadoPost,
} from "../types/trueketec.types";

export const useTrueketec = () => {
  const [posts,       setPosts]       = useState<TrueketecPost[]>([]);
  const [myPosts,     setMyPosts]     = useState<TrueketecPost[]>([]);
  const [matches,     setMatches]     = useState<TrueketecPost[]>([]);
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters,     setFilters]     = useState<TrueketecFilters>({});
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Carga inicial: mis posts + mis matches (sin feed hasta que el usuario busque)
  useEffect(() => {
    const init = async () => {
      try {
        const [myData, matchData] = await Promise.all([
          trueketecService.getMyPosts(),
          trueketecService.getMyMatches(),
        ]);
        setMyPosts(myData);
        setMatches(matchData.matches);
      } catch {
        // Silencioso en carga inicial
      }
    };
    init();
  }, []);

  const loadFeed = useCallback(async (f: TrueketecFilters, page: number) => {
    // Sin filtros mínimos, no se lanza query (validación en el componente de filtros)
    const hasComision = (f.comision?.length ?? 0) >= 2;
    const hasFilters  = !!(f.materia && f.departamento && f.turno_deseado);
    if (!hasComision && !hasFilters) return;

    setLoading(true);
    setError(null);
    try {
      const feedData = await trueketecService.getFeed(f, page);
      setPosts(feedData.posts);
      setTotal(feedData.total);
      setTotalPages(feedData.totalPages);
      setCurrentPage(feedData.page);
      setHasSearched(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cargar el feed.");
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = (newFilters: TrueketecFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    loadFeed(newFilters, 1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    loadFeed(filters, page);
  };

  const publish = async (data: TrueketecFormData) => {
    await trueketecService.createPost(data);
    // Refrescar mis posts y matches tras publicar
    const [myData, matchData] = await Promise.all([
      trueketecService.getMyPosts(),
      trueketecService.getMyMatches(),
    ]);
    setMyPosts(myData);
    setMatches(matchData.matches);
    // Si hay un feed cargado, recargarlo
    if (hasSearched) await loadFeed(filters, 1);
  };

  const remove = async (id: string) => {
    await trueketecService.deletePost(id);
    setMyPosts((prev) => prev.filter((p) => p._id !== id));
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  const updateEstadoLocal = (postId: string, estado: EstadoPost) => {
    setMyPosts((prev) => prev.map((p) => p._id === postId ? { ...p, estado } : p));
    setPosts((prev)   => prev.map((p) => p._id === postId ? { ...p, estado } : p));
  };

  const accept = async (myPostId: string, targetPostId: string) => {
    const result = await trueketecService.acceptMatch(myPostId, targetPostId);
    // Refrescar todo
    const [myData, matchData] = await Promise.all([
      trueketecService.getMyPosts(),
      trueketecService.getMyMatches(),
    ]);
    setMyPosts(myData);
    setMatches(matchData.matches);
    if (hasSearched) await loadFeed(filters, currentPage);
    return result;
  };

  return {
    posts, myPosts, matches,
    total, totalPages, currentPage,
    filters, loading, error, hasSearched,
    applyFilters, goToPage,
    publish, remove, accept,
    updateEstadoLocal,
  };
};
