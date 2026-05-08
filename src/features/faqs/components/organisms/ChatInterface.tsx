import React, { useEffect, useRef } from "react";
import { useChatbot } from "../../hooks/useChatbot";
import { ChatMessage } from "../molecules/ChatMessage";
import { ChatInput } from "../molecules/ChatInput";

export const ChatInterface: React.FC = () => {
  const { messages, sendMessage, loading } = useChatbot();
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-itec-background">
      {/* HEADER */}
      <div
        className="
          sticky
          top-0
          z-20
          border-b
          border-itec-border
          bg-itec-box/80
          backdrop-blur-xl
          px-4
          py-3
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              h-12
              w-12
              rounded-full
              bg-linear-to-br
              from-fuchsia-500
              to-indigo-600
              shadow-xl
            "
          />

          <div>
            <h1 className="font-bold text-white">Meta ITEC AI</h1>

            <p className="text-xs text-green-400">En línea</p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div
        ref={scrollRef}
        className="
          flex-1
          overflow-y-auto
          px-3
          py-4
        "
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id}>
              <ChatMessage role={msg.role} text={msg.text} />

              {msg.suggestions && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      className="
                            rounded-full
                            border
                            border-itec-border
                            bg-itec-box
                            px-4
                            py-2
                            text-xs
                            text-itec-text
                            transition-all
                            hover:bg-itec-surface
                          "
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className="
                  rounded-3xl
                  border
                  border-itec-border
                  bg-itec-box
                  px-4
                  py-3
                  text-sm
                  text-gray-400
                "
              >
                Escribiendo...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INPUT */}
      <ChatInput onSend={sendMessage} loading={loading} />
    </div>
  );
};
