# VR Urban Cardboard Demo - urbana.glb ajustado

Proyecto de ejemplo para recorrer una maqueta urbana en modo VR/Cardboard usando Next.js y A-Frame.

## Qué incluye

- Modelo real cargado como `/public/models/maqueta-urbana.glb` a partir de `urbana.glb`.
- Puntos ajustados al modelo:
  1. Inicio del proyecto
  2. Plaza central
  3. Corredor peatonal
  4. Ciclovía / plataforma lateral
  5. Paradero de transporte / acceso sur
  6. Área verde
  7. Equipamiento urbano
  8. Vista general final
- Modos:
  - Vista maqueta
  - Vista peatonal
  - Vista guiada
- Navegación por mirada: mirar una esfera durante 1.4 segundos activa el salto.

## Uso

```bash
npm install
npm run clean
npm run dev:network
```

Abre en PC:

```txt
http://localhost:3001/recorrido-vr
```

Abre desde celular usando la IP real de tu computadora:

```txt
http://TU-IP-REAL:3001/recorrido-vr
```

Ejemplo:

```txt
http://192.168.1.50:3001/recorrido-vr
```

## Archivos clave

```txt
src/data/urbanTour.js
src/app/recorrido-vr/VRUrbanTour.jsx
public/models/maqueta-urbana.glb
ANALISIS_MAQUETA_URBANA.md
ANALISIS_PUNTOS_URBANA.png
```

## Nota de rendimiento

`urbana.glb` pesa aproximadamente 53 MB y contiene alrededor de 1.48 millones de caras. Para producción móvil/VR conviene generar una versión optimizada del modelo.
