import React, { useState, useEffect } from "react";
import { getAuth }          from "firebase/auth";
import { getPointHistory }  from "../services/points.service";
import type { PointLogEntry } from "../points.types";

export const PointsHistoryWidget: React.FC = () => {
  const [logs,    setLogs]    = useState<PointLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const fbUser = getAuth().currentUser;
        if (!fbUser) return;
        const token = await fbUser.getIdToken();
        const data  = await getPointHistory(token);
        setLogs(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
      <span className="w-3.5 h-3.5 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
      Cargando historial...
    </div>
  );

  if (error) return <div className="text-red-400 text-sm">Error: {error}</div>;

  if (logs.length === 0) return (
    <div className="text-gray-500 text-sm py-4 text-center">
      Aún no tenés puntos registrados. ¡Empezá a participar!
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      {logs.map((entry) => (
        <div
          key={entry.id || entry.activityKey + entry.createdAt}
          className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-white/3 transition-colors"
        >
          <div className="flex flex-col">
            <span className="text-sm text-white font-medium">{entry.activityName}</span>
            <span className="text-xs text-gray-500">
              {new Date(entry.createdAt).toLocaleDateString("es-AR", {
                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
              })}
            </span>
          </div>
          <span className="text-yellow-400 font-semibold text-sm">+{entry.pointsAwarded} ⭐</span>
        </div>
      ))}
    </div>
  );
};
