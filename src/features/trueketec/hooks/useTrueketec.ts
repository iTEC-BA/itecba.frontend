import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@context/AuthContext";
import { trueketecService } from "../services/trueketec.service";
import type { TrueketecPost, TrueketecFilters, TrueketecFormData, EstadoPost } from "../types/trueketec.types";

export const getMyCareerDept = (specialty?: string): string => {
  if (!specialty) return ""; 
  const s = specialty.toLowerCase();
  if (s.includes("sistemas")) return "Sistemas de Información";
  if (s.includes("mecánica") || s.includes("mecanica")) return "Mecánica";
  if (s.includes("electrónica") || s.includes("electronica")) return "Electrónica";
  if (s.includes("eléctrica") || s.includes("electrica")) return "Eléctrica";
  if (s.includes("civil")) return "Civil";
  if (s.includes("industrial")) return "Industrial";
  if (s.includes("química") || s.includes("quimica")) return "Química";
  if (s.includes("naval")) return "Naval";
  if (s.includes("textil")) return "Textil";
  return "";
};

export const useTrueketec = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
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

  const allowedDepts = useMemo(() => {
    const depts = ["Ciencias Básicas"];
    const myDept = getMyCareerDept(user?.specialty);
    if (myDept && !depts.includes(myDept)) depts.push(myDept);
    return depts;
  }, [user?.specialty]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const init = async () => {
      try {
        const [myData, matchData] = await Promise.all([
          trueketecService.getMyPosts(),
          trueketecService.getMyMatches(),
        ]);
        setMyPosts(myData);
        setMatches(matchData.matches);
      } catch { /* silencio en carga inicial */ }
    };
    init();
  }, [authLoading, isAuthenticated]);

  const loadFeed = useCallback(async (f: TrueketecFilters, page: number) => {
    const hasComision = (f.comision?.length ?? 0) >= 2;
    const hasFilters  = !!(f.materia && f.departamento && f.turno_deseado);
    if (!hasComision && !hasFilters) return;

    setLoading(true); setError(null);
    try {
      const feedData = await trueketecService.getFeed(f, page);
      const filteredPosts = feedData.posts.filter(p => allowedDepts.includes(p.departamento));
      
      setPosts(filteredPosts);
      setTotal(filteredPosts.length < feedData.total ? filteredPosts.length : feedData.total);
      setTotalPages(feedData.totalPages);
      setCurrentPage(feedData.page);
      setHasSearched(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cargar el directorio.");
    } finally {
      setLoading(false);
    }
  }, [allowedDepts]);

  const applyFilters = (newFilters: TrueketecFilters) => {
    setFilters(newFilters); setCurrentPage(1); loadFeed(newFilters, 1);
  };
  const goToPage = (page: number) => {
    setCurrentPage(page); loadFeed(filters, page);
  };
  const publish = async (data: TrueketecFormData) => {
    await trueketecService.createPost(data);
    const [myData, matchData] = await Promise.all([trueketecService.getMyPosts(), trueketecService.getMyMatches()]);
    setMyPosts(myData); setMatches(matchData.matches);
    if (hasSearched) await loadFeed(filters, 1);
  };
  const remove = async (id: string) => {
    await trueketecService.deletePost(id);
    setMyPosts(prev => prev.filter(p => p._id !== id));
    setPosts(prev => prev.filter(p => p._id !== id));
  };
  const updateEstadoLocal = (postId: string, estado: EstadoPost) => {
    setMyPosts(prev => prev.map(p => p._id === postId ? { ...p, estado } : p));
    setPosts(prev => prev.map(p => p._id === postId ? { ...p, estado } : p));
  };
  const accept = async (myPostId: string, targetPostId: string) => {
    const result = await trueketecService.acceptMatch(myPostId, targetPostId);
    const [myData, matchData] = await Promise.all([trueketecService.getMyPosts(), trueketecService.getMyMatches()]);
    setMyPosts(myData); setMatches(matchData.matches);
    if (hasSearched) await loadFeed(filters, currentPage);
    return result;
  };

  return {
    posts, myPosts, matches, allowedDepts, total, totalPages, currentPage,
    filters, loading, error, hasSearched,
    applyFilters, goToPage, publish, remove, accept, updateEstadoLocal,
  };
};
