// HeroScene — nuage de particules du hero (CLAUDE.md §8.4).
// Vanilla Three.js dans un composant React isole : la scene est trop simple
// pour justifier React Three Fiber (cf. §2).
//
// Trois contraintes non negociables de la §9, a ne pas regresser :
//   - DPR cappe a 1.6
//   - densite de particules adaptative (420 desktop / 160 sinon)
//   - rendu suspendu des que le hero sort de l'ecran

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const PARTICLE_COLOR = 0xc9a24b; // --gold
const COUNT_DESKTOP = 420;
const COUNT_COMPACT = 160;
const BOX = { x: 18, y: 10, z: 10 };
const MAX_DPR = 1.6;
const LERP = 0.02;
const DRIFT = 0.0006;
const FLOAT_SPEED = 0.15;
const FLOAT_AMPLITUDE = 0.3;
const RESIZE_DEBOUNCE_MS = 150;

// La §8.4 fixe le coefficient de lerp (0.02) et la derive (0.0006) mais pas
// l'amplitude du suivi de souris. Valeurs volontairement discretes, coherentes
// avec le ton feutre du site — a ajuster si le rendu doit etre plus marque.
const AMPLITUDE_Y = 0.25;
const AMPLITUDE_X = 0.15;

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // §9 : ne pas monter la scene du tout en reduced-motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisabled(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      // Pas de WebGL : on retire le canvas, le hero garde son fond CSS.
      setDisabled(true);
      return;
    }

    const sizeOf = () => ({
      width: canvas.clientWidth || 1,
      height: canvas.clientHeight || 1,
    });

    let { width, height } = sizeOf();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 12;

    const count = window.matchMedia('(min-width: 1000px)').matches
      ? COUNT_DESKTOP
      : COUNT_COMPACT;

    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * BOX.x;
      positions[i * 3 + 1] = (Math.random() - 0.5) * BOX.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * BOX.z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: PARTICLE_COLOR,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Suivi de la souris -------------------------------------------------
    let targetRotY = 0;
    let targetRotX = 0;

    const onPointerMove = (event: PointerEvent) => {
      targetRotY = (event.clientX / window.innerWidth - 0.5) * 2 * AMPLITUDE_Y;
      targetRotX = (event.clientY / window.innerHeight - 0.5) * 2 * AMPLITUDE_X;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // --- Suspension hors-ecran (§8.4, seuil 0.05) ---------------------------
    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    // --- Resize debounce ~150ms --------------------------------------------
    let resizeTimer = 0;
    const applyResize = () => {
      ({ width, height } = sizeOf());
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
      renderer.setSize(width, height, false);
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(applyResize, RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener('resize', onResize);

    // --- Boucle de rendu ----------------------------------------------------
    let frame = 0;
    const start = performance.now();

    const tick = () => {
      frame = window.requestAnimationFrame(tick);
      if (!visible) return;

      const t = (performance.now() - start) / 1000;

      points.rotation.y += (targetRotY - points.rotation.y) * LERP + DRIFT;
      points.rotation.x += (targetRotX - points.rotation.x) * LERP;
      points.position.y = Math.sin(t * FLOAT_SPEED) * FLOAT_AMPLITUDE;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  if (disabled) return null;

  return <canvas ref={canvasRef} id="hero-canvas" aria-hidden="true" />;
}
