/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Icons } from "./icons/Icons";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "purple"
  | "orange"
  | "teal"
  | "slate";

export type ButtonHierarchy = "solid" | "outline" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** El color temático del botón */
  variant?: ButtonVariant;
  /** El peso visual del botón */
  hierarchy?: ButtonHierarchy;
  /** Si debe ocupar el 100% del contenedor */
  fullWidth?: boolean;
  /** Icono a la izquierda del texto */
  icon?: string;
  /** Icono a la derecha del texto */
  iconRight?: string;
  /** Estado de carga (muestra un spinner y deshabilita el botón) */
  isLoading?: boolean;
  /** Texto del botón (opcional, también se puede usar children) */
  text?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  hierarchy = "solid",
  fullWidth = false,
  icon,
  iconRight,
  isLoading = false,
  text,
  className = "",
  disabled,
  ...props
}) => {
  // 1. Clases Base (Estructura, tipografía, accesibilidad y animaciones)
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-3 py-1 text-sm font-semibold rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-itec-bg active:scale-[0.98]";
  const widthStyles = fullWidth ? "w-full" : "w-fit";
  const disabledStyles =
    disabled || isLoading
      ? "opacity-50 cursor-not-allowed pointer-events-none"
      : "cursor-pointer";

  // 2. Diccionario de Temas (Combinación de Color + Jerarquía Visual)
  const getThemeStyles = () => {
    const themes: Record<ButtonVariant, Record<ButtonHierarchy, string>> = {
      primary: {
        solid:
          "bg-itec-blue-skye text-white hover:bg-itec-blue shadow-lg shadow-itec-blue/20",
        outline:
          "border-2 border-itec-blue-skye text-itec-blue-skye hover:bg-itec-blue-skye/10",
        ghost: "text-itec-blue-skye hover:bg-itec-blue-skye/10",
      },
      secondary: {
        solid: "bg-white/10 text-white hover:bg-white/20 border border-white/5",
        outline:
          "border-2 border-itec-gray text-itec-gray hover:text-white hover:bg-white/5 hover:border-white/20",
        ghost: "text-itec-gray hover:text-white hover:bg-white/10",
      },
      success: {
        solid:
          "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20",
        outline:
          "border-2 border-emerald-600 text-emerald-500 hover:bg-emerald-600/10",
        ghost: "text-emerald-500 hover:bg-emerald-600/10",
      },
      danger: {
        solid:
          "bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-900/20",
        outline: "border-2 border-rose-600 text-rose-500 hover:bg-rose-600/10",
        ghost: "text-rose-500 hover:bg-rose-600/10",
      },
      warning: {
        solid:
          "bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-900/20",
        outline:
          "border-2 border-amber-500 text-amber-500 hover:bg-amber-500/10",
        ghost: "text-amber-500 hover:bg-amber-500/10",
      },
      purple: {
        solid:
          "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20",
        outline:
          "border-2 border-purple-600 text-purple-500 hover:bg-purple-600/10",
        ghost: "text-purple-500 hover:bg-purple-600/10",
      },
      orange: {
        solid:
          "bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-900/20",
        outline:
          "border-2 border-orange-600 text-orange-500 hover:bg-orange-600/10",
        ghost: "text-orange-500 hover:bg-orange-600/10",
      },
      teal: {
        solid:
          "bg-teal-600 text-white hover:bg-teal-500 shadow-lg shadow-teal-900/20",
        outline: "border-2 border-teal-600 text-teal-500 hover:bg-teal-600/10",
        ghost: "text-teal-500 hover:bg-teal-600/10",
      },
      slate: {
        solid:
          "bg-slate-700 text-white hover:bg-slate-600 shadow-lg shadow-slate-900/20",
        outline:
          "border-2 border-slate-600 text-slate-400 hover:text-white hover:bg-slate-600/10",
        ghost: "text-slate-400 hover:text-white hover:bg-slate-600/10",
      },
    };

    // Fallback de seguridad por si envían una variante que no existe
    return themes[variant]?.[hierarchy] || themes.primary.solid;
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${getThemeStyles()} ${widthStyles} ${disabledStyles} ${className}`}
      {...props}
    >
      {/* Si está cargando, reemplazamos el icono izquierdo por un spinner */}
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : icon ? (
        <div className="w-4 h-4 shrink-0">
          <Icons type={icon as any} />
        </div>
      ) : null}

      {/* Contenido (Permite combinar prop text con children) */}
      {(text || children) && (
        <span className="truncate flex items-center justify-center gap-1">
          {text}{children}
        </span>
      )}

      {/* Icono a la derecha (ej: flecha de "siguiente") */}
      {iconRight && !isLoading && (
        <div className="w-4 h-4 shrink-0">
          <Icons type={iconRight as any} />
        </div>
      )}
    </button>
  );
};
