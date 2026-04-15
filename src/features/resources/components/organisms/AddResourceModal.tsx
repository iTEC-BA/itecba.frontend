import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../../../../components/atoms/Input';
import { Select } from '../../../../components/atoms/Select';
import { Button } from '../../../../components/atoms/Button';
import { Icons } from '../../../../components/atoms/Icons';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS, MATERIAS_POR_CARRERA } from '../../../groups/types/groups';
import { useAuth } from '../../../../context/AuthContext';

// 🟢 NUEVO: Importamos la mutación
import { useSubmitResource } from '../../hooks/useResources';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  // 🔴 BORRADO: onResourceAdded
}

const TIPOS_ARCHIVO = [
  { value: 'Apunte', label: 'Apunte de Clase' },
  { value: 'Resumen', label: 'Resumen Teórico' },
  { value: 'Parcial', label: 'Modelo de Parcial' },
  { value: 'Final', label: 'Modelo de Final' },
  { value: 'Guía', label: 'Guía de Ejercicios' },
  { value: 'Carpeta', label: 'Carpeta Drive Completa' },
];

const FORMATOS_ARCHIVO = [
  { value: 'PDF', label: 'Documento PDF' },
  { value: 'Drive', label: 'Google Drive' },
  { value: 'Notion', label: 'Notion / Web' },
  { value: 'ZIP', label: 'Archivo Comprimido' },
];
export const AddResourceModal: React.FC<Props> = ({ isOpen, onClose, isAdmin }) => {
  const { user, isAuthenticated, loginWithGoogle, addPoints } = useAuth();
  
  const submitMutation = useSubmitResource(); // 🟢 Instanciamos mutación

  const [form, setForm] = useState({ title: '', carrera: '', nivel: '', materia: '', tipo: 'Apunte', formato: 'PDF', link: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', desc: '' });
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPending = submitMutation.isPending; // 🟢 Reemplaza isSubmitting

  const materiasDisponibles = (form.carrera && form.nivel && MATERIAS_POR_CARRERA[form.carrera] && MATERIAS_POR_CARRERA[form.carrera][form.nivel])
    ? MATERIAS_POR_CARRERA[form.carrera][form.nivel] : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    setError('');
    if (!form.title || !form.carrera || !form.nivel || !form.materia || !form.link) {
      setError('Completá todos los campos obligatorios.'); return;
    }

    const isDirectPublish = isAuthenticated;
    const newResourceData = {
      title: form.title,
      carrera: form.carrera,
      nivel: form.nivel,
      materia: form.materia,
      tipo: form.tipo,
      formato: form.formato,
      link: form.link,
      autor: 'Comunidad ITEC',
      submittedBy: user?.email || 'invitado'
    };

    // 🟢 Ejecutamos la mutación en lugar de la función suelta
    submitMutation.mutate(
      { data: newResourceData, isDirectPublish },
      {
        onSuccess: async () => {
          if (isDirectPublish) {
            await addPoints(1); // Sumamos el punto si se publica directo
            setSuccessInfo({ title: '¡Aporte Publicado!', desc: '¡Ganaste +1 Punto ITEC! Gracias por colaborar con la comunidad.' });
          } else {
            setSuccessInfo({ title: '¡Solicitud Enviada!', desc: 'Tu aporte fue enviado a revisión. Un admin lo validará pronto.' });
          }

          setSuccess(true);
          setTimeout(() => { 
            setSuccess(false); 
            setForm({ title: '', carrera: '', nivel: '', materia: '', tipo: 'Apunte', formato: 'PDF', link: '' }); 
            onClose(); 
          }, 3000);
        },
        onError: () => {
          setError('Error al enviar el archivo. Revisa tu conexión a la base de datos.');
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-itec-surface border border-itec-gray rounded-3xl w-full max-w-xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200 my-8">
        <button onClick={onClose} disabled={isPending} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-itec-bg border border-itec-gray text-gray-500 hover:text-white transition-colors">✖</button>
        <h2 className="text-2xl font-bold text-white mb-2">Aportar Archivo</h2>
        <p className="text-sm text-gray-400 mb-6">Sube material y gana <strong className="text-yellow-500">+1 Punto ITEC</strong>.</p>

        {success ? (
          <div className="text-center py-10 animate-in fade-in zoom-in">
            <span className="text-6xl block mb-4">⭐</span>
            <h3 className="text-xl font-bold text-green-500 mb-2">{successInfo.title}</h3>
            <p className="text-gray-300 text-sm">{successInfo.desc}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isAuthenticated && (
              <div className="bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/30 rounded-xl p-4 mb-2 flex items-center justify-between gap-4 shadow-lg">
                <div>
                  <h4 className="text-[13px] font-bold text-white mb-1">¿Querés ganar puntos?</h4>
                  <p className="text-[11px] text-gray-400 leading-tight">Iniciá sesión para acumular Puntos ITEC y publicar al instante.</p>
                </div>
                <button type="button" onClick={loginWithGoogle} className="shrink-0 bg-white text-black text-[11px] font-bold py-2 px-3 rounded-lg flex items-center gap-2">
                  <div className="w-4 h-4 text-blue-600"><Icons type="google" /></div> Ingresar
                </button>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Título del Aporte</label>
              <Input fullWidth placeholder="Ej: Resumen Completo Unidad 1 a 5..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-itec-bg border-itec-gray text-sm py-2.5" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Carrera</label>
                <Select fullWidth options={CARRERAS_OPTIONS} value={form.carrera} onChange={e => setForm({...form, carrera: e.target.value, nivel: e.target.value === 'ingreso' ? '0' : '', materia: ''})} className="text-sm bg-itec-bg py-2.5" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Año</label>
                <Select fullWidth disabled={!form.carrera} options={NIVEL_OPTIONS} value={form.nivel} onChange={e => setForm({...form, nivel: e.target.value, materia: ''})} className="text-sm bg-itec-bg py-2.5 disabled:opacity-50" />
              </div>
            </div>

            <div ref={dropdownRef} className="relative">
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Materia</label>
              <Input fullWidth disabled={!form.carrera || !form.nivel} placeholder={!form.carrera ? "Seleccioná Carrera..." : "Buscar..."} value={form.materia} onChange={e => { setForm({...form, materia: e.target.value}); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)} className="text-sm bg-itec-bg py-2.5 disabled:opacity-50" />
              {showDropdown && materiasDisponibles.length > 0 && (
                <ul className="absolute z-50 w-full mt-2 bg-itec-sidebar border border-itec-gray rounded-xl shadow-2xl max-h-40 overflow-y-auto custom-scrollbar">
                  {materiasDisponibles.filter(m => m.toLowerCase().includes(form.materia.toLowerCase())).map(m => (
                    <li key={m} onClick={() => { setForm({...form, materia: m}); setShowDropdown(false); }} className="px-4 py-2 text-sm text-gray-300 hover:bg-itec-blue hover:text-white cursor-pointer border-b border-itec-gray/50">{m}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Tipo</label>
                <Select fullWidth options={TIPOS_ARCHIVO} value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className="text-sm bg-itec-bg py-2.5" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Formato</label>
                <Select fullWidth options={FORMATOS_ARCHIVO} value={form.formato} onChange={e => setForm({...form, formato: e.target.value})} className="text-sm bg-itec-bg py-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Link del Archivo (Drive, Mega, Notion)</label>
              <Input fullWidth placeholder="https://..." value={form.link} onChange={e => setForm({...form, link: e.target.value})} className="bg-itec-bg border-itec-gray text-sm py-2.5" />
            </div>

            {error && <p className="text-itec-red-skye text-xs font-bold bg-itec-red/10 p-2 rounded">{error}</p>}

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isPending} className="bg-itec-bg border-none text-gray-400">Cancelar</Button>
              <Button type="submit" variant="primary" disabled={isPending} className="bg-orange-600 hover:bg-orange-500 border-none text-white font-bold">{isPending ? 'Subiendo...' : 'Publicar y Ganar Puntos'}</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};