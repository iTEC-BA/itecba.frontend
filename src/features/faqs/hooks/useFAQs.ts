import { useState, useEffect, useCallback } from "react";
import { faqService } from "../services/faqService";
import type { FAQ, AIContext } from "../types/faqs";

export const useFAQs = () => {
  const [faqs, setFaqs]           = useState<FAQ[]>([]);
  const [topFaqs, setTopFaqs]     = useState<FAQ[]>([]);
  const [aiContext, setAIContext]  = useState<AIContext | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const [allFaqs, top] = await Promise.all([
        faqService.getAll(),
        faqService.getTop(),
      ]);
      setFaqs(allFaqs);
      setTopFaqs(top);
    } catch (err) {
      console.error(err);
      setError("Error cargando FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadContext = useCallback(async () => {
    try {
      const ctx = await faqService.getAIContext();
      setAIContext(ctx);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (data: Partial<FAQ>) => {
    const faq = await faqService.create(data);
    setFaqs(prev => [faq, ...prev]);
    return faq;
  };

  const update = async (id: string, data: Partial<FAQ>) => {
    const updated = await faqService.update(id, data);
    setFaqs(prev => prev.map(f => f._id === id ? updated : f));
    return updated;
  };

  const remove = async (id: string) => {
    await faqService.remove(id);
    setFaqs(prev => prev.filter(f => f._id !== id));
  };

  const updateContext = async (data: Partial<AIContext>) => {
    const ctx = await faqService.updateAIContext(data);
    setAIContext(ctx);
    return ctx;
  };

  const clearCache = async () => {
    await faqService.clearPromptCache();
  };

  return {
    faqs, topFaqs, aiContext, loading, error,
    load, loadContext,
    create, update, remove,
    updateContext, clearCache,
  };
};
