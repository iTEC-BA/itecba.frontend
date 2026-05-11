import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Props {
  onSendMessage: (text?: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<Props> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input);
    setInput(''); // Limpiamos el input después de enviar
  };

  return (
    <div className="p-4 bg-itec-box/90 border-t border-itec-gray shrink-0 relative z-10">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            placeholder="Escribe tu consulta sobre trámites, materias, fechas..."
            fullWidth
            className="pr-10 text-sm disabled:opacity-50"
          />
        </div>
        <Button 
            type="submit" 
            variant="primary" 
            hierarchy="solid" 
            disabled={!input.trim() || disabled} 
            icon="send" 
            className='cursor-pointer'
          />
      </form>
    </div>
  );
};
