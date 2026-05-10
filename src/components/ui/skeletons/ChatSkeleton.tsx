// ChatSkeleton.tsx — Skeleton para la interfaz de chat (FAQs page)
import React from "react";

export const ChatMessageSkeleton: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => (
  <div className={`flex ${isUser ? "justify-end" : "items-start gap-3"} mb-4 animate-pulse`}>
    {!isUser && (
      <div className="w-8 h-8 rounded-2xl bg-white/8 border border-white/10 shrink-0" />
    )}
    <div
      className={`rounded-2xl px-4 py-3 ${
        isUser
          ? "bg-[#1d4ed8]/30 rounded-br-sm w-48"
          : "bg-white/5 border border-white/8 rounded-tl-sm w-72"
      }`}
    >
      <div className="space-y-2">
        <div className="h-3 bg-white/10 rounded-md w-full" />
        <div className="h-3 bg-white/10 rounded-md w-4/5" />
        {!isUser && <div className="h-3 bg-white/10 rounded-md w-2/3" />}
      </div>
    </div>
  </div>
);

export const ChatSkeleton: React.FC = () => (
  <div className="px-4 py-4 max-w-2xl mx-auto w-full">
    <ChatMessageSkeleton />
    <ChatMessageSkeleton isUser />
    <ChatMessageSkeleton />
    <ChatMessageSkeleton isUser />
  </div>
);
