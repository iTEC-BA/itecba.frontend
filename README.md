# 🎓 iTEC BA — Frontend & PWA

Bienvenido al repositorio oficial del frontend de **iTEC BA**, la plataforma colaborativa e independiente exclusiva para estudiantes de la UTN FRBA.

Este proyecto está construido como una **Single Page Application (SPA)** altamente interactiva y configurada como una **Progressive Web App (PWA)**, optimizada para ofrecer una experiencia nativa tanto en escritorio como en dispositivos móviles.

---

## 🎨 1. Sistema de Diseño (UI/UX)

La plataforma utiliza un diseño **Dark Theme por defecto**, enfocado en el **Flat Design Institucional**. El objetivo es transmitir seriedad, orden y velocidad, simulando un sistema de gestión universitaria moderno.

### Reglas Visuales y Restricciones
* **Paleta de Colores Estricta:** No se deben usar colores arbitrarios de Tailwind. Se deben usar las variables CSS globales definidas en `index.css`:
  * `bg-itec-bg` / `bg-itec-box` / `bg-itec-surface`: Jerarquía de fondos oscuros.
  * `border-itec-border`: Para todos los delineados sutiles (`#171717`).
  * `text-itec-text` / `text-itec-muted`: Para textos primarios y secundarios.
* **Prohibido el uso de sombras y degradados:** Para mantener un diseño limpio y rápido (Flat), no se deben utilizar clases como `shadow-lg`, `shadow-[...]`, `bg-gradient-to-...` ni desenfoques (`blur`).
* **Componentes Modales:** Todas las interacciones complejas deben renderizarse usando la plantilla global `<LayoutModal/>` para mantener la consistencia móvil/escritorio.

### Colores por Módulo (Feature Colors)
Cada sección principal de la plataforma tiene asignado un color sólido representativo para mantener coherencia e identidad visual sin saturar la interfaz general:
* **TruekeTEC (Azul - `itec-blue-skye`):** Representa la confianza, la comunicación clara y la estabilidad, esenciales para establecer acuerdos de intercambio.
* *(Espacio reservado para futuros colores y módulos)*

### 🤖 Prompt Maestro para Generación con IA
Si necesitas utilizar herramientas de Inteligencia Artificial para maquetar nuevas secciones o componentes, copia y pega el siguiente prompt para garantizar que el código generado respete nuestro sistema de diseño al pie de la letra:

> **Prompt Maestro:**
> "Actúa como un desarrollador Frontend experto en React y Tailwind CSS. Necesito que maquetes un nuevo componente para la plataforma web de iTEC BA.
> 
> **Reglas de diseño estrictas a respetar:**
> 1. **Estilo General:** Flat Design Institucional, Modern Dark Mode y estructura estilo Bento UI.
> 2. **Prohibiciones Absolutas:** CERO sombras (`shadow`), CERO degradados (`bg-gradient`), CERO desenfoques (`blur` o `backdrop-blur`).
> 3. **Estructura y Fondos:** Usa Flexbox o CSS Grid con `gap-4` o `gap-6`. Los fondos de los contenedores deben usar obligatoriamente las clases `bg-itec-bg`, `bg-itec-box` o `bg-itec-surface`. Usa radios de borde `rounded-2xl` o `rounded-3xl` y paddings como `p-6` o `p-8`.
> 4. **Bordes:** Para separar elementos usa bordes sutiles con `border border-itec-border` o `border-white/5`.
> 5. **Textos:** Títulos principales en `text-white font-bold tracking-tight`. Textos secundarios o descripciones en `text-itec-muted` o `text-itec-text/80` (tamaños `text-sm` o `text-xs`).
> 6. **Colores de Acento:** Usa el color del módulo (ej. `itec-blue-skye` para el módulo TruekeTEC) en llamadas a la acción, botones principales (`bg-itec-blue-skye text-black font-bold`) o iconos destacados.
> 7. **Iconografía:** Usa la biblioteca Lucide React.
> 
> **La tarea:**
> Teniendo en cuenta estas reglas, genera el código en React (usando `className`) para: **[DESCRIBIR EL COMPONENTE, SECCIÓN O PANTALLA AQUÍ]**."

---

## 🏛️ 2. Estructura y Arquitectura
El proyecto emplea una arquitectura híbrida y escalable que combina el **Atomic Design** (para la UI global) con el patrón **Feature-Driven Architecture** (para la lógica de negocio).