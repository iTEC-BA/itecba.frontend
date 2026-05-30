import { SectionData } from "../types";

// =============================================================================
// SECCIÓN 1 — Herramientas propias de iTEC BA
// =============================================================================
const seccionITEC: SectionData = {
  id: "itec",
  title: "Herramientas iTEC",
  iconName: "lightning",
  colorTheme: "orange",
  folders: [
    {
      id: "itec-academico",
      label: "Académico",
      iconName: "chart-line",
      iconColor: "bg-emerald-500/12 text-emerald-400",
      tag: "Propio",
      tagColor: "bg-emerald-500/12 text-emerald-400",
      description: "Seguí tu carrera y calculá tu promedio",
      links: [
        { id: "progreso", label: "Seguidor de carrera", url: "/progreso", description: "Visualizá tu progreso académico y correlatividades", iconName: "chart-line", isExternal: false, badge: "Privado", badgeColor: "bg-emerald-500/12 text-emerald-400" },
        { id: "grado", label: "Calculadora de promedio", url: "/grado", description: "Calculá tu promedio ponderado con las notas del SIU", iconName: "calculator", isExternal: false },
      ],
    },
    {
      id: "itec-campus",
      label: "Campus & Aulas",
      iconName: "map-pin",
      iconColor: "bg-itec-red/12 text-[#e01540]",
      tag: "Propio",
      tagColor: "bg-itec-red/12 text-[#e01540]",
      description: "Encontrá cualquier aula de Medrano o Campus",
      links: [
        { id: "aulas", label: "Buscar Aula", url: "/aulas", description: "Localizador de aulas con referencias para llegar", iconName: "map-pin", isExternal: false },
        { id: "calendario", label: "Calendario Académico", url: "/calendario", description: "Fechas de parciales, finales y feriados de la FRBA", iconName: "calendar", isExternal: false },
      ],
    },
    {
      id: "itec-contenido",
      label: "Contenido & Recursos",
      iconName: "video",
      iconColor: "bg-teal-500/12 text-teal-400",
      tag: "Propio",
      tagColor: "bg-teal-500/12 text-teal-400",
      description: "Videos y recursos para materias clave",
      links: [
        { id: "guiatec", label: "GuíaTEC", url: "/guiatec", description: "Videos explicativos gratuitos para materias e ingresantes", iconName: "video", isExternal: false },
        { id: "cursos", label: "Cursos", url: "/cursos", description: "Cursos estudiantiles de la comunidad iTEC", iconName: "book", isExternal: false },
        { id: "recursos", label: "Recursos", url: "/recursos", description: "Apuntes, resúmenes y material de estudio", iconName: "library", isExternal: false, badge: "Privado", badgeColor: "bg-blue-500/12 text-blue-400" },
      ],
    },
    {
      id: "itec-comunidad",
      label: "Comunidad",
      iconName: "users",
      iconColor: "bg-purple-500/12 text-purple-400",
      tag: "Propio",
      tagColor: "bg-purple-500/12 text-purple-400",
      description: "Conectate con otros estudiantes",
      links: [
        { id: "foro", label: "Foro estudiantil", url: "/foro", description: "Hacé preguntas y ayudá a otros estudiantes", iconName: "message", isExternal: false },
        { id: "grupos", label: "Grupos de WhatsApp", url: "/grupos", description: "Grupos organizados por materia y año", iconName: "whatsapp", isExternal: false },
        { id: "trueketec", label: "TruekeTEC", url: "/trueketec", description: "Comprá, vendé e intercambiá libros y materiales", iconName: "gift", isExternal: false, badge: "Privado", badgeColor: "bg-blue-500/12 text-blue-400" },
      ],
    },
  ],
};

