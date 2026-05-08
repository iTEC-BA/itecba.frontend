import React, { useState } from "react";

interface Props {
  onSend: (v: string) => void;
  loading: boolean;
}

export const ChatInput: React.FC<Props> = ({ onSend, loading }) => {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;

    onSend(value);
    setValue("");
  };

  return (
    <div
      className="
        border-t
        border-itec-border
        bg-itec-box/90
        backdrop-blur-xl
        p-3
        pb-[calc(env(safe-area-inset-bottom)+14px)]
      "
    >
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submit();
            }
          }}
          placeholder="Preguntá lo que quieras..."
          className="
            flex-1
            rounded-full
            border
            border-itec-border
            bg-itec-surface
            px-4
            py-3
            text-sm
            text-white
            outline-none
          "
        />

        <button
          onClick={submit}
          disabled={loading}
          className="
            h-12
            w-12
            rounded-full
            bg-indigo-600
            text-white
            active:scale-95
            transition-all
          "
        >
          →
        </button>
      </div>
    </div>
  );
};
