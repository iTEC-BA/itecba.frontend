import React, { useState } from 'react';
import { Icons } from '@components/ui/icons/Icons';

interface Props {
  title: string;
  message: string;
  isCritical?: boolean;
}

export const AnnouncementBar: React.FC<Props> = ({ title, message, isCritical }) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className={`relative flex items-start gap-3 rounded-xl px-4 py-3 mb-3 border overflow-hidden ${
      isCritical ? 'bg-itec-red/10 border-itec-red/30' : 'bg-itec-blue-skye/10 border-itec-blue-skye/25'
    }`}>
      <div className={`absolute inset-0 pointer-events-none bg-gradient-to-r opacity-25 ${
        isCritical ? 'from-itec-red/20 to-transparent' : 'from-itec-blue-skye/15 to-transparent'
      }`} />
      <div className={`w-5 h-5 shrink-0 mt-0.5 ${isCritical ? 'text-itec-red' : 'text-itec-blue-skye'}`}>
        <Icons type="info" />
      </div>
      <div className="flex-1 min-w-0 relative">
        <p className={`font-semibold text-[13px] ${isCritical ? 'text-itec-red' : 'text-itec-text'}`}>
          {title}
        </p>
        <p className="text-itec-gray text-[12px] mt-0.5 leading-relaxed">{message}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-itec-gray hover:text-itec-text shrink-0 transition-colors relative ml-1"
        aria-label="Cerrar"
      >
        <Icons type="close" className="w-4 h-4" />
      </button>
    </div>
  );
};
