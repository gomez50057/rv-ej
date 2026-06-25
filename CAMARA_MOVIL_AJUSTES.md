# Ajustes de cámara móvil

Esta versión agrega estados de cámara específicos para teléfono en cada punto del recorrido.

## Cambios principales

- Se agregaron `mobileCameraRigPosition` y `mobileCameraLookAt` por punto.
- En móvil o pantalla táctil, el visor usa automáticamente esas posiciones.
- Las vistas peatonales se alejaron y elevaron ligeramente para evitar que el modelo se vea cortado.
- Las vistas generales se alejaron más para que el corredor completo entre mejor en pantalla vertical/horizontal.
- Al girar el teléfono o cambiar tamaño de pantalla, la cámara se reajusta al punto actual.
- Se configuró la cámara con `fov: 72`, `near: 0.05` y `far: 180`.

## Ruta de prueba

```txt
/recorrido-vr/index.html
```

## Recomendación de uso

En celular, primero abre el recorrido en horizontal, espera que cargue la maqueta y luego activa el botón Cardboard.
