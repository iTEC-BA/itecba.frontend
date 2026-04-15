import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Icons } from '../atoms/Icons';

interface Props {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<Props> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input);
    setInput(''); // Limpiamos el input después de enviar
  };

  return (
    <div className="p-4 bg-itec-surface/90 border-t border-itec-gray shrink-0 relative z-10">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            placeholder="Escribe tu consulta sobre trámites, materias, fechas..."
            className="w-full bg-itec-bg border border-itec-gray text-white pl-4 pr-10 py-3.5 rounded-xl focus:outline-none focus:border-itec-blue text-sm transition-all shadow-inner disabled:opacity-50"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!input.trim() || disabled} 
          className="rounded-xl px-5 py-3.5 bg-itec-blue border-none text-white disabled:opacity-50 hover:bg-itec-blue-skye shadow-lg transition-transform active:scale-95 flex items-center justify-center"
        >
          <div className="w-5 h-5"><Icons type="send" /></div>
        </Button>
      </form>
    </div>
  );
};