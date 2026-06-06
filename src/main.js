import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// SCENE
const scene = new THREE.Scene();

// CAMERAS
const globalCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
const mercuryCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
const venusCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
const earthCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
const moonCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
const marsCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
const jupiterCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
const saturnCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
const uranusCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
const neptuneCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
const freeCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);

let activeCamera = globalCamera;
let lastTrackedPlanet = null;

// LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 100, 300, 1);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
sunLight.castShadow = true;

// CONTROLS
const controls = new OrbitControls(activeCamera, renderer.domElement);
controls.enableDamping = true;

globalCamera.position.set(70, 70, 70);
controls.update();

// HELPER FUNCTION FOR SMOOTH ORBITS
function createOrbitLine(radius, color = 0xffffff) {
  const points = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0),
    );
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 1,
  });
  return new THREE.LineLoop(geometry, material);
}

// Textures
const textureLoader = new THREE.TextureLoader();
const base = import.meta.env.BASE_URL;

const sunTexture = textureLoader.load(base + "8k_sun.jpg");
const mercuryTexture = textureLoader.load(base + "8k_mercury.jpg");
const venusTexture = textureLoader.load(base + "8k_venus_surface.jpg");

const earthTexture = textureLoader.load(base + "8k_earth_daymap.jpg");
const earthCloudTexture = textureLoader.load(base + "8k_earth_clouds.jpg");

const marsTexture = textureLoader.load(base + "8k_mars.jpg");
const jupiterTexture = textureLoader.load(base + "8k_jupiter.jpg");

const saturnTexture = textureLoader.load(base + "8k_saturn.jpg");
const saturnRingsTexture = textureLoader.load(
  base + "8k_saturn_ring_alpha.png",
);

const uranusTexture = textureLoader.load(base + "2k_uranus.jpg");
const neptuneTexture = textureLoader.load(base + "2k_neptune.jpg");

const moonTexture = textureLoader.load(base + "8k_moon.jpg");

// OBJECTS
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(4, 128, 128),
  new THREE.MeshBasicMaterial({ map: sunTexture }),
);
scene.add(sun);

const mercury = new THREE.Mesh(
  new THREE.SphereGeometry(0.18, 48, 48),
  new THREE.MeshStandardMaterial({ map: mercuryTexture }),
);
const venus = new THREE.Mesh(
  new THREE.SphereGeometry(0.38, 64, 64),
  new THREE.MeshStandardMaterial({ map: venusTexture }),
);
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 64, 64),
  new THREE.MeshStandardMaterial({ map: earthTexture }),
);
earth.rotation.z = 0.41;
earth.castShadow = true;

const earthClouds = new THREE.Mesh(
  new THREE.SphereGeometry(0.405, 64, 64),
  new THREE.MeshStandardMaterial({
    map: earthCloudTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.3,
  }),
);
earth.add(earthClouds);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.11, 64, 64),
  new THREE.MeshStandardMaterial({ map: moonTexture }),
);
moon.receiveShadow = true;

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(0.22, 50, 50),
  new THREE.MeshStandardMaterial({ map: marsTexture }),
);
const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(1.6, 50, 50),
  new THREE.MeshStandardMaterial({ map: jupiterTexture }),
);

const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(1.3, 50, 50),
  new THREE.MeshStandardMaterial({ map: saturnTexture }),
);
saturn.rotation.z = 0.466;

const ringGeometry = new THREE.RingGeometry(1.6, 2.4, 200);
const pos = ringGeometry.attributes.position;
const uv = ringGeometry.attributes.uv;
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i);
  const y = pos.getY(i);
  const angle = Math.atan2(y, x);
  const radius = Math.sqrt(x * x + y * y);
  uv.setXY(i, angle / (2 * Math.PI) + 0.5, radius);
}
uv.needsUpdate = true;

const saturnRings = new THREE.Mesh(
  ringGeometry,
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: saturnRingsTexture,
    transparent: true,
  }),
);
saturnRings.rotation.x = Math.PI / 2;
saturn.add(saturnRings);

const uranus = new THREE.Mesh(
  new THREE.SphereGeometry(0.65, 50, 50),
  new THREE.MeshStandardMaterial({ map: uranusTexture }),
);
uranus.rotation.z = 1.71;
const uranusRings = new THREE.Mesh(
  new THREE.RingGeometry(0.8, 1.0, 200),
  new THREE.MeshBasicMaterial({ color: 0x5f6f7a, side: THREE.DoubleSide }),
);
uranusRings.rotation.x = Math.PI / 2;
uranus.add(uranusRings);

const neptune = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 50, 50),
  new THREE.MeshStandardMaterial({ map: neptuneTexture }),
);

