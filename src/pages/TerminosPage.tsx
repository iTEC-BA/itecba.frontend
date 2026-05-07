import React, { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { usePageTitle } from "@hooks/usePageTitle";

interface Section {
  title: string;
  content: string;
}

const SECTIONS: Section[] = [
  {
    title: "1. Aceptación de los Términos",
    content:
      "Al acceder o utilizar la plataforma ITEC.BA, el usuario acepta quedar vinculado por los presentes Términos y Condiciones. Si no estás de acuerdo con alguna parte, no podrás acceder al servicio. Estos términos aplican a todos los visitantes, usuarios y personas que accedan o utilicen el servicio.",
  },
  {
    title: "2. Descripción del Servicio",
    content:
      "ITEC.BA es una plataforma educativa independiente desarrollada por estudiantes de la UTN FRBA. No tiene carácter oficial ni representa a la Universidad Tecnológica Nacional. Los servicios incluyen: BuscaTEC (buscador de materias y aulas), cursos dictados por estudiantes, GuíaTEC (videos educativos), BiblioTEC (repositorio de material), grupos de estudio y herramientas académicas complementarias.",
  },
  {
    title: "3. Uso de Contenido de Terceros",
    content:
      "Parte del contenido disponible en GuíaTEC y otras secciones puede estar alojado en plataformas externas como YouTube. ITEC.BA actúa como indexador y no se responsabiliza por el contenido externo. Los derechos de autor de dichos materiales corresponden a sus respectivos creadores. Los usuarios deben respetar las condiciones de uso de dichas plataformas.",
  },
  {
    title: "4. Cuentas de Usuario y Autenticación",
    content:
      "El acceso a funciones avanzadas requiere iniciar sesión mediante una cuenta de Google. Los datos recopilados durante el proceso de autenticación se utilizan exclusivamente para identificar al usuario dentro de la plataforma y no serán compartidos con terceros sin consentimiento explícito, salvo obligación legal.",
  },
  {
    title: "5. Sistema de Puntos y Recompensas",
    content:
      "Los puntos acumulados en la plataforma son virtuales y no tienen valor monetario. ITEC.BA se reserva el derecho de modificar, limitar o cancelar el sistema de puntos en cualquier momento sin previo aviso. Los puntos no son transferibles entre cuentas ni canjeables por dinero en efectivo.",
  },
  {
    title: "6. Cursos y Material de Usuarios",
    content:
      "Los cursos y materiales publicados por usuarios son responsabilidad exclusiva de sus autores. ITEC.BA no garantiza la exactitud, completitud ni actualidad del contenido generado por usuarios. Nos reservamos el derecho de eliminar contenido que infrinja derechos de terceros, sea inapropiado o viole estos términos.",
  },
  {
    title: "7. Limitación de Responsabilidad",
    content:
      "ITEC.BA no garantiza que la plataforma esté disponible de forma ininterrumpida ni libre de errores. No nos hacemos responsables por pérdidas directas o indirectas derivadas del uso o imposibilidad de uso del servicio. La información académica publicada tiene carácter orientativo; para datos oficiales, consultá el SIU Guaraní o la secretaría de tu facultad.",
  },
  {
    title: "8. Privacidad y Datos Personales",
    content:
      "Recopilamos datos mínimos necesarios para el funcionamiento de la plataforma (email, nombre de perfil, foto de Google). No vendemos ni cedemos datos personales a terceros con fines comerciales. Los datos pueden ser usados para mejorar la experiencia del usuario y enviar notificaciones académicas relevantes. Podés solicitar la eliminación de tu cuenta y datos en cualquier momento.",
  },
  {
    title: "9. Modificaciones a los Términos",
    content:
      "ITEC.BA se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigencia a partir de su publicación en la plataforma. El uso continuado del servicio tras dichas modificaciones implica la aceptación de los nuevos términos.",
  },
  {
    title: "10. Contacto",
    content:
      "Para consultas, reclamos o solicitudes relacionadas con estos términos, podés contactarnos a través de nuestras redes sociales o al correo de ITEC UTN FRBA. También podés comunicarte con el equipo de desarrollo a través del repositorio oficial del proyecto.",
  },
];

export const TerminosPage: React.FC = () => {
  usePageTitle("Términos y Condiciones");
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <MainLayout>
      <PageHeader
        title="Términos y Condiciones"
        description="Leé con atención las condiciones de uso de la plataforma ITEC.BA antes de utilizarla."
        iconType="file-text"
        colorTheme="blue"
      />

      <div className="max-w-3xl mx-auto">
        <div className="bg-itec-card border border-white/7 rounded-xl p-4 mb-6 flex items-start gap-3">
          <div className="text-lg shrink-0">📌</div>
          <p className="text-sm text-[#9aa3b0] leading-relaxed">
            ITEC.BA es un proyecto estudiantil independiente, sin fines de lucro, creado por y para estudiantes de la UTN FRBA. Última actualización: <strong className="text-itec-text">Mayo 2025</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {SECTIONS.map((s, i) => (
            <div key={i} className="bg-itec-card border border-white/7 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left"
              >
                <span className="text-sm font-medium text-itec-text">{s.title}</span>
                <span className={`text-[#5a6475] text-lg leading-none transition-transform shrink-0 ${expanded === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="h-px bg-white/5 mb-4" />
                  <p className="text-sm text-[#9aa3b0] leading-relaxed">{s.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
