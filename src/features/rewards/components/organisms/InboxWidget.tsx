import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { inboxService } from '../../services/inboxService';
import { InboxMessage } from '../../types/rewards';
import { Icons } from '@/components/ui/icons/Icons';

export const InboxWidget: React.FC = () => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = await getAuth().currentUser?.getIdToken();
      if (token) {
        const data = await inboxService.getMyMessages(token);
        setMessages(data);
      }
    };
    fetchMessages();
  }, []);

  const handleRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    const token = await getAuth().currentUser?.getIdToken();
    if (token) {
      await inboxService.markAsRead(id, token);
      setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
    }
  };

  return (
    <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6">
      <h2 className="text-xl font-bold text-itec-textflex items-center gap-2 mb-6">
        <Icons type="message" className="w-5 h-5 " /> Mi Buzón de Avisos
      </h2>
      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm">No tienes mensajes nuevos.</p>
        ) : (
          messages.map(msg => (
            <div 
              key={msg._id} 
              onClick={() => handleRead(msg._id, msg.isRead)}
              className={`p-4 rounded-lg border transition-colors cursor-pointer ${msg.isRead ? 'bg-[#252525] border-[#333]' : 'bg-[#1e293b] border-itec-blue/50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-semibold ${msg.isRead ? 'text-gray-300' : 'text-white'}`}>{msg.subject}</h3>
                <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-itec-text whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};