// PLANETS SYSTEM CONFIG
const planets = [
  {
    name: "mercury",
    mesh: mercury,
    camera: mercuryCamera,
    offset: new THREE.Vector3(1, 1, 0),
  },
  {
    name: "venus",
    mesh: venus,
    camera: venusCamera,
    offset: new THREE.Vector3(2, 2, 0),
  },
  {
    name: "earth",
    mesh: earth,
    camera: earthCamera,
    offset: new THREE.Vector3(2, 2, 0),
  },
  {
    name: "mars",
    mesh: mars,
    camera: marsCamera,
    offset: new THREE.Vector3(2, 2, 0),
  },
  {
    name: "jupiter",
    mesh: jupiter,
    camera: jupiterCamera,
    offset: new THREE.Vector3(6, 8, 0),
  },
  {
    name: "saturn",
    mesh: saturn,
    camera: saturnCamera,
    offset: new THREE.Vector3(6, 7, 0),
  },
  {
    name: "uranus",
    mesh: uranus,
    camera: uranusCamera,
    offset: new THREE.Vector3(2, 2, 0),
  },
  {
    name: "neptune",
    mesh: neptune,
    camera: neptuneCamera,
    offset: new THREE.Vector3(2, 2, 0),
  },
];

// SETUP ORBITS & PIVOTS
const mercuryOrbit = createOrbitLine(7, 0x8c8c8c);
mercuryOrbit.rotation.x = -Math.PI / 2;
scene.add(mercuryOrbit);
const mercuryPivot = new THREE.Group();
scene.add(mercuryPivot);
mercuryPivot.add(mercury);
mercury.position.set(7, 0, 0);

const venusOrbit = createOrbitLine(11, 0xeccc9a);
venusOrbit.rotation.x = -Math.PI / 2;
scene.add(venusOrbit);
const venusPivot = new THREE.Group();
scene.add(venusPivot);
venusPivot.add(venus);
venus.position.set(11, 0, 0);

const earthOrbit = createOrbitLine(15, 0x129ae3);
earthOrbit.rotation.x = -Math.PI / 2;
scene.add(earthOrbit);
const earthPivot = new THREE.Group();
scene.add(earthPivot);
earthPivot.add(earth);
earth.position.set(15, 0, 0);

const moonOrbit = createOrbitLine(0.9, 0xbfbfbf);
moonOrbit.rotation.y = (5.14 * Math.PI) / 180;
moonOrbit.rotation.x = -Math.PI / 2;
earth.add(moonOrbit);
const moonPivot = new THREE.Group();
moonPivot.rotation.y = (5.14 * Math.PI) / 180;
moonPivot.rotation.x = -Math.PI / 2;
earth.add(moonPivot);
moonPivot.add(moon);
moon.position.set(0.9, 0, 0);

const marsOrbit = createOrbitLine(20, 0xd47415);
marsOrbit.rotation.x = -Math.PI / 2;
scene.add(marsOrbit);
const marsPivot = new THREE.Group();
scene.add(marsPivot);
marsPivot.add(mars);
mars.position.set(20, 0, 0);

const jupiterOrbit = createOrbitLine(30, 0xd9a066);
jupiterOrbit.rotation.x = -Math.PI / 2;
scene.add(jupiterOrbit);
const jupiterPivot = new THREE.Group();
scene.add(jupiterPivot);
jupiterPivot.add(jupiter);
jupiter.position.set(30, 0, 0);

const saturnOrbit = createOrbitLine(42, 0xe5c07b);
saturnOrbit.rotation.x = -Math.PI / 2;
scene.add(saturnOrbit);
const saturnPivot = new THREE.Group();
scene.add(saturnPivot);
saturnPivot.add(saturn);
saturn.position.set(42, 0, 0);

const uranusOrbit = createOrbitLine(54, 0x7fdbff);
uranusOrbit.rotation.x = -Math.PI / 2;
scene.add(uranusOrbit);
const uranusPivot = new THREE.Group();
scene.add(uranusPivot);
uranusPivot.add(uranus);
uranus.position.set(54, 0, 0);

const neptuneOrbit = createOrbitLine(65, 0x4169e1);
neptuneOrbit.rotation.x = -Math.PI / 2;
scene.add(neptuneOrbit);
const neptunePivot = new THREE.Group();
scene.add(neptunePivot);
neptunePivot.add(neptune);
neptune.position.set(65, 0, 0);

// RESIZE EVENT
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  globalCamera.aspect = window.innerWidth / window.innerHeight;
  globalCamera.updateProjectionMatrix();
});

