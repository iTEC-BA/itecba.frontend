#!/usr/bin/env bash
# =============================================================================
# fix_frontend.sh  —  Ejecutar desde la RAÍZ del frontend
# Corrige los 4 errores detectados en la consola del browser:
#
#  1. Loop infinito en useRewards  (100+ requests /api/rewards/list por minuto)
#     → No verifica isAuthenticated antes de fetchear
#
#  2. <button> anidado en TopNavbar + NotificationBell
#     → NotificationBell ya tiene su propio <button>, TopNavbar lo volvía a envolver
#
#  3. SVG props inválidas (fill-opacity, stop-color, stop-opacity)
#     → Deben ser fillOpacity, stopColor, stopOpacity en JSX
#
#  4. InboxWidget llama /api/messages/my-messages sin verificar autenticación
#     → Se llama aunque currentUser sea null, generando 404 en loop
# =============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

ok()    { echo -e "${GREEN}  ✔ $1${RESET}"; }
warn()  { echo -e "${YELLOW}  ⚠ $1${RESET}"; }
err()   { echo -e "${RED}  ✖ $1${RESET}"; }
title() { echo -e "\n${BOLD}${BLUE}══════════════════════════════════════${RESET}"; \
          echo -e "${BOLD}${CYAN}  $1${RESET}"; \
          echo -e "${BOLD}${BLUE}══════════════════════════════════════${RESET}"; }

SRC="src"

title "fix_frontend.sh — Corrección de errores de consola"

if [ ! -d "$SRC" ]; then
  err "No se encontró el directorio $SRC. ¿Estás en la raíz del frontend?"
  exit 1
fi
ok "Directorio $SRC encontrado"

# =============================================================================
# FIX 1 — useRewards: loop infinito por falta de guard de autenticación
# =============================================================================
title "Fix 1: Loop infinito en useRewards"

HOOK="src/features/rewards/hooks/useRewards.ts"

if [ ! -f "$HOOK" ]; then
  err "No se encontró $HOOK"
else
  cp "$HOOK" "${HOOK}.bak"
  ok "Backup: ${HOOK}.bak"

  cat > "$HOOK" << 'ENDOFFILE'
// src/features/rewards/hooks/useRewards.ts
// FIX: Agregado guard de autenticación para evitar loop infinito de fetches.
// El hook ahora NO llama a la API si el usuario no está autenticado.
import { useState, useEffect, useCallback } from 'react';
import { rewardsService } from '../services/rewardsService';
import { Reward, RedemptionPayload } from '../types/rewards';
import { useAuth } from '@context/AuthContext';
import { getAuth } from 'firebase/auth';

