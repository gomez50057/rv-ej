# VR Urban Cardboard Demo — urbana.glb

Demo de recorrido VR/Cardboard para una maqueta urbana usando Next.js + A-Frame.

## Corrección de esta versión

Esta versión ya no carga A-Frame con un script dinámico desde el componente. Ahora A-Frame se carga de forma estática desde el layout con:

```txt
/public/vendor/aframe-v1.7.1.min.js
```

El componente solo verifica `window.AFRAME` y no se queda indefinidamente en “Inicializando A-Frame”. Si A-Frame no aparece en 12 segundos, muestra diagnóstico y botón de recarga.

También se retiró el uso de `<a-assets>` para el modelo grande, porque en móvil puede bloquear la escena mientras descarga el GLB. Ahora el modelo se carga directamente con `gltf-model="/models/maqueta-urbana.glb"` y se muestra un aviso independiente mientras carga.

## Ejecutar

```bash
npm install
npm run clean
npm run dev:network
```

Abrir en PC:

```txt
http://localhost:3001/recorrido-vr
```

Abrir en celular usando la IP real de tu PC:

```txt
http://TU-IP-REAL:3001/recorrido-vr
```

No uses `localhost` desde el celular.

## Prueba de archivos desde celular

Abre estas rutas desde el celular:

```txt
http://TU-IP-REAL:3001/vendor/aframe-v1.7.1.min.js
http://TU-IP-REAL:3001/models/maqueta-urbana.glb
```

Si alguna no carga, el problema es IP, puerto, firewall o red.

## Nota sobre móvil

El modelo `urbana.glb` pesa aproximadamente 53 MB y tiene más de 1 millón de vértices. En celulares puede tardar o fallar por memoria. La versión final para Cardboard debería exportarse optimizada o low-poly.

## Versión móvil más robusta

Si en teléfono se queda en “Verificando A-Frame”, usa directamente la ruta estática:

```txt
http://TU-IP-REAL:3001/recorrido-vr/index.html
```

Esta versión evita React/Next para cargar A-Frame en móvil. La ruta `/recorrido-vr` redirige automáticamente a esa página estática.

Pruebas desde el teléfono:

```txt
http://TU-IP-REAL:3001/vendor/aframe-v1.7.1.min.js
http://TU-IP-REAL:3001/models/maqueta-urbana.glb
http://TU-IP-REAL:3001/recorrido-vr/mobile-vr.js
```

Si esas rutas no abren, el problema es IP, puerto, firewall o red. Si abren, la página estática debe inicializar el visor.
