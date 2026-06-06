# 🌌 3D Solar System Explorer

An interactive, real-time 3D solar system built with **Three.js** — featuring all 8 planets, the Moon, orbital animations, per-planet tracking cameras, and full mobile/tablet support.

---

## ✨ Features

- **All 8 planets** with high-resolution 8K texture maps, accurate axial tilts, and self-rotation
- **Saturn & Uranus rings** rendered with correct geometry and transparency
- **Earth cloud layer** as a separate semi-transparent mesh with additive blending
- **Moon** orbiting Earth at a 5.14° inclination
- **Orbital paths** visualized as color-coded ellipses, toggleable on/off
- **Per-planet tracking cameras** — each planet gets its own camera that follows it along its orbit
- **Free camera mode** — detach from any planet and explore freely
- **Global overview camera** — pull back to see the entire solar system
- **10,000-star skybox** procedurally generated with randomized positions
- **Floating name labels** for every body, scaled dynamically by camera distance
- **Point light sun** casting shadows across the scene (PCF soft shadows)
- **Responsive UI** — keyboard shortcuts on desktop, touch-friendly nav buttons on mobile/tablet
- **Pause/Resume** orbital animation

---

<img width="1920" height="916" alt="image" src="https://github.com/user-attachments/assets/fc1d91d4-ab88-432a-a1ee-8200d22915ee" />



## 🪐 Planets & Scale

| # | Planet  | Radius | Orbital Distance | Color Code     |
|---|---------|--------|-----------------|----------------|
| 1 | Mercury | 0.18   | 7               | Gray `#8c8c8c` |
| 2 | Venus   | 0.38   | 11              | Gold `#eccc9a` |
| 3 | Earth   | 0.40   | 15              | Blue `#129ae3` |
| – | Moon    | 0.11   | 0.9 (from Earth)| Lt. Gray       |
| 4 | Mars    | 0.22   | 20              | Orange `#d47415` |
| 5 | Jupiter | 1.60   | 30              | Tan `#d9a066`  |
| 6 | Saturn  | 1.30   | 42              | Gold `#e5c07b` |
| 7 | Uranus  | 0.65   | 54              | Cyan `#7fdbff` |
| 8 | Neptune | 0.60   | 65              | Blue `#4169e1` |

> Radii and distances are compressed/logarithmic for visual clarity — not to real astronomical scale.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/3d-solar-system.git
cd 3d-solar-system

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

### Common Issue — Tailwind CSS Error

If you see `[postcss] ENOENT: no such file or directory, open 'tailwindcss'`, remove the first line from `src/style.css`:

```css
/* Delete this line if Tailwind is not installed: */
@import "tailwindcss";
```

The project uses fully custom CSS and does not require Tailwind.

---

## 🎮 Controls

### Desktop — Keyboard

| Key       | Action                          |
|-----------|---------------------------------|
| `1` – `8` | Jump to planet camera (Mercury → Neptune) |
| `0`       | Jump to Moon camera             |
| `Esc`     | Return to global overview       |
| `F`       | Switch to Free camera (detach from current planet) |
| `Space`   | Pause / Resume orbital animation |

### Desktop — Mouse

| Action              | Control              |
|---------------------|----------------------|
| Orbit               | Left-click + drag    |
| Zoom                | Scroll wheel         |
| Pan                 | Right-click + drag   |

### Desktop — Touchpad

| Action | Gesture             |
|--------|---------------------|
| Orbit  | One-finger drag     |
| Zoom   | Two-finger pinch    |
| Pan    | Two-finger swipe    |

### Mobile & Tablet

| Action | Gesture / Button                   |
|--------|------------------------------------|
| Orbit  | One-finger drag                    |
| Zoom   | Two-finger pinch                   |
| Pan    | Three-finger drag                  |
| Navigate | Tap any planet button in the menu |
| Free Cam | Tap 🎥 Free Cam after selecting a planet |
| Global view | Tap 🌌 System              |
| Pause  | Tap ⏸ Pause / ▶ Resume            |

---

## 🏗️ Architecture

### Cameras

Each body has a dedicated `PerspectiveCamera`. Every frame, planet cameras compute their position based on the planet's current world position — following it tangentially along its orbit without being parented to it.

```
globalCamera   — overview of the full system
mercuryCamera  ─┐
venusCamera    ─┤
earthCamera    ─┤
moonCamera     ─┤ tracking cameras (one per body)
marsCamera     ─┤
jupiterCamera  ─┤
saturnCamera   ─┤
uranusCamera   ─┤
neptuneCamera  ─┘
freeCamera     — detached, user-controlled
```

### Orbital System

Each planet uses a `THREE.Group` pivot at the origin. Rotating the pivot's Y-axis each frame moves the planet along its orbit:

```js
mercuryPivot.rotation.y += 0.08 * delta;  // fastest — closest to Sun
neptunePivot.rotation.y += 0.004 * delta; // slowest — furthest out
```

The Moon uses a nested pivot parented to Earth, with a 5.14° inclination applied via `rotation.y` on the pivot.

### Camera Switching

All navigation routes through four shared functions so keyboard and touch buttons stay in sync:

```js
switchToPlanet(index)  // 1–8 keys or planet buttons
switchToMoon()         // 0 key or Moon button
switchToGlobal()       // Esc key or System button
switchToFree()         // F key or Free Cam button
```

### Responsive UI

CSS class-based visibility (no JavaScript):

```css
@media (min-width: 768px) { .mobile-only  { display: none !important; } }
@media (max-width: 767px) { .desktop-only { display: none !important; } }
```

- **≥ 768px**: keyboard shortcut hints + mouse/touchpad instructions
- **< 768px**: 2-column planet button grid + touch gesture instructions

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [Three.js](https://threejs.org/) | 3D rendering engine |
| [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls) | Camera pan / orbit / zoom |
| [Vite](https://vitejs.dev/) | Dev server & bundler |
| Vanilla CSS | UI panel, responsive layout |
| Vanilla JS | DOM interactions, keyboard events |

---

## 🔭 Possible Extensions

- [ ] GLSL shader for the Sun's corona / surface glow effect
- [ ] Clickable planets to jump camera (raycasting)
- [ ] Real orbital speeds and inclinations (Kepler's laws)
- [ ] Planet info cards (mass, diameter, distance from Sun)
- [ ] Asteroid belt between Mars and Jupiter
- [ ] Day/night terminator on Earth using a normal map
- [ ] VR/XR mode via `THREE.WebXRManager`

---

## 📦 Dependencies

```json
{
  "three": "^0.160.0"
}
```

```json
{
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```
