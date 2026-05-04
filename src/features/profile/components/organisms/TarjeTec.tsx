import React from "react";
import tarjeTEC from "@assets/TarjeTec/iTEC-tarjeta.svg";
import styles from "@/styles/TarjeTec.module.css"
import type { User } from "@context/AuthContext";

export const TarjeTec: React.FC<{ user: User }> = ({ user }) => {
  return (

    // Contenedor Tarjeta
    <div className={styles.tarjeta}>
      
      <div className={styles.tarjetaQR}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(user.legajo || 'SinLegajo')}`}
            alt="QR de acceso"
            className="w-full h-full rounded-sm"
          />
      </div>

      {/* Tarjeta Datos */}
      <div className={styles.tarjetaDatos}>

        {/* Número de Legajo formateado */}
        <p className={styles.tarjetaLegajo}>
          {user.legajo ? user.legajo.replace(/(.{7})(?!$)/g, "$1 ") : 'PENDIENTE'}
        </p>

        {/* Mail del usuario */}
        <p className={styles.tarjetaMail}>
          {user.email}
        </p>

        {/* Carrera del usuario */}
        <p className={styles.tarjetaCarrera}>
          <span className={styles.tarjetaCarreraIng}>Ing. </span>
          <span className={styles.tarjetaCarreraNombre}>{user.specialty}</span>
        </p>

      </div>

      {/*SVG de la Tarjeta*/}
      <img src={tarjeTEC} alt="tarjeTec" />
    </div>
  );
};