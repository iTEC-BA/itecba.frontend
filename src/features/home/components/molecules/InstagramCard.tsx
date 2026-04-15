import React from "react";
import { Icons } from "../../../../components/atoms/Icons";

interface InstagramCardProps {
  imageUrl: string;
  caption: string;
  date: string;
  link: string;
}

export const InstagramCard: React.FC<InstagramCardProps> = ({
  imageUrl,
  caption,
  date,
  link,
}) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-itec-bg rounded-xl overflow-hidden shadow-lg transition-all group flex flex-col h-full cursor-pointer"
    >
      {/* Contenedor de la Imagen (Aspect Ratio 1:1 estilo Instagram) */}
      <div className="relative w-full pt-[100%] bg-itec-bg overflow-hidden">
        <img
          src={imageUrl}
          alt="Publicación ITEC"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
        />
        {/* Icono de Instagram en la esquina superior derecha */}
        <div className="absolute top-2.5 right-2.5 w-8 h-8 text-white bg-black/50 p-1 rounded-md  shadow-md transition-opacity group-hover:opacity-100">
          <Icons type="instagram" />
        </div>
      </div>

      {/* Pie de foto y fecha */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm text-gray-300 line-clamp-3 mb-3 flex-1">
          {caption}
        </p>
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          {date}
        </span>
      </div>
    </a>
  );
};
