# VR Urban Cardboard Demo

Demo base para crear un recorrido 3D interactivo de una maqueta urbana con prioridad en **VR / Cardboard / VR Box 3D**.

Incluye:

- Proyecto Next.js con App Router.
- A-Frame para experiencia VR web.
- CSS Modules.
- Maqueta urbana de ejemplo en formato `.glb`.
- Navegación por mirada con `a-cursor` y `fuse`.
- Saltos entre puntos del recorrido.
- 3 modos de navegación:
  - Vista maqueta.
  - Vista peatonal.
  - Vista guiada.

---

## Estructura principal

```txt
public/
  models/
    maqueta-urbana.glb

src/
  app/
    recorrido-vr/
      page.jsx
      VRUrbanTour.jsx
      VRUrbanTour.module.css

  data/
    urbanTour.js
```

---

## Instalación

```bash
npm install
```

---

## Ejecutar localmente

```bash
npm run dev
```

Después abre:

```txt
http://localhost:3000/recorrido-vr
```

---

## Probar desde celular en la misma red

Ejecuta:

```bash
npm run dev:network
```

Busca la IP local de tu computadora. En Windows puedes usar:

```powershell
ipconfig
```

Después abre desde el celular:

```txt
http://TU-IP-LOCAL:3000/recorrido-vr
```

Ejemplo:

```txt
http://192.168.1.50:3000/recorrido-vr
```

---

## Cómo usar en VR Box / Cardboard

1. Abre `/recorrido-vr` desde el celular.
2. Espera a que cargue la maqueta.
3. Presiona el ícono de **VR** del visor A-Frame.
4. Mete el celular en el visor VR Box / Cardboard.
5. Mira una esfera durante 1.4 segundos.
6. Se activa el salto y la cámara se mueve a esa zona.

---

## Puntos incluidos

1. Inicio del proyecto.
2. Plaza central.
3. Corredor peatonal.
4. Ciclovía.
5. Paradero de transporte.
6. Área verde.
7. Equipamiento urbano.
8. Vista general final.

---

## Modos incluidos

### Vista maqueta

Vista superior para entender el proyecto completo.

### Vista peatonal

Vista a nivel de calle para recorrer espacios clave.

### Vista guiada

Secuencia ordenada por puntos estratégicos.

---

## Cambiar la maqueta

Reemplaza este archivo:

```txt
public/models/maqueta-urbana.glb
```

por tu modelo real exportado desde Blender, SketchUp, Revit o Rhino.

Recomendaciones para el modelo final:

```txt
Formato: .glb
Peso ideal: 10 MB a 30 MB
Texturas: 1024 px o 2048 px
Geometría: simplificada
Árboles: low-poly
Sombras: horneadas si es posible
```

---

## Editar puntos del recorrido

Modifica:

```txt
src/data/urbanTour.js
```

Cada punto tiene:

```js
{
  id: "plaza-central",
  title: "Plaza central",
  description: "Espacio público principal de convivencia.",
  hotspotPosition: "0 2.4 -5.4",
  cameraRigPosition: "0 1.6 -1.2",
  cameraRotation: "0 180 0",
  modes: ["maqueta", "peatonal", "guiada"],
  order: 2,
}
```

### Campos importantes

- `hotspotPosition`: ubicación de la esfera que el usuario mira.
- `cameraRigPosition`: ubicación a la que salta la cámara.
- `cameraRotation`: orientación inicial de la vista.
- `modes`: en qué modos aparece ese punto.
- `order`: orden del recorrido guiado.

---

## Nota importante sobre iPhone y Android

Para una primera prueba conviene usar **Android + Chrome** o **Samsung Internet**. En iPhone, el soporte VR/WebXR puede variar según versión y navegador.

---

## Siguiente mejora recomendada

Después de validar este MVP, lo siguiente sería agregar:

- Paneles informativos dentro de VR.
- Narración o audio por punto.
- Capas encendibles/apagables.
- Comparación “actual vs propuesta”.
- Versión web normal para escritorio con controles de mouse.

## Corrección de carga

Esta versión incluye una carga más robusta de A-Frame:

1. Primero intenta cargar la dependencia local instalada con `npm install`.
2. Si no carga después de unos segundos, intenta usar el CDN oficial de A-Frame.
3. Si falla, muestra un mensaje de error en pantalla en lugar de quedarse congelado en "Cargando experiencia".

Si ves el mensaje de error, revisa:

```bash
npm install
npm run dev
```

También confirma que el archivo exista:

```txt
public/models/maqueta-urbana.glb
```
