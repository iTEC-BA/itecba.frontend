export interface FAQ {
  keywords: string[];
  answer: string;
}

export const FAQ_DATABASE: FAQ[] = [
  // ==========================================
  // MATERIAL DE ESTUDIO Y APUNTES (Redirección a ITEC)
  // ==========================================
  {
    keywords: ["apuntes", "material", "parciales", "finales", "resumen", "resumenes", "estudiar", "pdf", "drive", "carpeta"],
    answer: "Si buscás **apuntes, resúmenes, guías de ejercicios, modelos de parciales o finales resueltos**, podés encontrar mucho material compartido por estudiantes.\n\nIngresá a:\n\n**[Explorar Aportes](/recursos)**\n\nAhí la comunidad sube material clasificado por:\n\n- Materia\n- Carrera\n- Año\n- Tipo de material (apunte, parcial, final, resumen)\n\nConsejos útiles:\n\n- Revisá siempre la **fecha del material**, porque algunos programas cambian.\n- Compará varios apuntes si la materia es difícil.\n- Practicá con **parciales de años anteriores**, ya que muchos profesores mantienen estilos similares de evaluación."
  },
  {
    keywords: ["clases", "grabadas", "videos", "youtube", "curso"],
    answer: "Podés encontrar **clases grabadas, cursos de apoyo y contenido teórico** en tu sección:\n\n**[Mis Cursos](/cursos)**\n\nEn muchos casos allí se publican:\n\n- Clases grabadas\n- Explicaciones de temas difíciles\n- Resolución de ejercicios\n- Cursos de apoyo para materias básicas\n\nTambién es común que algunas cátedras publiquen clases o material complementario en el **canal de YouTube de ITEC UTN BA**.\n\nSiempre revisá también el **Aula Virtual oficial**, ya que muchas materias publican allí el contenido principal."
  },

  // ==========================================
  // SEDES Y UBICACIÓN
  // ==========================================
  {
    keywords: ["sede", "medrano", "campus", "lugano", "almagro", "ubicacion", "donde", "direccion"],
    answer: "La **UTN FRBA (Facultad Regional Buenos Aires)** tiene dos sedes principales para cursar carreras de ingeniería.\n\n**Sede Medrano**\n\n- Dirección: Medrano 951, Almagro, CABA\n- Principalmente materias de especialidad y últimos años\n- También funcionan áreas administrativas\n\n**Campus UTN Lugano**\n\n- Dirección: Mozart 2300, Villa Lugano, CABA\n- La mayoría de materias de **primeros años y ciencias básicas**\n\nMuchos estudiantes cursan en **ambas sedes durante la carrera**.\n\nMás información oficial:\n\n[https://frba.utn.edu.ar](https://frba.utn.edu.ar/)"
  },

  // ==========================================
  // TRÁMITES Y SISTEMAS (SIGA)
  // ==========================================
  {
    keywords: ["siga", "contraseña", "login", "sistema", "entrar"],
    answer: "El **SIGA (Sistema de Información de Gestión Académica)** es el sistema principal que utilizan los estudiantes para gestionar su carrera.\n\nIngresá aquí:\n\n[https://siga.frba.utn.edu.ar](https://siga.frba.utn.edu.ar/)\n\nDesde SIGA podés:\n\n- Inscribirte a materias\n- Inscribirte a finales\n- Ver notas\n- Ver tu historia académica\n- Solicitar certificados\n- Consultar horarios\n\nSi olvidaste tu contraseña:\n\n1. Entrá al sistema.\n2. Hacé clic en **Olvidé mi contraseña**.\n3. Ingresá tu correo registrado.\n4. Seguí las instrucciones del mail.\n\nSi no recibís el correo, revisá **spam o correo no deseado**."
  },
  {
    keywords: ["regular", "certificado", "alumno", "laboral", "trabajo", "constancia"],
    answer: "Podés solicitar certificados académicos desde el sistema **SIGA**.\n\nIngresá aquí:\n\n[https://siga.frba.utn.edu.ar](https://siga.frba.utn.edu.ar/)\n\nPasos:\n\n1. Iniciá sesión.\n2. Ir al menú **Solicitud de Certificados**.\n3. Elegí el certificado que necesitás.\n\nLos certificados más comunes son:\n\n- Alumno regular\n- Certificado de examen\n- Analítico parcial\n\nNormalmente los certificados se envían **firmados digitalmente al mail institucional**, lo que permite presentarlos en trabajos o trámites oficiales."
  },
  {
    keywords: ["inscripcion", "anotarme", "ingreso", "empezar", "fechas", "cuatrimestre"],
    answer: "La **inscripción a materias** se realiza desde el sistema SIGA.\n\nIngresá aquí:\n\n[https://siga.frba.utn.edu.ar](https://siga.frba.utn.edu.ar/)\n\nPasos generales:\n\n1. Iniciá sesión.\n2. Entrá a **Inscripción a cursadas**.\n3. Seleccioná la materia.\n4. Elegí comisión y horario.\n5. Confirmá la inscripción.\n\nImportante:\n\n- Las inscripciones se realizan **en fechas específicas del calendario académico**.\n- Suelen abrir en **febrero/marzo (primer cuatrimestre)** y **julio/agosto (segundo cuatrimestre)**.\n- Algunas materias tienen **prioridad por año de carrera o cantidad de materias aprobadas**.\n\nConsultá el calendario en:\n\n[https://frba.utn.edu.ar](https://frba.utn.edu.ar/)"
  },
  {
    keywords: ["finales", "examen", "rendir", "mesa", "fechas de finales"],
    answer: "La inscripción a **mesas de examen final** se realiza desde SIGA.\n\nIngresá a:\n\n[https://siga.frba.utn.edu.ar](https://siga.frba.utn.edu.ar/)\n\nPasos:\n\n1. Iniciar sesión.\n2. Ir a **Inscripción a finales**.\n3. Seleccionar materia.\n4. Elegir la mesa disponible.\n5. Confirmar la inscripción.\n\nImportante:\n\n- Debés anotarte **al menos 48 horas hábiles antes del examen**. :contentReference[oaicite:0]{index=0}\n- Sábados, domingos y feriados **no cuentan como días hábiles**.\n- Debés tener la materia **regular o habilitada para final**.\n\nSe recomienda **guardar el comprobante de inscripción**."
  },
  {
    keywords: ["boleto", "sube", "estudiantil", "pasaje", "transporte"],
    answer: "El **boleto estudiantil** permite descuentos en transporte público.\n\nPara solicitarlo generalmente debés:\n\n- Ser alumno regular\n- Tener materias aprobadas o cursando\n\nPasos típicos:\n\n1. Ingresar a **SIGA**.\n2. Ir al menú de **trámites estudiantiles**.\n3. Solicitar el beneficio.\n\nLuego deberás **validar la tarjeta SUBE** en una terminal automática para que se aplique el beneficio.\n\nRevisá información actualizada en:\n\n[https://frba.utn.edu.ar](https://frba.utn.edu.ar/)"
  },
  {
    keywords: ["equivalencias", "cambio", "especialidad", "facultad", "pase"],
    answer: "Los trámites de **equivalencias, cambio de carrera o pase desde otra universidad** se gestionan a través de la **Dirección de Gestión Académica**.\n\nAlgunos trámites posibles:\n\n- Cambio de especialidad\n- Pase desde otra universidad\n- Pase desde otra regional UTN\n- Reconocimiento de materias\n\nEstos trámites suelen abrir en **fechas específicas del calendario académico**.\n\nMás información:\n\n[https://frba.utn.edu.ar/estudiantes/tramites/](https://frba.utn.edu.ar/estudiantes/tramites/)"
  },
  {
    keywords: ["mail", "institucional", "correo", "alumnos.frba"],
    answer: "Todos los estudiantes tienen un **correo institucional**.\n\nFormato habitual:\n\nusuario@alumnos.frba.utn.edu.ar\n\nEste correo se utiliza para:\n\n- Acceder al Aula Virtual\n- Recibir notificaciones académicas\n- Recibir certificados\n- Comunicaciones oficiales de la facultad\n\nEs importante **revisarlo regularmente**, ya que muchos avisos importantes se envían únicamente a este correo."
  },

  // ==========================================
  // SISTEMAS Y PLATAFORMAS
  // ==========================================
  {
    keywords: ["aula virtual", "campus virtual", "campus", "moodle"],
    answer: "El **Aula Virtual de UTN FRBA** es la plataforma donde las materias publican contenido académico.\n\nIngresá aquí:\n\n[https://aulavirtual.frba.utn.edu.ar](https://aulavirtual.frba.utn.edu.ar/)\n\nEn el Aula Virtual suelen encontrarse:\n\n- Material teórico\n- Guías de ejercicios\n- Fechas de parciales\n- Entregas de trabajos prácticos\n- Foros de consulta\n\nCada materia tiene su propio espacio dentro del campus."
  },
  {
    keywords: ["no puedo entrar aula virtual", "problema aula virtual", "login aula virtual"],
    answer: "Si no podés entrar al Aula Virtual:\n\n1. Verificá que estás usando tu **correo institucional**.\n2. Revisá que la contraseña sea correcta.\n3. Intentá usar la opción **recuperar contraseña**.\n4. Probá ingresar desde otro navegador.\n\nAcceso al sistema:\n\n[https://aulavirtual.frba.utn.edu.ar](https://aulavirtual.frba.utn.edu.ar/)\n\nSi el problema persiste, contactá soporte técnico de la facultad."
  },

  // ==========================================
  // INGRESO A LA UTN
  // ==========================================
  {
    keywords: ["ingreso utn", "seminario ingreso", "como entrar utn", "inscripcion ingreso"],
    answer: "El ingreso a **UTN FRBA** generalmente se realiza mediante el **Seminario Universitario de ingreso**.\n\nEste seminario incluye contenidos de nivelación en áreas básicas como:\n\n- Matemática\n- Física\n\nDependiendo del año puede tener:\n\n- Clases teóricas\n- Guías de ejercicios\n- Parciales o evaluaciones\n\nInformación oficial:\n\n[https://frba.utn.edu.ar](https://frba.utn.edu.ar/)"
  },
  {
    keywords: ["documentacion ingreso", "papeles ingreso utn"],
    answer: "Para el ingreso a la facultad normalmente se solicita documentación como:\n\n- DNI\n- Título secundario o constancia de título en trámite\n- Foto tipo carnet\n\nEn algunos casos también pueden solicitarse:\n\n- Certificado analítico del secundario\n- Formularios de inscripción\n\nLos requisitos exactos pueden cambiar cada año, por lo que siempre conviene verificar en:\n\n[https://frba.utn.edu.ar](https://frba.utn.edu.ar/)"
  },

  // ==========================================
  // CURSADA
  // ==========================================
  {
    keywords: ["regularidad", "ser regular", "condicion regular"],
    answer: "La **regularidad** significa que aprobaste la cursada de una materia y quedaste habilitado para rendir el examen final.\n\nGeneralmente para obtener regularidad debés:\n\n- Aprobar los parciales\n- Cumplir con asistencia mínima\n- Entregar trabajos prácticos\n\nLas condiciones exactas dependen de **cada cátedra**."
  },
  {
    keywords: ["recuperatorio", "recuperar parcial"],
    answer: "Muchas materias permiten rendir **recuperatorios** si desaprobás un parcial.\n\nDependiendo de la cátedra pueden existir:\n\n- Recuperatorios de parcial\n- Recuperatorio integrador\n\nLas condiciones específicas se informan al inicio de la cursada."
  },

  // ==========================================
  // MATERIAS DIFÍCILES
  // ==========================================
  {
    keywords: ["analisis matematico 1", "am1", "analisis 1"],
    answer: "**Análisis Matemático 1** es una de las materias fundamentales del primer año en ingeniería.\n\nTemas comunes:\n\n- Límites\n- Derivadas\n- Integrales\n- Funciones\n\nConsejos de estudio:\n\n- Practicar muchos ejercicios\n- Resolver parciales de años anteriores\n- Estudiar teoría y práctica en conjunto"
  },
  {
    keywords: ["algoritmos", "algoritmos y estructuras", "aed"],
    answer: "**Algoritmos y Estructuras de Datos** es una materia central en Ingeniería en Sistemas.\n\nSe estudian temas como:\n\n- Programación\n- Estructuras de datos\n- Algoritmos\n- Resolución de problemas\n\nConsejos:\n\n- Programar todos los días\n- Resolver muchos ejercicios\n- Entender bien estructuras básicas como listas, pilas y colas"
  },

  // ==========================================
  // VIDA UNIVERSITARIA
  // ==========================================
  {
    keywords: ["biblioteca", "libros", "donde estudiar"],
    answer: "La UTN FRBA tiene **bibliotecas en sus sedes**.\n\nEn ellas podés:\n\n- Consultar libros académicos\n- Estudiar en salas de lectura\n- Acceder a material técnico\n\nEs un buen lugar para estudiar si necesitás un ambiente tranquilo."
  },
  {
    keywords: ["wifi", "internet facultad"],
    answer: "Las sedes de UTN FRBA cuentan con **red WiFi institucional** para estudiantes.\n\nEn algunos casos puede requerir:\n\n- Usuario institucional\n- Registro previo del dispositivo"
  },
  {
    keywords: ["imprimir", "fotocopias", "apuntes impresos"],
    answer: "Dentro de las sedes suele haber **centros de copiado o fotocopiadoras** donde podés:\n\n- Imprimir apuntes\n- Sacar fotocopias\n- Encuadernar material\n\nMuchos estudiantes imprimen allí las **guías de ejercicios o parciales para estudiar**."
  },

  // ==========================================
  // CONSEJOS UTNIANOS
  // ==========================================
  {
    keywords: ["cuantas materias cursar", "materias recomendadas primer año"],
    answer: "Muchos estudiantes recomiendan cursar entre **3 y 5 materias por cuatrimestre**.\n\nEsto depende de:\n\n- Si trabajás\n- La dificultad de las materias\n- Tu experiencia previa\n\nLo importante es **no sobrecargarse el primer año**."
  },
  {
    keywords: ["trabajar y estudiar utn", "se puede trabajar utn"],
    answer: "Muchos estudiantes trabajan mientras estudian en la UTN.\n\nConsejos habituales:\n\n- Cursar menos materias\n- Organizar bien horarios\n- Priorizar materias difíciles\n\nLa facultad tiene **comisiones en distintos horarios** para facilitar esto."
  },
  {
    keywords: ["cuanto dura ingenieria", "duracion carrera utn"],
    answer: "Las carreras de ingeniería en UTN tienen una duración teórica de **5 años**.\n\nSin embargo, muchos estudiantes tardan más debido a:\n\n- Trabajo\n- Dificultad de materias\n- Recursadas\n\nEs normal que la carrera lleve **entre 6 y 7 años en promedio**."
  },

 // ==========================================
// CARRERAS
// ==========================================
{
  keywords: ["sistemas", "ingenieria en sistemas", "sistemas de informacion","ing. en sistemas"],
  answer: "**Ingeniería en Sistemas de Información** forma profesionales capaces de analizar, diseñar y gestionar sistemas informáticos en organizaciones.\n\nEn el **plan de estudios** se incluyen materias como:\n\n- Programación\n- Bases de Datos\n- Arquitectura de Software\n- Sistemas Operativos\n- Redes\n- Gestión de Proyectos\n\nTambién se estudia cómo aplicar la tecnología para resolver problemas en empresas y organizaciones."
},
{
  keywords: ["industrial", "ingenieria industrial"],
  answer: "**Ingeniería Industrial** combina ingeniería, gestión y economía para optimizar procesos productivos y organizacionales.\n\nEl **plan de estudios** incluye áreas como:\n\n- Investigación Operativa\n- Logística\n- Gestión de Calidad\n- Economía\n- Organización Industrial\n\nSu objetivo es mejorar la eficiencia de empresas, fábricas y sistemas productivos."
},
{
  keywords: ["civil", "ingenieria civil"],
  answer: "**Ingeniería Civil** se centra en el diseño, cálculo y construcción de infraestructura.\n\nEn el **plan de estudios** se estudian materias como:\n\n- Mecánica de Suelos\n- Estructuras\n- Hidráulica\n- Construcciones\n- Transporte\n\nLos ingenieros civiles participan en proyectos como edificios, puentes, rutas y obras hidráulicas."
},
{
  keywords: ["electronica", "ingenieria electronica"],
  answer: "**Ingeniería Electrónica** estudia el diseño y desarrollo de dispositivos y sistemas electrónicos.\n\nEl **plan de estudios** incluye temas como:\n\n- Circuitos electrónicos\n- Telecomunicaciones\n- Sistemas digitales\n- Control automático\n- Sistemas embebidos\n\nSe aplica en áreas como telecomunicaciones, automatización e industria tecnológica."
},
{
  keywords: ["mecanica", "ingenieria mecanica"],
  answer: "**Ingeniería Mecánica** se enfoca en el diseño, análisis y fabricación de máquinas y sistemas mecánicos.\n\nEn el **plan de estudios** se incluyen materias como:\n\n- Mecánica de materiales\n- Termodinámica\n- Dinámica\n- Diseño mecánico\n- Procesos de manufactura\n\nLos ingenieros mecánicos trabajan en industrias como automotriz, energética y manufactura."
},
{
  keywords: ["quimica", "ingenieria quimica"],
  answer: "**Ingeniería Química** aplica principios de química, física y matemática para transformar materias primas en productos útiles.\n\nEl **plan de estudios** incluye áreas como:\n\n- Operaciones unitarias\n- Termodinámica química\n- Procesos industriales\n- Ingeniería de reactores\n\nSe aplica en industrias como alimentos, petróleo, energía y materiales."
},
{
  keywords: ["electrica", "ingenieria electrica", "energia electrica"],
  answer: "**Ingeniería Eléctrica** estudia la generación, transporte y distribución de energía eléctrica.\n\nEl **plan de estudios** incluye materias como:\n\n- Máquinas eléctricas\n- Sistemas de potencia\n- Electrónica de potencia\n- Energías renovables\n\nLos profesionales trabajan en redes eléctricas, generación de energía e infraestructura energética."
},
{
  keywords: ["textil", "ingenieria textil"],
  answer: "**Ingeniería Textil** se centra en el diseño, producción y control de materiales textiles.\n\nEn el **plan de estudios** se estudian temas como:\n\n- Tecnología de fibras\n- Procesos textiles\n- Control de calidad\n- Diseño de materiales textiles\n\nTiene aplicaciones en la industria de indumentaria, materiales técnicos y producción industrial."
},
{
  keywords: ["naval", "ingenieria naval"],
  answer: "**Ingeniería Naval** se especializa en el diseño y construcción de embarcaciones y estructuras marítimas.\n\nEl **plan de estudios** incluye materias como:\n\n- Arquitectura naval\n- Hidrodinámica\n- Estructuras navales\n- Sistemas de propulsión\n\nLos ingenieros navales trabajan en astilleros, transporte marítimo y tecnología naval."
},

  // ==========================================
  // MÁS FAQ GENERALES
  // ==========================================
  {
    keywords: ["horarios cursada", "horarios materias"],
    answer: "Los **horarios de cursada** se pueden consultar en el sistema académico.\n\nLuego de inscribirte a materias, podés ver tu agenda semanal dentro del sistema académico del alumno."
  },
  {
    keywords: ["correlativas", "materias correlativas"],
    answer: "Las **materias correlativas** son asignaturas que debés aprobar antes de cursar o rendir otras.\n\nEsto garantiza que tengas los conocimientos necesarios para avanzar en la carrera."
  },
  {
    keywords: ["perdi regularidad", "regularidad vencida"],
    answer: "Si perdés la regularidad de una materia normalmente deberás **recursarla** para poder volver a rendir el final."
  },
  {
    keywords: ["final libre", "rendir libre"],
    answer: "Algunas materias permiten rendir **examen final libre**, es decir sin haber cursado.\n\nSin embargo:\n\n- No todas las materias lo permiten\n- Depende de cada cátedra"
  },
  {
    keywords: ["ver notas", "donde ver notas","notas"],
    answer: "Podés ver tus **notas, historial académico y estado de materias** desde el sistema SIGA.\n\nIngresá a:\n\n[https://siga.frba.utn.edu.ar](https://siga.frba.utn.edu.ar/)"
  },


  // ==========================================
  // INFORMACIÓN 2026 - TRÁMITES E INSCRIPCIONES (AGREGADA)
  // ==========================================
  {
    keywords: ["fechas importantes", "inscripciones especiales 2026", "19 de marzo", "20 de marzo", "inscripciones 2026"],
    answer: "Atención: hay **inscripciones por CASOS ESPECIALES para el 1er cuatrimestre 2026 los días 19 y 20 de marzo de 2026**. \n\n- **19 de marzo de 2026:** Cambio de Especialidad, Simultaneidad de Carreras y Pases de Regional. \n- **20 de marzo de 2026:** Ingresos, Equivalencias, Revisión y Agregado de Materias y Cursado sin Pase (ver requisitos). \n\nSi tenés trámites sin finalizar, debés completar los formularios indicados por la Dirección de Alumnos antes de esas fechas. Consultá los formularios oficiales y los cronogramas en la web de la facultad: [https://frba.utn.edu.ar](https://frba.utn.edu.ar/) y en el sistema SIGA: [https://siga.frba.utn.edu.ar](https://siga.frba.utn.edu.ar/)."
  },
  {
    keywords: ["inscripcion cuatrimestre", "¿cuándo me anoto?", "cuando me anoto a cursar", "fechas inscripcion"],
    answer: "La inscripción a cursadas se realiza desde **SIGA**: [https://siga.frba.utn.edu.ar](https://siga.frba.utn.edu.ar/). \n\n- En términos generales las inscripciones del **primer cuatrimestre** suelen abrir entre **febrero y marzo** y para el **segundo cuatrimestre** entre **julio y agosto**. \n- Para el **1er cuatrimestre 2026** hay un cronograma de inscripciones especiales: **19 y 20 de marzo de 2026** (ver detalle en la publicación de trámites). \n\nSi tenés trámites administrativos pendientes (pases, equivalencias, cambio de especialidad, etc.), muchas veces te piden completar antes un formulario o presentar documentación en Medrano 951 — Oficina 311. Recomendación práctica: 1) revisá el calendario en SIGA, 2) fijate las fechas publicadas en la web oficial de la FRBA y 3) completá los formularios indicados si corresponde."
  },
  {
    keywords: ["grupos whatsapp", "ver grupos whatsapp", "como veo los grupos de whatsapp", "whatsapp cátedra"],
    answer: "La facultad **no suele mantener una lista pública centralizada de grupos de WhatsApp**. Los grupos suelen organizarse por cada cátedra o comisión y los métodos habituales para obtener el enlace son:\n\n1. **Web de ITEC grupos estudiantiles**: muchos estudiantes comparten los grupos de comisiones en la web [Grupos de WA](/grupos).\n2. **Aula Virtual / Aula de la cátedra**: muchas cátedras publican el enlace o facilitan contacto al inicio de cursada. Revisá tu espacio en el Aula Virtual: [https://aulavirtual.frba.utn.edu.ar](https://aulavirtual.frba.utn.edu.ar/).\n3. **Preguntar al docente o ayudantes** durante la primer clase o por el canal de consultas de la materia.\n4. **Delegados y compañeros**: el representante de comisión o los estudiantes suelen crear y compartir los enlaces.\n5. **Foros y canales estudiantiles** (p. ej. la sección de comunidad o [Explorar Aportes](/recursos) en el sitio estudiantil) o redes de la comunidad (Instagram @itecba). \n\nSi no encontrás el grupo, podés escribir a **alumnos@frba.utn.edu.ar** para consultar canales oficiales o pedir orientación sobre dónde buscar los canales de comunicación de la cátedra. Consejo de seguridad: no compartas datos personales sensibles en grupos y verificá la fuente del enlace antes de unirte."
  },
  {
    keywords: ["formularios inscripcion", "formularios pases", "formulario cursado sin pase"],
    answer: "Algunos trámites requieren completar formularios online antes de inscribirte. Ejemplos (publicados por la Dirección de Alumnos FRBA):\n\n- **Formulario para pases provenientes de otras FR**: https://docs.google.com/forms/d/e/1FAIpQLSdDVKtn8zAR6QGu1zsqg9a1MxeEU7jihDrOvk02aW4zTf-J0A/viewform?pli=1\n- **Formulario para simultaneidad entre regionales**: https://forms.gle/AGMocwDzLcbMQPwv5\n- **Formulario de Cursado sin Pase (cuando aplica)**: https://docs.google.com/forms/d/e/1FAIpQLSff2Eunfd-e7PKfErqEWYg1BE_rxI0kyQwreX8gSete7RUrfg/viewform\n\nSiempre verificá en la publicación oficial de trámites o contactá a la Dirección de Alumnos antes de completar un formulario."
  },
  {
    keywords: ["contacto frba", "telefono alumnos", "direccion medrano", "mail alumnos"],
    answer: "Datos de contacto oficiales (según comunicación vigente):\n\n- **Mail Dirección de Alumnos:** alumnos@frba.utn.edu.ar\n- **Medrano 951 – Oficina 311 (Almagro, CABA)** — Tel: (54 11) 4867-7500 — Interno 7548/7733 — Atención: lunes a viernes de 10 a 13 y de 14 a 20\n- **Campus Mozart 2300 (Villa Lugano, CABA) – Oficina 11** — Tel: (54 11) 4638-8100/8838 — Interno 7148 — Atención: lunes a viernes de 14 a 20\n\nPara trámites presenciales y entrega de documentación física, consultá siempre horarios y requisitos antes de acercarte."
  }
]
export const FALLBACK_ANSWER = "Lo siento, no tengo una respuesta automática para esa consulta específica.\n\nTip: probá usar palabras clave como **siga**, **parciales**, **inscripción**, **campus** o el nombre de tu **materia**.";

export const ITEC_FOOTER = "\n\n---\nRecuerda que siempre puedes consultar en nuestros grupos o en nuestro [Instagram oficial @itecba](https://instagram.com/itecba).";