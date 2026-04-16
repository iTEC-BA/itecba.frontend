import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute h-full w-full animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        <div className="h-8 w-8 animate-pulse rounded-full bg-blue-600"></div>
      </div>
      <p className="text-sm font-medium text-gray-500 animate-pulse">
        Cargando módulo...
      </p>
    </div>
  );
};

export default LoadingState;