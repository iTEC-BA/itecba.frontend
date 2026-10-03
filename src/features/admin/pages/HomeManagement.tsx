import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { LayoutModal } from '@/components/templates/LayoutModal';
import { linksService, type AudienceRole, type CampusLink, type LinkDisplayType, type LinkSection } from '@features/home/services/linksService';
import { useLinks } from '@features/home/hooks/useLinks';

const displayOptions = [
  { value: 'chips', label: 'Chips / accesos' },
  { value: 'stories', label: 'Stories circulares' },
  { value: 'carousel', label: 'Carrusel' },
];

const roleOptions = [
  { value: 'all', label: 'Todos los roles' },
  { value: 'student', label: 'Estudiantes' },
  { value: 'ingresante', label: 'Ingresantes' },
  { value: 'afiliado', label: 'Afiliados' },
  { value: 'profesor', label: 'Profesores' },
];

type SectionForm = {
  title: string;
  description: string;
  displayType: LinkDisplayType;
  audienceRoles: AudienceRole[];
};

type LinkForm = {
  title: string;
  url: string;
  icon: string;
  imageUrl: string;
  sectionId: string;
  order: number;
};

const emptySection: SectionForm = {
  title: '',
  description: '',
  displayType: 'chips',
  audienceRoles: ['all'],
};

const emptyLink: LinkForm = {
  title: '',
  url: '',
  icon: '🔗',
  imageUrl: '',
  sectionId: '',
  order: 0,
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">{label}</span>
    {children}
  </label>
);

