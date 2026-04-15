import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '../atoms/Button';
import { Icons } from '../atoms/Icons'; 
import logoItec from '../../assets/logo.png'; 

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ITEC_FOOTER = "\n\n---\n*💡 Recuerda que siempre puedes consultar en nuestros grupos de WhatsApp o en nuestro [Instagram oficial @itecba](https://instagram.com/itecba).*";

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy ITEC Bot (IA). ¿En qué te puedo ayudar hoy con respecto a la UTN?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al fondo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    
    // Añadir mensaje del usuario al estado local (sin localStorage)
    const tempMessages: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(tempMessages);
    setIsLoading(true);

    try {
      // Llamada al backend en lugar de usar la SDK directamente en el frontend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          // Enviamos el historial para que la IA tenga contexto
          history: tempMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          }))
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const data = await response.json();
      const responseText = data.response + ITEC_FOOTER;

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);

    } catch (error) {
      console.error("Error al consultar al backend:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Ocurrió un error al conectar con el servidor. Intenta nuevamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-itec-surface border border-itec-gray rounded-2xl w-80 sm:w-87.5 h-112.5 shadow-2xl flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          
          <div className="bg-itec-blue text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logoItec} alt="Bot Logo" className="w-8 h-8 object-contain bg-white rounded-full p-0.5 shadow-md" />
              <div>
                <h3 className="font-bold leading-tight">ITEC Bot (IA)</h3>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest">Servidor Activo</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-800 p-1 rounded transition-colors">
              <div className="w-5 h-5">
                 <Icons type="close" />
              </div>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-itec-bg/50">
            {messages.map((msg, index) => (
              <div key={index} className={`max-w-[85%] p-3.5 rounded-2xl text-[14px] ${
                msg.role === 'user' 
                  ? 'bg-itec-blue text-white self-end rounded-tr-sm shadow-md' 
                  : 'bg-itec-sidebar text-itec-text border border-itec-gray self-start rounded-tl-sm shadow-md'
              }`}>
                {msg.role === 'user' ? (
                  msg.text
                ) : (
                  <ReactMarkdown 
                    components={{
                      strong: ({ ...props}) => <span className="font-bold text-white" {...props} />,
                      p: ({ ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                      ul: ({ ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                      ol: ({ ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                      li: ({ ...props}) => <li className="pl-1" {...props} />,
                      a: ({ ...props}) => <a className="text-blue-400 font-medium hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                      hr: ({ ...props}) => <hr className="border-itec-gray my-3" {...props} />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="bg-itec-sidebar text-gray-400 p-3.5 rounded-2xl text-sm self-start rounded-tl-sm w-16 flex justify-center border border-itec-gray shadow-md">
                <span className="animate-pulse font-bold tracking-widest">...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-itec-gray bg-itec-sidebar">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Escribe tu duda..."
                className="flex-1 bg-itec-surface border border-itec-gray text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-itec-blue disabled:opacity-50 text-sm transition-colors"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="px-4 rounded-xl flex items-center justify-center">
                 <div className="w-[18px] h-[18px]">
                    <Icons type="send" />
                 </div>
              </Button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center cursor-pointer border border-white/10 ${isOpen ? 'bg-itec-sidebar text-gray-400 hover:bg-itec-gray' : 'bg-itec-blue text-white hover:bg-blue-700'}`}
      >
        <div className={isOpen ? "w-6 h-6" : "w-7 h-7"}>
           <Icons type={isOpen ? "close" : "message"} />
        </div>
      </button>
    </div>
  );
};