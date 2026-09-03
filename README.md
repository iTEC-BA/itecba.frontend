# 🎓 iTEC BA — Frontend & PWA

Bienvenido al repositorio oficial del frontend de **iTEC BA**, la plataforma colaborativa e independiente exclusiva para estudiantes de la UTN FRBA.

Este proyecto está construido como una **Single Page Application (SPA)** altamente interactiva y configurada como una **Progressive Web App (PWA)**, optimizada para ofrecer una experiencia nativa tanto en escritorio como en dispositivos móviles.

## 1. Sistema de Diseño (UI/UX)

La plataforma utiliza un diseño **Dark Theme por defecto**, enfocado en el **Flat Design Institucional**. El objetivo es transmitir seriedad, orden y velocidad, simulando un sistema de gestión universitaria moderno.

### Reglas Visuales y Restricciones
* **Paleta de Colores Estricta:** No se deben usar colores arbitrarios de Tailwind. Se deben usar las variables CSS globales definidas en `index.css`:
* **Prohibido el uso de sombras y degradados:** Para mantener un diseño limpio y rápido (Flat), no se deben utilizar clases como `shadow-lg`, `shadow-[...]`, `bg-gradient-to-...` ni desenfoques (`blur`).
* **Componentes Modales:** Todas las interacciones complejas deben renderizarse usando la plantilla global `<LayoutModal/>` para mantener la consistencia móvil/escritorio.

### Colores por Módulo (Feature Colors)
Cada sección principal de la plataforma tiene asignado un color sólido representativo para mantener coherencia e identidad visual sin saturar la interfaz general, pero sino existe en el index.css en los themes como `--color-itec-section-[SECCION]: #....`
* **TruekeTEC:** `#FAB306`
* **Admission, Ingreso:** `#C27AFF`
