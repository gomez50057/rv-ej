"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./VRUrbanTour.module.css";
import {
  TOUR_MODES,
  TOUR_POINTS,
  getNextGuidedPoint,
  getPreviousGuidedPoint,
} from "@/data/urbanTour";

const AFRAME_CDN = "https://aframe.io/releases/1.7.1/aframe.min.js";

function moveCameraToPoint(point) {
  const rig = document.querySelector("#camera-rig");
  const viewOffset = document.querySelector("#view-offset");

  if (!rig || !viewOffset || !point) return;

  rig.setAttribute("animation__move", {
    property: "position",
    to: point.cameraRigPosition,
    dur: 950,
    easing: "easeInOutQuad",
  });

  viewOffset.setAttribute("animation__rotate", {
    property: "rotation",
    to: point.cameraRotation,
    dur: 950,
    easing: "easeInOutQuad",
  });
}

function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);

    if (existing) {
      if (window.AFRAME) {
        resolve();
        return;
      }

      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function registerAFrameComponents() {
  const AF = window.AFRAME;
  if (!AF) return false;

  if (!AF.components["gaze-jump"]) {
    AF.registerComponent("gaze-jump", {
      schema: {
        targetId: { type: "string" },
      },

      init() {
        this.handleClick = () => {
          window.dispatchEvent(
            new CustomEvent("vr-point-change", {
              detail: {
                pointId: this.data.targetId,
              },
            })
          );
        };

        this.el.addEventListener("click", this.handleClick);
      },

      remove() {
        this.el.removeEventListener("click", this.handleClick);
      },
    });
  }

  if (!AF.components["look-at-camera"]) {
    AF.registerComponent("look-at-camera", {
      tick() {
        const camera = document.querySelector("[camera]");
        if (!camera) return;
        this.el.object3D.lookAt(camera.object3D.getWorldPosition(this.target));
      },

      init() {
        this.target = new window.AFRAME.THREE.Vector3();
      },
    });
  }

  return true;
}

export default function VRUrbanTour() {
  const [aframeStatus, setAframeStatus] = useState("loading");
  const [activeMode, setActiveMode] = useState("maqueta");
  const [activePointId, setActivePointId] = useState("inicio");
  const [uiCompact, setUiCompact] = useState(false);

  const aframeReady = aframeStatus === "ready";
  const aframeFailed = aframeStatus === "error";

  const activeModeConfig = useMemo(
    () => TOUR_MODES.find((mode) => mode.id === activeMode),
    [activeMode]
  );

  const visiblePoints = useMemo(() => {
    return TOUR_POINTS.filter((point) => point.modes.includes(activeMode)).sort(
      (a, b) => a.order - b.order
    );
  }, [activeMode]);

  const activePoint = useMemo(() => {
    return TOUR_POINTS.find((point) => point.id === activePointId);
  }, [activePointId]);

  useEffect(() => {
    let mounted = true;
    let finished = false;

    const finishReady = () => {
      if (!mounted || finished) return;
      finished = true;
      const registered = registerAFrameComponents();
      setAframeStatus(registered ? "ready" : "error");
    };

    const finishError = () => {
      if (!mounted || finished) return;
      finished = true;
      setAframeStatus("error");
    };

    const tryCdnFallback = () => {
      loadExternalScript(AFRAME_CDN).then(finishReady).catch(finishError);
    };

    if (window.AFRAME) {
      finishReady();
      return () => {
        mounted = false;
      };
    }

    const fallbackTimer = window.setTimeout(() => {
      if (!finished && !window.AFRAME) {
        tryCdnFallback();
      }
    }, 2500);

    import("aframe")
      .then(finishReady)
      .catch(() => {
        if (!finished) tryCdnFallback();
      });

    return () => {
      mounted = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    const handlePointChange = (event) => {
      const point = TOUR_POINTS.find((item) => item.id === event.detail.pointId);
      if (!point) return;
      setActivePointId(point.id);
      moveCameraToPoint(point);
    };

    window.addEventListener("vr-point-change", handlePointChange);

    return () => {
      window.removeEventListener("vr-point-change", handlePointChange);
    };
  }, []);

  useEffect(() => {
    if (!aframeReady || !activePoint) return;
    moveCameraToPoint(activePoint);
  }, [aframeReady, activePoint]);

  const handleModeChange = (modeId) => {
    const modeConfig = TOUR_MODES.find((mode) => mode.id === modeId);
    const point = TOUR_POINTS.find((item) => item.id === modeConfig.startPointId);
    setActiveMode(modeId);
    setActivePointId(modeConfig.startPointId);
    moveCameraToPoint(point);
  };

  const handlePointButton = (point) => {
    setActivePointId(point.id);
    moveCameraToPoint(point);
  };

  const handleNextGuided = () => {
    const nextPoint = getNextGuidedPoint(activePointId);
    setActiveMode("guiada");
    setActivePointId(nextPoint.id);
    moveCameraToPoint(nextPoint);
  };

  const handlePreviousGuided = () => {
    const previousPoint = getPreviousGuidedPoint(activePointId);
    setActiveMode("guiada");
    setActivePointId(previousPoint.id);
    moveCameraToPoint(previousPoint);
  };

  return (
    <main className={styles.page}>
      {!aframeReady && !aframeFailed && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingCard}>
            <p className={styles.kicker}>VR / Cardboard</p>
            <h1>Cargando experiencia...</h1>
            <p>Inicializando A-Frame y preparando la maqueta urbana.</p>
          </div>
        </div>
      )}

      {aframeFailed && (
        <div className={styles.errorOverlay}>
          <div className={styles.loadingCard}>
            <p className={styles.kicker}>Error de carga</p>
            <h1>No se pudo cargar A-Frame</h1>
            <p>
              Revisa que hayas ejecutado <strong>npm install</strong> y que exista la
              dependencia <strong>aframe</strong>. También puedes revisar la consola del
              navegador para ver el error exacto.
            </p>
          </div>
        </div>
      )}

      <div className={`${styles.overlay} ${uiCompact ? styles.overlayCompact : ""}`}>
        <section className={styles.topCard}>
          <div>
            <p className={styles.kicker}>Recorrido VR / Cardboard</p>
            <h1>Maqueta urbana interactiva</h1>
            <p className={styles.description}>
              Mira una esfera durante 1.4 segundos para saltar a esa zona. En celular,
              presiona el ícono de VR y usa el visor.
            </p>
          </div>

          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => setUiCompact((current) => !current)}
          >
            {uiCompact ? "Mostrar panel" : "Ocultar panel"}
          </button>
        </section>

        <section className={styles.modePanel}>
          <h2>Modos</h2>
          <div className={styles.modeButtons}>
            {TOUR_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`${styles.modeButton} ${
                  activeMode === mode.id ? styles.modeButtonActive : ""
                }`}
                onClick={() => handleModeChange(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <p className={styles.modeHelp}>{activeModeConfig?.description}</p>
        </section>

        <section className={styles.infoPanel}>
          <h2>Punto actual</h2>
          <h3>{activePoint?.title}</h3>
          <p>{activePoint?.description}</p>

          <div className={styles.guideControls}>
            <button type="button" onClick={handlePreviousGuided}>
              Anterior
            </button>
            <button type="button" onClick={handleNextGuided}>
              Siguiente
            </button>
          </div>

          <div className={styles.pointList}>
            {visiblePoints.map((point) => (
              <button
                key={point.id}
                type="button"
                className={`${styles.pointItem} ${
                  activePointId === point.id ? styles.pointItemActive : ""
                }`}
                onClick={() => handlePointButton(point)}
              >
                <span>{point.order}. </span>
                {point.title}
              </button>
            ))}
          </div>
        </section>
      </div>

      <a-scene
        embedded
        vr-mode-ui="enabled: true"
        loading-screen="enabled: false"
        renderer="antialias: true; colorManagement: true"
        raycaster="objects: .clickable"
      >
        <a-assets>
          <a-asset-item id="urban-model" src="/models/maqueta-urbana.glb"></a-asset-item>
        </a-assets>

        <a-sky color="#101820"></a-sky>

        <a-light type="ambient" intensity="0.9"></a-light>
        <a-light type="directional" intensity="1.2" position="4 8 6"></a-light>
        <a-light type="point" intensity="0.4" position="-4 4 2"></a-light>

        <a-entity
          id="urban-model-entity"
          gltf-model="#urban-model"
          position="0 0 -5"
          rotation="0 180 0"
          scale="1 1 1"
        ></a-entity>

        {visiblePoints.map((point) => (
          <a-entity key={point.id} position={point.hotspotPosition} look-at-camera="">
            <a-sphere
              radius="0.2"
              color={activePointId === point.id ? "#bc955b" : "#691b32"}
              className="clickable"
              gaze-jump={`targetId: ${point.id}`}
              animation="property: position; dir: alternate; dur: 900; easing: easeInOutSine; loop: true; to: 0 0.12 0"
            ></a-sphere>

            <a-text
              value={point.title}
              align="center"
              position="0 0.48 0"
              color="#ffffff"
              width="3.8"
              side="double"
            ></a-text>
          </a-entity>
        ))}

        <a-entity id="camera-rig" position="0 8 14">
          <a-entity id="view-offset" rotation="-22 180 0">
            <a-camera id="camera-head" look-controls="pointerLockEnabled: false" wasd-controls-enabled="false">
              <a-entity position="0 -0.58 -1.4">
                <a-plane
                  width="1.65"
                  height="0.34"
                  color="#000000"
                  opacity="0.52"
                  material="transparent: true"
                ></a-plane>
                <a-text
                  value={`Punto: ${activePoint?.title || "Inicio"}`}
                  align="center"
                  position="0 0 0.01"
                  color="#ffffff"
                  width="1.55"
                ></a-text>
              </a-entity>

              <a-cursor
                fuse="true"
                fuse-timeout="1400"
                raycaster="objects: .clickable"
                geometry="primitive: ring; radiusInner: 0.012; radiusOuter: 0.022"
                material="color: white; shader: flat"
              ></a-cursor>
            </a-camera>
          </a-entity>
        </a-entity>
      </a-scene>
    </main>
  );
}
