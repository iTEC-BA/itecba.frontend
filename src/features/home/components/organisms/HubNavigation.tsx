import React from 'react';
import { HubNavCard } from '@features/home/components/molecules/HubNavCard';
import { SectionLabel } from '@features/home/components/atoms/SectionLabel';

const NAV_ITEMS = [
  {
    title: 'Cursos y Clases',
    description: 'Videos de apoyo por materia',
    href: '/cursos',
    icon: 'play',
    accentClass: 'hover:border-blue-500/40',
    iconBgClass: 'bg-blue-500/10',
    iconTextClass: 'text-blue-400',
  },
  {
    title: 'BiblioTEC',
    description: 'Resúmenes, parciales y finales',
    href: '/recursos',
    icon: 'library',
    accentClass: 'hover:border-orange-500/40',
    iconBgClass: 'bg-orange-500/10',
    iconTextClass: 'text-orange-400',
  },
  {
    title: 'Grupos WhatsApp',
    description: 'Por materia y comisión',
    href: '/grupos',
    icon: 'users',
    accentClass: 'hover:border-itec-groups/40',
    iconBgClass: 'bg-itec-groups/10',
    iconTextClass: 'text-emerald-400',
  },
  {
    title: 'Ingreso UTN',
    description: 'TIVU, Módulo B y más',
    href: '/ingreso',
    icon: 'entry',
    accentClass: 'hover:border-purple-500/40',
    iconBgClass: 'bg-purple-500/10',
    iconTextClass: 'text-purple-400',
  },
  {
    title: 'Grado (Plan 23)',
    description: 'Planes y correlativas',
    href: '/grado',
    icon: 'degree',
    accentClass: 'hover:border-yellow-500/40',
    iconBgClass: 'bg-yellow-500/10',
    iconTextClass: 'text-yellow-400',
  },
  {
    title: 'Sobre ✳️TEC',
    description: 'Quiénes somos y contacto',
    href: '/nosotros',
    icon: 'heart',
    accentClass: 'hover:border-pink-500/40',
    iconBgClass: 'bg-pink-500/10',
    iconTextClass: 'text-pink-400',
  },
];

export const HubNavigation: React.FC = () => (
  <section className="mb-6">
    <SectionLabel>Secciones principales</SectionLabel>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {NAV_ITEMS.map(item => (
        <HubNavCard key={item.href} {...item} />
      ))}
    </div>
  </section>
);
