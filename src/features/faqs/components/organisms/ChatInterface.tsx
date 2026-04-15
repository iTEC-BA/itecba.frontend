import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../molecules/ChatMessage';
import { ChatInput } from '../molecules/ChatInput';
import { Icons } from '@/components/atoms/Icons';
import { useAuth } from '../../../../context/AuthContext';
import { useChatbot } from '../../hooks/useChatbot';

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isAiGenerated?: boolean;
  suggestions?: string[]; // 🟢 AÑADIMOS EL TIPO AQUÍ
}

const INITIAL_SUGGESTIONS = ["¿Cuándo me anoto a cursar?", "¿Cómo veo los grupos de WhatsApp?", "¿Cuándo son los exámenes finales?"];

export const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const userEmail = user?.email || 'invitado'; 
  
  const { messages, isTyping, canUseAI, timeLeftAI, handleSendMessage, clearChat } = useChatbot(userEmail);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="bg-itec-surface border border-itec-gray rounded-3xl shadow-2xl flex flex-col h-[650px] relative overflow-hidden animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-itec-gray bg-itec-sidebar flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-md relative p-1">
             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10"></span>
             <img src="/logo.png" alt="ITEC Logo" className="w-full h-full object-contain rounded-full" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg leading-tight">ITEC Bot</h2>
            <p className="text-[11px] text-teal-400 font-medium uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span> En línea
            </p>
          </div>
        </div>
        <button onClick={clearChat} title="Limpiar chat" className="w-8 h-8 flex items-center justify-center rounded-full bg-itec-bg border border-itec-gray text-gray-400 hover:text-white hover:bg-itec-gray transition-colors">
          <Icons type="close" className="w-4 h-4" />
        </button>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col gap-6 bg-gradient-to-b from-itec-bg/30 to-itec-bg/10">
        
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col w-full">
            <ChatMessage role={msg.role} text={msg.text} timestamp={msg.timestamp} />
            
            {/* 🟢 RENDERIZAMOS LAS SUGERENCIAS DEL BOT SI EXISTEN */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-start mt-3 ml-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {msg.suggestions.map((sug, i) => (
                  <button 
                    key={i} onClick={() => handleSendMessage(sug)}
                    className="bg-itec-sidebar border border-itec-gray text-teal-400 hover:bg-teal-600 hover:border-teal-500 hover:text-white transition-all px-4 py-2 rounded-xl text-[11px] md:text-xs shadow-sm font-medium"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Sugerencias Iniciales */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 justify-start mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {INITIAL_SUGGESTIONS.map((sug, i) => (
              <button key={i} onClick={() => handleSendMessage(sug)} className="bg-itec-bg border border-itec-gray text-gray-300 hover:border-teal-500 hover:text-white transition-all px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow-teal-500/10">
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Escribiendo... */}
        {isTyping && (
          <div className="flex w-full justify-start animate-in fade-in duration-200">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 overflow-hidden p-1 shadow-sm bg-white">
                 <img src="/logo.png" alt="ITEC Logo" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-itec-surface border border-itec-gray flex gap-1.5 items-center h-[42px] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500/70 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500/70 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500/70 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} canUseAI={canUseAI} timeLeftAI={timeLeftAI} />
    </div>
  );
};