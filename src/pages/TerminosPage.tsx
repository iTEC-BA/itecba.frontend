import React from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { usePageTitle } from "@hooks/usePageTitle";

export const TerminosPage: React.FC = () => {
  usePageTitle("Términos y Condiciones — ITEC.BA");

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8 border-b border-itec-border pb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted mb-2">Legal</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Términos y Condiciones de Uso
          </h1>
          <p className="mt-3 text-sm text-itec-muted">
            Última actualización: {new Date().toLocaleDateString('es-AR')}
          </p>
        </div>

        <div className="space-y-8 text-sm text-itec-muted leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Aceptación de los Términos</h2>
            <p>
              Al acceder, registrarse y utilizar la plataforma ITEC.BA (en adelante, "la Plataforma" o "ITEC"), usted acepta someterse a los presentes Términos y Condiciones ("T&C") y a nuestra Política de Privacidad. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios. La Plataforma está dirigida exclusivamente a estudiantes y miembros de la comunidad educativa vinculada (UTN FRBA), requiriendo un Legajo y/o DNI válido para la plena funcionalidad.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Tratamiento de Datos Personales y Privacidad</h2>
            <p className="mb-2">
              En cumplimiento con la Ley de Protección de los Datos Personales N° 25.326 (República Argentina), le informamos que:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Recopilación:</strong> ITEC recopila datos identificatorios (Nombre, DNI, Legajo, Correo Electrónico, Teléfono, Carrera, Año de Ingreso) con el fin de validar la identidad del usuario, emitir la credencial virtual ("TarjeTEC") y prevenir fraudes.</li>
              <li><strong>Almacenamiento de Terceros:</strong> Los datos son procesados y almacenados utilizando infraestructuras de terceros (Firebase, MongoDB Atlas, Supabase). Al aceptar estos T&C, el usuario consiente el procesamiento transfronterizo de sus datos.</li>
              <li><strong>Exactitud:</strong> El usuario declara bajo juramento que los datos aportados son reales y verificables. ITEC se reserva el derecho de suspender cuentas con datos falsos o suplantación de identidad.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Uso de Cookies y Almacenamiento Local</h2>
            <p>
              La Plataforma utiliza cookies, tokens de sesión y tecnologías de almacenamiento local (Local Storage/Session Storage) estrictamente necesarias para la autenticación del usuario, el mantenimiento de la sesión activa y preferencias de interfaz. ITEC <strong>no</strong> utiliza cookies de rastreo de terceros para fines publicitarios. Al continuar usando la Plataforma, usted otorga su consentimiento explícito, irrevocable e incondicional para el uso de estas tecnologías.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Credencial TarjeTEC y Red de Beneficios</h2>
            <p>
              La "TarjeTEC" es una credencial digital intransferible. ITEC actúa única y exclusivamente como <strong>intermediario informativo</strong> entre los estudiantes y los comercios adheridos.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>ITEC <strong>no garantiza</strong> la disponibilidad continua, calidad, idoneidad ni efectividad de los productos o servicios ofrecidos por terceros.</li>
              <li>Cualquier reclamo por descuentos no aplicados, mala atención o perjuicios derivados de la relación de consumo deberá dirigirse exclusivamente al comercio proveedor.</li>
              <li>ITEC se reserva el derecho de modificar, suspender o eliminar comercios y beneficios del catálogo en cualquier momento y sin previo aviso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Sistema de Gamificación y Recompensas</h2>
            <p>
              El sistema de puntos de ITEC es un programa de incentivos académicos y de participación. <strong>Los puntos ITEC carecen de valor económico, fiduciario, comercial o monetario.</strong> No pueden ser comprados, vendidos, transferidos ni canjeados por dinero en efectivo. ITEC se reserva el derecho absoluto e inapelable de:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Modificar el valor de las recompensas, invalidar puntos obtenidos mediante explotación de vulnerabilidades (exploits) o fraude.</li>
              <li>Terminar el programa de recompensas en cualquier momento, lo cual resultará en la pérdida total de los puntos acumulados sin derecho a indemnización alguna.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Foro Anónimo y Contenido Generado por el Usuario (UGC)</h2>
            <p>
              La Plataforma incluye un micro-foro anónimo y repositorios de apuntes. El usuario es el único y exclusivo responsable legal de cualquier contenido, comentario, archivo (PDFs, imágenes) o enlace que publique.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Pseudonimato Condicionado:</strong> El anonimato en el foro es únicamente frente a otros usuarios públicos. ITEC mantiene un registro criptográfico del "Real User ID" asociado a cada publicación. En caso de requerimiento judicial, acoso reiterado, amenazas o comisión de delitos, ITEC revelará la identidad real del usuario a las autoridades competentes sin necesidad de previo aviso.</li>
              <li><strong>Propiedad Intelectual (Apuntes):</strong> Está terminantemente prohibido subir material protegido por derechos de autor sin autorización (libros escaneados, material oficial no libre). ITEC actuará de inmediato eliminando el contenido ante cualquier reclamo de "Take-Down" aplicable.</li>
              <li><strong>Filtros y Moderación:</strong> La Plataforma utiliza sistemas automatizados para filtrar vocabulario inapropiado. Intentar evadir estos filtros resultará en la suspensión permanente.</li>
              <li><strong>Retención de Datos:</strong> Las publicaciones anónimas y sus respuestas serán eliminadas permanentemente de la base de datos tras un período de 6 meses. ITEC no tiene obligación de proveer copias de seguridad de dicho contenido.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Exención de Garantías (Cláusula "AS IS")</h2>
            <p>
              La Plataforma ITEC.BA, sus servicios, módulos de tutorías, repositorio y foros se proporcionan <strong>"TAL CUAL" (As Is) y "SEGÚN DISPONIBILIDAD" (As Available)</strong>.
            </p>
            <p className="mt-2">
              ITEC no garantiza que la plataforma estará libre de errores, interrupciones, vulnerabilidades de seguridad o pérdida de datos. Operamos sobre infraestructuras de capa gratuita (Free Tiers), por lo que ITEC declina toda responsabilidad por caídas del servidor, pérdida de apuntes subidos, o inhabilitación temporal o permanente de la base de datos. El usuario asume el riesgo total de utilizar el servicio y debe mantener sus propias copias de seguridad de cualquier material académico.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Indemnidad y Limitación de Responsabilidad</h2>
            <p>
              En ningún caso, ITEC, sus administradores, desarrolladores, tutores o miembros de la agrupación serán responsables por daños directos, indirectos, incidentales, especiales, punitivos o consecuentes (incluyendo pérdida de datos, lucro cesante o daños informáticos) que surjan del uso o la imposibilidad de uso de la Plataforma. El usuario acepta mantener indemne a ITEC de cualquier reclamo legal, demanda o gasto derivado de sus acciones dentro de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Terminación y Derecho de Admisión</h2>
            <p>
              ITEC se reserva el <strong>derecho de admisión, permanencia y exclusión</strong>. Podemos suspender, bloquear o eliminar cuentas de forma inmediata, sin previo aviso ni responsabilidad, por cualquier motivo, incluyendo pero no limitado a: violación de estos T&C, comportamiento abusivo en el foro anónimo, subida de archivos maliciosos (malware/virus), o fraude en el sistema de canjes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Modificaciones y Jurisdicción</h2>
            <p>
              ITEC se reserva el derecho de modificar estos T&C en cualquier momento. El uso continuado de la plataforma tras la publicación de los cambios constituye su aceptación tácita. 
            </p>
            <p className="mt-2">
              Para cualquier controversia legal derivada del uso de la Plataforma, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires (CABA), renunciando expresamente a cualquier otro fuero o jurisdicción.
            </p>
          </section>

        </div>
      </div>
    </MainLayout>
  );
};