// =============================================================================
// SECCIÓN 2 — Portales oficiales UTN FRBA
// =============================================================================
const seccionUTN: SectionData = {
  id: "utn",
  title: "Portales UTN FRBA",
  iconName: "siuGuarani",
  colorTheme: "blue",
  folders: [
    {
      id: "utn-sistemas",
      label: "Sistemas Académicos",
      iconName: "siuGuarani",
      iconColor: "bg-blue-500/12 text-blue-400",
      tag: "Externo",
      tagColor: "bg-white/8 text-[#9aa3b0]",
      description: "SIU Guaraní, Moodle y autogestión",
      links: [
        { id: "siu", label: "SIU Guaraní", url: "https://guarani.frba.utn.edu.ar", description: "Inscripciones, notas, regularidades y constancias", iconName: "siuGuarani", isExternal: true },
        { id: "moodle", label: "Aulas Virtuales (Moodle)", url: "https://aulasvirtuales.frba.utn.edu.ar", description: "Plataforma oficial de clases virtuales y materiales", iconName: "aulasVirtuales", isExternal: true },
        { id: "autogestion", label: "Autogestión Alumnos", url: "https://autogestion.frba.utn.edu.ar", description: "Trámites estudiantiles online", iconName: "settings", isExternal: true },
        { id: "correoutn", label: "Correo Institucional", url: "https://mail.google.com", description: "Gmail UTN: @frba.utn.edu.ar", iconName: "send", isExternal: true },
      ],
    },
    {
      id: "utn-institucional",
      label: "Información Institucional",
      iconName: "info",
      iconColor: "bg-cyan-500/12 text-cyan-400",
      tag: "Externo",
      tagColor: "bg-white/8 text-[#9aa3b0]",
      description: "Sitios oficiales, reglamentos y secretarías",
      links: [
        { id: "frba-web", label: "Sitio web FRBA", url: "https://www.frba.utn.edu.ar", description: "Portal oficial de la Facultad Regional Buenos Aires", iconName: "hologram", isExternal: true },
        { id: "utn-central", label: "UTN Central", url: "https://www.utn.edu.ar", description: "Portal principal de la UTN", iconName: "degree", isExternal: true },
        { id: "reglamento", label: "Reglamento de Estudios", url: "https://www.frba.utn.edu.ar/index.php/reglamento-de-estudios/", description: "Régimen de cursada, correlatividades y regularidad", iconName: "document", isExternal: true },
        { id: "biblioteca", label: "Biblioteca UTN", url: "https://www.frba.utn.edu.ar/index.php/biblioteca/", description: "Catálogo y recursos bibliográficos digitales", iconName: "book", isExternal: true },
        { id: "depto-alumnos", label: "Depto. de Alumnos", url: "https://www.frba.utn.edu.ar/index.php/departamento-alumnos/", description: "Trámites presenciales: equivalencias, certificados, pases", iconName: "users", isExternal: true },
      ],
    },
    {
      id: "utn-bienestar",
      label: "Bienestar & Servicios",
      iconName: "heart",
      iconColor: "bg-pink-500/12 text-pink-400",
      tag: "Externo",
      tagColor: "bg-white/8 text-[#9aa3b0]",
      description: "Becas, salud, comedor y deportes",
      links: [
        { id: "becas", label: "Becas y Beneficios", url: "https://www.frba.utn.edu.ar/index.php/bienestar-universitario/becas/", description: "Becas PNBU, UTN y municipales para estudiantes", iconName: "star", isExternal: true },
        { id: "salud", label: "Servicio de Salud", url: "https://www.frba.utn.edu.ar/index.php/bienestar-universitario/", description: "Atención médica y odontológica gratuita", iconName: "heart", isExternal: true },
        { id: "deportes", label: "Deportes UTN", url: "https://www.frba.utn.edu.ar/index.php/extension/deportes/", description: "Torneos, actividades físicas e interfacultades", iconName: "lightning", isExternal: true },
        { id: "comedor", label: "Comedor Universitario", url: "https://www.frba.utn.edu.ar/index.php/bienestar-universitario/comedor/", description: "Info del comedor, menú y horarios", iconName: "clock", isExternal: true },
      ],
    },
    {
      id: "utn-redes",
      label: "Redes Oficiales",
      iconName: "instagram",
      iconColor: "bg-orange-500/12 text-orange-400",
      tag: "Externo",
      tagColor: "bg-white/8 text-[#9aa3b0]",
      description: "Seguí a la facultad en sus redes",
      links: [
        { id: "ig-frba", label: "Instagram FRBA", url: "https://www.instagram.com/utnfrba", description: "@utnfrba — noticias, eventos y novedades", iconName: "instagram", isExternal: true },
        { id: "yt-frba", label: "YouTube FRBA", url: "https://www.youtube.com/@UTNFRBA", description: "Charlas, conferencias y graduaciones", iconName: "youtube", isExternal: true },
        { id: "contacto", label: "Mesa de Ayuda", url: "https://www.frba.utn.edu.ar/index.php/contacto/", description: "Contacto oficial con la facultad", iconName: "send", isExternal: true },
      ],
    },
  ],
};

