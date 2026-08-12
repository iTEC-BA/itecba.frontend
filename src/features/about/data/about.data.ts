export const HERO_DATA = {
  tagline: "Proyecto Estudiantil",
  taglineIcon: "verified",
  titleStart: "Equipo",
  titleHighlight: "iTEC BA",
  description: "Somos una plataforma colaborativa e independiente construida exclusivamente por y para estudiantes de la UTN FRBA. Nuestro objetivo es centralizar herramientas y democratizar el acceso a la información académica de forma rápida y sin publicidad.",
  logoUrl: "/logo.png",
  socialLinks: [
    { label: "Instagram", url: "https://www.instagram.com/itecba", icon: "instagram" },
    { label: "Discord",   url: "https://discord.gg/kGAHwb2qKV",    icon: "users" },
    { label: "YouTube",   url: "https://www.youtube.com/@itecBA",  icon: "youtube" },
    { label: "Contacto",  url: "mailto:soporte.itecba@gmail.com",  icon: "message" },
  ]
};

export const PILLARS_DATA = {
  title: "Pilares del Proyecto",
  icon: "star",
  items: [
    {
      title: "Aportes Gratuitos",
      badge: "BiblioTEC",
      colorClass: "bg-itec-sky",
      description: "Acceso libre a miles de resúmenes, parciales y guías sin costo alguno. Todo el material es subido y validado por la misma comunidad de estudiantes para asegurar la mejor calidad académica."
    },
    {
      title: "Red de Alumnos",
      badge: "Comunidad",
      colorClass: "bg-itec-groups",
      description: "Encontrá tu grupo de WhatsApp por materia y comisión al instante. Conectate con tus compañeros, resolvé dudas en el foro anónimo y organizá tu cursada de forma eficiente."
    },
    {
      title: "Crecimiento Constante",
      badge: "Herramientas",
      colorClass: "bg-itec-rewards",
      description: "Agregamos nuevas secciones y herramientas útiles cada cuatrimestre. Desde el seguimiento de carrera interactivo hasta un catálogo de beneficios y un sistema de recompensas automatizado."
    }
  ]
};

export const PROJECTS_DATA = {
  title: "Proyectos Destacados",
  icon: "grid",
  items: [
    {
      id: "trueketec",
      title: "TruekeTEC — Intercambio de Comisiones",
      description: "Plataforma segura para buscar y acordar intercambios de comisiones entre estudiantes. Cuenta con un algoritmo inteligente de matches perfectos, privacidad de datos y notificaciones en tiempo real.",
      imageUrl: "/logo.png", // Podés cambiarla por una captura real en /public
      tags: [
        { name: "Módulo Nativo", colorClass: "text-itec-text border-itec-border" },
        { name: "Tiempo Real", colorClass: "text-itec-emerald border-itec-emerald/20 bg-itec-emerald/10" }
      ],
      links: [
        { label: "Probar Módulo", url: "/trueketec", icon: "externalLink" }
      ]
    },
    {
      id: "bibliotec",
      title: "BiblioTEC — Repositorio Colaborativo",
      description: "Miles de resúmenes, finales y guías resueltas organizadas por especialidad y materia. Todo el material es subido y validado por la propia comunidad estudiantil para garantizar su vigencia y calidad.",
      imageUrl: "/logo.png",
      tags: [
        { name: "Storage Optimizado", colorClass: "text-itec-text border-itec-border" },
        { name: "Validación Comunitaria", colorClass: "text-itec-sky border-itec-sky/20 bg-itec-sky/10" }
      ],
      links: [
        { label: "Ver Recursos", url: "/recursos", icon: "folder" }
      ]
    },
    {
      id: "foro",
      title: "Foro Anónimo UTN",
      description: "Espacio de discusión estudiantil sin fricción. Utiliza pseudónimos deterministas generados criptográficamente para proteger la identidad de los alumnos, promoviendo el debate libre y seguro.",
      imageUrl: "/logo.png",
      tags: [
        { name: "SQLite Edge", colorClass: "text-itec-text border-itec-border" },
        { name: "Full Anónimo", colorClass: "text-itec-rewards border-itec-rewards/20 bg-itec-rewards/10" }
      ],
      links: [
        { label: "Ir al Foro", url: "/foro", icon: "message" }
      ]
    }
  ]
};

export const CONTRIBUTORS_DATA = {
  sectionTitle: "Equipo y Colaboradores",
  sectionIcon: "users",
  teamTitle: "Colaboradores de la plataforma",
  teamDescription: "Estudiantes de la UTN comprometidos con mantener el código y la plataforma activa diariamente.",
  ctaTitle: "QUIERES UNIRTE?",
  ctaDescription: "El proyecto es abierto. Sumate para proponer mejoras o revisar la documentación del código fuente.",
  ctaButtonText: "Ver repositorio",
  ctaButtonUrl: "https://github.com/iTEC-BA",
  ctaButtonIcon: "externalLink", // Usamos externalLink porque no existe github en Icons.tsx
  ctaIcon: "edit"
};