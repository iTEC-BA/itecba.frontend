import React from 'react';

export const MentionsPanel: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 px-6 text-center">
    <div className="text-5xl opacity-30">@</div>
    <p className="font-bold text-itec-text text-lg">No hay menciones nuevas</p>
    <p className="text-sm text-itec-muted leading-relaxed">
      Cuando alguien te mencione con <span className="text-purple-400">@tuapodo</span>, aparecerá aquí.
    </p>
  </div>
);
