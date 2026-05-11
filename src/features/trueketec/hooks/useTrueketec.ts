// src/features/trueketec/hooks/useTrueketec.ts
import { useState, useEffect, useCallback } from "react";
import { trueketecService } from "../services/trueketec.service";
import type {
  TrueketecPost,
  TrueketecFilters,
  TrueketecFormData,
} from "../types/trueketec.types";

export const useTrueketec = () => {
  const [posts,       setPosts]       = useState<TrueketecPost[]>([]);
  const [matches,     setMatches]     = useState<TrueketecPost[]>([]);
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters,     setFilters]     = useState<TrueketecFilters>({});
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  const loadFeed = useCallback(async (f = filters, page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const [feedData, matchData] = await Promise.all([
        trueketecService.getFeed(f, page),
        trueketecService.getMyMatches(),
      ]);
      setPosts(feedData.posts);
      setTotal(feedData.total);
      setTotalPages(feedData.totalPages);
      setCurrentPage(feedData.page);
      setMatches(matchData.matches);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadFeed(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    await loadFeed();
  };

  const remove = async (id: string) => {
    await trueketecService.deletePost(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
    setTotal((prev) => prev - 1);
  };

  const accept = async (myPostId: string, targetPostId: string) => {
    const result = await trueketecService.acceptMatch(myPostId, targetPostId);
    await loadFeed();
    return result;
  };

  return {
    posts, matches, total, totalPages, currentPage,
    filters, loading, error,
    applyFilters, goToPage, publish, remove, accept, reload: loadFeed,
  };
};