// STARS
const starGeometry = new THREE.BufferGeometry();
const starCount = 10000;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 2000;
}
starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    sizeAttenuation: true,
  }),
);
scene.add(stars);

// ─── CAMERA SWITCH LOGIC (shared by keyboard + mobile buttons) ────────────
const planeOrbits = [
  mercuryOrbit,
  venusOrbit,
  earthOrbit,
  moonOrbit,
  marsOrbit,
  jupiterOrbit,
  saturnOrbit,
  uranusOrbit,
  neptuneOrbit,
];

function switchToPlanet(index) {
  if (!planets[index]) return;
  activeCamera = planets[index].camera;
  lastTrackedPlanet = planets[index].name;
  controls.object = activeCamera;
  controls.update();
  updateNavBtnActive(index);
}

function switchToMoon() {
  activeCamera = moonCamera;
  lastTrackedPlanet = "moon";
  controls.object = activeCamera;
  controls.update();
  updateNavBtnActive("moon");
}

function switchToGlobal() {
  activeCamera = globalCamera;
  lastTrackedPlanet = null;
  controls.object = activeCamera;
  controls.target.set(0, 0, 0);
  activeCamera.position.set(70, 70, 70);
  controls.update();
  updateNavBtnActive("global");
}

function switchToFree() {
  const currentPlanet = planets.find((p) => p.camera === activeCamera);
  if (currentPlanet) {
    freeCamera.position.copy(activeCamera.position);
    freeCamera.rotation.copy(activeCamera.rotation);
    const p = new THREE.Vector3();
    currentPlanet.mesh.getWorldPosition(p);
    controls.target.copy(p);
    lastTrackedPlanet = currentPlanet.name;
  } else if (activeCamera === moonCamera) {
    freeCamera.position.copy(moonCamera.position);
    freeCamera.rotation.copy(moonCamera.rotation);
    const p = new THREE.Vector3();
    moon.getWorldPosition(p);
    controls.target.copy(p);
    lastTrackedPlanet = "moon";
  } else {
    return; // already global/free — nothing to inherit
  }
  activeCamera = freeCamera;
  controls.object = activeCamera;
  controls.update();
  updateNavBtnActive("free");
}

// ─── ORBIT TOGGLE ────────────────────────────────────────────────────────
let visible = true;
document.getElementById("toggleOrbit").addEventListener("click", () => {
  visible = !visible;
  planeOrbits.forEach((orbit) => {
    orbit.material.opacity = visible ? 1 : 0;
  });
});

// ─── KEYBOARD CONTROLS ───────────────────────────────────────────────────
let isRotating = false;

window.addEventListener("keydown", (event) => {
  if (event.key === "0") switchToMoon();

  const index = parseInt(event.key) - 1;
  if (!isNaN(index) && planets[index]) switchToPlanet(index);

  if (event.key === "Escape") switchToGlobal();

  if (event.key.toLowerCase() === "f") switchToFree();

  if (event.code === "Space") {
    event.preventDefault();
    isRotating = !isRotating;
  }
});

// ─── MOBILE NAV BUTTONS ──────────────────────────────────────────────────
const navButtons = document.querySelectorAll(".nav-btn[data-action]");

function updateNavBtnActive(active) {
  navButtons.forEach((btn) => {
    btn.classList.remove("active");
    const action = btn.dataset.action;
    const idx =
      btn.dataset.index !== undefined ? parseInt(btn.dataset.index) : null;

    if (active === "global" && action === "global") btn.classList.add("active");
    else if (active === "moon" && action === "moon")
      btn.classList.add("active");
    else if (active === "free" && action === "free")
      btn.classList.add("active");
    else if (
      typeof active === "number" &&
      action === "planet" &&
      idx === active
    )
      btn.classList.add("active");
  });
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "global") switchToGlobal();
    else if (action === "moon") switchToMoon();
    else if (action === "free") switchToFree();
    else if (action === "pause") {
      isRotating = !isRotating;
      btn.textContent = isRotating ? "▶ Resume" : "⏸ Pause";
    } else if (action === "planet") switchToPlanet(parseInt(btn.dataset.index));
  });
});

// ─── DOM SELECTORS FOR CAMERA UI INDICATOR ───────────────────────────────
const camTypeSpan = document.getElementById("cam-type");
const camTargetSpan = document.getElementById("cam-target");

// LABELS
function createLabel(text) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 128;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = "rgba(0,0,0,0.8)";
  ctx.lineWidth = 6;
  ctx.strokeText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
  ctx.fillStyle = "white";
  ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4, 1, 1);
  return sprite;
}