export const HomeManagement: React.FC = () => {
  const { links, reload: reloadLinks } = useLinks();
  const [sections, setSections] = useState<Omit<LinkSection, 'links'>[]>([]);
  const [sectionForm, setSectionForm] = useState<SectionForm>(emptySection);
  const [linkForm, setLinkForm] = useState<LinkForm>(emptyLink);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<CampusLink | null>(null);
  const [modal, setModal] = useState<'section' | 'link' | null>(null);
  const [message, setMessage] = useState('');

  const reload = useCallback(async () => {
    setSections(await linksService.getAllSections());
    await reloadLinks();
  }, [reloadLinks]);

  useEffect(() => {
    reload().catch((error) => setMessage(error instanceof Error ? error.message : 'No se pudo cargar el contenido.'));
  }, [reload]);

  const sectionOptions = useMemo(
    () => [{ value: '', label: 'Accesos rápidos' }, ...sections.map((item) => ({ value: item.id, label: item.title }))],
    [sections],
  );

  const linksBySection = useMemo(() => {
    const grouped = new Map<string, CampusLink[]>();
    links.forEach((link) => {
      const key = link.sectionId || 'general';
      grouped.set(key, [...(grouped.get(key) || []), link]);
    });
    return grouped;
  }, [links]);

  const closeModal = () => {
    setModal(null);
    setEditingSection(null);
    setEditingLink(null);
    setSectionForm(emptySection);
    setLinkForm({ ...emptyLink, order: links.length });
  };

  const openNewSection = () => {
    setEditingSection(null);
    setSectionForm(emptySection);
    setModal('section');
  };

  const openEditSection = (section: Omit<LinkSection, 'links'>) => {
    setEditingSection(section.id);
    setSectionForm({
      title: section.title,
      description: section.description || '',
      displayType: section.displayType,
      audienceRoles: section.audienceRoles,
    });
    setModal('section');
  };

  const openNewLink = (sectionId = '') => {
    setEditingLink(null);
    setLinkForm({ ...emptyLink, sectionId, order: links.length });
    setModal('link');
  };

  const openEditLink = (link: CampusLink) => {
    setEditingLink(link);
    setLinkForm({
      title: link.title,
      url: link.url,
      icon: link.icon,
      imageUrl: link.imageUrl || '',
      sectionId: link.sectionId || '',
      order: link.order,
    });
    setModal('link');
  };

  const saveSection = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!sectionForm.title.trim()) return;
    if (editingSection) {
      await linksService.updateSection(editingSection, sectionForm);
    } else {
      await linksService.addSection({ ...sectionForm, order: sections.length, isActive: true });
    }
    await reload();
    closeModal();
  };

  const saveLink = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = { ...linkForm, sectionId: linkForm.sectionId || null };
    if (editingLink?.id) {
      await linksService.updateLink(editingLink.id, payload);
    } else {
      await linksService.addLink(payload);
    }
    await reload();
    closeModal();
  };

  const removeSection = async (id: string) => {
    if (!window.confirm('¿Eliminar esta sección? Sus links quedarán en accesos rápidos.')) return;
    await linksService.deleteSection(id);
    await reload();
  };

  const removeLink = async (id?: string) => {
    if (!id || !window.confirm('¿Eliminar este link?')) return;
    await linksService.deleteLink(id);
    await reload();
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Contenido del Home</p>
          <h2 className="text-2xl font-bold text-itec-text">Publicaciones</h2>
          <p className="mt-1 text-xs text-itec-muted">Organizá las secciones y los links que aparecen en el Home.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="slate" icon={<FolderOpen className="size-4" />} text="Agregar sección" onClick={openNewSection} />
          <Button variant="primary" icon={<Plus className="size-4" />} text="Agregar link" onClick={() => openNewLink()} />
        </div>
      </header>

      {message && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">{message}</p>}

      <div className="flex flex-col gap-4">
        <PublicationFolder
          title="Accesos rápidos"
          links={linksBySection.get('general') || []}
          onAdd={() => openNewLink()}
          onEdit={openEditLink}
          onDelete={removeLink}
        />
        {sections.map((section) => (
          <PublicationFolder
            key={section.id}
            title={section.title}
            meta={`${section.displayType} · ${section.audienceRoles.join(', ')}`}
            links={linksBySection.get(section.id) || []}
            onAdd={() => openNewLink(section.id)}
            onEdit={openEditLink}
            onDelete={removeLink}
            onEditFolder={() => openEditSection(section)}
            onDeleteFolder={() => removeSection(section.id)}
          />
        ))}
      </div>

      <LayoutModal isOpen={modal === 'section'} onClose={closeModal} title={editingSection ? 'Editar sección' : 'Agregar sección'} description="Definí cómo se verá y quién podrá verla.">
        <form onSubmit={saveSection} className="flex flex-col gap-4 p-5">
          <Field label="Título"><Input required fullWidth value={sectionForm.title} onChange={(event) => setSectionForm({ ...sectionForm, title: event.target.value })} placeholder="Ej. Recursos de cursada" className="rounded-lg border border-itec-border/50 bg-itec-card p-2 text-sm" /></Field>
          <Field label="Descripción"><Input fullWidth value={sectionForm.description} onChange={(event) => setSectionForm({ ...sectionForm, description: event.target.value })} placeholder="Descripción opcional" className="rounded-lg border border-itec-border/50 bg-itec-card p-2 text-sm" /></Field>
          <CustomSelect value={sectionForm.displayType} options={displayOptions} onChange={(value) => setSectionForm({ ...sectionForm, displayType: value as LinkDisplayType })} label="Formato" />
          <CustomSelect value={sectionForm.audienceRoles[0]} options={roleOptions} onChange={(value) => setSectionForm({ ...sectionForm, audienceRoles: [value as AudienceRole] })} label="Audiencia" />
          <Button type="submit" variant="primary" text={editingSection ? 'Guardar cambios' : 'Crear sección'} />
        </form>
      </LayoutModal>

      <LayoutModal isOpen={modal === 'link'} onClose={closeModal} title={editingLink ? 'Editar link' : 'Agregar link'} description="Configurá el acceso que aparecerá dentro de una carpeta.">
        <form onSubmit={saveLink} className="flex flex-col gap-4 p-5">
          <Field label="Título"><Input required fullWidth value={linkForm.title} onChange={(event) => setLinkForm({ ...linkForm, title: event.target.value })} placeholder="Ej. SIU Guaraní" className="rounded-lg border border-itec-border/50 bg-itec-card p-2 text-sm" /></Field>
          <Field label="URL"><Input required fullWidth value={linkForm.url} onChange={(event) => setLinkForm({ ...linkForm, url: event.target.value })} placeholder="https://..." className="rounded-lg border border-itec-border/50 bg-itec-card p-2 text-sm" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Emoji"><Input fullWidth value={linkForm.icon} onChange={(event) => setLinkForm({ ...linkForm, icon: event.target.value })} className="rounded-lg border border-itec-border/50 bg-itec-card p-2 text-sm" /></Field>
            <Field label="Imagen (URL)"><Input fullWidth value={linkForm.imageUrl} onChange={(event) => setLinkForm({ ...linkForm, imageUrl: event.target.value })} placeholder="Opcional" className="rounded-lg border border-itec-border/50 bg-itec-card p-2 text-sm" /></Field>
          </div>
          <CustomSelect value={linkForm.sectionId} options={sectionOptions} onChange={(value) => setLinkForm({ ...linkForm, sectionId: value })} label="Carpeta / sección" />
          <Button type="submit" variant="primary" text={editingLink ? 'Guardar cambios' : 'Agregar link'} />
        </form>
      </LayoutModal>
    </div>
  );
};

