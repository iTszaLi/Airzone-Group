/**
 * Lazy-loaded Three.js scene: a procedurally modelled, illustrative twin-engine airliner.
 * Not a depiction of any Airzone-owned aircraft. Renders on demand only.
 */
export type PlaneState = { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number; edge: number };

export type AviationScene = {
  setState: (s: PlaneState) => void;
  setVisible: (v: boolean) => void;
  dispose: () => void;
};

export async function createAviationScene(host: HTMLElement, opts: { rtl: boolean; onContextLost?: () => void }): Promise<AviationScene> {
  const THREE = await import('three');
  const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');

  const canvas = document.createElement('canvas');
  canvas.className = 'av-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const narrow = window.matchMedia('(max-width: 760px)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !narrow, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  const onLost = (e: Event) => { e.preventDefault(); opts.onContextLost?.(); };
  canvas.addEventListener('webglcontextlost', onLost);
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envTex = pmrem.fromScene(room, 0.04).texture;
  scene.environment = envTex;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  camera.position.set(0, 0, 14);

  scene.add(new THREE.HemisphereLight(0xdfe9f2, 0x8a7a5e, 0.9));
  const sun = new THREE.DirectionalLight(0xfff3dc, 2.1);
  sun.position.set(6, 9, 7);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xb8cde0, 0.7);
  rim.position.set(-8, -2, -6);
  scene.add(rim);

  const mats = {
    body: new THREE.MeshStandardMaterial({ color: 0xf3f2ee, metalness: 0.35, roughness: 0.3, transparent: true }),
    wing: new THREE.MeshStandardMaterial({ color: 0xcfd3d6, metalness: 0.55, roughness: 0.34, transparent: true }),
    tail: new THREE.MeshStandardMaterial({ color: 0x172a42, metalness: 0.3, roughness: 0.38, transparent: true }),
    gold: new THREE.MeshStandardMaterial({ color: 0xc9a969, metalness: 0.7, roughness: 0.3, transparent: true }),
    nacelle: new THREE.MeshStandardMaterial({ color: 0xe6e8ea, metalness: 0.6, roughness: 0.24, transparent: true }),
    dark: new THREE.MeshStandardMaterial({ color: 0x18222d, metalness: 0.2, roughness: 0.5, transparent: true }),
  };
  const lineMat = new THREE.LineBasicMaterial({ color: 0xd8c08a, transparent: true, opacity: 0 });

  const mirror = new THREE.Group();
  if (opts.rtl) mirror.scale.x = -1;
  const rig = new THREE.Group();
  rig.rotation.order = 'YZX';
  const plane = new THREE.Group();
  plane.scale.setScalar(0.55);
  mirror.add(rig); rig.add(plane); scene.add(mirror);

  type Geo = ConstructorParameters<typeof THREE.EdgesGeometry>[0] & { dispose: () => void };
  const geos: { dispose: () => void }[] = [];
  const add = (geo: Geo, mat: InstanceType<typeof THREE.Material>, edges = true) => {
    geos.push(geo);
    const mesh = new THREE.Mesh(geo, mat);
    plane.add(mesh);
    if (edges) {
      const eg = new THREE.EdgesGeometry(geo, 28);
      geos.push(eg);
      plane.add(new THREE.LineSegments(eg, lineMat));
    }
    return mesh;
  };

  // Fuselage (lathe around Y, rotated so the nose points +X)
  const profile = [[0.03, -4.1], [0.16, -3.8], [0.3, -3.2], [0.4, -2.4], [0.43, -1.6], [0.43, 2.4], [0.41, 2.9], [0.35, 3.35], [0.24, 3.75], [0.11, 4.0], [0, 4.08]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const fus = new THREE.LatheGeometry(profile, 40);
  fus.rotateZ(-Math.PI / 2);
  add(fus, mats.body);

  // Cockpit glazing
  const cockpit = new THREE.SphereGeometry(0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3);
  cockpit.scale(1.1, 0.5, 1.25); cockpit.rotateZ(-0.9); cockpit.translate(3.55, 0.17, 0);
  add(cockpit, mats.dark, false);

  // Cabin windows
  const win = new THREE.SphereGeometry(0.032, 8, 6);
  win.scale(1, 1.4, 0.4);
  geos.push(win);
  const windows = new THREE.InstancedMesh(win, mats.dark, 64);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < 32; i++) {
    const x = -2.1 + i * 0.145;
    m4.makeTranslation(x, 0.13, 0.425); windows.setMatrixAt(i * 2, m4);
    m4.makeTranslation(x, 0.13, -0.425); windows.setMatrixAt(i * 2 + 1, m4);
  }
  plane.add(windows);

  // Gold cheatline
  const cheat = new THREE.CylinderGeometry(0.435, 0.435, 4.6, 40, 1, true, Math.PI * 0.62, Math.PI * 0.08);
  cheat.rotateZ(-Math.PI / 2); cheat.translate(0.1, 0, 0);
  add(cheat, mats.gold, false);
  const cheat2 = cheat.clone(); cheat2.scale(1, 1, -1);
  add(cheat2, mats.gold, false);

  const extrudePlan = (pts: number[][], depth: number) => {
    const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 1 });
    g.translate(0, 0, -depth / 2);
    return g;
  };

  // Main wings: swept planform in XY, rotated into XZ
  for (const side of [1, -1]) {
    const g = extrudePlan([[0.95, 0.3], [-0.75, 0.3], [-2.0, 4.1 * 1], [-1.45, 4.1]].map(([x, y]) => [x, y * side]), 0.07);
    g.rotateX(Math.PI / 2);
    g.rotateX(side * -0.07);
    g.translate(0, -0.2, 0);
    add(g, mats.wing);
    // winglet
    const wl = extrudePlan([[0, 0], [0.45, 0], [0.62, 0.55], [0.38, 0.55]], 0.04);
    wl.translate(-1.95, -0.2 + 0.29 * 1, side * 4.08);
    wl.rotateY(0);
    add(wl, mats.tail, false);
    // engine nacelle + pylon
    const nac = new THREE.CylinderGeometry(0.21, 0.17, 1.15, 28, 1, true);
    nac.rotateZ(Math.PI / 2); nac.translate(0.42, -0.5, side * 1.35);
    add(nac, mats.nacelle);
    const fan = new THREE.CircleGeometry(0.2, 24);
    fan.rotateY(Math.PI / 2); fan.translate(0.98, -0.5, side * 1.35);
    add(fan, mats.dark, false);
    const core = new THREE.ConeGeometry(0.11, 0.35, 16);
    core.rotateZ(Math.PI / 2); core.translate(-0.3, -0.5, side * 1.35);

    add(core, mats.wing, false);
    const pylon = new THREE.BoxGeometry(0.75, 0.22, 0.05);
    pylon.translate(0.25, -0.3, side * 1.35);
    add(pylon, mats.wing, false);
    // horizontal stabiliser
    const hs = extrudePlan([[-3.0, 0.15], [-3.55, 0.15], [-4.05, 1.55], [-3.75, 1.55]].map(([x, y]) => [x, y * side]), 0.05);
    hs.rotateX(Math.PI / 2); hs.translate(0, 0.12, 0);
    add(hs, mats.wing);
  }

  // Vertical fin
  const fin = extrudePlan([[-2.7, 0.3], [-3.85, 0.3], [-4.3, 2.05], [-3.8, 2.05]], 0.06);
  add(fin, mats.tail);
  const finStripe = extrudePlan([[-3.62, 1.2], [-3.82, 1.2], [-4.12, 1.85], [-3.92, 1.85]], 0.065);
  add(finStripe, mats.gold, false);

  plane.rotation.z = 0;

  let w = 1, h = 1, k = 1;
  let visible = true, dirty = true, raf = 0;
  const state: PlaneState = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, edge: 0 };

  const apply = () => {
    rig.position.set(state.x * k, state.y * Math.min(1, 0.6 + k * 0.4), state.z);
    rig.rotation.set(state.rx, state.ry, state.rz);
    const sc = state.s * Math.min(1, 0.45 + k * 0.55);
    rig.scale.setScalar(sc);
    const e = Math.max(0, Math.min(1, state.edge));
    lineMat.opacity = e;
    const op = 1 - e * 0.82;
    for (const m of Object.values(mats)) { m.opacity = op; m.depthWrite = op > 0.95; }
  };
  const frame = () => { raf = 0; if (!visible || !dirty) return; dirty = false; apply(); renderer.render(scene, camera); };
  const request = () => { dirty = true; if (!raf && visible) raf = requestAnimationFrame(frame); };

  const resize = () => {
    const r = host.getBoundingClientRect();
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    k = Math.max(0.32, Math.min(1, (w / h) / 1.65));
    request();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  return {
    setState(s) { Object.assign(state, s); request(); },
    setVisible(v) { visible = v; if (v) request(); },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geos.forEach(g => g.dispose());
      Object.values(mats).forEach(m => m.dispose());
      lineMat.dispose();
      envTex.dispose(); pmrem.dispose();
      room.traverse(o => { const mesh = o as InstanceType<typeof THREE.Mesh>; if (mesh.isMesh) { mesh.geometry.dispose(); (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m => m.dispose()); } });
      canvas.removeEventListener('webglcontextlost', onLost);
      renderer.dispose();
      canvas.remove();
    },
  };
}