planets.forEach((planet) => {
  planet.label = createLabel(planet.name);
  scene.add(planet.label);
});

const moonLabel = createLabel("MOON");
scene.add(moonLabel);
const sunLabel = createLabel("SUN");
scene.add(sunLabel);
sunLabel.position.set(0, 6, 0);

// ANIMATION LOOP
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  // Sync top-right camera indicator
  if (camTypeSpan && camTargetSpan) {
    if (activeCamera === globalCamera) {
      camTypeSpan.innerText = "Global";
      camTargetSpan.innerText = "Solar System";
    } else if (activeCamera === freeCamera) {
      camTypeSpan.innerText = "Free Fly";
      camTargetSpan.innerText = lastTrackedPlanet
        ? lastTrackedPlanet
        : "Manual Orbit";
    } else if (activeCamera === moonCamera) {
      camTypeSpan.innerText = "Tracking";
      camTargetSpan.innerText = "Moon";
    } else {
      const currentPlanet = planets.find((p) => p.camera === activeCamera);
      if (currentPlanet) {
        camTypeSpan.innerText = "Tracking";
        camTargetSpan.innerText = currentPlanet.name;
      }
    }
  }

  const camPos = activeCamera.position;

  planets.forEach((planet) => {
    const p = new THREE.Vector3();
    planet.mesh.getWorldPosition(p);
    planet.label.position.copy(p);
    planet.label.position.x += 0.5;
    planet.label.position.y += 0.5;

    const distance = camPos.distanceTo(planet.label.position);
    const scaleFactor = distance * 0.06;
    planet.label.scale.set(scaleFactor * 4, scaleFactor, 1);
  });

  const moonPos = new THREE.Vector3();
  moon.getWorldPosition(moonPos);
  moonLabel.position.copy(moonPos);
  moonLabel.position.x += 0.5;
  const moonScaleFactor = camPos.distanceTo(moonLabel.position) * 0.06;
  moonLabel.scale.set(moonScaleFactor * 4, moonScaleFactor, 1);

  if (sunLabel) {
    const sunScaleFactor = camPos.distanceTo(sunLabel.position) * 0.06;
    sunLabel.scale.set(sunScaleFactor * 4, sunScaleFactor, 1);
  }

  const delta = clock.getDelta();

  if (!isRotating) {
    mercuryPivot.rotation.y += 0.08 * delta;
    venusPivot.rotation.y += 0.05 * delta;
    earthPivot.rotation.y += 0.04 * delta;
    moonPivot.rotation.z += 0.25 * delta;
    marsPivot.rotation.y += 0.03 * delta;
    jupiterPivot.rotation.y += 0.015 * delta;
    saturnPivot.rotation.y += 0.01 * delta;
    uranusPivot.rotation.y += 0.007 * delta;
    neptunePivot.rotation.y += 0.004 * delta;

    const localYAxis = new THREE.Vector3(0, 1, 0);
    mercury.rotateOnAxis(localYAxis, 0.5 * delta);
    venus.rotateOnAxis(localYAxis, -0.3 * delta);
    earth.rotation.y += 0.1 * delta;
    moon.rotation.y += 0.04 * delta;
    mars.rotation.y += 0.1 * delta;
    jupiter.rotation.y += 0.2 * delta;
    saturn.rotation.y += 0.18 * delta;
    uranus.rotation.y += -0.15 * delta;
    neptune.rotation.y += 0.15 * delta;
  }

  if (activeCamera === moonCamera) {
    const p = new THREE.Vector3();
    moon.getWorldPosition(p);
    moonCamera.position.copy(p).add(new THREE.Vector3(1.2, 1.5, 1.2));
    controls.target.copy(p);
  }

  planets.forEach((planet) => {
    if (activeCamera === planet.camera) {
      const p = new THREE.Vector3();
      planet.mesh.getWorldPosition(p);

      const radialDir = new THREE.Vector3(p.x, 0, p.z).normalize();
      const tangentDir = new THREE.Vector3(
        -radialDir.z,
        0,
        radialDir.x,
      ).normalize();

      const followDistance = planet.offset.x;
      const heightOffset = planet.offset.y;

      const camTargetPos = p
        .clone()
        .addScaledVector(tangentDir, -followDistance)
        .add(new THREE.Vector3(0, heightOffset, 0));

      planet.camera.position.copy(camTargetPos);

      const lookTarget = p.clone().addScaledVector(tangentDir, 5);
      planet.camera.lookAt(lookTarget);
      planet.camera.up.set(0, 1, 0);

      controls.target.copy(p);
      controls.update();
    }
  });

  controls.update();
  renderer.render(scene, activeCamera);
}

animate();
