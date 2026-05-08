import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Button } from '@components/ui/Button';
import { Icons } from '@components/ui/icons/Icons';
import { useAuth } from '@context/AuthContext';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS } from '../../types/groups';
import { groupsService, type GroupData } from '../../services/groupsService';
import { useSubmitGroup } from '../../hooks/useGroups';
import { useAddGroupForm } from '../../hooks/useAddGroupForm';

interface Props { isOpen: boolean; onClose: () => void; isAdmin: boolean; userEmail: string; existingGroups: GroupData[]; }

export const AddGroupModal: React.FC<Props> = ({ isOpen, onClose, isAdmin, existingGroups }) => {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const submitMutation = useSubmitGroup();
  const { form, setForm, materiasDisponibles, loadingMaterias, handleCarreraChange, handleNivelChange } = useAddGroupForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', desc: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitMutation.isPending) return;
    setError('');
    if (!form.carrera || !form.nivel || !form.materia || !form.comision || !form.link) {
      setError('Completá todos los campos para continuar.'); return;
    }
    if (!form.link.startsWith('http')) { setError('El link debe comenzar con https://'); return; }
    try {
      const isDupApproved = existingGroups.some(g => (g.materia === form.materia && g.comision.toLowerCase() === form.comision.toLowerCase()) || g.link === form.link);
      if (isDupApproved) { setError(`Este link o la comisión ${form.comision.toUpperCase()} ya están registrados.`); return; }
      const isDupPending = await groupsService.checkIsDuplicatePending(form.materia, form.comision, form.link);
      if (isDupPending) { setError('Este grupo ya fue sugerido y está en revisión.'); return; }
      submitMutation.mutate(
        { data: { carrera: form.carrera, nivel: form.nivel, materia: form.materia, comision: form.comision.toUpperCase(), link: form.link, tipo: isAdmin ? form.tipo : 'Alumnos', submittedBy: user?.email || 'invitado' }, isDirectPublish: isAuthenticated },
        {
          onSuccess: () => {
            setSuccessInfo({ title: isAuthenticated ? '¡Grupo Publicado!' : '¡Solicitud Enviada!', desc: isAuthenticated ? 'Tu grupo ya está visible para todos.' : 'Un administrador lo revisará pronto.' });
            setSuccess(true);
            setTimeout(() => { setSuccess(false); onClose(); }, 2500);
          },
          onError: () => setError('Error de conexión al enviar el grupo.'),
        }
      );
    } catch { setError('Ocurrió un error al procesar la solicitud.'); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-itec-box border border-white/[0.08] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-300">

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div>
            <h2 className="text-base font-bold text-itec-text">Aportar Grupo de WhatsApp</h2>
            <p className="text-[11px] text-itec-gray mt-0.5">Completá los datos para sumarlo a la comunidad.</p>
          </div>
          <button onClick={onClose} disabled={submitMutation.isPending} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-itec-gray hover:text-itec-text transition-colors">
            <Icons type="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {success ? (
            <div className="text-center py-12 animate-in fade-in duration-300 flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-itec-groups/15 border border-itec-groups/30 rounded-full flex items-center justify-center text-2xl">✅</div>
              <h3 className="text-lg font-bold text-itec-text">{successInfo.title}</h3>
              <p className="text-itec-gray text-sm">{successInfo.desc}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isAuthenticated && (
                <div className="bg-itec-blue-skye/10 border border-itec-blue-skye/25 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-itec-text">Iniciá sesión para publicar directo</p>
                    <p className="text-xs text-itec-gray mt-0.5">Sin revisión y sumás puntos a tu TarjeTEC.</p>
                  </div>
                  <button type="button" onClick={loginWithGoogle} className="shrink-0 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
                    <Icons type="google" className="w-4 h-4" /> Acceder
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-itec-gray uppercase tracking-wider mb-1.5">1. Especialidad</label>
                  <Select fullWidth options={CARRERAS_OPTIONS} value={form.carrera} onChange={e => handleCarreraChange(e.target.value)} className="text-sm py-2.5 bg-itec-bg border-white/8 focus:border-itec-groups/50 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-itec-gray uppercase tracking-wider mb-1.5">2. Nivel</label>
                  <Select fullWidth disabled={!form.carrera} options={NIVEL_OPTIONS} value={form.nivel} onChange={e => handleNivelChange(e.target.value)} className="text-sm py-2.5 bg-itec-bg border-white/8 focus:border-itec-groups/50 transition-all disabled:opacity-40" />
                </div>
              </div>

              <div ref={dropdownRef} className="relative">
                <label className="block text-[10px] font-bold text-itec-gray uppercase tracking-wider mb-1.5">3. Materia</label>
                <Input
                  fullWidth disabled={!form.carrera || !form.nivel}
                  placeholder={!form.carrera || !form.nivel ? 'Seleccioná especialidad y nivel...' : loadingMaterias ? 'Cargando...' : 'Escribí para buscar...'}
                  value={form.materia}
                  onChange={e => { setForm({ ...form, materia: e.target.value }); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  className="text-sm py-2.5 bg-itec-bg border-white/8 focus:border-itec-groups/50 transition-all disabled:opacity-40"
                />
                {showDropdown && materiasDisponibles.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 bg-itec-box border border-itec-border rounded-xl shadow-2xl max-h-52 overflow-y-auto">
                    {materiasDisponibles.filter(m => m.toLowerCase().includes(form.materia.toLowerCase())).map(m => (
                      <li key={m} onClick={() => { setForm({ ...form, materia: m }); setShowDropdown(false); }}
                        className="cursor-pointer px-4 py-2.5 text-sm text-itec-gray hover:bg-itec-groups/10 hover:text-itec-text border-b border-white/5 last:border-0 whitespace-normal leading-tight transition-colors">
                        {m}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-itec-gray uppercase tracking-wider mb-1.5">4. Comisión</label>
                  <Input fullWidth placeholder="Ej: K1043" value={form.comision} onChange={e => setForm({ ...form, comision: e.target.value.toUpperCase() })} className="text-sm py-2.5 uppercase bg-itec-bg border-white/8 focus:border-itec-groups/50 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-itec-gray uppercase tracking-wider mb-1.5">5. Link de WhatsApp</label>
                  <Input fullWidth placeholder="https://chat.whatsapp.com/..." value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="text-sm py-2.5 bg-itec-bg border-white/8 focus:border-itec-groups/50 transition-all" />
                </div>
              </div>

              {isAdmin && (
                <div className="bg-itec-blue-skye/5 border border-itec-blue-skye/15 rounded-xl p-3.5">
                  <label className="block text-[10px] font-bold text-itec-blue-skye uppercase tracking-wider mb-1.5">Admin — Tipo de grupo</label>
                  <Select fullWidth options={[{ value: 'Alumnos', label: 'Grupo de Alumnos' }, { value: 'Oficial', label: 'Grupo Oficial (ITEC)' }]} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as 'Alumnos' | 'Oficial' })} className="text-sm py-2 bg-itec-bg border-white/8 focus:border-itec-blue-skye" />
                </div>
              )}

              {error && (
                <div className="bg-itec-red/10 border border-itec-red/25 p-3 rounded-xl flex items-start gap-2.5">
                  <Icons type="info" className="w-4 h-4 text-itec-red shrink-0 mt-0.5" />
                  <p className="text-itec-red text-xs leading-relaxed">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="slate" hierarchy="ghost" onClick={onClose} disabled={submitMutation.isPending} className="text-xs">Cancelar</Button>
                <Button type="submit" variant="primary" disabled={submitMutation.isPending} className="text-xs bg-itec-groups hover:bg-emerald-500 border-none shadow-md min-w-28 active:scale-95">
                  {submitMutation.isPending ? 'Procesando...' : 'Aportar Grupo'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
