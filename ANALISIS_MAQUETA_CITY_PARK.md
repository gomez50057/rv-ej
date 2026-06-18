# Análisis de la maqueta `city_park_at_sunset.glb`

Este proyecto ya usa el archivo recibido como maqueta principal:

```txt
public/models/maqueta-urbana.glb
```

El archivo original fue renombrado internamente para no cambiar la ruta usada por A-Frame.

## Lectura geométrica del modelo

La maqueta tiene aproximadamente estas dimensiones:

```txt
X: -26.32 a 26.33
Y: -0.02 a 12.04
Z: -33.18 a 35.56
```

Interpretación visual:

- El modelo representa un parque urbano rectangular.
- La fuente/plaza principal está cerca del centro: `x: 0`, `z: 0`.
- Hay un eje peatonal norte-sur sobre `x: 0`.
- Hay accesos laterales sobre los bordes este/oeste.
- Hay zonas arboladas fuertes hacia el noreste y otras esquinas.
- El perímetro del parque queda claramente delimitado por muros/bordes.

## Puntos ajustados

Los puntos de vista se ajustaron al modelo real, no al placeholder anterior:

| Orden | Punto | Cámara | Mira hacia |
|---:|---|---|---|
| 1 | Inicio del proyecto | `0 25 54` | centro del parque |
| 2 | Plaza central | `0 1.65 9.5` | fuente central |
| 3 | Corredor peatonal | `0 1.65 25.5` | eje norte-sur |
| 4 | Ciclovía / sendero lateral | `-22.5 1.65 -23` | sendero lateral izquierdo |
| 5 | Paradero / acceso | `21.5 1.65 7.5` | acceso lateral derecho |
| 6 | Área verde | `18.5 1.65 18` | zona arbolada noreste |
| 7 | Equipamiento urbano | `-7 1.65 6` | mobiliario cerca de la plaza central |
| 8 | Vista general final | `-34 22 -48` | vista completa desde el ángulo opuesto |

## Mejora técnica agregada

La rotación de cámara ahora se calcula automáticamente con `cameraLookAt`, por lo que no dependemos de adivinar ángulos manuales.

Ejemplo:

```js
{
  cameraRigPosition: "0 1.65 9.5",
  cameraLookAt: "0 1.35 0"
}
```

Esto mueve la cámara a la posición indicada y la orienta hacia el punto objetivo.

## Recomendación para seguir ajustando

Si una vista queda muy cerca o muy lejos, modifica solo:

```js
cameraRigPosition
cameraLookAt
hotspotPosition
```

en:

```txt
src/data/urbanTour.js
```
