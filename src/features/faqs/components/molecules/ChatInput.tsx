import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Icons } from '@/components/atoms/Icons';

interface Props {
  onSendMessage: (text: string, forceAI?: boolean) => void;
  disabled?: boolean;
  canUseAI: boolean;
  timeLeftAI: string | null;
}

export const ChatInput: React.FC<Props> = ({ onSendMessage, disabled, canUseAI, timeLeftAI }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input, false);
    setInput(''); 
  };

  const handleForceAI = () => {
    if (!input.trim() || disabled || !canUseAI) return;
    onSendMessage(input, true);
    setInput('');
  };

  return (
    <div className="p-4 bg-itec-sidebar border-t border-itec-gray shrink-0 relative z-10 flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            placeholder="Escribe tu consulta aquí..."
            className="w-full bg-itec-bg border border-itec-gray text-white pl-4 pr-10 py-3.5 rounded-xl focus:outline-none focus:border-teal-500 text-sm transition-all shadow-inner disabled:opacity-50"
          />
        </div>
        <Button type="submit" disabled={!input.trim() || disabled} className="rounded-xl px-5 py-3.5 bg-teal-600 hover:bg-teal-500 border-none text-white disabled:opacity-50 shadow-lg">
          <div className="w-5 h-5"><Icons type="send" /></div>
        </Button>
      </form>
      
      {/* Botón Mágico IA */}
      <div className="flex justify-end mt-1">
         <button
            type="button"
            onClick={handleForceAI}
            disabled={!input.trim() || disabled || !canUseAI}
            className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              !canUseAI 
                ? 'bg-transparent text-gray-500 cursor-not-allowed'
                : input.trim() && !disabled 
                  ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white border border-purple-500/30 cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                  : 'bg-transparent text-gray-500 cursor-not-allowed border border-transparent'
            }`}
          >
            <span className="text-[10px]">{canUseAI ? '✨' : '⏳'}</span> 
            {canUseAI ? 'Buscar con IA Avanzada' : `IA disponible en ${timeLeftAI}`}
         </button>
      </div>
    </div>
  );
};