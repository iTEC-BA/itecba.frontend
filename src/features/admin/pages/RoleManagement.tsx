import React, { useEffect, useState } from "react";
import { LayoutModal } from "@/components/templates/LayoutModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { adminService, type RoleDefinition } from "../services/admin.service";
import { useAuthorization } from "@/hooks/useAuthorization";

const emptyRole = { key: "", name: "", description: "", permissions: [] as string[] };
const PERMISSION_OPTIONS = [
  { value: "admin.panel", label: "Administración del panel" },
  { value: "users.manage", label: "Gestión de usuarios" },
  { value: "roles.manage", label: "Gestión de roles y permisos" },
  { value: "publications.manage", label: "Gestión de publicaciones" },
  { value: "announcements.manage", label: "Gestión de avisos" },
  { value: "courses.edit", label: "Edición de cursos" },
  { value: "courses.manage", label: "Administración de cursos" },
  { value: "resources.manage", label: "Gestión de recursos" },
];

export const RoleManagement: React.FC = () => {
  const { can } = useAuthorization();
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [form, setForm] = useState(emptyRole);
  const [permissionToAdd, setPermissionToAdd] = useState("");
  const [editing, setEditing] = useState<RoleDefinition | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setRoles(await adminService.getRoles());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los roles.");
    }
  };
  useEffect(() => { load(); }, []);

  if (!can("roles.manage")) {
    return <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">No tenés permisos para administrar roles.</p>;
  }

  const close = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyRole);
    setPermissionToAdd("");
  };

  const openEdit = (role: RoleDefinition) => {
    setEditing(role);
    setForm({ key: role.key, name: role.name, description: role.description, permissions: role.permissions });
    setModalOpen(true);
  };

  const openNewRole = () => {
    setEditing(null);
    setForm(emptyRole);
    setError("");
    setModalOpen(true);
  };

  const save = async (event: React.SubmitEvent) => {
    event.preventDefault();
    const permissions = form.permissions;
    try {
      if (editing?._id) await adminService.updateRole(editing._id, { name: form.name, description: form.description, permissions });
      else await adminService.createRole({ ...form, permissions });
      await load();
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el rol.");
    }
  };

  const remove = async (role: RoleDefinition) => {
    if (role.isSystem || !role._id || !window.confirm(`¿Eliminar el rol ${role.name}?`)) return;
    try { await adminService.deleteRole(role._id); await load(); } catch (err) { setError(err instanceof Error ? err.message : "No se pudo eliminar el rol."); }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Seguridad</p><h2 className="text-2xl font-bold text-itec-text">Roles y permisos</h2><p className="mt-1 text-xs text-itec-muted">Definí qué funcionalidades puede utilizar cada rol.</p></div>
        <Button
          variant="primary"
          hierarchy="dashed"
          text="Agregar Rol"
          onClick={openNewRole}
          className="rounded-xl! border! border-itec-purple/30! bg-itec-purple/10! px-5! py-2.5! text-sm! font-bold! text-itec-purple! hover:bg-itec-purple/20!"
        />
      </header>
      {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">{error}</p>}
      <div className="grid gap-3">
        {roles.map((role) => <div key={role._id || role.key} className="rounded-xl border border-itec-border/50 bg-itec-box p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-itec-text">{role.name} <span className="text-xs font-normal text-itec-muted">({role.key})</span></h3><p className="mt-1 text-xs text-itec-muted">{role.description}</p></div><div className="flex gap-2"><Button variant="slate" text="Editar" onClick={() => openEdit(role)} className="rounded-xl! border! border-itec-sky/30! bg-itec-sky/10! px-4! py-2! text-xs! font-bold! text-itec-sky! hover:bg-itec-sky/20!" />{!role.isSystem && <Button variant="danger" text="Eliminar" onClick={() => remove(role)} className="rounded-xl! border! border-itec-red/30! bg-itec-red/10! px-4! py-2! text-xs! font-bold! text-itec-red! hover:bg-itec-red/20!" />}</div></div><div className="mt-3 flex flex-wrap gap-2">{role.permissions.length ? role.permissions.map((permission) => <span key={permission} className="rounded-full border border-itec-sky/30 bg-itec-sky/10 px-2 py-1 text-[10px] text-itec-sky">{permission}</span>) : <span className="text-xs text-itec-muted">Sin permisos asignados</span>}</div></div>)}
      </div>
      <LayoutModal isOpen={modalOpen} onClose={close} title={editing ? "Editar rol" : "Agregar rol"} description="Las funcionalidades se expresan como permisos, por ejemplo: courses.edit">
        <form onSubmit={save} className="flex flex-col gap-4 p-5">
          <Input required fullWidth disabled={Boolean(editing)} value={form.key} onChange={(event) => setForm({ ...form, key: event.target.value })} placeholder="Clave: coordinador" className="rounded-lg border border-itec-border/50 bg-itec-card p-2 text-sm" />
          <Input required fullWidth value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nombre visible" className="rounded-lg border border-itec-border/50 bg-itec-card p-2 text-sm" />
          <Input fullWidth value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descripción" className="rounded-lg border border-itec-border/50 bg-itec-card p-2 text-sm" />
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-itec-purple">Agregar funcionalidad</span>
            <select
              value={permissionToAdd}
              onChange={(event) => {
                const permission = event.target.value;
                if (permission) {
                  setForm((current) => ({
                    ...current,
                    permissions: current.permissions.includes(permission)
                      ? current.permissions
                      : [...current.permissions, permission],
                  }));
                }
                setPermissionToAdd("");
              }}
              className="w-full rounded-lg border border-itec-border/50 bg-itec-card p-3 text-sm text-itec-text outline-none focus:border-itec-purple"
            >
              <option value="">Seleccioná una funcionalidad...</option>
              {PERMISSION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            {form.permissions.length === 0 ? (
              <span className="text-[11px] text-itec-muted">Sin funcionalidades asignadas.</span>
            ) : form.permissions.map((permission) => (
              <span key={permission} className="inline-flex items-center gap-2 rounded-lg border border-itec-sky/30 bg-itec-sky/10 px-2.5 py-1.5 text-xs text-itec-sky">
                {PERMISSION_OPTIONS.find((option) => option.value === permission)?.label ?? permission}
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, permissions: current.permissions.filter((item) => item !== permission) }))}
                  className="text-itec-muted hover:text-itec-text"
                  aria-label={`Quitar ${permission}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <p className="text-[11px] text-itec-muted">Seleccioná las funcionalidades que tendrá el rol. Podés quitar cualquiera desde la etiqueta.</p>
          <Button
            type="submit"
            variant="primary"
            text="Guardar rol"
            className="rounded-xl! border! border-itec-rewards/20! bg-itec-rewards! px-5! py-3! text-sm! font-bold! text-black! hover:brightness-110!"
          />
        </form>
      </LayoutModal>
    </div>
  );
};
