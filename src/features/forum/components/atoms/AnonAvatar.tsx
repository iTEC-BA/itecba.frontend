// src/features/forum/components/atoms/AnonAvatar.tsx
// Avatar determinista basado en el pseudónimo
import React from "react";

const AVATAR_COLORS = [
  "bg-itec-accent",
  "bg-itec-blue",
  "bg-itec-purple",
  "bg-itec-emerald",
  "bg-itec-amber",
  "bg-itec-sky",
  "bg-itec-groups",
  "bg-itec-red",
];

const colorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

interface AnonAvatarProps {
  pseudonym: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

export const AnonAvatar: React.FC<AnonAvatarProps> = ({
  pseudonym,
  size = "md",
}) => {
  const initials = pseudonym.slice(0, 2).toUpperCase();
  const color = colorFromName(pseudonym);

  return (
    <div
      className={`${SIZE_MAP[size]} ${color} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none`}
      aria-label={`Avatar de ${pseudonym}`}
    >
      {initials}
    </div>
  );
};
