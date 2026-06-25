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

## Botón VR / Cardboard

Esta versión vuelve a activar el botón nativo de A-Frame con:

```html
vr-mode-ui="enabled: true"
```

Además conserva el botón propio `Entrar modo lentes / Cardboard`. En móvil debes ver:

- botón propio abajo a la izquierda,
- ícono VR nativo de A-Frame abajo a la derecha.

Si el ícono aparece pero no divide pantalla, usa HTTPS para probar en celular.


## Ajuste móvil de esta versión

Esta versión conserva el ícono nativo de VR/Cardboard y mejora la visualización en teléfono:

- En móvil inicia con los paneles compactos para no tapar la maqueta.
- El botón `Controles` abre/cierra modos, punto actual y lista de navegación.
- El botón `Entrar modo lentes / Cardboard` queda abajo a la izquierda para no encimarse con el ícono VR nativo de A-Frame.
- El ícono VR nativo queda visible abajo a la derecha.
- En modo lentes se ocultan los paneles para que no estorben.
- Se usan alturas `100dvh`, márgenes seguros `safe-area` y botones más grandes para toque móvil.

Ruta recomendada en móvil:

```txt
http://TU-IP-REAL:3001/recorrido-vr/index.html
```

Para mejor compatibilidad Cardboard/WebXR, probar también con HTTPS mediante túnel:

```bash
npm run dev:network
npm run tunnel
```

## Ajuste de cámara móvil

La ruta estática `/recorrido-vr/index.html` ahora usa una cámara inicial más abierta para móvil:

- posición inicial: `0 24 62`
- rotación inicial aproximada: `-20.38 4.43 0`
- FOV: `72`
- near/far: `0.05 / 180`

Cada punto del recorrido tiene posiciones móviles propias (`mobileCameraRigPosition` y `mobileCameraLookAt`). En teléfono o pantalla táctil se usan automáticamente para evitar encuadres demasiado pegados al modelo.
