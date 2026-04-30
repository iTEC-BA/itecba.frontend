import React, { useState } from 'react';
import { Icons } from '@components/ui/Icons';
import { BENEFITS_DATA } from '../../types/profileData';

export const BenefitsGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'medrano' | 'campus' | 'digital'>('medrano');

  const tabs = [
    { id: 'medrano', label: 'Sede Medrano', icon: 'pin', color: 'sky' },
    { id: 'campus', label: 'Sede Campus', icon: 'pin', color: 'orange' },
    { id: 'digital', label: 'Digitales', icon: 'lightning', color: 'purple' },
  ];

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-[2rem] p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-itec-textmb-1">Catálogo de Beneficios</h2>
        <p className="text-slate-400 text-sm">Navegá por las categorías y descubrí tus ventajas.</p>
      </div>
      
      {/* Selector de Pestañas */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 mb-8 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? `bg-${tab.color}-500/10 text-${tab.color}-400 border border-${tab.color}-500/30 shadow-inner` 
                : 'bg-slate-900/50 text-slate-400 border border-transparent hover:bg-slate-800 hover:text-slate-200'}
            `}
          >
            <div className="w-4 h-4"><Icons type={tab.icon as any} /></div>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid de Contenido Activo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BENEFITS_DATA[activeTab].map((b, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-950/50 border border-white/5 p-4 rounded-2xl hover:border-slate-700 transition-colors cursor-pointer group">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-slate-900 border border-white/5 group-hover:scale-105 transition-transform`}>
               <span className="font-black text-sm text-white">{b.discount.replace(/[^0-9%]/g, '') || '%'}</span>
            </div>
            <div>
              <h4 className="text-slate-200 font-bold text-sm mb-0.5 leading-tight">{b.title}</h4>
              <p className={`text-${tabs.find(t => t.id === activeTab)?.color}-400 text-xs font-bold mb-1`}>{b.discount}</p>
              <span className="text-[10px] text-slate-500 line-clamp-1">{b.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};