import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { Button } from '../components/atoms/Button';
import { adminService, type AnnouncementData } from '../services/adminService';
import type { User } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { Icons } from '../components/atoms/Icons';

export const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'news'>('users');

  // Estados de Usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Estados de Avisos
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [newsForm, setNewsForm] = useState({ title: '', message: '', hours: '24' });
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadAnnouncements();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try { setUsers(await adminService.getAllUsers()); } 
    finally { setIsLoadingUsers(false); }
  };

  const loadAnnouncements = async () => {
    setAnnouncements(await adminService.getActiveAnnouncements());
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    if (!window.confirm(`¿Cambiar rol a ${newRole.toUpperCase()}?`)) return;
    
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (e) { alert("Error al cambiar el rol"); }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.message) return;
    setIsSubmittingNews(true);
    try {
      await adminService.createAnnouncement(newsForm.title, newsForm.message, parseInt(newsForm.hours));
      setNewsForm({ title: '', message: '', hours: '24' });
      await loadAnnouncements();
      alert("Aviso global publicado con éxito");
    } catch {
      alert("Error al publicar aviso");
    } finally {
      setIsSubmittingNews(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm("¿Borrar este aviso activo?")) return;
    await adminService.deleteAnnouncement(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-red-500 font-bold text-2xl">ACCESO DENEGADO</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-10 relative z-10">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-orange-500">⚙️</span> Panel de Control
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Centro de comando exclusivo para administradores de ITEC.</p>
        </div>

        {/* TABS NAVEGACIÓN */}
        <div className="flex gap-2 border-b border-itec-gray mb-6">
          <button onClick={() => setActiveTab('users')} className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'users' ? 'border-itec-blue text-itec-blue-skye' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
            👥 Gestión de Usuarios
          </button>
          <button onClick={() => setActiveTab('news')} className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'news' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
            📢 Avisos Globales
          </button>
        </div>

        {/* TAB USUARIOS */}
        {activeTab === 'users' && (
          <div className="bg-itec-surface border border-itec-gray rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-itec-bg border-b border-itec-gray">
                  <tr>
                    <th className="p-4 text-[11px] font-bold text-gray-500 uppercase">Usuario</th>
                    <th className="p-4 text-[11px] font-bold text-gray-500 uppercase">Correo UTN</th>
                    <th className="p-4 text-[11px] font-bold text-gray-500 uppercase">Rol Actual</th>
                    <th className="p-4 text-[11px] font-bold text-gray-500 uppercase text-right">Acciones de Seguridad</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingUsers ? (
                    <tr><td colSpan={4} className="text-center py-10 text-gray-400">Cargando usuarios...</td></tr>
                  ) : users.map((u) => (
                    <tr key={u.id} className="border-b border-itec-gray/30 hover:bg-itec-gray/10 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.name}`} alt="avatar" className="w-8 h-8 rounded-full" />
                        <span className="text-white font-bold text-sm">{u.name}</span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${u.role === 'admin' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-itec-blue/10 text-itec-blue-skye border border-itec-blue/20'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.email !== 'jtumiricuellar@frba.utn.edu.ar' && (
                          <Button variant="secondary" onClick={() => toggleUserRole(u.id!, u.role)} className="text-[10px] py-1.5 px-3 bg-itec-bg border-itec-gray hover:bg-white hover:text-black">
                            Hacer {u.role === 'admin' ? 'Estudiante' : 'Administrador'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB AVISOS */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Crear Aviso */}
            <div className="bg-itec-surface border border-itec-gray rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4">Emitir Nuevo Aviso</h2>
              <form onSubmit={handleCreateNews} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Título Impactante</label>
                  <Input fullWidth placeholder="Ej: ¡Inscripciones Abiertas!" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} className="bg-itec-bg text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Mensaje Detallado</label>
                  <textarea 
                    value={newsForm.message} onChange={e => setNewsForm({...newsForm, message: e.target.value})} 
                    className="w-full bg-itec-bg border border-itec-gray rounded-xl p-3 text-white text-sm focus:border-orange-500 focus:outline-none min-h-[100px] resize-none" 
                    placeholder="Escribe el cuerpo de la noticia..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Tiempo Visible en la Web</label>
                  <Select fullWidth options={[
                    { value: '12', label: '12 Horas' },
                    { value: '24', label: '1 Día (24 hrs)' },
                    { value: '72', label: '3 Días' },
                    { value: '168', label: '1 Semana' }
                  ]} value={newsForm.hours} onChange={e => setNewsForm({...newsForm, hours: e.target.value})} className="bg-itec-bg text-sm" />
                </div>
                <Button type="submit" variant="primary" disabled={isSubmittingNews} className="w-full bg-orange-600 hover:bg-orange-500 border-none text-white mt-2">
                  {isSubmittingNews ? 'Publicando...' : 'Lanzar Pop-up Global'}
                </Button>
              </form>
            </div>

            {/* Avisos Activos */}
            <div className="bg-itec-surface border border-itec-gray rounded-2xl p-6 shadow-xl flex flex-col h-full">
              <h2 className="text-lg font-bold text-white mb-4">Avisos Activos Actualmente</h2>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {announcements.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-10">No hay noticias impactando a los usuarios en este momento.</p>
                ) : announcements.map(a => (
                  <div key={a.id} className="bg-itec-bg border border-itec-gray p-4 rounded-xl relative group">
                    <button onClick={() => handleDeleteNews(a.id)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-4 h-4"><Icons type="close" /></div>
                    </button>
                    <h3 className="text-orange-400 font-bold text-sm pr-6">{a.title}</h3>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">{a.message}</p>
                    <div className="mt-3 pt-2 border-t border-itec-gray/50 flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest">
                        Expira: {a.expiresAt.toDate().toLocaleDateString()} {a.expiresAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};