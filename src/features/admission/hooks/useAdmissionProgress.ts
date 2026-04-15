import { useState, useEffect } from 'react';

export const useAdmissionProgress = () => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar progreso al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('itec_admission_progress');
    if (saved) {
      try {
        setCompletedSteps(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing admission progress', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar cada vez que cambia
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('itec_admission_progress', JSON.stringify(completedSteps));
    }
  }, [completedSteps, isLoaded]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId) // Lo desmarca
        : [...prev, stepId] // Lo marca
    );
  };

  const getProgressPercentage = (totalSteps: number) => {
    if (totalSteps === 0) return 0;
    return Math.round((completedSteps.length / totalSteps) * 100);
  };

  return { completedSteps, toggleStep, getProgressPercentage, isLoaded };
};