interface PublicationFolderProps {
  title: string;
  meta?: string;
  links: CampusLink[];
  onAdd: () => void;
  onEdit: (link: CampusLink) => void;
  onDelete: (id?: string) => void;
  onEditFolder?: () => void;
  onDeleteFolder?: () => void;
}

const PublicationFolder: React.FC<PublicationFolderProps> = ({ title, meta, links, onAdd, onEdit, onDelete, onEditFolder, onDeleteFolder }) => (
  <section className="rounded-xl border border-itec-border/50 bg-itec-box p-4">
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border border-itec-amber/30 bg-itec-amber/10 text-itec-amber"><FolderOpen className="size-5" /></div>
        <div><h3 className="font-semibold text-itec-text">{title}</h3><p className="text-[10px] uppercase tracking-widest text-itec-muted">{meta || `${links.length} links`}</p></div>
      </div>
      <div className="flex gap-2">
        <Button variant="slate" hierarchy="outline" text="Agregar link" onClick={onAdd} />
        {onEditFolder && <Button variant="slate" hierarchy="ghost" icon={<Pencil className="size-4" />} aria-label="Editar carpeta" onClick={onEditFolder} />}
        {onDeleteFolder && <Button variant="danger" hierarchy="ghost" icon={<Trash2 className="size-4" />} aria-label="Eliminar carpeta" onClick={onDeleteFolder} />}
      </div>
    </div>
    {links.length === 0 ? <p className="rounded-lg border border-dashed border-itec-border/50 p-4 text-center text-xs text-itec-muted">Esta carpeta todavía no tiene links.</p> : <div className="flex flex-col gap-2">{links.map((link) => <div key={link.id} className="flex items-center gap-3 rounded-lg border border-itec-border/50 bg-itec-bg p-3"><span className="w-8 text-center text-xl">{link.imageUrl ? <img src={link.imageUrl} alt="" className="mx-auto size-8 rounded object-cover" /> : link.icon}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-itec-text">{link.title}</p><p className="truncate text-[10px] text-itec-muted">{link.url}</p></div><Button variant="slate" hierarchy="ghost" icon={<Pencil className="size-4" />} aria-label={`Editar ${link.title}`} onClick={() => onEdit(link)} /><Button variant="danger" hierarchy="ghost" icon={<Trash2 className="size-4" />} aria-label={`Eliminar ${link.title}`} onClick={() => onDelete(link.id)} /></div>)}</div>}
  </section>
);