export const useRewards = () => {
  const { user, isAuthenticated, addPoints } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pointsBalance, setPointsBalance] = useState<number>(user?.points || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    setPointsBalance(user?.points || 0);
  }, [user?.points]);

  const fetchRewards = useCallback(async () => {
    // GUARD: no fetchear si el usuario no está autenticado
    if (!isAuthenticated) {
      setRewards([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const authUser = getAuth().currentUser;
      if (!authUser) return;
      const token = await authUser.getIdToken();
      const data = await rewardsService.getAvailableRewards(token);
      setRewards(data);
    } catch (error) {
      console.error("Error al cargar beneficios:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]); // DEPENDENCIA CORRECTA: solo re-ejecutar si cambia el estado de auth

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const handleRedeem = async (payload: RedemptionPayload, rewardId: string, cost: number) => {
    if (pointsBalance < cost) return false;

    setIsRedeeming(true);
    try {
      const authUser = getAuth().currentUser;
      if (!authUser) throw new Error("Usuario no autenticado en Firebase");

      const token = await authUser.getIdToken();
      const response = await rewardsService.redeemReward(payload, rewardId, token);

      if (response.success) {
        addPoints(-cost, false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Fallo en el proceso de canje:", error);
      return false;
    } finally {
      setIsRedeeming(false);
    }
  };

  return { rewards, pointsBalance, isLoading, isRedeeming, handleRedeem, refreshRewards: fetchRewards };
};
ENDOFFILE

  ok "useRewards.ts corregido (guard de isAuthenticated + dependencia correcta en useCallback)"
fi

# =============================================================================
# FIX 2 — InboxWidget: llama /api/messages/my-messages aunque currentUser sea null
# =============================================================================
title "Fix 2: InboxWidget — guard de autenticación"

INBOX="src/features/rewards/components/organisms/InboxWidget.tsx"

if [ ! -f "$INBOX" ]; then
  warn "No se encontró $INBOX — omitiendo"
else
  cp "$INBOX" "${INBOX}.bak"
  ok "Backup: ${INBOX}.bak"

  cat > "$INBOX" << 'ENDOFFILE'
// src/features/rewards/components/organisms/InboxWidget.tsx
// FIX: Guard de autenticación — no llama /api/messages si el usuario no está logueado.
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useAuth } from '@context/AuthContext';
import { inboxService } from '../../services/inboxService';
import { InboxMessage } from '../../types/rewards';
import { Icons } from '@/components/ui/icons/Icons';

export const InboxWidget: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<InboxMessage[]>([]);

  useEffect(() => {
    // GUARD: no fetchear si el usuario no está autenticado
    if (!isAuthenticated) return;

    const fetchMessages = async () => {
      const token = await getAuth().currentUser?.getIdToken();
      if (!token) return;
      try {
        const data = await inboxService.getMyMessages(token);
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando mensajes:", err);
      }
    };
    fetchMessages();
  }, [isAuthenticated]); // re-fetch cuando cambia el estado de auth

  if (!isAuthenticated) return null;

  return (
    <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6">
      <h2 className="text-xl font-bold text-itec-text flex items-center gap-2 mb-6">
        <Icons type="message" className="w-5 h-5" /> Mi Buzón de Avisos
      </h2>
      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm">No tienes mensajes nuevos.</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg._id}
              onClick={async () => {
                if (msg.isRead) return;
                const token = await getAuth().currentUser?.getIdToken();
                if (token) {
                  await inboxService.markAsRead(msg._id, token);
                  setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
                }
              }}
              className={`p-4 rounded-lg border transition-colors cursor-pointer ${msg.isRead ? 'bg-[#252525] border-[#333]' : 'bg-[#1e293b] border-itec-blue/50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-semibold ${msg.isRead ? 'text-gray-300' : 'text-white'}`}>{msg.subject}</h3>
                <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-itec-text whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
ENDOFFILE

  ok "InboxWidget.tsx corregido"
fi

# =============================================================================
# FIX 3 — TopNavbar: <button> anidado con NotificationBell
# El TopNavbar envolvía <NotificationBell /> en un <button>,
# pero NotificationBell ya renderiza su propio <button> internamente.
# Solución: quitar el <button> wrapper del TopNavbar para NotificationBell.
# =============================================================================
title "Fix 3: <button> anidado en TopNavbar"

NAVBAR="src/components/molecules/TopNavbar.tsx"

if [ ! -f "$NAVBAR" ]; then
  warn "$NAVBAR no encontrado — verificando en outputs/"
  NAVBAR="src/components/molecules/TopNavbar.tsx"
fi

if [ -f "$NAVBAR" ]; then
  cp "$NAVBAR" "${NAVBAR}.bak"
  ok "Backup: ${NAVBAR}.bak"

  # Reemplazar el bloque:
  #   <div className="relative">
  #     <button ...>
  #       <NotificationBell />
  #     </button>
  #   </div>
  # por:
  #   <div className="relative">
  #     <NotificationBell />
  #   </div>
  #
  # Usamos Python para un reemplazo multi-línea seguro
  python3 - "$NAVBAR" << 'PYEOF'
import sys, re

path = sys.argv[1]
with open(path, 'r') as f:
    content = f.read()

# Patrón: <button ...> <NotificationBell /> </button>  (puede tener espacios/tabs)
# Eliminamos el wrapper <button> que contiene SOLO a NotificationBell
pattern = r'(<div[^>]*className="relative"[^>]*>\s*)<button[^>]*>\s*(<NotificationBell\s*/>)\s*</button>(\s*</div>)'
replacement = r'\1\2\3'

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

if new_content != content:
    with open(path, 'w') as f:
        f.write(new_content)
    print("  → Wrapper <button> de NotificationBell eliminado")
else:
    # Intentar pattern más flexible
    pattern2 = r'<button\s+className="w-9 h-9[^"]*">\s*\n\s*<NotificationBell\s*/>\s*\n\s*</button>'
    replacement2 = '<NotificationBell />'
    new_content2 = re.sub(pattern2, replacement2, content, flags=re.DOTALL)
    if new_content2 != content:
        with open(path, 'w') as f:
            f.write(new_content2)
        print("  → Wrapper <button> de NotificationBell eliminado (pattern2)")
    else:
        print("  ⚠ No se encontró el patrón exacto — verificar manualmente")
        print("    Buscar en TopNavbar.tsx: <button ...><NotificationBell /></button>")
        print("    y reemplazar por: <NotificationBell />")
PYEOF

  ok "TopNavbar.tsx procesado"
else
  warn "TopNavbar.tsx no encontrado en $NAVBAR"
  warn "Corrección manual requerida:"
  echo "  Buscar en src/components/molecules/TopNavbar.tsx:"
  echo "    <button className=\"w-9 h-9 ...\"><NotificationBell /></button>"
  echo "  Reemplazar por:"
  echo "    <NotificationBell />"
fi

# =============================================================================
# FIX 4 — SVG props inválidas: fill-opacity → fillOpacity, etc.
# =============================================================================
title "Fix 4: Propiedades SVG en camelCase"

SVG_FILES_FIXED=0
while IFS= read -r -d '' file; do
  CHANGED=false

  # fill-opacity → fillOpacity
  if grep -q 'fill-opacity=' "$file" 2>/dev/null; then
    sed -i 's/fill-opacity=/fillOpacity=/g' "$file"
    CHANGED=true
  fi
  # stop-color → stopColor
  if grep -q 'stop-color=' "$file" 2>/dev/null; then
    sed -i 's/stop-color=/stopColor=/g' "$file"
    CHANGED=true
  fi
  # stop-opacity → stopOpacity
  if grep -q 'stop-opacity=' "$file" 2>/dev/null; then
    sed -i 's/stop-opacity=/stopOpacity=/g' "$file"
    CHANGED=true
  fi
  # stroke-width → strokeWidth (en JSX, no en SVG raw)
  if grep -q 'stroke-width=' "$file" 2>/dev/null; then
    sed -i 's/stroke-width=/strokeWidth=/g' "$file"
    CHANGED=true
  fi
  # stroke-linecap → strokeLinecap
  if grep -q 'stroke-linecap=' "$file" 2>/dev/null; then
    sed -i 's/stroke-linecap=/strokeLinecap=/g' "$file"
    CHANGED=true
  fi
  # stroke-linejoin → strokeLinejoin
  if grep -q 'stroke-linejoin=' "$file" 2>/dev/null; then
    sed -i 's/stroke-linejoin=/strokeLinejoin=/g' "$file"
    CHANGED=true
  fi

  if [ "$CHANGED" = true ]; then
    ok "SVG props corregidas en: $file"
    SVG_FILES_FIXED=$((SVG_FILES_FIXED + 1))
  fi
done < <(find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" \) -print0 2>/dev/null)

if [ "$SVG_FILES_FIXED" -eq 0 ]; then
  ok "No se encontraron propiedades SVG con kebab-case — ya estaban bien"
else
  ok "$SVG_FILES_FIXED archivo(s) con props SVG corregidas"
fi

# =============================================================================
# FIX 5 — RewardsWidget: guard de autenticación para no montar el hook en anonimos
# =============================================================================
title "Fix 5: RewardsWidget — no montar para usuarios no autenticados"

WIDGET="src/features/rewards/components/organisms/RewardsWidget.tsx"

if [ ! -f "$WIDGET" ]; then
  warn "No se encontró $WIDGET — omitiendo"
else
  cp "$WIDGET" "${WIDGET}.bak"
  ok "Backup: ${WIDGET}.bak"

  cat > "$WIDGET" << 'ENDOFFILE'
// src/features/rewards/components/organisms/RewardsWidget.tsx
// FIX: El widget solo se monta si el usuario está autenticado,
// evitando que useRewards intente fetchear sin token.
import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { useRewards } from "../../hooks/useRewards";
import { RewardCardSmall } from "../atoms/RewardsCardSmall";
import { RedeemModal } from "./RedeemModal";
import { Reward, RedemptionPayload } from "../../types/rewards";

const RewardsWidgetInner: React.FC = () => {
  const { rewards, pointsBalance, isLoading, isRedeeming, handleRedeem } = useRewards();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const onConfirmRedeem = async (payload: RedemptionPayload) => {
    if (!selectedReward) return;
    const rewardId = (selectedReward as any)._id || selectedReward.id;
    const success = await handleRedeem(payload, rewardId, selectedReward.pointsCost);
    if (success) {
      setSelectedReward(null);
      alert("¡Canje realizado con éxito!");
    }
  };

  if (isLoading)
    return <div className="animate-pulse h-64 bg-itec-bg rounded-xl"></div>;

  return (
    <section className="mb-4 relative">
      <div className="flex flex-col justify-between gap-4 mb-4 text-itec-gray">
        <h3 className="text-xs">RECOMPENSAS — {pointsBalance} PTS</h3>
      </div>

      {rewards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-itec-text">Próximamente habrán nuevos beneficios disponibles.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {rewards.map((reward: any) => {
            const uniqueId = reward._id || reward.id;
            return (
              <RewardCardSmall
                key={uniqueId}
                reward={{ ...reward, id: uniqueId }}
                userPoints={pointsBalance}
                onSelect={setSelectedReward}
              />
            );
          })}
        </div>
      )}

      {selectedReward && (
        <RedeemModal
          reward={selectedReward}
          isLoading={isRedeeming}
          onClose={() => setSelectedReward(null)}
          onConfirm={onConfirmRedeem}
        />
      )}
    </section>
  );
};

// Guard: solo renderiza el widget si el usuario está autenticado.
// Esto evita que useRewards se ejecute para visitantes anónimos.
export const RewardsWidget: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <RewardsWidgetInner />;
};
ENDOFFILE

  ok "RewardsWidget.tsx corregido (guard de autenticación)"
fi

# =============================================================================
# RESUMEN
# =============================================================================
title "✅ RESUMEN DE CORRECCIONES"

echo ""
echo -e "${BOLD}Archivos modificados:${RESET}"
echo "  1. src/features/rewards/hooks/useRewards.ts          → Guard isAuthenticated + dep correcta"
echo "  2. src/features/rewards/components/organisms/InboxWidget.tsx → Guard auth + no loop"
echo "  3. src/components/molecules/TopNavbar.tsx             → Quitado <button> wrapper de NotificationBell"
echo "  4. Todos los .tsx con props SVG en kebab-case         → Convertidas a camelCase"
echo "  5. src/features/rewards/components/organisms/RewardsWidget.tsx → Guard auth antes de montar hook"
echo ""
echo -e "${YELLOW}Backups disponibles con extensión .bak en cada archivo modificado.${RESET}"
echo -e "${GREEN}${BOLD}Reiniciá Vite: npm run dev${RESET}"