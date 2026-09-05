# 🎓 iTEC BA — Frontend & PWA

Bienvenido al repositorio oficial del frontend de **iTEC BA**, la plataforma colaborativa e independiente exclusiva para estudiantes de la UTN FRBA.

Este proyecto está construido como una **Single Page Application (SPA)** altamente interactiva y configurada como una **Progressive Web App (PWA)**, optimizada para ofrecer una experiencia nativa tanto en escritorio como en dispositivos móviles.

## 1. Sistema de Diseño (UI/UX)

La plataforma utiliza un diseño **Dark Theme por defecto**, enfocado en el **Flat Design Institucional**. El objetivo es transmitir seriedad, orden y velocidad, simulando un sistema de gestión universitaria moderno.

### Reglas Visuales y Restricciones
* **Paleta de Colores Estricta:** No se deben usar colores arbitrarios de Tailwind. Se deben usar las variables CSS globales definidas en `index.css`.
* **Prohibido el uso de sombras y degradados:** Para mantener un diseño limpio y rápido (Flat), no se deben utilizar clases como `shadow-lg`, `shadow-[...]`, `bg-gradient-to-...` ni desenfoques (`blur`).
* **Componentes Modales:** Todas las interacciones complejas deben renderizarse usando la plantilla global `<LayoutModal/>` para mantener la consistencia móvil/escritorio.

### Colores por Módulo (Feature Colors)
Cada sección principal de la plataforma tiene asignado un color sólido representativo para mantener coherencia e identidad visual sin saturar la interfaz general, pero sino existe en el index.css en los themes como `--color-itec-section-[SECCION]: #....`, para jugar con fondos a cosas importantes y borders, solo con cosas importantes jugar con la opacidad de tailwind ejemplos `[bg/text/border/etc...]-itec-section-[SECCION]/10`, `[bg/text/border/etc...]-itec-section-[SECCION]/60`, `[bg/text/border/etc...]-itec-section-[SECCION]/90`, etc.

* **TruekeTEC:** `#ff493b`
* **Admission, Ingreso:** `#C27AFF`

### 1.bis Escala de opacidad por uso (no solo "cómo", también "cuándo")

La sintaxis de arriba explica cómo se compone la clase, pero no cuándo usar cada
nivel. Esta tabla es la convención a seguir para que cada feature nueva no invente
su propia escala:

| Opacidad  | Uso recomendado                                                                      |
|-----------|----------------------------------------------------------------------------------------|
| `/10`     | Fondo de bloques destacados (banners, tarjetas de match, alertas informativas)         |
| `/20–/30` | Borde de esos mismos bloques (acompaña al fondo `/10`)                                 |
| `/40`     | Borde de badges de estado                                                              |
| `/60`     | Borde con énfasis medio-alto (acordeones importantes, avisos que requieren atención)    |
| `/80–/90` | Texto o fondo casi sólido (hover states, botones "solid" del color de sección)          |

### Dark theme: ¿hay soporte de modo claro planeado?

`index.css` conserva valores de modo claro comentados (ej. `--color-itec-bg: #ffffff`).
Antes de tocar esas líneas, confirmar si son:
- (a) residuo de una prueba descartada → se pueden eliminar, o
- (b) un modo claro planeado a futuro → no borrar, y documentar acá el criterio
  para cuándo se retomaría.

---

## 2. Arquitectura y Convenciones de Código

### 2.1 Alias de imports (paths)

Definidos en `tsconfig.app.json`. Usar siempre alias, nunca rutas relativas largas
(`../../../`):

```
@/*            → src/*
@components/*  → src/components/*
@features/*    → src/features/*
@pages/*       → src/pages/*
@assets/*      → src/assets/*
@hooks/*       → src/hooks/*
@services/*    → src/services/*
@context/*     → src/context/*
@lib/*         → src/lib/*
@data/*        → src/data/*
```

### 2.2 Componentes de UI obligatorios (no usar HTML nativo)

Para mantener consistencia visual y de comportamiento, estos componentes son de uso
obligatorio en lugar de sus equivalentes nativos:

| En vez de...              | Usar siempre...                        |
|-----------------------------|------------------------------------------|
| `<button>`                 | `@components/ui/Button`                  |
| `<select>`                 | `@components/ui/CustomSelect`            |
| `<input>`                  | `@components/ui/Input`                   |
| `fixed` + overlay manual   | `@components/templates/LayoutModal`      |

**Limitación conocida de `CustomSelect`:** no tiene búsqueda ni filtro por texto,
es un dropdown que lista todas las opciones al abrir. Para listas largas (30+
ítems, ej. materias de una carrera completa) la experiencia se degrada. En esos
casos evaluar `@components/molecules/AutocompleteInput`, o agrupar/paginar las
opciones dentro del propio `CustomSelect`.

### 2.3 Estructura obligatoria de una feature (`src/features/<nombre>/`)

Toda feature nueva debe seguir esta estructura (ya usada en `trueketec` y
`notifications`):

```
src/features/<nombre>/
├── components/
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── hooks/
│   └── use<Nombre>.ts        # lógica de estado + llamadas a services
├── services/
│   └── <nombre>.service.ts   # fetch a la API, nunca dentro de componentes
├── types/
│   └── <nombre>.types.ts     # interfaces que reflejan el shape real de la DB
└── data.ts                   # info dura: textos largos, listas, mensajes, config
```

**Regla de `data.ts`:** ningún texto de negocio (mensajes de error, textos largos,
listas de opciones, datos de contacto) debe vivir hardcodeado dentro de un `.tsx`.
Siempre extraer a `data.ts` de la feature correspondiente.

### 2.4 Patrón de autenticación en `*.service.ts`

Todo servicio que llame a la API del backend debe seguir este patrón (visto en
`trueketec.service.ts`), no inventar uno nuevo:

```ts
const getHeaders = async (): Promise<HeadersInit> => {
  await auth.authStateReady();
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Sesión caducada o no disponible.");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};
```

### 2.5 Restricción de dominio institucional

Ciertas páginas/funcionalidades son exclusivas para cuentas `@frba.utn.edu.ar`
(ej. TruekeTEC). Es una regla de negocio transversal, no algo específico de una
sola página. Patrón estándar de verificación:

```ts
if (!user?.email?.endsWith("@frba.utn.edu.ar")) { /* bloquear acceso */ }
```

Al crear una feature nueva restringida por dominio, replicar este mismo patrón en
vez de reinventar la validación.

---


### 1.ter Simulación de Profundidad (Estricto Flat Design)
Queda **completamente prohibido** el uso de `shadow-*`, `drop-shadow-*` o `backdrop-blur-*` en cualquier componente (incluyendo Modales, Toasts, Loaders y Banners). 
Para separar visualmente elementos superpuestos, se debe utilizar la superposición de colores de fondo combinada con bordes sutiles:
* Elemento base: `bg-itec-box border border-itec-border`
* Elemento superpuesto (Modal/Toast): `bg-itec-card border border-white/10`
* Ningún componente de la carpeta `@components/ui/` o `@components/organisms/` tiene excepciones a esta regla.
