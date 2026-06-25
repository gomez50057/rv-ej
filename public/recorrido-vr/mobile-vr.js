(function () {
  "use strict";

  const FUSE_TIMEOUT_MS = 1300;
  const MODEL_POSITION = "0 -6.235643 0";

  const TOUR_MODES = [
    {
      id: "maqueta",
      label: "Vista maqueta",
      shortLabel: "Maqueta",
      description:
        "Vista superior para leer la forma general del corredor, accesos, plataforma lateral y zonas abiertas.",
      startPointId: "inicio",
    },
    {
      id: "peatonal",
      label: "Vista peatonal",
      shortLabel: "Peatonal",
      description:
        "Vista a nivel de usuario para recorrer nodos, senderos, estancias y equipamiento.",
      startPointId: "plaza-central",
    },
    {
      id: "guiada",
      label: "Vista guiada",
      shortLabel: "Guiada",
      description:
        "Secuencia ordenada para explicar el proyecto punto por punto sin que el usuario se pierda.",
      startPointId: "inicio",
    },
  ];

  const TOUR_POINTS = [
    {
      id: "inicio",
      title: "Inicio del proyecto",
      shortTitle: "Inicio",
      description:
        "Vista aérea inicial del corredor completo. Permite ubicar el eje longitudinal, la plataforma lateral, las áreas verdes y los accesos.",
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
      shortTitle: "Plaza",
      description:
        "Nodo circular hacia el costado poniente de la maqueta. Funciona como punto principal de estancia y encuentro.",
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
      shortTitle: "Corredor",
      description:
        "Eje peatonal principal que cruza la maqueta y conecta los nodos centrales con la zona norte.",
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
      shortTitle: "Ciclovía",
      description:
        "Pieza longitudinal al oriente del modelo. Se interpreta como ciclovía o plataforma de movilidad activa.",
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
      shortTitle: "Acceso sur",
      description:
        "Punto de llegada en el extremo sur. Se usa como acceso/paradero porque es el remate más claro del recorrido.",
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
      shortTitle: "Área verde",
      description:
        "Zona amplia del costado poniente/norte. Sirve para explicar paisaje, sombra, estancia y espacios abiertos.",
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
      shortTitle: "Equipamiento",
      description:
        "Conjunto lineal del costado poniente medio. Se interpreta como mobiliario, bancas o elementos de apoyo urbano.",
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
      shortTitle: "Vista final",
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

  let activeMode = "maqueta";
  let activePointId = "inicio";
  let isLensMode = false;
  let infoVisible = false;

  const $ = (selector) => document.querySelector(selector);

  function setStatus(message) {
    const el = $("#boot-status");
    if (el) el.textContent = message;
  }

  function isMobileLike() {
    return (
      window.matchMedia("(max-width: 900px)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    );
  }

  function isSmallScreen() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function parseVec3(value) {
    const parts = String(value).trim().split(/\s+/).map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return { x: parts[0], y: parts[1], z: parts[2] };
  }

  function stringifyVec3(v) {
    return `${v.x.toFixed(3)} ${v.y.toFixed(3)} ${v.z.toFixed(3)}`;
  }

  function normalize(v) {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 0.0001;
    return { x: v.x / length, y: v.y / length, z: v.z / length };
  }

  function cross(a, b) {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x,
    };
  }

  function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
  }

  function sub(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  }

  function scale(v, amount) {
    return { x: v.x * amount, y: v.y * amount, z: v.z * amount };
  }

  function getRotationToLookAt(positionValue, targetValue) {
    const position = parseVec3(positionValue);
    const target = parseVec3(targetValue);
    if (!position || !target) return "0 0 0";

    const dx = target.x - position.x;
    const dy = target.y - position.y;
    const dz = target.z - position.z;
    const horizontal = Math.sqrt(dx * dx + dz * dz) || 0.0001;
    const pitch = Math.atan2(dy, horizontal) * (180 / Math.PI);
    const yaw = Math.atan2(-dx, -dz) * (180 / Math.PI);

    return `${pitch.toFixed(2)} ${yaw.toFixed(2)} 0`;
  }

  function getActivePoint() {
    return TOUR_POINTS.find((point) => point.id === activePointId) || TOUR_POINTS[0];
  }

  function getActiveMode() {
    return TOUR_MODES.find((mode) => mode.id === activeMode) || TOUR_MODES[0];
  }

  function getVisiblePoints() {
    return TOUR_POINTS.filter((point) => point.modes.includes(activeMode)).sort(
      (a, b) => a.order - b.order
    );
  }

  function getActiveVisibleIndex() {
    const visible = getVisiblePoints();
    return Math.max(0, visible.findIndex((point) => point.id === activePointId));
  }

  function getNextPoint() {
    const visible = getVisiblePoints();
    const index = getActiveVisibleIndex();
    return visible[index >= visible.length - 1 ? 0 : index + 1] || TOUR_POINTS[0];
  }

  function getPreviousPoint() {
    const visible = getVisiblePoints();
    const index = getActiveVisibleIndex();
    return visible[index <= 0 ? visible.length - 1 : index - 1] || TOUR_POINTS[0];
  }

  function getNextMode() {
    const index = TOUR_MODES.findIndex((mode) => mode.id === activeMode);
    return TOUR_MODES[index >= TOUR_MODES.length - 1 ? 0 : index + 1] || TOUR_MODES[0];
  }

  function getCameraRigPosition(point) {
    if (!point) return "0 24 62";
    return isMobileLike()
      ? point.mobileCameraRigPosition || point.cameraRigPosition
      : point.cameraRigPosition;
  }

  function getCameraLookAt(point) {
    if (!point) return "0 0 0";
    return isMobileLike()
      ? point.mobileCameraLookAt || point.cameraLookAt
      : point.cameraLookAt;
  }

  function syncViewportClasses() {
    document.body.classList.toggle("mobile-ui", isSmallScreen());
    document.body.classList.toggle("landscape-ui", window.matchMedia("(orientation: landscape)").matches);
  }

  function showApp() {
    $("#boot")?.classList.add("is-hidden");
    $("#app")?.classList.remove("is-hidden");
  }

  function showFatal(message) {
    setStatus(message);
    const bootCard = document.querySelector(".boot-card");
    if (!bootCard) return;

    const debug = document.createElement("pre");
    debug.className = "debug-block";
    debug.textContent = JSON.stringify(
      {
        href: location.href,
        protocol: location.protocol,
        isSecureContext: window.isSecureContext,
        hasAframe: Boolean(window.AFRAME),
        aframeVersion: window.AFRAME && window.AFRAME.version,
        userAgent: navigator.userAgent,
      },
      null,
      2
    );
    bootCard.appendChild(debug);
  }

  function registerComponents() {
    if (!window.AFRAME) return false;

    if (!AFRAME.components["gaze-action"]) {
      AFRAME.registerComponent("gaze-action", {
        schema: {
          action: { type: "string" },
          targetId: { type: "string", default: "" },
          modeId: { type: "string", default: "" },
        },
        init: function () {
          this.onClick = () => runGazeAction(this.data.action, this.data);
          this.onEnter = () => this.el.emit("gaze-target-entered");
          this.onLeave = () => this.el.emit("gaze-target-left");
          this.el.addEventListener("click", this.onClick);
          this.el.addEventListener("mouseenter", this.onEnter);
          this.el.addEventListener("mouseleave", this.onLeave);
        },
        remove: function () {
          this.el.removeEventListener("click", this.onClick);
          this.el.removeEventListener("mouseenter", this.onEnter);
          this.el.removeEventListener("mouseleave", this.onLeave);
        },
      });
    }

    if (!AFRAME.components["look-at-camera"]) {
      AFRAME.registerComponent("look-at-camera", {
        init: function () {
          this.target = new AFRAME.THREE.Vector3();
        },
        tick: function () {
          const camera = document.querySelector("[camera]");
          if (!camera || !this.target) return;
          camera.object3D.getWorldPosition(this.target);
          this.el.object3D.lookAt(this.target);
        },
      });
    }

    return true;
  }

  function createText(value, position, width, color = "#ffffff", align = "center") {
    const text = document.createElement("a-text");
    text.setAttribute("value", value);
    text.setAttribute("align", align);
    text.setAttribute("position", position);
    text.setAttribute("color", color);
    text.setAttribute("width", width);
    text.setAttribute("side", "double");
    return text;
  }

  function createGazeButton({ label, sublabel = "", action, targetId = "", modeId = "", position, color = "#691b32", scaleValue = "1 1 1" }) {
    const wrapper = document.createElement("a-entity");
    wrapper.setAttribute("position", position);
    wrapper.setAttribute("scale", scaleValue);
    wrapper.setAttribute("look-at-camera", "");

    const disc = document.createElement("a-circle");
    disc.setAttribute("radius", "0.44");
    disc.setAttribute("color", color);
    disc.setAttribute("opacity", "0.94");
    disc.setAttribute("material", "transparent: true; shader: flat");
    disc.setAttribute("class", "clickable");
    disc.setAttribute("gaze-action", `action: ${action}; targetId: ${targetId}; modeId: ${modeId}`);
    disc.setAttribute(
      "animation__enter",
      `property: scale; startEvents: gaze-target-entered; from: 1 1 1; to: 1.18 1.18 1.18; dur: ${FUSE_TIMEOUT_MS}; easing: linear`
    );
    disc.setAttribute(
      "animation__leave",
      "property: scale; startEvents: gaze-target-left; to: 1 1 1; dur: 120; easing: easeOutQuad"
    );
    disc.setAttribute(
      "animation__click",
      "property: scale; startEvents: click; to: 0.82 0.82 0.82; dur: 100; dir: alternate; easing: easeOutQuad"
    );

    const ring = document.createElement("a-ring");
    ring.setAttribute("radius-inner", "0.46");
    ring.setAttribute("radius-outer", "0.51");
    ring.setAttribute("color", "#dec9a3");
    ring.setAttribute("opacity", "0.85");
    ring.setAttribute("material", "transparent: true; shader: flat");
    ring.setAttribute("position", "0 0 0.01");

    const labelText = createText(label, "0 0.045 0.025", "1.42", "#ffffff");
    const subText = createText(sublabel, "0 -0.16 0.025", "1.12", "#dec9a3");

    wrapper.appendChild(disc);
    wrapper.appendChild(ring);
    wrapper.appendChild(labelText);
    if (sublabel) wrapper.appendChild(subText);
    return wrapper;
  }

  function updateHotspotColors() {
    document.querySelectorAll("[data-point-sphere]").forEach((sphere) => {
      const isActive = sphere.dataset.pointId === activePointId;
      sphere.setAttribute("color", isActive ? "#bc955b" : "#691b32");
      sphere.setAttribute("radius", isActive ? "0.48" : "0.38");
    });
  }

  function renderHotspots() {
    const container = $("#hotspots");
    if (!container) return;
    container.innerHTML = "";

    getVisiblePoints().forEach((point) => {
      const wrapper = document.createElement("a-entity");
      wrapper.setAttribute("position", point.hotspotPosition);
      wrapper.setAttribute("look-at-camera", "");

      const sphere = document.createElement("a-sphere");
      sphere.setAttribute("radius", point.id === activePointId ? "0.48" : "0.38");
      sphere.setAttribute("color", point.id === activePointId ? "#bc955b" : "#691b32");
      sphere.setAttribute("class", "clickable");
      sphere.setAttribute("gaze-action", `action: point; targetId: ${point.id}`);
      sphere.setAttribute("animation__float", "property: position; dir: alternate; dur: 1050; easing: easeInOutSine; loop: true; to: 0 0.16 0");
      sphere.setAttribute("animation__enter", `property: scale; startEvents: gaze-target-entered; to: 1.34 1.34 1.34; dur: ${FUSE_TIMEOUT_MS}; easing: linear`);
      sphere.setAttribute("animation__leave", "property: scale; startEvents: gaze-target-left; to: 1 1 1; dur: 120; easing: easeOutQuad");
      sphere.dataset.pointSphere = "true";
      sphere.dataset.pointId = point.id;

      const ring = document.createElement("a-ring");
      ring.setAttribute("radius-inner", "0.48");
      ring.setAttribute("radius-outer", "0.54");
      ring.setAttribute("color", "#dec9a3");
      ring.setAttribute("position", "0 0 0.02");
      ring.setAttribute("opacity", point.id === activePointId ? "0.95" : "0.55");
      ring.setAttribute("material", "transparent: true; shader: flat");

      const labelPlane = document.createElement("a-plane");
      labelPlane.setAttribute("width", "2.35");
      labelPlane.setAttribute("height", "0.42");
      labelPlane.setAttribute("position", "0 0.86 0");
      labelPlane.setAttribute("color", "#000000");
      labelPlane.setAttribute("opacity", "0.48");
      labelPlane.setAttribute("material", "transparent: true; shader: flat");

      const label = createText(point.shortTitle || point.title, "0 0.87 0.03", "2.1");

      wrapper.appendChild(sphere);
      wrapper.appendChild(ring);
      wrapper.appendChild(labelPlane);
      wrapper.appendChild(label);
      container.appendChild(wrapper);
    });
  }

  function getControlLayout() {
    const point = getActivePoint();
    const cameraPosition = parseVec3(getCameraRigPosition(point));
    const lookAt = parseVec3(getCameraLookAt(point));
    if (!cameraPosition || !lookAt) return [];

    const forward = normalize(sub(lookAt, cameraPosition));
    const worldUp = { x: 0, y: 1, z: 0 };
    const right = normalize(cross(forward, worldUp));
    const up = normalize(cross(right, forward));
    const distance = isMobileLike() ? 5.4 : 4.8;
    const center = add(cameraPosition, scale(forward, distance));

    function place(rightOffset, upOffset, forwardOffset = 0) {
      return stringifyVec3(add(add(add(center, scale(right, rightOffset)), scale(up, upOffset)), scale(forward, forwardOffset)));
    }

    return [
      {
        label: "Anterior",
        sublabel: "mirar",
        action: "previous",
        color: "#333842",
        position: place(-1.55, -0.25),
      },
      {
        label: "Siguiente",
        sublabel: "mirar",
        action: "next",
        color: "#691b32",
        position: place(1.55, -0.25),
      },
      {
        label: "Info",
        sublabel: infoVisible ? "cerrar" : "abrir",
        action: "info",
        color: "#bc955b",
        position: place(0, 0.92),
      },
      {
        label: "Cambiar",
        sublabel: getNextMode().shortLabel,
        action: "cycle-mode",
        color: "#355c5d",
        position: place(0, -1.35),
      },
      {
        label: "Inicio",
        sublabel: getActiveMode().shortLabel,
        action: "home",
        color: "#5a3e73",
        position: place(-2.8, 0.72, 0.15),
        scaleValue: "0.84 0.84 0.84",
      },
    ];
  }

  function renderVRControls() {
    const container = $("#vr-actions");
    if (!container) return;
    container.innerHTML = "";

    getControlLayout().forEach((config) => {
      container.appendChild(createGazeButton(config));
    });
  }

  function updateVRInfoCard() {
    const card = $("#vr-info-card");
    if (!card) return;
    card.innerHTML = "";
    card.setAttribute("visible", infoVisible ? "true" : "false");
    if (!infoVisible) return;

    const point = getActivePoint();
    const cameraPosition = parseVec3(getCameraRigPosition(point));
    const lookAt = parseVec3(getCameraLookAt(point));
    if (!cameraPosition || !lookAt) return;

    const forward = normalize(sub(lookAt, cameraPosition));
    const worldUp = { x: 0, y: 1, z: 0 };
    const right = normalize(cross(forward, worldUp));
    const up = normalize(cross(right, forward));
    const center = add(add(cameraPosition, scale(forward, isMobileLike() ? 5.2 : 4.8)), scale(up, 1.82));

    card.setAttribute("position", stringifyVec3(center));

    const plane = document.createElement("a-plane");
    plane.setAttribute("width", "4.5");
    plane.setAttribute("height", "1.48");
    plane.setAttribute("color", "#050505");
    plane.setAttribute("opacity", "0.72");
    plane.setAttribute("material", "transparent: true; shader: flat");

    const title = createText(point.title, "0 0.43 0.02", "4.0", "#dec9a3");
    const body = createText(point.description, "0 0.02 0.02", "4.0", "#ffffff");
    const hint = createText("Mira Info para cerrar", "0 -0.52 0.02", "3.4", "#bc955b");

    card.appendChild(plane);
    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(hint);
  }

  function updateMiniHud() {
    const label = $("#vr-point-label");
    const point = getActivePoint();
    const visible = getVisiblePoints();
    const index = getActiveVisibleIndex() + 1;
    if (label) {
      label.setAttribute("value", `${index}/${visible.length} · ${point.shortTitle || point.title}`);
    }
  }

  function renderModeButtons() {
    const container = $("#mode-buttons");
    if (!container) return;
    container.innerHTML = "";

    TOUR_MODES.forEach((mode) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `mode-button${mode.id === activeMode ? " active" : ""}`;
      button.dataset.modeId = mode.id;
      button.textContent = mode.label;
      button.addEventListener("click", () => switchMode(mode.id));
      container.appendChild(button);
    });
  }

  function renderPointList() {
    const container = $("#point-list");
    if (!container) return;
    container.innerHTML = "";

    getVisiblePoints().forEach((point) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `point-item${point.id === activePointId ? " active" : ""}`;
      button.textContent = `${point.order}. ${point.title}`;
      button.addEventListener("click", () => goToPoint(point.id));
      container.appendChild(button);
    });
  }

  function setToggleButtonLabel() {
    const overlay = $("#overlay");
    const button = $("#toggle-panel");
    if (!overlay || !button) return;
    const compact = overlay.classList.contains("compact");
    button.textContent = compact ? "Controles" : "Ocultar";
    button.setAttribute("aria-expanded", String(!compact));
  }

  function updateUI() {
    const point = getActivePoint();
    const visible = getVisiblePoints();
    const index = getActiveVisibleIndex() + 1;
    const mode = getActiveMode();

    const title = $("#point-title");
    const description = $("#point-description");
    const pointIndex = $("#point-index");
    const modeHelp = $("#mode-help");

    if (title) title.textContent = point.title;
    if (description) description.textContent = point.description;
    if (pointIndex) pointIndex.textContent = `${index} / ${visible.length}`;
    if (modeHelp) modeHelp.textContent = mode.description;

    document.querySelectorAll(".mode-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.modeId === activeMode);
    });

    renderPointList();
    updateHotspotColors();
    updateMiniHud();
    renderVRControls();
    updateVRInfoCard();
  }

  function moveCameraToPoint(point, immediate = false) {
    const rig = $("#camera-rig");
    const viewOffset = $("#view-offset");
    if (!rig || !viewOffset || !point) return;

    const position = getCameraRigPosition(point);
    const lookAt = getCameraLookAt(point);
    const rotation = getRotationToLookAt(position, lookAt);

    if (immediate) {
      rig.setAttribute("position", position);
      viewOffset.setAttribute("rotation", rotation);
      renderVRControls();
      updateVRInfoCard();
      return;
    }

    rig.setAttribute("animation__move", {
      property: "position",
      to: position,
      dur: 900,
      easing: "easeInOutQuad",
    });

    viewOffset.setAttribute("animation__rotate", {
      property: "rotation",
      to: rotation,
      dur: 900,
      easing: "easeInOutQuad",
    });

    window.setTimeout(() => {
      renderVRControls();
      updateVRInfoCard();
    }, 940);
  }

  function goToPoint(pointId, immediate = false) {
    const point = TOUR_POINTS.find((item) => item.id === pointId);
    if (!point) return;
    activePointId = point.id;
    infoVisible = false;
    updateUI();
    moveCameraToPoint(point, immediate);
  }

  function switchMode(modeId) {
    const mode = TOUR_MODES.find((item) => item.id === modeId);
    if (!mode) return;
    activeMode = mode.id;
    activePointId = mode.startPointId;
    infoVisible = false;
    renderModeButtons();
    renderHotspots();
    updateUI();
    moveCameraToPoint(getActivePoint());
  }

  function cycleMode() {
    switchMode(getNextMode().id);
  }

  function runGazeAction(action, data) {
    switch (action) {
      case "point":
        goToPoint(data.targetId);
        break;
      case "next":
        goToPoint(getNextPoint().id);
        break;
      case "previous":
        goToPoint(getPreviousPoint().id);
        break;
      case "info":
        infoVisible = !infoVisible;
        updateUI();
        break;
      case "cycle-mode":
        cycleMode();
        break;
      case "home":
        goToPoint(getActiveMode().startPointId);
        break;
      default:
        break;
    }
  }

  async function requestMobileFullscreen() {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {}

    try {
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock("landscape");
      }
    } catch (error) {}
  }

  async function toggleLensMode() {
    const scene = $("#scene");
    const button = $("#lens-button");
    const message = $("#lens-message");
    const overlay = $("#overlay");
    if (!scene) return;

    if (isLensMode) {
      try {
        if (typeof scene.exitVR === "function") scene.exitVR();
      } catch (error) {}
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch (error) {}
      isLensMode = false;
      document.body.classList.remove("lens-mode");
      if (button) button.textContent = "Entrar modo lentes / Cardboard";
      if (message) message.textContent = "Modo lentes desactivado. Puedes volver a entrar cuando quieras.";
      if (overlay && !isSmallScreen()) overlay.classList.remove("compact");
      setToggleButtonLabel();
      return;
    }

    if (overlay) overlay.classList.add("compact");
    setToggleButtonLabel();
    document.body.classList.add("lens-mode");
    if (button) button.textContent = "Salir de modo lentes";
    if (message) message.textContent = "En lentes: mira Siguiente, Anterior, Info o Cambiar vista.";

    await requestMobileFullscreen();

    try {
      if (typeof scene.enterVR === "function") {
        scene.enterVR();
      }
      isLensMode = true;
    } catch (error) {
      isLensMode = false;
      document.body.classList.remove("lens-mode");
      if (button) button.textContent = "Entrar modo lentes / Cardboard";
      if (message) {
        message.textContent =
          "El navegador bloqueó Cardboard. Prueba con HTTPS, Android Chrome/Samsung Internet y permisos de sensores.";
      }
    }
  }

  function attachEvents() {
    const overlay = $("#overlay");
    const toggle = $("#toggle-panel");
    const previous = $("#previous-point");
    const next = $("#next-point");
    const lens = $("#lens-button");
    const scene = $("#scene");
    const model = $("#urban-model");
    const modelPill = $("#model-pill");

    toggle?.addEventListener("click", () => {
      overlay?.classList.toggle("compact");
      setToggleButtonLabel();
    });

    previous?.addEventListener("click", () => goToPoint(getPreviousPoint().id));
    next?.addEventListener("click", () => goToPoint(getNextPoint().id));
    lens?.addEventListener("click", toggleLensMode);

    model?.addEventListener("model-loaded", () => {
      modelPill?.classList.add("is-hidden");
      goToPoint(activePointId, true);
    });

    model?.addEventListener("model-error", () => {
      if (!modelPill) return;
      modelPill.classList.add("error");
      modelPill.textContent =
        "No se pudo cargar /models/maqueta-urbana.glb. Abre esa ruta desde el teléfono para verificar red, IP o firewall.";
    });

    scene?.addEventListener("enter-vr", () => {
      isLensMode = true;
      document.body.classList.add("lens-mode");
      overlay?.classList.add("compact");
      if (lens) lens.textContent = "Salir de modo lentes";
      setToggleButtonLabel();
    });

    scene?.addEventListener("exit-vr", () => {
      isLensMode = false;
      document.body.classList.remove("lens-mode");
      if (lens) lens.textContent = "Entrar modo lentes / Cardboard";
      setToggleButtonLabel();
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      syncViewportClasses();
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => moveCameraToPoint(getActivePoint(), true), 180);
    });

    window.addEventListener("orientationchange", () => {
      window.setTimeout(() => {
        syncViewportClasses();
        moveCameraToPoint(getActivePoint(), true);
      }, 320);
    });
  }

  function init() {
    syncViewportClasses();
    setStatus("Buscando A-Frame local...");

    if (!window.AFRAME) {
      showFatal(
        "No se detectó A-Frame. Abre /vendor/aframe-v1.7.1.min.js desde el teléfono. Si no carga, revisa IP, puerto o firewall."
      );
      return;
    }

    setStatus(`A-Frame ${AFRAME.version || "detectado"}. Registrando interacción por mirada...`);

    if (!registerComponents()) {
      showFatal("No fue posible registrar componentes de mirada.");
      return;
    }

    renderModeButtons();
    renderHotspots();
    renderVRControls();
    updateUI();
    attachEvents();

    const overlay = $("#overlay");
    if (overlay && isSmallScreen()) overlay.classList.add("compact");
    setToggleButtonLabel();

    showApp();
    requestAnimationFrame(() => moveCameraToPoint(getActivePoint(), true));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
