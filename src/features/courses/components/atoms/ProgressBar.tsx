import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-itec-gray rounded-full h-2.5 my-2 overflow-hidden">
      <div 
        className="bg-itec-blue h-2.5 rounded-full transition-all duration-500" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};