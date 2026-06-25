(function () {
  "use strict";

  const TOUR_MODES = [
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

  const TOUR_POINTS = [
    {
      id: "inicio",
      title: "Inicio del proyecto",
      description:
        "Vista aérea inicial del corredor completo. Permite ubicar el eje longitudinal, la plataforma lateral, las áreas verdes y los accesos del modelo.",
      hotspotPosition: "-4.0 4.2 28.0",
      cameraRigPosition: "0.0 18.0 46.0",
      cameraLookAt: "-4.5 0.8 0.0",
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
      modes: ["maqueta", "guiada"],
      order: 8,
    },
  ];

  let activeMode = "maqueta";
  let activePointId = "inicio";
  let isLensMode = false;

  const $ = (selector) => document.querySelector(selector);

  function parseVec3(value) {
    const parts = String(value).trim().split(/\s+/).map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return { x: parts[0], y: parts[1], z: parts[2] };
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

  function getMode() {
    return TOUR_MODES.find((mode) => mode.id === activeMode) || TOUR_MODES[0];
  }

  function getVisiblePoints() {
    return TOUR_POINTS.filter((point) => point.modes.includes(activeMode)).sort(
      (a, b) => a.order - b.order
    );
  }

  function getActivePoint() {
    return TOUR_POINTS.find((point) => point.id === activePointId) || TOUR_POINTS[0];
  }

  function getGuidedPoints() {
    return TOUR_POINTS.filter((point) => point.modes.includes("guiada")).sort(
      (a, b) => a.order - b.order
    );
  }

  function getNextGuidedPoint() {
    const guided = getGuidedPoints();
    const index = guided.findIndex((point) => point.id === activePointId);
    return guided[index >= guided.length - 1 ? 0 : index + 1] || guided[0];
  }

  function getPreviousGuidedPoint() {
    const guided = getGuidedPoints();
    const index = guided.findIndex((point) => point.id === activePointId);
    return guided[index <= 0 ? guided.length - 1 : index - 1] || guided[0];
  }

  function setStatus(message) {
    const bootStatus = $("#boot-status");
    if (bootStatus) bootStatus.textContent = message;
  }

  function updateUI() {
    const activePoint = getActivePoint();
    const mode = getMode();

    $("#point-title").textContent = activePoint.title;
    $("#point-description").textContent = activePoint.description;
    $("#mode-help").textContent = mode.description;

    const vrLabel = $("#vr-point-label");
    if (vrLabel) {
      vrLabel.setAttribute("value", `Punto: ${activePoint.title}`);
    }

    document.querySelectorAll(".mode-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.modeId === activeMode);
    });

    renderPointList();
    updateHotspotColors();
  }

  function moveCameraToPoint(point) {
    const rig = $("#camera-rig");
    const viewOffset = $("#view-offset");
    if (!rig || !viewOffset || !point) return;

    rig.setAttribute("animation__move", {
      property: "position",
      to: point.cameraRigPosition,
      dur: 950,
      easing: "easeInOutQuad",
    });

    const targetRotation = getRotationToLookAt(point.cameraRigPosition, point.cameraLookAt);
    viewOffset.setAttribute("animation__rotate", {
      property: "rotation",
      to: targetRotation,
      dur: 950,
      easing: "easeInOutQuad",
    });
  }

  function goToPoint(pointId) {
    const point = TOUR_POINTS.find((item) => item.id === pointId);
    if (!point) return;
    activePointId = point.id;
    updateUI();
    moveCameraToPoint(point);
  }

  function switchMode(modeId) {
    const mode = TOUR_MODES.find((item) => item.id === modeId);
    if (!mode) return;
    activeMode = mode.id;
    activePointId = mode.startPointId;
    renderHotspots();
    renderModeButtons();
    updateUI();
    moveCameraToPoint(getActivePoint());
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

  function updateHotspotColors() {
    document.querySelectorAll("[data-point-sphere]").forEach((sphere) => {
      const active = sphere.dataset.pointId === activePointId;
      sphere.setAttribute("color", active ? "#bc955b" : "#691b32");
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
      sphere.setAttribute("radius", "0.22");
      sphere.setAttribute("color", point.id === activePointId ? "#bc955b" : "#691b32");
      sphere.setAttribute("class", "clickable");
      sphere.setAttribute("gaze-jump", `targetId: ${point.id}`);
      sphere.setAttribute(
        "animation",
        "property: position; dir: alternate; dur: 900; easing: easeInOutSine; loop: true; to: 0 0.12 0"
      );
      sphere.dataset.pointSphere = "true";
      sphere.dataset.pointId = point.id;

      const label = document.createElement("a-text");
      label.setAttribute("value", point.title);
      label.setAttribute("align", "center");
      label.setAttribute("position", "0 0.52 0");
      label.setAttribute("color", "#ffffff");
      label.setAttribute("width", "3.8");
      label.setAttribute("side", "double");

      wrapper.appendChild(sphere);
      wrapper.appendChild(label);
      container.appendChild(wrapper);
    });
  }

  function registerComponents() {
    if (!window.AFRAME) return false;

    if (!AFRAME.components["gaze-jump"]) {
      AFRAME.registerComponent("gaze-jump", {
        schema: {
          targetId: { type: "string" },
        },
        init: function () {
          this.onClick = () => goToPoint(this.data.targetId);
          this.el.addEventListener("click", this.onClick);
        },
        remove: function () {
          this.el.removeEventListener("click", this.onClick);
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

  async function requestMobileFullscreen() {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      // Móvil puede bloquear fullscreen si no está en HTTPS o si el navegador no lo permite.
    }

    try {
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock("landscape");
      }
    } catch (error) {
      // Orientación no obligatoria.
    }
  }

  async function enterLensMode() {
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
      button.textContent = "Entrar modo lentes / VR";
      message.textContent = "Modo lentes desactivado.";
      overlay.classList.remove("compact");
      return;
    }

    overlay.classList.add("compact");
    button.textContent = "Salir de modo lentes";
    message.textContent = "Activando pantalla completa y VR/Cardboard...";
    await requestMobileFullscreen();

    try {
      if (typeof scene.enterVR === "function") {
        scene.enterVR();
        isLensMode = true;
        message.textContent =
          "Modo lentes solicitado. Si no se divide la pantalla, el navegador bloqueó WebXR; prueba con HTTPS o Samsung Internet/Chrome Android.";
      } else {
        message.textContent = "La escena cargó, pero este navegador no expone enterVR().";
      }
    } catch (error) {
      isLensMode = false;
      button.textContent = "Entrar modo lentes / VR";
      message.textContent =
        "El navegador bloqueó VR/Cardboard. Prueba con HTTPS, Android Chrome/Samsung Internet y permisos de sensores.";
    }
  }

  function showApp() {
    $("#boot").classList.add("is-hidden");
    $("#app").classList.remove("is-hidden");
  }

  function showFatal(message) {
    setStatus(message);
    const bootCard = document.querySelector(".boot-card");
    if (bootCard) {
      const debug = document.createElement("pre");
      debug.style.whiteSpace = "pre-wrap";
      debug.style.textAlign = "left";
      debug.style.marginTop = "16px";
      debug.style.padding = "12px";
      debug.style.borderRadius = "12px";
      debug.style.background = "rgba(0,0,0,.35)";
      debug.textContent = JSON.stringify(
        {
          href: location.href,
          protocol: location.protocol,
          host: location.host,
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
  }

  function init() {
    setStatus("Buscando window.AFRAME...");

    if (!window.AFRAME) {
      showFatal(
        "No se detectó A-Frame. Abre /vendor/aframe-v1.7.1.min.js desde el teléfono. Si no carga, es IP/puerto/firewall; si sí carga, recarga esta página."
      );
      return;
    }

    setStatus(`A-Frame ${AFRAME.version || "detectado"} listo. Registrando componentes...`);
    registerComponents();

    renderModeButtons();
    renderHotspots();
    updateUI();

    const model = $("#urban-model");
    const modelPill = $("#model-pill");
    if (model) {
      model.addEventListener("model-loaded", () => {
        if (modelPill) modelPill.classList.add("is-hidden");
        goToPoint(activePointId);
      });
      model.addEventListener("model-error", () => {
        if (modelPill) {
          modelPill.classList.add("error");
          modelPill.textContent =
            "No se pudo cargar /models/maqueta-urbana.glb desde el teléfono. Prueba abrir esa ruta directamente.";
        }
      });
    }

    $("#toggle-panel").addEventListener("click", () => {
      const overlay = $("#overlay");
      overlay.classList.toggle("compact");
      $("#toggle-panel").textContent = overlay.classList.contains("compact")
        ? "Mostrar panel"
        : "Ocultar panel";
    });

    $("#previous-point").addEventListener("click", () => {
      activeMode = "guiada";
      goToPoint(getPreviousGuidedPoint().id);
      renderModeButtons();
      renderHotspots();
      updateUI();
    });

    $("#next-point").addEventListener("click", () => {
      activeMode = "guiada";
      goToPoint(getNextGuidedPoint().id);
      renderModeButtons();
      renderHotspots();
      updateUI();
    });

    $("#lens-button").addEventListener("click", enterLensMode);

    const scene = $("#scene");
    if (scene) {
      scene.addEventListener("enter-vr", () => {
        isLensMode = true;
        $("#lens-button").textContent = "Salir de modo lentes";
        $("#overlay").classList.add("compact");
      });
      scene.addEventListener("exit-vr", () => {
        isLensMode = false;
        $("#lens-button").textContent = "Entrar modo lentes / VR";
      });
    }

    showApp();
    requestAnimationFrame(() => goToPoint(activePointId));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
