export const MODEL_INFO = {
  file: "/models/maqueta-urbana.glb",
  sourceName: "urbana.glb",
  modelPosition: "0 -6.235643 0",
  modelRotation: "0 0 0",
  modelScale: "1 1 1",
  bounds: {
    min: [-16.55884171, 5.42677116, -30.65447235],
    max: [9.35380268, 8.90506458, 30.04634666],
  },
  extents: [25.91264439, 3.47829342, 60.70081902],
  notes:
    "Modelo de corredor/parque urbano alargado. El GLB viene como una sola malla llamada PRUEVA, sin nombres semánticos por elemento; los puntos se ajustaron por lectura espacial de la geometría visible.",
};

export const TOUR_MODES = [
  {
    id: "maqueta",
    label: "Vista maqueta",
    description:
      "Vista superior para leer la forma general del modelo, su eje principal, accesos, zonas verdes y plataforma lateral.",
    startPointId: "inicio",
  },
  {
    id: "peatonal",
    label: "Vista peatonal",
    description:
      "Vista a nivel de usuario para recorrer los nodos, senderos y áreas de equipamiento detectadas en la maqueta.",
    startPointId: "plaza-central",
  },
  {
    id: "guiada",
    label: "Vista guiada",
    description:
      "Secuencia ordenada por los puntos principales ajustados al modelo urbana.glb.",
    startPointId: "inicio",
  },
];

export const TOUR_POINTS = [
  {
    id: "inicio",
    title: "Inicio del proyecto",
    description:
      "Vista aérea inicial del corredor completo. Permite ubicar el eje longitudinal, la plataforma lateral, las áreas verdes y los accesos del modelo.",
    hotspotPosition: "-4.0 4.2 28.0",
    cameraRigPosition: "0.0 18.0 46.0",
    cameraLookAt: "-4.5 0.8 0.0",
    mobileCameraRigPosition: "0.0 24.0 62.0",
    mobileCameraLookAt: "-4.8 0.9 0.0",
    modes: ["maqueta", "guiada"],
    order: 1,
  },
  {
    id: "plaza-central",
    title: "Plaza central",
    description:
      "Nodo circular visible hacia el costado poniente de la maqueta. Se usa como punto de estancia/plaza dentro del recorrido.",
    hotspotPosition: "-11.3 2.2 3.4",
    cameraRigPosition: "-13.8 1.65 8.0",
    cameraLookAt: "-11.3 1.0 3.4",
    mobileCameraRigPosition: "-17.2 2.35 11.8",
    mobileCameraLookAt: "-11.3 1.15 3.4",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 2,
  },
  {
    id: "corredor-peatonal",
    title: "Corredor peatonal",
    description:
      "Eje peatonal principal que cruza la maqueta de sur a norte y conecta los nodos centrales con la zona superior.",
    hotspotPosition: "-3.5 2.2 13.5",
    cameraRigPosition: "-5.2 1.65 19.0",
    cameraLookAt: "-3.5 1.0 9.0",
    mobileCameraRigPosition: "-6.4 2.45 25.5",
    mobileCameraLookAt: "-3.5 1.15 9.0",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 3,
  },
  {
    id: "ciclovia",
    title: "Ciclovía / plataforma lateral",
    description:
      "Elemento rectangular elevado al oriente del modelo. Se asigna como ciclovía o pista lineal porque es la pieza longitudinal más clara para movilidad activa.",
    hotspotPosition: "2.1 4.0 3.8",
    cameraRigPosition: "6.8 3.25 9.5",
    cameraLookAt: "2.1 2.65 3.8",
    mobileCameraRigPosition: "10.8 4.8 13.8",
    mobileCameraLookAt: "2.1 2.75 3.8",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 4,
  },
  {
    id: "paradero",
    title: "Paradero de transporte / acceso sur",
    description:
      "Punto de llegada en el extremo sur del modelo. No se detecta un paradero como objeto separado, por eso se ajusta al acceso más claro del recorrido.",
    hotspotPosition: "-11.2 2.2 -25.5",
    cameraRigPosition: "-13.8 1.65 -29.2",
    cameraLookAt: "-11.2 1.0 -25.5",
    mobileCameraRigPosition: "-16.2 2.35 -33.6",
    mobileCameraLookAt: "-11.2 1.15 -25.5",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 5,
  },
  {
    id: "area-verde",
    title: "Área verde",
    description:
      "Zona amplia del costado poniente/norte. Funciona como punto para explicar paisaje, sombra y espacios abiertos del proyecto.",
    hotspotPosition: "-13.2 2.2 16.0",
    cameraRigPosition: "-15.6 1.65 20.5",
    cameraLookAt: "-13.2 1.0 16.0",
    mobileCameraRigPosition: "-19.0 2.55 24.6",
    mobileCameraLookAt: "-13.2 1.15 16.0",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 6,
  },
  {
    id: "equipamiento",
    title: "Equipamiento urbano",
    description:
      "Conjunto lineal visible en el costado poniente medio. Se usa para representar bancas, mobiliario o elementos de apoyo urbano.",
    hotspotPosition: "-12.2 2.2 -7.3",
    cameraRigPosition: "-14.4 1.65 -11.2",
    cameraLookAt: "-12.2 1.0 -7.3",
    mobileCameraRigPosition: "-17.0 2.35 -14.8",
    mobileCameraLookAt: "-12.2 1.15 -7.3",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 7,
  },
  {
    id: "vista-final",
    title: "Vista general final",
    description:
      "Cierre del recorrido con una lectura panorámica desde el extremo sur, mostrando la longitud completa de la intervención.",
    hotspotPosition: "-4.0 4.2 -28.5",
    cameraRigPosition: "8.5 18.0 -45.0",
    cameraLookAt: "-4.5 0.8 0.0",
    mobileCameraRigPosition: "13.5 24.0 -62.0",
    mobileCameraLookAt: "-4.8 0.9 0.0",
    modes: ["maqueta", "guiada"],
    order: 8,
  },
];

export function getNextGuidedPoint(currentPointId) {
  const guided = TOUR_POINTS.filter((point) => point.modes.includes("guiada")).sort(
    (a, b) => a.order - b.order
  );

  const currentIndex = guided.findIndex((point) => point.id === currentPointId);
  const nextIndex = currentIndex >= guided.length - 1 ? 0 : currentIndex + 1;

  return guided[nextIndex];
}

export function getPreviousGuidedPoint(currentPointId) {
  const guided = TOUR_POINTS.filter((point) => point.modes.includes("guiada")).sort(
    (a, b) => a.order - b.order
  );

  const currentIndex = guided.findIndex((point) => point.id === currentPointId);
  const previousIndex = currentIndex <= 0 ? guided.length - 1 : currentIndex - 1;

  return guided[previousIndex];
}
