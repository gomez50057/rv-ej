# Mejoras de alto nivel — Cardboard por mirada

Esta versión está diseñada para que el recorrido sea usable dentro de Google Cardboard / VR Box sin depender de botones físicos, mouse, teclado ni touch dentro del visor.

## Objetivo principal

Crear una experiencia urbana inmersiva operable únicamente con la mirada:

```txt
mirar objetivo → esperar 1.3 s → activar acción → saltar de cámara o cambiar estado
```

## Cambios principales

- Modo Cardboard conserva el botón VR nativo de A-Frame.
- Botón propio “Entrar modo lentes / Cardboard”.
- En modo lentes se oculta la interfaz HTML para no tapar la vista.
- Se agregaron controles 3D dentro de la escena:
  - Siguiente
  - Anterior
  - Info
  - Cambiar vista
  - Inicio
- Todos los controles 3D se activan por mirada fija.
- Se agregaron hotspots grandes sobre la maqueta.
- Se mejoró el cursor central con animación de carga.
- Se agregó una mini etiqueta fija dentro del visor con el punto actual.
- Se agregó tarjeta informativa 3D que se abre/cierra por mirada.
- Se mantienen los modos:
  - Vista maqueta
  - Vista peatonal
  - Vista guiada

## Ruta principal

```txt
/recorrido-vr/index.html
```

## Prueba local

```bash
npm install
npm run clean
npm run dev:network
```

En móvil abre:

```txt
http://TU-IP-REAL:3001/recorrido-vr/index.html
```

Para mejor compatibilidad con sensores y Cardboard, prueba con HTTPS.

## Consideración técnica

El modelo `urbana.glb` pesa aproximadamente 53 MB. Para producción móvil se recomienda crear una versión optimizada de 15–30 MB con materiales PBR ligeros y geometría reducida.
