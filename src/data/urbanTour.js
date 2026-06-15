export const TOUR_MODES = [
  {
    id: "maqueta",
    label: "Vista maqueta",
    description: "Vista superior para entender la forma general del proyecto.",
    startPointId: "inicio",
  },
  {
    id: "peatonal",
    label: "Vista peatonal",
    description: "Vista a nivel de calle para recorrer plazas, corredores y equipamiento.",
    startPointId: "plaza-central",
  },
  {
    id: "guiada",
    label: "Vista guiada",
    description: "Secuencia ordenada por puntos estratégicos del proyecto.",
    startPointId: "inicio",
  },
];

export const TOUR_POINTS = [
  {
    id: "inicio",
    title: "Inicio del proyecto",
    description: "Vista inicial para ubicar el proyecto urbano completo.",
    hotspotPosition: "0 3.8 -4.2",
    cameraRigPosition: "0 8 14",
    cameraRotation: "-22 180 0",
    modes: ["maqueta", "guiada"],
    order: 1,
  },
  {
    id: "plaza-central",
    title: "Plaza central",
    description: "Espacio público principal de convivencia y estancia.",
    hotspotPosition: "0 2.4 -5.4",
    cameraRigPosition: "0 1.6 -1.2",
    cameraRotation: "0 180 0",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 2,
  },
  {
    id: "corredor-peatonal",
    title: "Corredor peatonal",
    description: "Eje de conexión peatonal entre zonas del proyecto.",
    hotspotPosition: "2.9 2.3 -6.2",
    cameraRigPosition: "2.4 1.6 -4.1",
    cameraRotation: "0 160 0",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 3,
  },
  {
    id: "ciclovia",
    title: "Ciclovía",
    description: "Infraestructura para movilidad activa y conexión ciclista.",
    hotspotPosition: "-3.2 2.2 -6.3",
    cameraRigPosition: "-2.8 1.6 -4.4",
    cameraRotation: "0 210 0",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 4,
  },
  {
    id: "paradero",
    title: "Paradero de transporte",
    description: "Nodo de espera y transferencia con transporte público.",
    hotspotPosition: "4.4 2.2 -4.9",
    cameraRigPosition: "3.8 1.6 -3.4",
    cameraRotation: "0 140 0",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 5,
  },
  {
    id: "area-verde",
    title: "Área verde",
    description: "Zona de vegetación, sombra y estancia urbana.",
    hotspotPosition: "-4.5 2.3 -4.5",
    cameraRigPosition: "-3.8 1.6 -2.8",
    cameraRotation: "0 220 0",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 6,
  },
  {
    id: "equipamiento",
    title: "Equipamiento urbano",
    description: "Mobiliario, bancas, luminarias y elementos de apoyo urbano.",
    hotspotPosition: "1.25 2.25 -7.45",
    cameraRigPosition: "1.1 1.6 -5.75",
    cameraRotation: "0 180 0",
    modes: ["maqueta", "peatonal", "guiada"],
    order: 7,
  },
  {
    id: "vista-final",
    title: "Vista general final",
    description: "Cierre del recorrido con una vista amplia de toda la maqueta.",
    hotspotPosition: "0 4.25 -9.2",
    cameraRigPosition: "0 9.5 18",
    cameraRotation: "-25 180 0",
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
