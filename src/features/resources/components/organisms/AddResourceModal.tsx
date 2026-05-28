import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@components/ui/Button';
import { Icons } from '@/components/ui/icons/Icons';
import { FilterField } from '../molecules/FilterField';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS } from '@features/groups/types/groups';
import { useAuth } from '@context/AuthContext';
import { usePointsGrant } from '@features/points/hooks/usePointsGrant';
import { useSubmitResource } from '../../hooks/useResources';
import { useResourceMaterias } from '../../hooks/useResourceMaterias';
import { TIPOS_ARCHIVO, FORMATOS_ARCHIVO } from '../../types/resource.types';
import type { ResourceFormState } from '../../types/resource.types';

interface Props { isOpen: boolean; onClose: () => void; isAdmin: boolean }

const EMPTY: ResourceFormState = { title: '', carrera: '', nivel: '', materia: '', tipo: 'Apunte', formato: 'PDF', link: '' };
const INPUT_CLS = 'text-sm py-2.5 bg-itec-bg border-itec-gray/60 focus:border-orange-500/70 transition-colors placeholder:text-itec-gray/40';

export const AddResourceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const { grant } = usePointsGrant();
  const mutation = useSubmitResource();

  const [form, setForm] = useState<ResourceFormState>(EMPTY);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState<{ title: string; desc: string } | null>(null);

  // Hook Declarativo: Maneja toda la lógica compleja de consulta a la base de datos (Supabase),
  // mezcla de Homogéneas, filtrado de inputs, aperturas del menú y clics fuera del contenedor.
  const { 
    dropRef, 
    openDrop, 
    setOpenDrop, 
    filteredOptions, 
    handleSelectMateria 
  } = useResourceMaterias(form.carrera, form.nivel, form.materia, (val) => setForm(f => ({ ...f, materia: val })));

  const set = (k: keyof ResourceFormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mutation.isPending) return;
    setError('');
    if (!form.title || !form.carrera || !form.nivel || !form.materia || !form.link) {
      setError('Completá todos los campos obligatorios.'); return;
    }
    mutation.mutate(
      { data: { ...form, autor: 'Comunidad ITEC', submittedBy: user?.email ?? 'invitado' }, isDirectPublish: isAuthenticated },
      {
        onSuccess: async () => {
          if (isAuthenticated) {
            await grant('1');
            setSuccessInfo({ title: '¡Aporte publicado!', desc: '¡Ganaste +1 Punto ITEC! Gracias por colaborar.' });
          } else {
            setSuccessInfo({ title: '¡Solicitud enviada!', desc: 'Tu aporte fue enviado a revisión. Un admin lo validará pronto.' });
          }
          setTimeout(() => { setSuccessInfo(null); setForm(EMPTY); onClose(); }, 3000);
        },
        onError: () => setError('Error al enviar. Revisá tu conexión.'),
      },
    );
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-lg bg-itec-box border border-itec-gray/30 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black/50 flex flex-col max-h-[92dvh] sm:max-h-[90vh]">

        {/* Header fijo */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-itec-border shrink-0">
          <div>
            <h2 className="text-xl font-bold text-itec-text">Aportar Material</h2>
            <p className="text-xs text-itec-gray mt-0.5">
              Sube material y gana{' '}
              <span className="text-yellow-400 font-semibold">+1 Punto ITEC</span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={mutation.isPending}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-itec-gray/40 text-itec-gray hover:text-itec-text hover:border-itec-gray transition-colors"
          >
            <div className="w-4 h-4"><Icons type="close" /></div>
          </button>
        </div>

        {/* Cuerpo scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {successInfo ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95">
              <span className="text-6xl mb-5">⭐</span>
              <h3 className="text-xl font-bold text-orange-400 mb-2">{successInfo.title}</h3>
              <p className="text-sm text-itec-gray max-w-xs leading-relaxed">{successInfo.desc}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Banner login */}
              {!isAuthenticated && (
                <div className="flex items-center justify-between gap-4 rounded-xl bg-orange-500/10 border border-orange-500/20 p-4">
                  <div>
                    <p className="text-sm font-semibold text-itec-text">¿Querés ganar puntos?</p>
                    <p className="text-xs text-itec-gray mt-0.5 leading-tight">
                      Iniciá sesión para publicar al instante y acumular puntos.
                    </p>
                  </div>
                  <button
                    type="button" onClick={loginWithGoogle}
                    className="shrink-0 flex items-center gap-2 bg-itec-text text-itec-bg text-xs font-bold py-2 px-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <div className="w-4 h-4"><Icons type="google" /></div>
                    Ingresar
                  </button>
                </div>
              )}

              <FilterField label="Título del aporte *">
                <Input fullWidth placeholder="Ej: Resumen Unidades 1–5 Análisis I" value={form.title} onChange={e => set('title', e.target.value)} className={INPUT_CLS} />
              </FilterField>

              <div className="grid grid-cols-2 gap-3">
                <FilterField label="Carrera *">
                  <Select fullWidth options={CARRERAS_OPTIONS} value={form.carrera}
                    onChange={e => { set('carrera', e.target.value); setForm(f => ({ ...f, carrera: e.target.value, nivel: e.target.value === 'ingreso' ? '0' : '', materia: '' })); }}
                    className={`${INPUT_CLS} cursor-pointer`} />
                </FilterField>
                <FilterField label="Año *">
                  <Select fullWidth disabled={!form.carrera} options={NIVEL_OPTIONS} value={form.nivel}
                    onChange={e => { setForm(f => ({ ...f, nivel: e.target.value, materia: '' })); }}
                    className={`${INPUT_CLS} disabled:opacity-40 cursor-pointer`} />
                </FilterField>
              </div>

              {/* Materia conectada al nuevo Hook */}
              <FilterField label="Materia *">
                <div ref={dropRef} className="relative">
                  <Input fullWidth disabled={!form.carrera || !form.nivel}
                    placeholder={!form.carrera ? 'Primero elegí carrera...' : 'Buscar materia...'}
                    value={form.materia}
                    onChange={e => { set('materia', e.target.value); setOpenDrop(true); }}
                    onFocus={() => setOpenDrop(true)}
                    className={`${INPUT_CLS} disabled:opacity-40`} />
                  {openDrop && filteredOptions.length > 0 && (
                    <ul className="absolute z-50 top-full mt-1 w-full max-h-40 overflow-y-auto bg-itec-sidebar border border-itec-gray/40 rounded-xl shadow-2xl shadow-black/40">
                      {filteredOptions.map(m => (
                        <li key={m} onMouseDown={() => handleSelectMateria(m)}
                          className="px-3 py-2.5 text-sm text-itec-text hover:bg-orange-600/80 cursor-pointer border-b border-itec-border last:border-0 transition-colors truncate">
                          {m}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FilterField>

              <div className="grid grid-cols-2 gap-3">
                <FilterField label="Tipo">
                  <Select fullWidth options={[...TIPOS_ARCHIVO]} value={form.tipo} onChange={e => set('tipo', e.target.value)} className={`${INPUT_CLS} cursor-pointer`} />
                </FilterField>
                <FilterField label="Formato">
                  <Select fullWidth options={[...FORMATOS_ARCHIVO]} value={form.formato} onChange={e => set('formato', e.target.value)} className={`${INPUT_CLS} cursor-pointer`} />
                </FilterField>
              </div>

              <FilterField label="Link del archivo *">
                <Input fullWidth placeholder="https://drive.google.com/..." value={form.link} onChange={e => set('link', e.target.value)} className={INPUT_CLS} />
              </FilterField>

              {error && (
                <p className="text-xs font-semibold text-itec-red-skye bg-itec-red/10 border border-itec-red/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        {!successInfo && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-itec-border shrink-0">
            <Button onClick={onClose} disabled={mutation.isPending}
              className="px-4 py-2 text-sm bg-transparent border border-itec-gray/40 text-itec-gray hover:text-itec-text hover:border-itec-gray transition-colors rounded-xl">
              Cancelar
            </Button>
            <Button onClick={(e: React.MouseEvent) => handleSubmit(e as unknown as React.FormEvent)}
              disabled={mutation.isPending}
              className="px-5 py-2 text-sm bg-orange-600 hover:bg-orange-500 text-itec-text font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-orange-900/30">
              {mutation.isPending ? 'Publicando...' : 'Publicar · +1 Punto'}
            </Button>
          </div>
        )}
      </div>
        </div>
    </>
  );
};
