# Análisis de `urbana.glb`

## Resultado técnico

El modelo se cargó como una sola malla llamada `PRUEVA`; no trae objetos separados por nombre como `Plaza`, `Ciclovia`, `Bancas`, `Acceso`, etc. Por eso los puntos fueron asignados mediante análisis espacial de la geometría en planta.

## Dimensiones detectadas

```txt
Archivo: urbana.glb
Peso aproximado: 53 MB
Mallas detectadas: 1
Vértices aproximados: 1,162,331
Caras aproximadas: 1,480,007
Bounds X: -16.56 a 9.35
Bounds Y: 5.43 a 8.91
Bounds Z: -30.65 a 30.05
Extensión aproximada: 25.91 x 3.48 x 60.70
```

## Ajuste aplicado al modelo

El terreno principal no estaba en `Y = 0`. Se aplicó un offset vertical:

```txt
modelPosition: 0 -6.235643 0
```

Con esto, la mayoría de superficies caminables quedan alrededor de `Y = 0`, lo que permite usar cámaras peatonales cerca de `Y = 1.65`.

## Criterio de puntos

| Punto | Criterio usado |
|---|---|
| Inicio del proyecto | Vista aérea desde el extremo norte para entender toda la intervención. |
| Plaza central | Nodo circular visible en el costado poniente medio. |
| Corredor peatonal | Eje longitudinal central que conecta la maqueta. |
| Ciclovía / plataforma lateral | Plataforma rectangular elevada al oriente. |
| Paradero / acceso sur | Extremo sur como punto de llegada; no hay paradero separado detectable. |
| Área verde | Zona amplia poniente/norte con baja densidad de elementos. |
| Equipamiento urbano | Elementos lineales visibles al poniente medio, interpretados como mobiliario. |
| Vista general final | Vista aérea desde el extremo sur para cerrar el recorrido. |

## Importante

El modelo pesa aproximadamente 53 MB y tiene más de 1.4 millones de caras. Puede cargar en PC, pero en celular puede tardar o fallar si el dispositivo tiene poca memoria. Para una versión final VR/Cardboard conviene reducirlo a una versión `low-poly` o decimada.
