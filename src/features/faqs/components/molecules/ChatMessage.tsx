import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Icons } from '@/components/atoms/Icons';

interface Props {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const ChatMessage: React.FC<Props> = ({ role, text, timestamp }) => {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);
  
  const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 🟢 NUEVA FUNCIONALIDAD: Copiar mensaje
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 group`}>
      <div className={`flex max-w-[90%] md:max-w-[85%] gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
        
        {/* Usuario o Logo de ITEC */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mb-1 overflow-hidden ${
          isUser 
            ? 'bg-gradient-to-tr from-blue-600 to-blue-400 text-white' 
            : ' p-1'
        }`}>
          {isUser ? (
            <div className="w-4 h-4"><Icons type="info" /></div>
          ) : (
            <img src="/logo.png" alt="Bot" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
          )}
        </div>

        {/* Burbuja y Controles */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3.5 text-[14px] shadow-sm relative ${
            isUser 
              ? 'bg-itec-blue text-white rounded-2xl rounded-br-sm' 
              : 'bg-itec-surface border border-itec-gray text-gray-200 rounded-2xl rounded-bl-sm'
          }`}>
            {isUser ? (
              <p className="leading-relaxed">{text}</p>
            ) : (
              <ReactMarkdown 
                components={{
                  strong: ({...props}) => <span className="font-bold text-teal-400" {...props} />,
                  p: ({...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                  ul: ({...props}) => <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-300" {...props} />,
                  li: ({...props}) => <li className="marker:text-teal-500" {...props} />,
                  a: ({...props}) => <a className="text-blue-400 font-medium hover:underline flex items-center gap-1 inline-flex" target="_blank" rel="noopener noreferrer" {...props} />,
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          </div>
          
          {/* Fila debajo del mensaje: Hora y Botón Copiar */}
          <div className="flex items-center gap-3 mt-1 px-1">
            <span className="text-[10px] text-gray-500 font-medium">
              {timeString} {isUser && '✓'}
            </span>
            
            {/* 🟢 BOTÓN COPIAR (Solo aparece en mensajes del bot y se revela al pasar el mouse en PC, o siempre visible en celular de forma sutil) */}
            {!isUser && (
              <button 
                onClick={handleCopy}
                className="text-[10px] flex items-center gap-1 text-gray-500 hover:text-teal-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                {copied ? <span className="text-green-500">¡Copiado!</span> : '📋 Copiar'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};