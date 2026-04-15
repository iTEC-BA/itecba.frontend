// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // 🔴 NUEVO IMPORT

import './index.css'
import App from './App'

// 🔴 CONFIGURACIÓN DEL CACHÉ
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita peticiones si cambias de pestaña y vuelves
      staleTime: 1000 * 60 * 5,    // Los datos se consideran "frescos" por 5 minutos (evita spam a la DB)
      retry: 1,                    // Si falla una petición, reintenta 1 vez
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 🔴 ENVUELVE LA APP */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)