// =============================================================================
// SECCIÓN 3 — Materias del Ciclo Básico (todas las carreras)
// =============================================================================
const seccionCicloBasico: SectionData = {
  id: "basico",
  title: "Ciclo Básico — Todas las Carreras",
  iconName: "book",
  colorTheme: "yellow",
  folders: [
    {
      id: "cb-analisis1",
      label: "Análisis Matemático I",
      iconName: "calculator",
      iconColor: "bg-yellow-500/12 text-yellow-400",
      description: "Límites, derivadas, integrales y series",
      links: [
        { id: "wolfram", label: "Wolfram Alpha", url: "https://www.wolframalpha.com", description: "Motor de cálculo simbólico y numérico", isExternal: true },
        { id: "desmos", label: "Desmos — Graficador", url: "https://www.desmos.com/calculator", description: "Graficador de funciones online en tiempo real", isExternal: true },
        { id: "geogebra", label: "GeoGebra", url: "https://www.geogebra.org/calculator", description: "Calculadora gráfica, CAS y 3D", isExternal: true },
        { id: "symbolab-am1", label: "Symbolab", url: "https://www.symbolab.com", description: "Soluciones paso a paso: límites, derivadas, integrales", isExternal: true },
        { id: "3b1b-calc", label: "3Blue1Brown — Esencia del Cálculo", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", description: "La mejor visualización de cálculo en YouTube", isExternal: true },
        { id: "paul-calc", label: "Paul's Online Math Notes", url: "https://tutorial.math.lamar.edu", description: "Apuntes completos de cálculo con ejercicios resueltos", isExternal: true },
      ],
    },
    {
      id: "cb-analisis2",
      label: "Análisis Matemático II",
      iconName: "calculator",
      iconColor: "bg-amber-500/12 text-amber-400",
      description: "Cálculo vectorial, EDOs e integrales múltiples",
      links: [
        { id: "wolfram-a2", label: "Wolfram Alpha", url: "https://www.wolframalpha.com", description: "EDOs, series de Taylor, integrales múltiples", isExternal: true },
        { id: "geogebra-3d", label: "GeoGebra 3D", url: "https://www.geogebra.org/3d", description: "Visualización de superficies y curvas en 3D", isExternal: true },
        { id: "desmos-a2", label: "Desmos", url: "https://www.desmos.com/calculator", description: "Graficador de funciones para verificar resultados", isExternal: true },
        { id: "ode-visualizer", label: "ODE Visualizer", url: "https://homepages.math.uic.edu/~jlind/odeproj/", description: "Visualizador de campos de pendiente y EDOs", isExternal: true },
        { id: "mit-1802", label: "MIT 18.02 Multivariable Calculus", url: "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/", description: "Curso completo de cálculo multivariable del MIT", isExternal: true },
      ],
    },
    {
      id: "cb-algebra",
      label: "Álgebra y Geometría Analítica",
      iconName: "chip",
      iconColor: "bg-indigo-500/12 text-indigo-400",
      description: "Matrices, vectores, transformaciones lineales",
      links: [
        { id: "matrix-calc", label: "Matrix Calculator", url: "https://matrix.reshish.com/es/", description: "Inversas, determinantes, sistemas de ecuaciones", isExternal: true },
        { id: "wolfram-alg", label: "Wolfram Alpha (Álgebra)", url: "https://www.wolframalpha.com/examples/mathematics/algebra", description: "Resolución de sistemas y operaciones matriciales", isExternal: true },
        { id: "3b1b-algebra", label: "3Blue1Brown — Esencia del Álgebra Lineal", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", description: "Visualización conceptual de álgebra lineal", isExternal: true },
        { id: "immersive-linear", label: "Immersive Math", url: "http://immersivemath.com/ila/index.html", description: "Libro interactivo de álgebra lineal con visualizaciones", isExternal: true },
        { id: "mit-1806", label: "MIT 18.06 Linear Algebra (Gilbert Strang)", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", description: "El curso de álgebra lineal más famoso del mundo", isExternal: true },
      ],
    },
    {
      id: "cb-fisica1",
      label: "Física I (Mecánica)",
      iconName: "lightning",
      iconColor: "bg-sky-500/12 text-sky-400",
      description: "Cinemática, dinámica, energía y oscilaciones",
      links: [
        { id: "phet-mec", label: "PhET — Mecánica", url: "https://phet.colorado.edu/es/simulations/filter?subjects=motion", description: "Simuladores de movimiento, fuerzas y energía", isExternal: true },
        { id: "hyperphysics", label: "HyperPhysics", url: "http://hyperphysics.phy-astr.gsu.edu/hbasees/hframees.html", description: "Enciclopedia interactiva de física con mapas conceptuales", isExternal: true },
        { id: "wolframalpha-fis", label: "Wolfram Alpha (Física)", url: "https://www.wolframalpha.com/examples/science-and-technology/physics", description: "Resolución de problemas de mecánica", isExternal: true },
        { id: "walter-lewin", label: "Física con Walter Lewin (MIT)", url: "https://www.youtube.com/playlist?list=PLyQSN7X0ro203puVhQsmCj9qhlFQ-As8e", description: "Las clases de física más famosas de internet", isExternal: true },
        { id: "formulasheet-fis", label: "The Physics Hypertextbook", url: "https://physics.info", description: "Formulario y teoría de física universitaria", isExternal: true },
      ],
    },
    {
      id: "cb-fisica2",
      label: "Física II (Electromagnetismo)",
      iconName: "lightning",
      iconColor: "bg-violet-500/12 text-violet-400",
      description: "Electrostática, magnetismo, ondas y óptica",
      links: [
        { id: "phet-em", label: "PhET — Electricidad y Magnetismo", url: "https://phet.colorado.edu/es/simulations/filter?subjects=electricity-magnets-and-circuits", description: "Simuladores de campos eléctricos y magnéticos", isExternal: true },
        { id: "falstad-em", label: "Falstad — Campos EM", url: "https://www.falstad.com/emstatic/", description: "Visualizador de campos eléctricos y magnéticos 2D", isExternal: true },
        { id: "hyperphysics-em", label: "HyperPhysics — EM", url: "http://hyperphysics.phy-astr.gsu.edu/hbasees/emcon.html", description: "Teoría de electromagnetismo con diagramas interactivos", isExternal: true },
        { id: "mit-802", label: "MIT 8.02 Electricity & Magnetism", url: "https://ocw.mit.edu/courses/8-02-electricity-and-magnetism-spring-2002/", description: "Curso completo de electromagnetismo del MIT", isExternal: true },
      ],
    },
    {
      id: "cb-quimica",
      label: "Química",
      iconName: "hologram",
      iconColor: "bg-rose-500/12 text-rose-400",
      description: "Tabla periódica, estequiometría y reacciones",
      links: [
        { id: "ptable", label: "Tabla Periódica Interactiva", url: "https://ptable.com/?lang=es", description: "Propiedades completas de cada elemento", isExternal: true },
        { id: "chembalancer", label: "Balanceador de Ecuaciones", url: "https://www.chemicalaid.com/tools/equationbalancer.php", description: "Balanceo automático de ecuaciones químicas", isExternal: true },
        { id: "molview", label: "MolView — Visualizador 3D", url: "https://molview.org", description: "Estructuras moleculares en 3D desde el navegador", isExternal: true },
        { id: "chemspider", label: "ChemSpider", url: "https://www.chemspider.com", description: "Base de datos de estructuras y propiedades químicas", isExternal: true },
        { id: "khan-quimica", label: "Khan Academy — Química", url: "https://es.khanacademy.org/science/chemistry", description: "Videos y ejercicios de química en español", isExternal: true },
      ],
    },
  ],
};

// =============================================================================
// SECCIÓN 4 — Ingeniería en Sistemas de Información (ISI)
// =============================================================================
const seccionSistemas: SectionData = {
  id: "sistemas",
  title: "Ingeniería en Sistemas",
  iconName: "chip",
  colorTheme: "green",
  folders: [
    {
      id: "isi-prog",
      label: "Programación I y II",
      iconName: "chip",
      iconColor: "bg-green-500/12 text-green-400",
      description: "Fundamentos de programación, POO y estructuras",
      links: [
        { id: "replit", label: "Replit", url: "https://replit.com", description: "IDE online — corré código sin instalar nada", isExternal: true },
        { id: "pythontutor", label: "Python Tutor", url: "https://pythontutor.com", description: "Visualizá la ejecución de código paso a paso", isExternal: true },
        { id: "cs50", label: "CS50 Harvard (gratis)", url: "https://cs50.harvard.edu/x/", description: "El mejor curso introductorio de ciencias de la computación", isExternal: true },
        { id: "exercism", label: "Exercism", url: "https://exercism.org", description: "Práctica de lenguajes con ejercicios y mentores", isExternal: true },
        { id: "hackerrank", label: "HackerRank", url: "https://www.hackerrank.com", description: "Desafíos de programación por nivel y lenguaje", isExternal: true },
        { id: "refactoring-guru", label: "Refactoring.Guru", url: "https://refactoring.guru/es", description: "Patrones de diseño y principios SOLID explicados", isExternal: true },
      ],
    },
    {
      id: "isi-algoritmos",
      label: "Algoritmos y Estructuras",
      iconName: "chip",
      iconColor: "bg-emerald-500/12 text-emerald-400",
      description: "AyED, complejidad y estructuras de datos",
      links: [
        { id: "visualgo", label: "VisuAlgo", url: "https://visualgo.net/es", description: "Visualización animada de algoritmos y estructuras de datos", isExternal: true },
        { id: "leetcode", label: "LeetCode", url: "https://leetcode.com", description: "Problemas de AyED clasificados por dificultad", isExternal: true },
        { id: "neetcode", label: "NeetCode.io", url: "https://neetcode.io", description: "Guía curada de problemas con soluciones en video", isExternal: true },
        { id: "cs-animated", label: "CS Academy — Graph Editor", url: "https://csacademy.com/app/graph_editor/", description: "Editor visual de grafos para modelar problemas", isExternal: true },
        { id: "big-o", label: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com", description: "Referencia rápida de complejidad algorítmica", isExternal: true },
      ],
    },
    {
      id: "isi-bd",
      label: "Bases de Datos",
      iconName: "spreadsheet",
      iconColor: "bg-cyan-500/12 text-cyan-400",
      description: "SQL, diseño relacional y motores de BD",
      links: [
        { id: "sqlfiddle", label: "SQL Fiddle", url: "http://sqlfiddle.com", description: "Editor SQL online con múltiples motores (MySQL, Postgres, SQLite)", isExternal: true },
        { id: "dbdiagram", label: "dbdiagram.io", url: "https://dbdiagram.io", description: "Diseño de diagramas ER/DER online y colaborativo", isExternal: true },
        { id: "drawsql", label: "DrawSQL", url: "https://drawsql.app", description: "Diagramador de bases de datos visualmente cuidado", isExternal: true },
        { id: "pgexercises", label: "PostgreSQL Exercises", url: "https://pgexercises.com", description: "Ejercicios interactivos de SQL con Postgres", isExternal: true },
        { id: "sqlzoo", label: "SQLZoo", url: "https://sqlzoo.net/wiki/SQL_Tutorial", description: "Tutorial interactivo de SQL con ejercicios", isExternal: true },
        { id: "mongodb-university", label: "MongoDB University (gratis)", url: "https://learn.mongodb.com", description: "Cursos oficiales de MongoDB para principiantes y avanzados", isExternal: true },
      ],
    },
    {
      id: "isi-redes",
      label: "Redes y Comunicaciones",
      iconName: "nfc",
      iconColor: "bg-blue-500/12 text-blue-400",
      description: "Protocolos, TCP/IP, routing y seguridad",
      links: [
        { id: "cisco-packet", label: "Cisco Packet Tracer", url: "https://www.netacad.com/resources/lab-downloads", description: "Simulador oficial de redes Cisco (gratuito con cuenta)", isExternal: true },
        { id: "cloudflare-learn", label: "Cloudflare Learning Center", url: "https://www.cloudflare.com/learning/", description: "Guías claras sobre DNS, HTTP, TLS, CDN y más", isExternal: true },
        { id: "wireshark", label: "Wireshark", url: "https://www.wireshark.org", description: "Analizador de tráfico de red — herramienta estándar", isExternal: true },
        { id: "subnet-calc", label: "Subnet Calculator", url: "https://www.subnet-calculator.com", description: "Calculadora de subredes IPv4 online", isExternal: true },
        { id: "ccna-study", label: "Jeremy's IT Lab (CCNA)", url: "https://www.youtube.com/@JeremysITLab", description: "Curso CCNA completo y gratuito en YouTube", isExternal: true },
      ],
    },
    {
      id: "isi-so",
      label: "Sistemas Operativos",
      iconName: "settings",
      iconColor: "bg-slate-500/12 text-slate-400",
      description: "Procesos, memoria, filesystem y concurrencia",
      links: [
        { id: "os-three-easy", label: "Operating Systems: Three Easy Pieces", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", description: "El mejor libro de SO — gratuito y online", isExternal: true },
        { id: "linux-journey", label: "Linux Journey", url: "https://linuxjourney.com", description: "Aprendé Linux desde cero, paso a paso", isExternal: true },
        { id: "explainshell", label: "ExplainShell", url: "https://explainshell.com", description: "Pegá un comando de bash y te explica cada parte", isExternal: true },
        { id: "ubuntu-tutor", label: "Ubuntu Tutorials", url: "https://ubuntu.com/tutorials", description: "Tutoriales oficiales de Ubuntu para todos los niveles", isExternal: true },
      ],
    },
    {
      id: "isi-ingsoft",
      label: "Ingeniería de Software",
      iconName: "document",
      iconColor: "bg-orange-500/12 text-orange-400",
      description: "Metodologías, UML, testing y gestión de proyectos",
      links: [
        { id: "draw-io", label: "draw.io / diagrams.net", url: "https://www.drawio.com", description: "Diagramas UML, flujos y arquitecturas — gratuito", isExternal: true },
        { id: "lucidchart", label: "Lucidchart", url: "https://www.lucidchart.com", description: "Diagramas colaborativos en la nube", isExternal: true },
        { id: "mermaid-live", label: "Mermaid Live Editor", url: "https://mermaid.live", description: "Diagramas UML desde código — ideal para documentación", isExternal: true },
        { id: "agile-manifesto", label: "Manifiesto Ágil", url: "https://agilemanifesto.org/iso/es/manifesto.html", description: "El documento fundacional de las metodologías ágiles", isExternal: true },
        { id: "jira-free", label: "Jira (plan gratuito)", url: "https://www.atlassian.com/software/jira", description: "Gestión de proyectos ágiles — gratis hasta 10 usuarios", isExternal: true },
        { id: "github-learn", label: "GitHub Skills", url: "https://skills.github.com", description: "Aprende Git y GitHub con proyectos interactivos", isExternal: true },
      ],
    },
    {
      id: "isi-web",
      label: "Diseño Web / Laboratorio",
      iconName: "hologram",
      iconColor: "bg-pink-500/12 text-pink-400",
      description: "HTML, CSS, JavaScript y frameworks frontend",
      links: [
        { id: "mdn-web", label: "MDN Web Docs", url: "https://developer.mozilla.org/es/", description: "La referencia definitiva de HTML, CSS y JS", isExternal: true },
        { id: "codepen", label: "CodePen", url: "https://codepen.io", description: "Editor online de HTML/CSS/JS con preview en tiempo real", isExternal: true },
        { id: "css-tricks", label: "CSS-Tricks", url: "https://css-tricks.com", description: "Guías y trucos de CSS con ejemplos interactivos", isExternal: true },
        { id: "flexbox-froggy", label: "Flexbox Froggy", url: "https://flexboxfroggy.com/#es", description: "Aprendé Flexbox jugando — juego interactivo", isExternal: true },
        { id: "grid-garden", label: "Grid Garden", url: "https://cssgridgarden.com/#es", description: "Aprendé CSS Grid jugando — juego interactivo", isExternal: true },
        { id: "roadmap-frontend", label: "Roadmap.sh — Frontend", url: "https://roadmap.sh/frontend", description: "Hoja de ruta para convertirte en desarrollador frontend", isExternal: true },
      ],
    },
  ],
};

// =============================================================================
// SECCIÓN 5 — Ingeniería Electrónica (IEC)
// =============================================================================
const seccionElectronica: SectionData = {
  id: "electronica",
  title: "Ingeniería Electrónica",
  iconName: "chip",
  colorTheme: "cyan",
  folders: [
    {
      id: "iec-circuitos",
      label: "Circuitos Eléctricos",
      iconName: "chip",
      iconColor: "bg-yellow-500/12 text-yellow-400",
      description: "Análisis de circuitos DC/AC, Thevenin, Norton",
      links: [
        { id: "falstad", label: "Falstad Circuit Simulator", url: "https://www.falstad.com/circuit/", description: "Simulador de circuitos en tiempo real — sin instalar", isExternal: true },
        { id: "circuitlab", label: "CircuitLab", url: "https://www.circuitlab.com", description: "Diseño y simulación de circuitos online", isExternal: true },
        { id: "everycircuit", label: "EveryCircuit", url: "https://everycircuit.com", description: "Simulador interactivo con animaciones de corriente", isExternal: true },
        { id: "allaboutcircuits", label: "All About Circuits", url: "https://www.allaboutcircuits.com", description: "Textbooks gratuitos y referencia de circuitos", isExternal: true },
        { id: "dcaclab", label: "DC/AC Virtual Lab", url: "https://dcaclab.com", description: "Laboratorio virtual con osciloscopio y multímetro", isExternal: true },
      ],
    },
    {
      id: "iec-electronica-analogica",
      label: "Electrónica Analógica",
      iconName: "chip",
      iconColor: "bg-amber-500/12 text-amber-400",
      description: "Diodos, transistores, amplificadores y op-amps",
      links: [
        { id: "tinkercad", label: "Tinkercad Circuits", url: "https://www.tinkercad.com/circuits", description: "Simulá circuitos con componentes electrónicos y Arduino", isExternal: true },
        { id: "falstad-analog", label: "Falstad — Analógico", url: "https://www.falstad.com/circuit/", description: "Simulación de BJT, FET, op-amps y más", isExternal: true },
        { id: "analog-devices", label: "Analog Devices Learning", url: "https://www.analog.com/en/resources/technical-articles.html", description: "Artículos técnicos de diseño analógico", isExternal: true },
        { id: "horowitz-hill", label: "The Art of Electronics (extractos)", url: "https://artofelectronics.net", description: "El libro de referencia más famoso de electrónica", isExternal: true },
      ],
    },
    {
      id: "iec-digital",
      label: "Sistemas Digitales",
      iconName: "chip",
      iconColor: "bg-green-500/12 text-green-400",
      description: "Lógica combinacional, secuencial, VHDL y FPGAs",
      links: [
        { id: "logisim", label: "Logisim Evolution", url: "https://github.com/logisim-evolution/logisim-evolution", description: "Simulador de circuitos digitales — open source", isExternal: true },
        { id: "logic-ly", label: "Logic.ly", url: "https://logic.ly/demo/", description: "Simulador de puertas lógicas online sin instalación", isExternal: true },
        { id: "boolean-algebra", label: "Boolean Algebra Simplifier", url: "https://www.boolean-algebra.com", description: "Simplificador de expresiones booleanas con Karnaugh", isExternal: true },
        { id: "nandgame", label: "Nand Game", url: "https://nandgame.com", description: "Construí una computadora desde la compuerta NAND", isExternal: true },
        { id: "hdl-bits", label: "HDLBits — Verilog Practice", url: "https://hdlbits.01xz.net/wiki/Main_Page", description: "Ejercicios de Verilog con verificación automática", isExternal: true },
      ],
    },
    {
      id: "iec-micro",
      label: "Microcontroladores / Embebidos",
      iconName: "chip",
      iconColor: "bg-blue-500/12 text-blue-400",
      description: "Arduino, ESP32, STM32 y sistemas embebidos",
      links: [
        { id: "wokwi", label: "Wokwi Simulator", url: "https://wokwi.com", description: "Simulador online de Arduino, ESP32 y Raspberry Pi", isExternal: true },
        { id: "tinkercad-arduino", label: "Tinkercad — Arduino", url: "https://www.tinkercad.com/circuits", description: "Simulá proyectos Arduino con componentes reales", isExternal: true },
        { id: "arduino-ref", label: "Referencia Arduino", url: "https://www.arduino.cc/reference/es/", description: "Referencia oficial del lenguaje Arduino en español", isExternal: true },
        { id: "esp-idf", label: "ESP-IDF Docs", url: "https://docs.espressif.com/projects/esp-idf/en/latest/", description: "Documentación oficial del SDK de ESP32", isExternal: true },
      ],
    },
    {
      id: "iec-control",
      label: "Control Automático",
      iconName: "settings",
      iconColor: "bg-purple-500/12 text-purple-400",
      description: "Sistemas de control, Laplace y MATLAB",
      links: [
        { id: "octave", label: "GNU Octave Online", url: "https://octave-online.net", description: "Alternativa gratuita a MATLAB en el navegador", isExternal: true },
        { id: "matlab-learn", label: "MATLAB Onramp (gratuito)", url: "https://matlabacademy.mathworks.com", description: "Curso oficial de MATLAB gratuito con certificado", isExternal: true },
        { id: "control-tutor", label: "Control Tutor", url: "http://www.cds.caltech.edu/~murray/amwiki/", description: "Textbook online de teoría de control de Caltech", isExternal: true },
        { id: "wolfram-ode", label: "Wolfram — Transformada de Laplace", url: "https://www.wolframalpha.com/calculators/laplace-transform-calculator", description: "Calculadora de transformadas de Laplace", isExternal: true },
      ],
    },
  ],
};

// =============================================================================
// SECCIÓN 6 — Ingeniería Civil (IC)
// =============================================================================
const seccionCivil: SectionData = {
  id: "civil",
  title: "Ingeniería Civil",
  iconName: "degree",
  colorTheme: "slate",
  folders: [
    {
      id: "ic-estruct",
      label: "Estructuras y Resistencia",
      iconName: "degree",
      iconColor: "bg-slate-500/12 text-slate-400",
      description: "Vigas, columnas, tensiones y deformaciones",
      links: [
        { id: "skyciv", label: "SkyCiv — Análisis Estructural", url: "https://skyciv.com/free-structural-design-software/", description: "Software de estructuras online con versión gratuita", isExternal: true },
        { id: "beamng-calc", label: "ClearCalcs — Beam Calculator", url: "https://clearcalcs.com/freetools/free-beam-calculator/us", description: "Calculadora gratuita de vigas con diagramas de esfuerzo", isExternal: true },
        { id: "mechanicalc", label: "MechaniCalc", url: "https://mechanicalc.com", description: "Calculadoras de resistencia, columnas y juntas", isExternal: true },
        { id: "efunda", label: "eFunda — Engineering Fundamentals", url: "https://www.efunda.com", description: "Referencia de ingeniería: materiales, fórmulas y tablas", isExternal: true },
      ],
    },
    {
      id: "ic-hormigon",
      label: "Hormigón Armado",
      iconName: "degree",
      iconColor: "bg-orange-500/12 text-orange-400",
      description: "Diseño de losas, vigas y columnas de HA",
      links: [
        { id: "cirsoc", label: "CIRSOC 201 (AIS)", url: "https://www.inti.gob.ar/cirsoc", description: "Reglamento Argentino de Estructuras de Hormigón", isExternal: true },
        { id: "aci-learn", label: "ACI — Recursos Educativos", url: "https://www.concrete.org/education/learnaboutconcrete.aspx", description: "Instituto Americano del Concreto — guías y normas", isExternal: true },
        { id: "engmorph", label: "Structural Engineering Toolbox", url: "https://www.engmorph.com/structural-calcs", description: "Calculadoras de diseño en hormigón y acero", isExternal: true },
      ],
    },
    {
      id: "ic-hidro",
      label: "Hidráulica e Hidrología",
      iconName: "hologram",
      iconColor: "bg-blue-500/12 text-blue-400",
      description: "Flujo en tuberías, canales y cuencas hidrológicas",
      links: [
        { id: "epanet", label: "EPANET (EPA)", url: "https://www.epa.gov/water-research/epanet", description: "Software de simulación de redes de agua potable (gratuito)", isExternal: true },
        { id: "hec-hms", label: "HEC-HMS (US Army Corps)", url: "https://www.hec.usace.army.mil/software/hec-hms/", description: "Simulación hidrológica de cuencas — gratuito", isExternal: true },
        { id: "hydraulic-calc", label: "Hydraulic Calc Tools", url: "https://www.engineeringtoolbox.com/hydraulics-t_19.html", description: "Calculadoras de hidráulica: Manning, Darcy-Weisbach", isExternal: true },
      ],
    },
    {
      id: "ic-topografia",
      label: "Topografía y SIG",
      iconName: "map-pin",
      iconColor: "bg-green-500/12 text-green-400",
      description: "Levantamientos, coordenadas y sistemas de información geográfica",
      links: [
        { id: "qgis", label: "QGIS (Software Libre)", url: "https://qgis.org", description: "El SIG open source más potente del mercado", isExternal: true },
        { id: "google-earth", label: "Google Earth Pro", url: "https://www.google.com/earth/about/versions/", description: "Visualización geoespacial — gratuito para uso personal", isExternal: true },
        { id: "ign-argentina", label: "IGN Argentina", url: "https://www.ign.gob.ar", description: "Instituto Geográfico Nacional — mapas y geodesia de Argentina", isExternal: true },
        { id: "utm-converter", label: "Convertidor UTM/GPS", url: "https://www.latlong.net/lat-long-utm.html", description: "Conversión entre coordenadas geográficas y UTM", isExternal: true },
      ],
    },
  ],
};

// =============================================================================
// SECCIÓN 7 — Ingeniería Mecánica (IM)
// =============================================================================
const seccionMecanica: SectionData = {
  id: "mecanica",
  title: "Ingeniería Mecánica",
  iconName: "tool",
  colorTheme: "red",
  folders: [
    {
      id: "im-resist",
      label: "Resistencia de Materiales",
      iconName: "tool",
      iconColor: "bg-red-500/12 text-red-400",
      description: "Tensión, deformación, flexión y torsión",
      links: [
        { id: "skyciv-mec", label: "SkyCiv — Beam Calculator", url: "https://skyciv.com/free-beam-calculator/", description: "Cálculo de reacciones, momentos y deflexiones en vigas", isExternal: true },
        { id: "mechanicalc-mec", label: "MechaniCalc", url: "https://mechanicalc.com", description: "Calculadoras de resistencia, fatiga y columnas", isExternal: true },
        { id: "efunda-mec", label: "eFunda — Mechanics", url: "https://www.efunda.com/formulae/solid_mechanics/intro.cfm", description: "Fórmulas de mecánica sólida y resistencia de materiales", isExternal: true },
        { id: "simscale", label: "SimScale FEA (plan gratuito)", url: "https://www.simscale.com", description: "Simulación por elementos finitos en la nube", isExternal: true },
      ],
    },
    {
      id: "im-termo",
      label: "Termodinámica",
      iconName: "lightning",
      iconColor: "bg-orange-500/12 text-orange-400",
      description: "Leyes de la termodinámica, ciclos y transferencia de calor",
      links: [
        { id: "engineeringtoolbox-thermo", label: "Engineering ToolBox", url: "https://www.engineeringtoolbox.com/thermodynamics-t_23.html", description: "Tablas de propiedades termodinámicas y calculadoras", isExternal: true },
        { id: "nist-webbook", label: "NIST WebBook", url: "https://webbook.nist.gov/chemistry/fluid/", description: "Propiedades termodinámicas de fluidos del Instituto NIST", isExternal: true },
        { id: "coolprop", label: "CoolProp Web", url: "http://www.coolprop.org/coolprop/wrappers/Web/index.html", description: "Propiedades de fluidos termodinámicos online", isExternal: true },
        { id: "khan-thermo", label: "Khan Academy — Termodinámica", url: "https://es.khanacademy.org/science/physics/thermodynamics", description: "Videos y ejercicios de termodinámica en español", isExternal: true },
      ],
    },
    {
      id: "im-fluidos",
      label: "Mecánica de Fluidos",
      iconName: "hologram",
      iconColor: "bg-blue-500/12 text-blue-400",
      description: "Hidrostática, flujo laminar/turbulento, Bernoulli",
      links: [
        { id: "phet-fluidos", label: "PhET — Fluidos", url: "https://phet.colorado.edu/es/simulations/fluid-pressure-and-flow", description: "Simulador de presión y flujo de fluidos", isExternal: true },
        { id: "engineering-toolbox-fluids", label: "Engineering ToolBox — Fluidos", url: "https://www.engineeringtoolbox.com/fluid-mechanics-t_21.html", description: "Calculadoras de Darcy-Weisbach, Manning y Reynolds", isExternal: true },
        { id: "fluidsim", label: "SimFlow (plan gratuito)", url: "https://sim-flow.com", description: "Simulación CFD accesible para estudiantes", isExternal: true },
      ],
    },
    {
      id: "im-cad",
      label: "Diseño Asistido (CAD/CAM)",
      iconName: "settings",
      iconColor: "bg-purple-500/12 text-purple-400",
      description: "Software de modelado 3D y diseño mecánico",
      links: [
        { id: "onshape", label: "Onshape (gratuito para estudiantes)", url: "https://www.onshape.com/en/education/", description: "CAD 3D profesional en el navegador — 100% gratuito para alumnos", isExternal: true },
        { id: "fusion360", label: "Fusion 360 (gratuito para estudiantes)", url: "https://www.autodesk.com/education/edu-software/overview", description: "CAD/CAM/CAE de Autodesk — licencia educativa gratuita", isExternal: true },
        { id: "freecad", label: "FreeCAD", url: "https://www.freecad.org", description: "CAD 3D paramétrico de código abierto", isExternal: true },
        { id: "grabcad", label: "GrabCAD Library", url: "https://grabcad.com/library", description: "Repositorio de modelos CAD gratuitos de la comunidad", isExternal: true },
      ],
    },
  ],
};

// =============================================================================
// SECCIÓN 8 — Ingeniería Química (IQ) e Industrial (IInd)
// =============================================================================
const seccionQuimicaIndustrial: SectionData = {
  id: "quimica-industrial",
  title: "Ing. Química e Industrial",
  iconName: "hologram",
  colorTheme: "pink",
  folders: [
    {
      id: "iq-procesos",
      label: "Procesos Químicos",
      iconName: "hologram",
      iconColor: "bg-pink-500/12 text-pink-400",
      description: "Operaciones unitarias y simulación de procesos",
      links: [
        { id: "dwsim", label: "DWSIM (simulador de procesos)", url: "https://dwsim.org", description: "Simulador de procesos químicos open source — alternativa a Aspen", isExternal: true },
        { id: "aspen-learn", label: "AspenTech Learning", url: "https://www.aspentech.com/en/aspen-plus-resources", description: "Recursos de aprendizaje de Aspen Plus", isExternal: true },
        { id: "nist-chem", label: "NIST Chemistry WebBook", url: "https://webbook.nist.gov/chemistry/", description: "Propiedades termodinámicas y cinéticas de compuestos", isExternal: true },
        { id: "chemspider-iq", label: "ChemSpider", url: "https://www.chemspider.com", description: "Base de datos de estructuras y propiedades químicas", isExternal: true },
      ],
    },
    {
      id: "iq-estadistica",
      label: "Estadística e Investigación Operativa",
      iconName: "chart-line",
      iconColor: "bg-violet-500/12 text-violet-400",
      description: "Probabilidad, estadística y optimización",
      links: [
        { id: "statcrunch", label: "StatCrunch", url: "https://www.statcrunch.com", description: "Calculadoras estadísticas online: distribuciones, regresión, ANOVA", isExternal: true },
        { id: "wolfram-stats", label: "Wolfram Alpha — Estadística", url: "https://www.wolframalpha.com/examples/mathematics/statistics", description: "Cálculos estadísticos: media, varianza, distribuciones", isExternal: true },
        { id: "geogebra-prob", label: "GeoGebra — Probabilidad", url: "https://www.geogebra.org/probability", description: "Calculadora de distribuciones de probabilidad interactiva", isExternal: true },
        { id: "linear-prog", label: "Linear Programming Solver", url: "https://www.zweigmedia.com/RealWorld/simplex.html", description: "Resolvedor online de programación lineal con método símplex", isExternal: true },
        { id: "r-studio-cloud", label: "Posit Cloud (R Studio gratuito)", url: "https://posit.cloud", description: "R Studio en el navegador — estadística y visualización de datos", isExternal: true },
      ],
    },
    {
      id: "iind-gestion",
      label: "Gestión Industrial",
      iconName: "users",
      iconColor: "bg-teal-500/12 text-teal-400",
      description: "Manufactura, calidad, logística y costos",
      links: [
        { id: "lean-simulator", label: "Lean Simulator", url: "https://www.lean.org/lexicon-terms/", description: "Léxico y recursos de Lean Manufacturing (Lean Enterprise Institute)", isExternal: true },
        { id: "iso-online", label: "ISO Online Browsing Platform", url: "https://www.iso.org/obp/ui/", description: "Acceso gratuito al índice de normas ISO internacionales", isExternal: true },
        { id: "iram", label: "IRAM (normas argentinas)", url: "https://www.iram.org.ar", description: "Instituto Argentino de Normalización y Certificación", isExternal: true },
        { id: "visual-paradigm", label: "Visual Paradigm Online", url: "https://online.visual-paradigm.com", description: "Diagramas BPMN, VSM y mapas de procesos industriales", isExternal: true },
      ],
    },
  ],
};

// =============================================================================
// SECCIÓN 9 — Recursos Generales para Estudiantes
// =============================================================================
const seccionEstudiantes: SectionData = {
  id: "estudiantes",
  title: "Recursos para Estudiantes",
  iconName: "users",
  colorTheme: "teal",
  folders: [
    {
      id: "est-productividad",
      label: "Productividad & Estudio",
      iconName: "clock",
      iconColor: "bg-teal-500/12 text-teal-400",
      description: "Organizate y estudiá más eficientemente",
      links: [
        { id: "notion", label: "Notion", url: "https://www.notion.so", description: "Notas, bases de datos y planificación todo en uno", isExternal: true },
        { id: "anki", label: "Anki (Flashcards)", url: "https://apps.ankiweb.net", description: "Memorización con repetición espaciada — ideal para parciales", isExternal: true },
        { id: "pomodoro", label: "Pomofocus", url: "https://pomofocus.io", description: "Técnica Pomodoro para estudiar con descansos programados", isExternal: true },
        { id: "excalidraw", label: "Excalidraw", url: "https://excalidraw.com", description: "Pizarrón colaborativo para diagramas y apuntes visuales", isExternal: true },
        { id: "obsidian", label: "Obsidian", url: "https://obsidian.md", description: "Notas enlazadas con Markdown — ideal para apuntes de ingeniería", isExternal: true },
      ],
    },
    {
      id: "est-ia",
      label: "Inteligencia Artificial",
      iconName: "chip",
      iconColor: "bg-violet-500/12 text-violet-400",
      description: "IAs para aprender, explicar y resolver dudas",
      links: [
        { id: "chatgpt", label: "ChatGPT", url: "https://chat.openai.com", description: "Asistente de IA para explicar conceptos y resolver dudas", isExternal: true },
        { id: "claude", label: "Claude (Anthropic)", url: "https://claude.ai", description: "IA excelente para análisis, código y explicaciones largas", isExternal: true },
        { id: "perplexity", label: "Perplexity AI", url: "https://www.perplexity.ai", description: "Buscador con IA que cita sus fuentes", isExternal: true },
        { id: "phind", label: "Phind", url: "https://www.phind.com", description: "Buscador de IA especializado en programación", isExternal: true },
        { id: "wolfram-ai", label: "Wolfram Alpha", url: "https://www.wolframalpha.com", description: "Motor de conocimiento computacional — matemáticas y ciencias", isExternal: true },
      ],
    },
    {
      id: "est-documentos",
      label: "Documentos & Informes",
      iconName: "document",
      iconColor: "bg-blue-500/12 text-blue-400",
      description: "LaTeX, Google Docs y herramientas de escritura",
      links: [
        { id: "overleaf", label: "Overleaf (LaTeX)", url: "https://www.overleaf.com", description: "Editor LaTeX online colaborativo — estándar en ingeniería", isExternal: true },
        { id: "gdocs", label: "Google Docs", url: "https://docs.google.com", description: "Documentos colaborativos online gratuitos", isExternal: true },
        { id: "canva", label: "Canva", url: "https://www.canva.com", description: "Presentaciones, infografías y afiches con diseño profesional", isExternal: true },
        { id: "ilovepdf", label: "iLovePDF", url: "https://www.ilovepdf.com/es", description: "Comprimir, unir, convertir y editar PDFs online", isExternal: true },
        { id: "detexify", label: "Detexify — LaTeX symbols", url: "https://detexify.kirelabs.org/classify.html", description: "Dibujá un símbolo y encontrá su comando LaTeX", isExternal: true },
      ],
    },
    {
      id: "est-libros",
      label: "Libros & Bibliografía",
      iconName: "book",
      iconColor: "bg-orange-500/12 text-orange-400",
      description: "Conseguí libros técnicos gratuitos o a bajo costo",
      links: [
        { id: "zlibrary", label: "Z-Library", url: "https://z-lib.id", description: "La mayor biblioteca digital gratuita del mundo", isExternal: true },
        { id: "libgen", label: "Library Genesis", url: "https://libgen.is", description: "Libros técnicos y académicos en PDF", isExternal: true },
        { id: "openlibrary", label: "Open Library", url: "https://openlibrary.org", description: "Biblioteca digital de Internet Archive con préstamo online", isExternal: true },
        { id: "mit-ocw", label: "MIT OpenCourseWare", url: "https://ocw.mit.edu", description: "Material completo de cursos del MIT — gratuito", isExternal: true },
        { id: "openstax", label: "OpenStax", url: "https://openstax.org", description: "Libros de texto universitarios gratuitos y con revisión académica", isExternal: true },
      ],
    },
    {
      id: "est-practicas",
      label: "Prácticas & Empleo",
      iconName: "users",
      iconColor: "bg-emerald-500/12 text-emerald-400",
      description: "Bolsas de trabajo, prácticas y construcción de CV",
      links: [
        { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com", description: "Red profesional — imprescindible para el primer empleo", isExternal: true },
        { id: "utn-bolsa", label: "Bolsa de Trabajo UTN", url: "https://www.frba.utn.edu.ar/index.php/extension/bolsa-de-trabajo/", description: "Ofertas laborales y pasantías publicadas por la facultad", isExternal: true },
        { id: "glassdoor", label: "Glassdoor", url: "https://www.glassdoor.com.ar", description: "Sueldos reales y reseñas de empresas tecnológicas", isExternal: true },
        { id: "flowcv", label: "FlowCV", url: "https://flowcv.com", description: "Creador de CV profesional online y gratuito", isExternal: true },
        { id: "github-portfolio", label: "GitHub", url: "https://github.com", description: "Mostrá tu código — el CV de todo desarrollador", isExternal: true },
      ],
    },
  ],
};

// =============================================================================
// EXPORT — Orden de aparición en la página
// =============================================================================
export const SECTIONS: SectionData[] = [
  seccionITEC,
  seccionUTN,
  seccionCicloBasico,
  seccionSistemas,
  seccionElectronica,
  seccionCivil,
  seccionMecanica,
  seccionQuimicaIndustrial,
  seccionEstudiantes,
];