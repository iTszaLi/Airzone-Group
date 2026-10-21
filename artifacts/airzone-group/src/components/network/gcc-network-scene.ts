/**
 * Lazy-loaded Three.js scene: an illustrative network of Saudi warehouse
 * cities and GCC road destinations on a tilted dot-grid plane, with cargo
 * pulses travelling along route arcs. Renders only while visible.
 */
import {
  AdditiveBlending, BufferGeometry, CircleGeometry, Color, Float32BufferAttribute, Group, Line, LineBasicMaterial,
  Mesh, MeshBasicMaterial, PerspectiveCamera, Points, PointsMaterial, QuadraticBezierCurve3, RingGeometry, Scene,
  Vector3, WebGLRenderer,
} from 'three';
import { bahrain, coastline, nodes, project, routes } from './gcc-geo';

export type NetworkScene = { setVisible: (visible: boolean) => void; dispose: () => void };

const GREEN = new Color('#5cc23f');
const BLUE = new Color('#3aa0ff');
const LINE = new Color('#7fb4e6');

export function createNetworkScene(host: HTMLElement, labels: Map<string, HTMLElement>, onContextLost?: () => void): NetworkScene {
  const canvas = document.createElement('canvas');
  canvas.className = 'az-net-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);

  const onLost = (e: Event) => { e.preventDefault(); onContextLost?.(); };
  canvas.addEventListener('webglcontextlost', onLost);
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, -6.2, 6.4);
  camera.lookAt(0, 0.2, 0);

  // Geography is never mirrored, including in right-to-left layouts.
  const world = new Group();
  scene.add(world);

  // Map design-space (600x300) into scene units centred on the origin.
  const toWorld = (lat: number, lon: number, z = 0) => {
    const p = project(lat, lon);
    return new Vector3((p.x - 300) / 60, (150 - p.y) / 60, z);
  };

  // Dot-grid ground plane.
  const grid: number[] = [];
  for (let x = -5.6; x <= 5.6; x += 0.22) for (let y = -2.8; y <= 2.8; y += 0.22) grid.push(x, y, 0);
  const gridGeo = new BufferGeometry();
  gridGeo.setAttribute('position', new Float32BufferAttribute(grid, 3));
  const gridMat = new PointsMaterial({ color: 0x5f86b3, size: 0.025, transparent: true, opacity: 0.45 });
  world.add(new Points(gridGeo, gridMat));

  const disposables: { dispose: () => void }[] = [gridGeo, gridMat];
  // Simplified coastline for geographic context.
  for (const shape of [coastline, bahrain]) {
    const geo = new BufferGeometry().setFromPoints(shape.map(([lon, lat]) => toWorld(lat, lon, 0.004)));
    const mat = new LineBasicMaterial({ color: 0x5b88ba, transparent: true, opacity: 0.75 });
    disposables.push(geo, mat);
    world.add(new Line(geo, mat));
  }

  // City markers with soft halos.
  const markerGeo = new CircleGeometry(0.075, 24);
  const ringGeo = new RingGeometry(0.11, 0.14, 32);
  disposables.push(markerGeo, ringGeo);
  const rings: { mesh: Mesh; phase: number }[] = [];
  const positions = new Map<string, Vector3>();
  for (const n of nodes) {
    const pos = toWorld(n.lat, n.lon, 0.01);
    positions.set(n.id, pos);
    const color = n.kind === 'warehouse' ? GREEN : BLUE;
    const dotMat = new MeshBasicMaterial({ color });
    const ringMat = new MeshBasicMaterial({ color, transparent: true, opacity: 0.6, blending: AdditiveBlending, depthWrite: false });
    disposables.push(dotMat, ringMat);
    const dot = new Mesh(markerGeo, dotMat); dot.position.copy(pos); world.add(dot);
    const ring = new Mesh(ringGeo, ringMat); ring.position.copy(pos); world.add(ring);
    rings.push({ mesh: ring, phase: Math.random() * Math.PI * 2 });
  }

  // Route arcs and travelling pulses.
  const curves: QuadraticBezierCurve3[] = [];
  for (const [a, b] of routes) {
    const p0 = positions.get(a)!, p2 = positions.get(b)!;
    const mid = p0.clone().add(p2).multiplyScalar(0.5);
    mid.z = 0.25 + p0.distanceTo(p2) * 0.22;
    const curve = new QuadraticBezierCurve3(p0, mid, p2);
    curves.push(curve);
    const geo = new BufferGeometry().setFromPoints(curve.getPoints(48));
    const mat = new LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.55 });
    disposables.push(geo, mat);
    world.add(new Line(geo, mat));
  }
  const pulseGeo = new BufferGeometry();
  const pulsePos = new Float32Array(curves.length * 3);
  pulseGeo.setAttribute('position', new Float32BufferAttribute(pulsePos, 3));
  const pulseMat = new PointsMaterial({ color: 0xffffff, size: 0.09, transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false });
  disposables.push(pulseGeo, pulseMat);
  world.add(new Points(pulseGeo, pulseMat));
  const offsets = curves.map(() => Math.random());

  // Pointer parallax (desktop pointers only).
  let targetX = 0, targetY = 0;
  const onPointer = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.25;
    targetY = ((e.clientY - r.top) / r.height - 0.5) * 0.15;
  };
  host.addEventListener('pointermove', onPointer);

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Keep the whole region (Jeddah to Muscat) in frame; narrower containers need more distance.
    const k = width / height < 1.4 ? 1.7 : 1.3;
    camera.position.set(0, -6.2 * k, 6.4 * k);
    camera.lookAt(0, 0.1, 0);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const v = new Vector3();
  let raf = 0, visible = false, start = performance.now();
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const t = (now - start) / 1000;
    world.rotation.z += ((targetX * -1) - world.rotation.z) * 0.04;
    world.rotation.x += ((targetY) - world.rotation.x) * 0.04;
    curves.forEach((c, i) => {
      c.getPoint((offsets[i] + t * 0.18) % 1, v);
      pulsePos.set([v.x, v.y, v.z], i * 3);
    });
    pulseGeo.attributes.position.needsUpdate = true;
    for (const r of rings) {
      const s = 1 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2 + r.phase));
      r.mesh.scale.setScalar(s);
      (r.mesh.material as MeshBasicMaterial).opacity = 0.7 - (s - 1) * 1.2;
    }
    renderer.render(scene, camera);
    // Keep HTML labels attached to their projected markers.
    const rect = canvas.getBoundingClientRect();
    for (const [id, el] of labels) {
      const p = positions.get(id);
      if (!p) continue;
      v.copy(p).applyMatrix4(world.matrixWorld).project(camera);
      el.style.transform = `translate(${((v.x + 1) / 2) * rect.width}px, ${((1 - v.y) / 2) * rect.height}px)`;
    }
  };

  return {
    setVisible(next) {
      if (next === visible) return;
      visible = next;
      if (visible) { start = performance.now() - 1000; raf = requestAnimationFrame(frame); }
      else cancelAnimationFrame(raf);
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onLost);
      disposables.forEach(d => d.dispose());
      labels.forEach(el => { el.style.transform = ''; });
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
