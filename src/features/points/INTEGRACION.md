# Integración del módulo de puntos — instrucciones

## 1. Warm-up de caché al iniciar la app

En `src/App.tsx` (o el componente raíz), añadir una llamada de warm-up para
que la caché de actividades esté lista antes del primer click del usuario:

```tsx
import { getActivities } from "@features/points";

// Dentro del componente (useEffect una sola vez):
useEffect(() => {
  getActivities().catch(() => {}); // warm-up silencioso
}, []);
```

---

## 2. Publicar en el foro anónimo

En el componente que maneja el submit del foro (donde ya llamás al backend y
confirmás que el post se creó):

```tsx
import { usePointsGrant }  from "@features/points";
import { usePointsToast }  from "@features/points";

const { grant }           = usePointsGrant();
const { showToast, toastNode } = usePointsToast();

// Dentro del handler de submit, DESPUÉS de confirmar éxito:
const handlePublish = async () => {
  // ... tu lógica existente de crear el post ...
  const result = await grant("forum_post", { postId: newPost.id });
  if (result.granted && result.points) {
    showToast(result.points, "Publicaste en el foro");
  }
};

// En el JSX:
return (
  <>
    {toastNode}
    {/* tu formulario existente */}
  </>
);
```

Para respuestas, usar `grant("forum_reply")` de la misma manera.

---

## 3. Subir un recurso

```tsx
const result = await grant("resource_upload", { resourceId: newResource._id });
if (result.granted && result.points) {
  showToast(result.points, "Subiste un recurso");
}
```

---

## 4. Proponer un grupo

```tsx
const result = await grant("group_propose");
if (result.granted && result.points) {
  showToast(result.points, "Propusiste un grupo");
}
```

---

## 5. Completar el perfil

```tsx
const result = await grant("profile_complete");
if (result.granted && result.points) {
  showToast(result.points, "Completaste tu perfil");
}
```

---

## 6. Login diario

Llamar en el AuthContext o en el componente que maneja el inicio de sesión
exitoso:

```tsx
grant("daily_login").catch(() => {});
```

---

## 7. Panel de admin

Agregar en la página de administración (junto a Rewards Management):

```tsx
import { PointsActivityManager } from "@features/points";

// En la sección de admin:
<PointsActivityManager />
```

---

## 8. Historial en el perfil del usuario

```tsx
import { PointsHistoryWidget } from "@features/points";

// En la página de perfil, debajo del balance:
<PointsHistoryWidget />
```

---

## 9. Variable de entorno

El servicio usa `import.meta.env.VITE_API_URL` para armar las URLs.
Asegurate de que esté definida en `.env`:

```
VITE_API_URL=https://tu-backend.onrender.com
```
