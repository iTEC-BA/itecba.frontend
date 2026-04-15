import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { Icons } from '@/components/atoms/Icons';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS } from '../../types/groups';
import { groupsService, type GroupData } from '../../services/groupsService';
import { useAuth } from '@/context/AuthContext';
import { useSubmitGroup } from '../../hooks/useGroups';
import { useAddGroupForm } from '../../hooks/useAddGroupForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  userEmail: string;
  existingGroups: GroupData[];
}

export const AddGroupModal: React.FC<Props> = ({ isOpen, onClose, isAdmin, existingGroups }) => {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const submitGroupMutation = useSubmitGroup();
  
  // 🟢 Hook Atómico para la lógica
  const { form, setForm, materiasDisponibles, handleCarreraChange, handleNivelChange } = useAddGroupForm();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', desc: '' });
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPending = submitGroupMutation.isPending;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setError('');
    
    if (!form.carrera || !form.nivel || !form.materia || !form.comision || !form.link) {
      setError('Completá todos los campos para continuar.'); return;
    }
    if (!materiasDisponibles.includes(form.materia)) {
      setError('Seleccioná una materia válida de la lista desplegable.'); return;
    }

    try {
      const isDupApproved = existingGroups.some(g => 
        (g.materia === form.materia && g.comision.toLowerCase() === form.comision.toLowerCase()) || g.link === form.link
      );

      if (isDupApproved) {
        setError(`Este link o la comisión ${form.comision.toUpperCase()} ya están registrados.`); return;
      }

      const isDupPending = await groupsService.checkIsDuplicatePending(form.materia, form.comision, form.link);
      if (isDupPending) {
        setError('Este grupo ya fue sugerido y está en revisión.'); return;
      }

      const isDirectPublish = isAuthenticated;
      const newGroupData = {
        carrera: form.carrera, nivel: form.nivel, materia: form.materia, 
        comision: form.comision.toUpperCase(), link: form.link, 
        tipo: isAdmin ? form.tipo : 'Alumnos', submittedBy: user?.email || 'invitado'
      };

      submitGroupMutation.mutate(
        { data: newGroupData, isDirectPublish },
        {
          onSuccess: () => {
            setSuccessInfo({ 
              title: isDirectPublish ? '¡Grupo Publicado!' : '¡Solicitud Enviada!', 
              desc: isDirectPublish ? 'Tu grupo ya está visible para todos.' : 'Un administrador lo revisará pronto.' 
            });
            setSuccess(true);
            setTimeout(() => { setSuccess(false); onClose(); }, 3000);
          },
          onError: () => setError('Error de conexión al enviar el grupo.')
        }
      );
    } catch {
      setError('Ocurrió un error al procesar la solicitud.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl p-8 relative">
        
        <button onClick={onClose} disabled={isPending} className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50">
          <Icons type="close" className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-1">Aportar Grupo</h2>
        <p className="text-sm text-gray-400 mb-6">Completá los datos para sumar a la comunidad.</p>

        {success ? (
          <div className="text-center py-10 animate-in fade-in duration-300">
            <span className="text-5xl block mb-4">✅</span>
            <h3 className="text-xl font-bold text-white mb-2">{successInfo.title}</h3>
            <p className="text-gray-400 text-sm">{successInfo.desc}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isAuthenticated && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Iniciá sesión para publicar directo</h4>
                  <p className="text-xs text-gray-400">Sumá puntos para tu TarjeTEC publicando sin revisión.</p>
                </div>
                <button type="button" onClick={loginWithGoogle} className="cursor-pointer shrink-0 bg-white hover:bg-gray-200 text-black text-xs font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                  <div className="w-4 h-4 text-blue-600"><Icons type="google" /></div> Acceder
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">1. Especialidad</label>
                <Select fullWidth options={CARRERAS_OPTIONS} value={form.carrera} onChange={e => handleCarreraChange(e.target.value)} className="cursor-pointer text-sm py-2.5 bg-gray-800 border-gray-600 text-gray-100 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">2. Nivel</label>
                <Select 
                  fullWidth disabled={!form.carrera} 
                  options={form.carrera === 'homogeneas' ? NIVEL_OPTIONS.slice(0, 3) : NIVEL_OPTIONS} // 🟢 Restricción UI de Homogéneas
                  value={form.nivel} onChange={e => handleNivelChange(e.target.value)} 
                  className="cursor-pointer text-sm py-2.5 bg-gray-800 border-gray-600 text-gray-100 focus:border-green-500 disabled:opacity-40" 
                />
              </div>
            </div>

            <div ref={dropdownRef} className="relative">
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">3. Materia Oficial</label>
              <Input 
                fullWidth disabled={!form.carrera || !form.nivel} 
                placeholder={!form.carrera || !form.nivel ? "Seleccioná especialidad y nivel..." : "Escribí para buscar..."} 
                value={form.materia} onChange={e => { setForm({...form, materia: e.target.value}); setShowDropdown(true); }} 
                onFocus={() => setShowDropdown(true)} 
                className="cursor-text text-sm py-2.5 bg-gray-800 border-gray-600 text-gray-100 focus:border-green-500 disabled:opacity-40" 
              />
              
              {/* 🟢 DROPDOWN MEJORADO: Texto envolvente y buen contraste */}
              {showDropdown && materiasDisponibles.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
                  {materiasDisponibles.filter(m => m.toLowerCase().includes(form.materia.toLowerCase())).map(m => (
                    <li 
                      key={m} onClick={() => { setForm({...form, materia: m}); setShowDropdown(false); }} 
                      className="cursor-pointer px-4 py-3 text-sm text-gray-300 hover:bg-green-600 hover:text-white border-b border-gray-700 last:border-0 whitespace-normal break-words leading-tight transition-colors"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">4. Comisión</label>
                <Input fullWidth placeholder="Ej: K1043" value={form.comision} onChange={e => setForm({...form, comision: e.target.value.toUpperCase()})} className="cursor-text text-sm py-2.5 uppercase bg-gray-800 border-gray-600 text-gray-100 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">5. Link de WhatsApp</label>
                <Input fullWidth placeholder="https://chat.whatsapp.com/..." value={form.link} onChange={e => setForm({...form, link: e.target.value})} className="cursor-text text-sm py-2.5 bg-gray-800 border-gray-600 text-gray-100 focus:border-green-500" />
              </div>
            </div>

            {isAdmin && (
              <div className="p-4 bg-gray-800 border border-gray-700 rounded-xl mt-2">
                <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">Privilegio Admin: Tipo de Grupo</label>
                <Select fullWidth options={[{value: 'Alumnos', label: 'Grupo de Alumnos'}, {value: 'Oficial', label: 'Grupo Oficial (ITEC)'}]} value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value as 'Alumnos' | 'Oficial'})} className="cursor-pointer text-sm py-2 bg-gray-900 border-gray-600 text-gray-100 focus:border-blue-500" />
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg flex items-center gap-3">
                <Icons type="info" className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-300 text-xs font-medium leading-tight">{error}</p>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isPending} className="cursor-pointer bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300">Cancelar</Button>
              <Button type="submit" variant="primary" disabled={isPending} className="cursor-pointer bg-green-600 hover:bg-green-500 border-none text-white shadow-md min-w-32 active:scale-95">
                {isPending ? 'Procesando...' : 'Aportar Grupo'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};