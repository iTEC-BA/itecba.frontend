import { useState, useCallback } from "react";

export function useOpenFolders(defaultOpen?: string[]) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(
    new Set(defaultOpen ?? [])
  );

  const toggleFolder = useCallback((folderId: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const isOpen = useCallback(
    (folderId: string) => openFolders.has(folderId),
    [openFolders]
  );

  const closeAll = useCallback(() => setOpenFolders(new Set()), []);

  return { toggleFolder, isOpen, closeAll };
}