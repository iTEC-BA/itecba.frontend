import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    // Esto cambiará el título de la pestaña agregando siempre " | ITEC UTN BA"
    document.title = `${title} | ITEC UTN BA`;
  }, [title]);
};