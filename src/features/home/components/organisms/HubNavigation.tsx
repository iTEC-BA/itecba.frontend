import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "../../../../components/atoms/Icons";

export const HubNavigation: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 relative z-10">
      
      {/* 1. Clases y Cursos (Azul) */}
      <Link to="/cursos" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-itec-blue hover:bg-blue-500/5 transition-all group">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0">
          <div className="w-5 h-5"><Icons type="play" /></div>
        </div>
        <div>
          <h3 className="font-bold text-white text-[13px]">Clases y Cursos</h3>
          <p className="text-[11px] text-gray-500">Videos de apoyo</p>
        </div>
      </Link>

      {/* 2. Aportes (Naranja) */}
      <Link to="/explore" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-orange-500 hover:bg-orange-500/5 transition-all group">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform shrink-0">
          <div className="w-5 h-5"><Icons type="compass" /></div>
        </div>
        <div>
          <h3 className="font-bold text-white text-[13px]">Aportes</h3>
          <p className="text-[11px] text-gray-500">Resúmenes y Finales</p>
        </div>
      </Link>

      {/* 3. Comunidades WA (Verde) */}
      <Link to="/grupos" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-green-500 hover:bg-green-500/5 transition-all group">
        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-105 transition-transform shrink-0">
          <div className="w-5 h-5"><Icons type="users" /></div>
        </div>
        <div>
          <h3 className="font-bold text-white text-[13px]">Comunidades WA</h3>
          <p className="text-[11px] text-gray-500">Grupos por comisión</p>
        </div>
      </Link>

      {/* 4. Ingreso UTN (Morado) */}
      <Link to="/ingreso" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-purple-500 hover:bg-purple-500/5 transition-all group">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0">
          <div className="w-5 h-5"><Icons type="entry" /></div>
        </div>
        <div>
          <h3 className="font-bold text-white text-[13px]">Ingreso UTN</h3>
          <p className="text-[11px] text-gray-500">TIVU y Módulo B</p>
        </div>
      </Link>

      {/* 5. Grado (Amarillo) */}
      <Link to="/grado" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-yellow-500 hover:bg-yellow-500/5 transition-all group">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:scale-105 transition-transform shrink-0">
          <div className="w-5 h-5"><Icons type="degree" /></div>
        </div>
        <div>
          <h3 className="font-bold text-white text-[13px]">Grado (Planes 23)</h3>
          <p className="text-[11px] text-gray-500">Planes y correlativas</p>
        </div>
      </Link>

      {/* 6. Sobre TEC (Rosa) */}
      <Link to="/nosotros" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-pink-500 hover:bg-pink-500/5 transition-all group">
        <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform shrink-0">
          <div className="w-5 h-5"><Icons type="heart" /></div>
        </div>
        <div>
          <h3 className="font-bold text-white text-[13px]">Sobre ✳️TEC</h3>
          <p className="text-[11px] text-gray-500">Valores y Contacto</p>
        </div>
      </Link>

    </div>
  );
};