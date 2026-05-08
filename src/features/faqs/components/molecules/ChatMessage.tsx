// src/features/faqs/components/molecules/ChatMessage.tsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Icons } from "@/components/ui/icons/Icons";
import { cn } from "@/lib/utils";

interface Props {
  role: "user" | "model";
  text?: string;
  timestamp: Date;
  isAiGenerated?: boolean;
}

// SVG Copy inline (no depende de Icons si no existe "copy" ahí)
const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Icono usuario inline
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const ChatMessage: React.FC<Props> = ({ role, text, timestamp, isAiGenerated }) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const timeString = timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(text ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[90%] gap-2 md:max-w-[85%] items-end",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "mb-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full",
            isUser
              ? "border border-itec-sky/30 bg-itec-sky/20"
              : "p-1 border border-itec-border bg-itec-surface"
          )}
        >
          {isUser ? (
            <UserIcon className="h-4 w-4 text-itec-sky" />
          ) : (
            <img
              src="/logo.png"
              alt="ITEC Bot"
              className="h-full w-full object-contain"
            />
          )}
        </div>

        {/* Burbuja + metadata */}
        <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
          {/* Burbuja */}
          <div
            className={cn(
              "relative px-4 py-3 text-sm shadow-sm",
              isUser
                ? "rounded-2xl rounded-br-sm border border-itec-sky/20 bg-itec-sky/15 text-itec-text"
                : "rounded-2xl rounded-bl-sm border border-itec-border bg-itec-box text-itec-text/90"
            )}
          >
            {isAiGenerated && (
              <div className="mb-2 flex items-center gap-1.5">
                <div className="h-3 w-3 text-itec-sky">
                  <Icons type="star" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-itec-sky">
                  IA
                </span>
              </div>
            )}

            {isUser ? (
              <p className="leading-relaxed">{text}</p>
            ) : (
              <ReactMarkdown
                components={{
                  strong: ({ ...props }) => (
                    <span className="font-bold text-itec-text" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="mb-3 last:mb-0 leading-relaxed text-itec-text/90" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="mb-3 list-disc space-y-1 pl-5 text-itec-muted" {...props} />
                  ),
                  li: ({ ...props }) => (
                    <li className="marker:text-itec-sky" {...props} />
                  ),
                  a: ({ ...props }) => (
                    <a
                      className="inline-flex items-center gap-1 font-medium text-itec-sky hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  code: ({ ...props }) => (
                    <code
                      className="rounded-lg border border-itec-border bg-itec-surface/80 px-1.5 py-0.5 font-mono text-xs text-itec-sky"
                      {...props}
                    />
                  ),
                  hr: () => (
                    <hr className="my-3 border-itec-border/50" />
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          </div>

          {/* Hora + copiar */}
          <div className="mt-1 flex items-center gap-3 px-1">
            <span className="text-[10px] font-medium text-itec-muted">{timeString}</span>

            {!isUser && (
              <button
                onClick={handleCopy}
                className={cn(
                  "flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-[10px] font-bold transition-all",
                  "opacity-0 group-hover:opacity-100 focus:opacity-100",
                  copied
                    ? "border-itec-emerald/20 bg-itec-emerald/10 text-itec-emerald"
                    : "border-itec-border bg-itec-surface/60 text-itec-muted hover:text-itec-text"
                )}
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-2.5 w-2.5" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-2.5 w-2.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
