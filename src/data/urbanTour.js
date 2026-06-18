export const MODEL_INFO = {
  file: "/models/maqueta-urbana.glb",
  sourceName: "city_park_at_sunset.glb",
  bounds: {
    min: [-26.32, -0.02, -33.18],
    max: [26.33, 12.04, 35.56],
  },
  notes:
    "Modelo de parque urbano con fuente central, corredores principales, accesos, muros perimetrales y zonas arboladas.",
};

export const TOUR_MODES = [
  {
    id: "maqueta",
    label: "Vista maqueta",
    description:
      "Vista superior para leer la forma general del parque, sus accesos, fuente central y ejes de recorrido.",
    startPointId: "inicio",
  },
  {
    id: "peatonal",
    label: "Vista peatonal",
    description:
      "Vista a nivel de usuario para recorrer la fuente, los senderos, las zonas verdes y el equipamiento.",
    startPointId: "plaza-central",
  },
  {
    id: "guiada",
    label: "Vista guiada",
    description:
      "Secuencia ordenada por los puntos más claros del modelo city_park_at_sunset.glb.",
    startPointId: "inicio",
  },
];

export const TOUR_POINTS = [
  {
    id: "inicio",
    title: "Inicio del proyecto",
    description:
      "Vista aérea inicial del parque completo. Permite ubicar el perímetro, los accesos y la plaza central.",
    hotspotPosition: "0 4.4 28",
    cameraRigPosition: "0 25 54",
    cameraLookAt: "0 1.2 0",
    modes: ["maqueta", "guiada"],
    order: 1,
  },
  {
    id: "plaza-central",
    title: "Plaza central",
    description:
      "Punto principal del recorrido: fuente circular y espacio de estancia en el centro de la maqueta.",
    hotspotPosition: "0 2.9 0",
    cameraRigPosition: "0 1.65 9.5",
    cameraLookAt: "0 1.35 0",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 2,
  },
  {
    id: "corredor-peatonal",
    title: "Corredor peatonal",
    description:
      "Eje peatonal longitudinal que conecta la zona central con el acceso norte del parque.",
    hotspotPosition: "0 2.7 21",
    cameraRigPosition: "0 1.65 25.5",
    cameraLookAt: "0 1.35 9",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 3,
  },
  {
    id: "ciclovia",
    title: "Ciclovía / sendero lateral",
    description:
      "Recorrido lateral izquierdo usado como ejemplo para movilidad activa dentro del parque.",
    hotspotPosition: "-19.5 2.7 -16",
    cameraRigPosition: "-22.5 1.65 -23",
    cameraLookAt: "-17 1.35 -13",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 4,
  },
  {
    id: "paradero",
    title: "Paradero de transporte / acceso",
    description:
      "Punto de acceso lateral que puede funcionar como llegada, espera o conexión con transporte público.",
    hotspotPosition: "23.5 2.7 2.5",
    cameraRigPosition: "21.5 1.65 7.5",
    cameraLookAt: "25 1.35 0",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 5,
  },
  {
    id: "area-verde",
    title: "Área verde",
    description:
      "Zona arbolada al noreste del modelo, útil para explicar sombra, paisaje y permanencia.",
    hotspotPosition: "22.5 4.4 23.5",
    cameraRigPosition: "18.5 1.65 18",
    cameraLookAt: "23.5 2.4 25.5",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 6,
  },
  {
    id: "equipamiento",
    title: "Equipamiento urbano",
    description:
      "Área próxima a la fuente con mobiliario, bancas y elementos de apoyo para los usuarios.",
    hotspotPosition: "-4.5 2.7 3.5",
    cameraRigPosition: "-7 1.65 6",
    cameraLookAt: "0 1.35 0",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 7,
  },
  {
    id: "vista-final",
    title: "Vista general final",
    description:
      "Cierre del recorrido con una lectura panorámica del parque y sus ejes principales.",
    hotspotPosition: "0 4.4 -29",
    cameraRigPosition: "-34 22 -48",
    cameraLookAt: "0 1.2 0",
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
