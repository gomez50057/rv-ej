# VR Urban Cardboard Demo — City Park

Demo Next.js + A-Frame para un recorrido VR/Cardboard usando la maqueta real:

```txt
city_park_at_sunset.glb
```

El archivo fue copiado a:

```txt
public/models/maqueta-urbana.glb
```

La ruta principal es:

```txt
/recorrido-vr
```

## Qué incluye

- Next.js con Webpack forzado para evitar bloqueos de Turbopack.
- A-Frame local en `public/vendor/aframe-v1.7.1.min.js`.
- Modelo `.glb` real del parque urbano.
- Navegación por mirada.
- Saltos entre puntos de vista.
- Tres modos:
  - Vista maqueta
  - Vista peatonal
  - Vista guiada
- Cálculo automático de rotación de cámara usando `cameraLookAt`.

## Instalar

```bash
npm install
```

## Ejecutar en PC

```bash
npm run clean
npm run dev:3001
```

Abrir:

```txt
http://localhost:3001/recorrido-vr
```

## Ejecutar para celular en la misma red

```bash
npm run clean
npm run dev:network
```

Busca tu IP real en Windows:

```powershell
ipconfig
```

Abre en el celular:

```txt
http://TU-IP-REAL:3001/recorrido-vr
```

Ejemplo:

```txt
http://192.168.1.50:3001/recorrido-vr
```

No uses `localhost` en el celular.

## Probar archivos desde el celular

Primero valida que el celular pueda abrir estos recursos:

```txt
http://TU-IP-REAL:3001/vendor/aframe-v1.7.1.min.js
http://TU-IP-REAL:3001/models/maqueta-urbana.glb
```

Si alguno no abre, el problema es red, IP, firewall o puerto.

## Ajustar puntos de vista

Edita:

```txt
src/data/urbanTour.js
```

Cada punto usa:

```js
cameraRigPosition: "x y z",
cameraLookAt: "x y z",
hotspotPosition: "x y z"
```

`cameraRigPosition` es dónde se coloca el usuario.

`cameraLookAt` es hacia dónde mira al llegar.

`hotspotPosition` es dónde aparece la esfera que activa el salto.

## Nota sobre HTTPS y VR

Para ver el modelo en navegador móvil por HTTP puede cargar la escena, pero algunas funciones de VR/WebXR pueden requerir HTTPS. Para una prueba real de Cardboard, lo ideal es publicar la demo en un servidor con HTTPS o usar un túnel HTTPS.

```bash
npm run tunnel
```

## Archivo de análisis

Incluí el archivo:

```txt
ANALISIS_MAQUETA_CITY_PARK.md
```

Ahí está la lectura de dimensiones, puntos ajustados y recomendaciones para seguir calibrando.
