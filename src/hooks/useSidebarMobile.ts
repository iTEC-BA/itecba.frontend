// src/hooks/useSidebarMobile.ts
// Hook global para controlar el estado del sidebar en mobile.
// Usa un estado global simple (sin Context) para que TopNavbar y Sidebar
// puedan compartir el mismo valor sin prop-drilling.

import { useState, useCallback } from "react";

// ── Singleton global ─────────────────────────────────────────────────────────
// Esto es un patrón ligero de estado compartido sin Redux ni Context.
// Si prefieres Context, mueve esto a src/context/SidebarContext.tsx.
let _isOpen = false;
const _listeners = new Set<(val: boolean) => void>();

function setGlobal(val: boolean) {
  _isOpen = val;
  _listeners.forEach((fn) => fn(val));
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export const useSidebarMobile = () => {
  const [isOpen, setIsOpen] = useState(_isOpen);

  // Suscribirse a cambios globales
  if (!_listeners.has(setIsOpen)) {
    _listeners.add(setIsOpen);
  }

  const open = useCallback(() => setGlobal(true), []);
  const close = useCallback(() => setGlobal(false), []);
  const toggle = useCallback(() => setGlobal(!_isOpen), []);

  return { isOpen, open, close, toggle };
};