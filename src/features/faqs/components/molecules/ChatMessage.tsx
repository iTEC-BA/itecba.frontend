import React from "react";

interface Props {
  role: "user" | "assistant";
  text: string;
}

export const ChatMessage: React.FC<Props> = ({ role, text }) => {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[88%]
          rounded-3xl
          px-4
          py-3
          whitespace-pre-wrap
          text-sm
          leading-relaxed
          shadow-xl
          border
          animate-in
          fade-in
          slide-in-from-bottom-2
          ${
            isUser
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "bg-itec-box border-itec-border text-itec-text"
          }
        `}
      >
        {text}
      </div>
    </div>
  );
};
