import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/templates/MainLayout';
import { usePageTitle } from '@hooks/usePageTitle';
import { Icons } from '@/components/ui/icons/Icons';
import { useContributors } from '@features/about/hooks/useContributors';
import { HERO_DATA, PILLARS_DATA, PROJECTS_DATA, CONTRIBUTORS_DATA } from '@features/about/data/about.data';
import { cn } from '@/lib/utils';

export const AboutPage: React.FC = () => {
  usePageTitle("Sobre Nosotros | ITEC BA");
  const { team, isLoading } = useContributors();

  return (
    <MainLayout>
      <main className="px-4 pb-24 overflow-x-hidden">
        
        {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
        <section className="py-8 md:py-8 w-full mx-auto container lg:max-w-4xl md:max-w-2xl">
          <div className="max-w-2xl">
            <div className="flex gap-4 mb-6 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Logo Institucional */}
              <div className="relative shrink-0">
                <div className="flex items-center justify-center p-1 h-20 w-20 sm:h-24 sm:w-24">
                   <img 
                      src={HERO_DATA.logoUrl} 
                      alt="iTEC BA" 
                      className="w-full h-full object-contain" 
                      onError={(e) => { (e.target as HTMLImageElement).src = '/itec.png'; }} 
                   />
                </div>
              </div>

              {/* Tag Institucional */}
              <div className="flex items-center h-full">
                <span className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-itec-text bg-itec-surface border border-itec-red-skye rounded-lg gap-2 bg-itec-red">
                  <Icons type={HERO_DATA.taglineIcon} className="w-4 h-4" /> {HERO_DATA.tagline}
                </span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-itec-text sm:text-5xl mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
              {HERO_DATA.titleStart} <span className="text-itec-red">{HERO_DATA.titleHighlight}</span>
            </h1>
            
            <p className="mt-6 text-base md:text-lg text-itec-text/80 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              {/* Renderizamos el texto usando un split simple para mantener el negrita sin usar dangerouslySetInnerHTML */}
              Somos una plataforma colaborativa e independiente construida <strong className="text-itec-text font-bold">exclusivamente por y para estudiantes</strong> de la UTN FRBA. Nuestro objetivo es centralizar herramientas y democratizar el acceso a la información académica de forma rápida y sin publicidad.
            </p>
            
            {/* Redes Sociales Dinámicas */}
            <nav className="flex flex-wrap gap-3 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              {HERO_DATA.socialLinks.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-itec-text transition-colors bg-itec-red/25 border border-itec-red/33 rounded-xl hover:bg-itec-surface text-xs font-bold"
                >
                  <Icons type={link.icon} className="w-4 h-4 text-itec-muted" /> {link.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* ── TIMELINE SECTION (Pilares) ─────────────────────────────────── */}
        <section className="py-8 w-full mx-auto container lg:max-w-4xl md:max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="mb-10">
            <h2 className="flex items-center text-2xl md:text-3xl font-bold tracking-tight gap-x-3 text-itec-text">
              <Icons type={PILLARS_DATA.icon} className="w-7 h-7 text-itec-rewards" />
              {PILLARS_DATA.title}
            </h2>
          </div>
          
          <ol className="relative mt-8 border-l-2 border-itec-border ml-3 md:ml-4">
            {PILLARS_DATA.items.map((pillar, idx) => (
              <li key={idx} className="mb-12 ml-8 md:ml-12 last:mb-0">
                <span className={cn("absolute flex items-center justify-center w-3 h-3 rounded-full -left-1.75 top-1.5 ring-4 ring-itec-bg", pillar.colorClass)} />
                <h3 className="flex items-center mb-1 text-lg font-bold text-itec-text flex-wrap gap-2">
                  {pillar.title}
                  <span className="bg-itec-blue/33 text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md  border border-itec-blue-skye">
                    {pillar.badge}
                  </span>
                </h3>
                <p className="mb-4 text-sm text-itec-text/70 leading-relaxed max-w-2xl mt-2">
                  {pillar.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── PROJECTS SECTION ───────────────────────────────────────────── */}
        <section className="py-16 w-full mx-auto container lg:max-w-4xl md:max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
          <div className="mb-12 border-b border-itec-border pb-4">
            <h2 className="flex items-center text-2xl md:text-3xl font-bold tracking-tight gap-x-3 text-itec-text">
              <Icons type={PROJECTS_DATA.icon} className="w-7 h-7 text-itec-blue-skye" />
              {PROJECTS_DATA.title}
            </h2>
          </div>

          <div className="flex flex-col gap-y-16">
            {PROJECTS_DATA.items.map((project) => (
              <article key={project.id} className="flex flex-col md:flex-row gap-6 md:gap-10 group">
                {/* Imagen del proyecto */}
                <div className="w-full md:w-1/2">
                  <div className="relative flex flex-col items-center overflow-hidden rounded-xl border border-itec-border bg-itec-box p-8 md:p-12 transition-colors duration-300 group-hover:border-itec-muted">
                    <img 
                      alt={project.title} 
                      className="object-contain w-full h-40 opacity-80 group-hover:opacity-100 transition-opacity" 
                      loading="lazy" 
                      src={project.imageUrl} 
                    />
                  </div>
                </div>
                
                {/* Info del proyecto */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-itec-text">
                    {project.title}
                  </h3>
                  
                  {/* Tags Flat */}
                  <ul className="flex flex-row flex-wrap mt-4 gap-2">
                    {project.tags.map((tag, i) => (
                      <li key={i}>
                        <span className={cn("flex gap-x-2 rounded-lg text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 border", tag.colorClass)}>
                          {tag.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <p className="mt-4 text-sm text-itec-text/70 leading-relaxed text-pretty">
                    {project.description}
                  </p>
                  
                  {/* Footer Buttons */}
                  <footer className="flex items-center mt-6 gap-x-3">
                    {project.links.map((link, i) => (
                      <Link 
                        key={i} 
                        to={link.url} 
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-itec-text transition-colors bg-itec-surface border border-itec-border rounded-xl hover:bg-itec-box hover:text-white"
                      >
                        <Icons type={link.icon} className="w-4 h-4" />
                        {link.label}
                      </Link>
                    ))}
                  </footer>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── CONTRIBUTORS SECTION ───────────────────────────────────────── */}
        <section className="py-16 w-full mx-auto container lg:max-w-4xl md:max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <div className="mb-10 border-b border-itec-border pb-4">
            <h2 className="flex items-center text-2xl md:text-3xl font-bold tracking-tight gap-x-3 text-itec-text">
              <Icons type={CONTRIBUTORS_DATA.sectionIcon} className="w-7 h-7 text-itec-red" />
              {CONTRIBUTORS_DATA.sectionTitle}
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            
            {/* Columna Izquierda: Los Creadores */}
            <div className="w-full md:w-3/5 flex flex-col justify-center gap-6 bg-itec-box border border-itec-border rounded-2xl p-8 sm:p-10 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-itec-text mb-2 tracking-tight">
                  {CONTRIBUTORS_DATA.teamTitle}
                </h3>
                <p className="text-sm text-itec-text/60 leading-relaxed max-w-75">
                  {CONTRIBUTORS_DATA.teamDescription}
                </p>
              </div>

              {/* Pila de Avatares (Componente Dinámico intacto) */}
              <div className="flex flex-wrap items-center mt-2 relative z-10 h-16">
                {isLoading ? (
                  <div className="text-sm text-itec-muted">Cargando equipo...</div>
                ) : (
                  <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                    {team?.map((user, index) => {
                      const displayName = user?.name || 'Miembro';
                      const initial = displayName.charAt(0).toUpperCase();
                      const firstName = displayName.split(' ')[0];

                      return (
                        <div key={index} className="group/avatar relative transition-transform hover:-translate-y-1 cursor-default">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-itec-box bg-itec-surface overflow-hidden flex items-center justify-center text-lg font-bold text-itec-muted ring-1 ring-itec-border group-hover/avatar:ring-itec-muted transition-all">
                            {user?.photoURL ? (
                              <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover grayscale-20" />
                            ) : (
                              initial
                            )}
                          </div>
                          
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 bg-itec-surface border border-itec-border text-itec-text text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-30 pointer-events-none flex flex-col items-center font-medium tracking-wide">
                            {firstName}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-itec-surface border-r border-b border-itec-border rotate-45" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha: CTA Github */}
            <div className="w-full md:w-2/5 flex">
              <div className="w-full bg-itec-red/33 border border-itec-border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center h-full relative overflow-hidden transition-color">
                
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-itec-muted mb-4">
                  <Icons type={CONTRIBUTORS_DATA.ctaIcon} className="w-5 h-5" />
                </div>
                
                <h4 className="text-itec-text font-bold text-base mb-2">{CONTRIBUTORS_DATA.ctaTitle}</h4>
                <p className="text-xs text-itec-text/60 mb-6 leading-relaxed max-w-50">
                  {CONTRIBUTORS_DATA.ctaDescription}
                </p>
                
                <a 
                  href={CONTRIBUTORS_DATA.ctaButtonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-6 bg-itec-box rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <Icons type={CONTRIBUTORS_DATA.ctaButtonIcon} className="w-4 h-4" /> {CONTRIBUTORS_DATA.ctaButtonText}
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>
    </MainLayout>
  );
};