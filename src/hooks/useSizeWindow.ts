  import { useEffect, useState } from 'react';

  /**
   * useSizeWindow - hook para obtener el ancho y alto de la ventana.
   *
   * Uso:
   * const { width, height } = useSizeWindow();
   *
   * Ejemplo en un componente React:
   * function MyComponent() {
   *   const { width, height } = useSizeWindow();
   *
   *   return (
   *     <div>
   *       <p>Width: {width}px</p>
   *       <p>Height: {height}px</p>
   *     </div>
   *   );
   * }
   *
   * El hook se suscribe al evento 'resize' y devuelve un objeto con las
   * propiedades `width` y `height`. En entornos server-side (SSR) devuelve 0.
   */

  type WindowSize = {
    width: number;
    height: number;
  };

  const getWindowSize = (): WindowSize => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  export default function useSizeWindow() {
    const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize());

    useEffect(() => {
      const handleResize = () => {
        setWindowSize(getWindowSize());
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const md = windowSize.width > 768;
    return { windowSize, md };
  }
