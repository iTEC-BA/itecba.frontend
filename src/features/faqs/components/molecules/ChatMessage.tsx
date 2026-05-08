import React from "react";
import ReactMarkdown from "react-markdown";
import { TypingDots } from "../atoms/TypingDots";
import type { ChatMessage as Msg } from "../../types/faqs";

interface Props { msg: Msg }

export const ChatMessage: React.FC<Props> = ({ msg }) => {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="max-w-[78%] bg-[#1d4ed8] text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-lg">
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Avatar asistente */}
      <div className="w-8 h-8 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        {msg.isLoading ? (
          <div className="bg-white/[0.06] border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
            <TypingDots />
          </div>
        ) : (
          <>
            <div className={`bg-white/[0.06] border rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-white/90 ${
              msg.isAI ? "border-violet-500/20" : "border-white/8"
            }`}>
              {msg.isAI && (
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/8">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">IA Avanzada</span>
                </div>
              )}
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                  li: ({ children }) => <li className="text-white/80">{children}</li>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{children}</a>
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>

            {/* Sugerencias */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {msg.suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="text-[11px] text-white/50 bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 px-3 py-1 rounded-full transition-all active:scale-95"
                    onClick={() => {
                      const input = document.getElementById("chat-input") as HTMLInputElement;
                      if (input) { input.value = s; input.focus(); }
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
