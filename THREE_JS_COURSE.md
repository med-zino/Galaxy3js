# Three.js Complete Course - Building a 3D Solar System

## Table of Contents
1. [Introduction to Three.js](#introduction)
2. [Core Concepts](#core-concepts)
3. [Scene Setup](#scene-setup)
4. [Camera Systems](#camera-systems)
5. [Rendering](#rendering)
6. [Lighting](#lighting)
7. [Geometry & Meshes](#geometry-meshes)
8. [Materials](#materials)
9. [Textures](#textures)
10. [Animation](#animation)
11. [Particle Systems](#particle-systems)
12. [User Interaction](#user-interaction)
13. [Performance Optimization](#performance)

---

## 1. Introduction to Three.js {#introduction}

### What is Three.js?
Three.js is a JavaScript library that makes creating 3D graphics in the browser easy. It uses WebGL under the hood but provides a much simpler API.

### Why Three.js?
- **Easy to learn**: Simpler than raw WebGL
- **Cross-platform**: Works in all modern browsers
- **Powerful**: Can create complex 3D scenes
- **Active community**: Lots of examples and help available

### Basic Structure
Every Three.js application needs three things:
1. **Scene** - The container for all 3D objects
2. **Camera** - The viewpoint
3. **Renderer** - Draws the scene to the screen

---

## 2. Core Concepts {#core-concepts}

### The Three.js Pipeline
```
Scene → Camera → Renderer → Canvas (Screen)
```

### Coordinate System
Three.js uses a **right-handed coordinate system**:
- **X-axis**: Left (-) to Right (+)
- **Y-axis**: Down (-) to Up (+)
- **Z-axis**: Into screen (-) to Out of screen (+)

```javascript
// Example: Position at x=5, y=10, z=15
object.position.set(5, 10, 15);
```

### Units
Three.js doesn't use specific units (meters, feet, etc.). You define what 1 unit means:
- In our project: 1 unit = arbitrary space unit
- Consistency is key!

---

## 3. Scene Setup {#scene-setup}

### Creating a Scene
The scene is like a stage where all your 3D objects live.

```javascript
const scene = new THREE.Scene();
```

### Setting Background Color
```javascript
scene.background = new THREE.Color(0x000000); // Black
// 0x000000 is hexadecimal: 0xRRGGBB
```

**Color Examples:**
- `0x000000` - Black
- `0xffffff` - White
- `0xff0000` - Red
- `0x00ff00` - Green
- `0x0000ff` - Blue

### Adding Objects to Scene
```javascript
scene.add(object); // Add any 3D object
```

---

## 4. Camera Systems {#camera-systems}

### Perspective Camera
Creates realistic perspective (things far away look smaller).

```javascript
const camera = new THREE.PerspectiveCamera(
    fov,      // Field of View (degrees)
    aspect,   // Aspect Ratio (width/height)
    near,     // Near clipping plane
    far       // Far clipping plane
);
```

**Parameters Explained:**

#### Field of View (FOV)
- Angle of view in degrees
- 75° is common (similar to human vision)
- Smaller = zoomed in, Larger = zoomed out

```javascript
const fov = 75; // 75 degrees
```

#### Aspect Ratio
- Width divided by height
- Should match your canvas

```javascript
const aspect = window.innerWidth / window.innerHeight;
```

#### Clipping Planes
- **Near**: Objects closer than this aren't rendered
- **Far**: Objects farther than this aren't rendered
- Keeps only visible objects for performance

```javascript
const near = 0.1;   // Very close
const far = 1000;   // Very far
```

### Positioning the Camera
```javascript
camera.position.set(x, y, z);
camera.position.set(-4.72, 22.20, 24.24); // Our initial position
```

### Looking At Objects
```javascript
camera.lookAt(0, 0, 0); // Look at origin (center)
camera.lookAt(object.position); // Look at specific object
```

---

## 5. Rendering {#rendering}

### WebGL Renderer
Draws your 3D scene to a 2D screen.

```javascript
const renderer = new THREE.WebGLRenderer({ 
    antialias: true  // Smooth edges
});
```

**Antialias**: Smooths jagged edges (costs performance but looks better)

### Setting Size
```javascript
renderer.setSize(window.innerWidth, window.innerHeight);
```

### Pixel Ratio (High-DPI Displays)
```javascript
renderer.setPixelRatio(window.devicePixelRatio);
// Makes it look sharp on Retina/4K displays
```

### Adding to DOM
```javascript
document.getElementById('scene-container').appendChild(renderer.domElement);
// renderer.domElement is the <canvas> element
```

### Rendering a Frame
```javascript
renderer.render(scene, camera);
// Takes a snapshot from camera's perspective
```

---

## 6. Lighting {#lighting}

Light makes objects visible! Without light, everything is black.

### Ambient Light
Soft, uniform light from all directions (like daylight).

```javascript
const ambientLight = new THREE.AmbientLight(
    0xffffff,  // Color (white)
    0.4        // Intensity (0-1+)
);
scene.add(ambientLight);
```

**Use Case**: Base illumination, prevents pure black shadows

### Directional Light
Light from a specific direction (like the sun).

```javascript
const directionalLight = new THREE.DirectionalLight(
    0xffffff,  // Color
    1.2        // Intensity
);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
```

**Key Points:**
- Has direction but no position falloff
- Position determines direction
- Great for sunlight simulation

### Multiple Lights
You can add many lights for realistic scenes:

```javascript
// Main light
const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.position.set(5, 5, 5);

// Fill light (softer, from opposite side)
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-5, -3, -5);

scene.add(mainLight, fillLight);
```

---

## 7. Geometry & Meshes {#geometry-meshes}

### What is Geometry?
Geometry defines the **shape** of an object (vertices, faces).

### Sphere Geometry
```javascript
const geometry = new THREE.SphereGeometry(
    radius,           // Size
    widthSegments,    // Horizontal detail
    heightSegments    // Vertical detail
);
```

**Example:**
```javascript
const geometry = new THREE.SphereGeometry(1.5, 64, 64);
// Radius: 1.5 units
// 64x64 segments = very smooth sphere
```

**Segments**: More segments = smoother but slower
- Low detail: 8-16 segments
- Medium: 32 segments
- High: 64+ segments

### Box Geometry
```javascript
const geometry = new THREE.BoxGeometry(width, height, depth);
const geometry = new THREE.BoxGeometry(1, 1, 1); // Cube
```

### What is a Mesh?
A mesh combines **geometry** (shape) + **material** (appearance).

```javascript
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

**Think of it as:**
- Geometry = Skeleton
- Material = Skin
- Mesh = Complete object

---

## 8. Materials {#materials}

Materials define how objects look and react to light.

### MeshStandardMaterial (Realistic)
Physically-based material that reacts to light realistically.

```javascript
const material = new THREE.MeshStandardMaterial({
    color: 0xff6b35,      // Base color
    roughness: 0.3,       // 0=shiny, 1=matte
    metalness: 0.7,       // 0=non-metal, 1=metal
    emissive: 0xff4500,   // Glow color
    emissiveIntensity: 0.3 // Glow strength
});
```

**Parameters:**

#### Color
Base color of the object
```javascript
color: 0xff6b35  // Orange
```

#### Roughness
How rough/smooth the surface is
```javascript
roughness: 0.0  // Mirror-like
roughness: 0.5  // Semi-glossy
roughness: 1.0  // Completely matte
```

#### Metalness
How metallic the surface is
```javascript
metalness: 0.0  // Plastic/wood
metalness: 0.5  // Semi-metallic
metalness: 1.0  // Pure metal
```

#### Emissive
Makes object glow (doesn't light other objects)
```javascript
emissive: 0xff4500,        // Orange glow
emissiveIntensity: 0.3     // 30% glow
```

### MeshPhysicalMaterial (Advanced)
Most realistic, supports transparency and transmission.

```javascript
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    metalness: 0,
    roughness: 0,
    transmission: 0.9,    // Glass-like transparency
    thickness: 0.5,
    transparent: true,
    opacity: 0.3
});
```

**Transmission**: Makes light pass through (like glass)

### MeshPhongMaterial (Legacy)
Older material, still useful for shiny objects.

```javascript
const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00
});
```

**Important**: Phong materials need lights to be visible!

---

## 9. Textures {#textures}

Textures are images applied to 3D surfaces.

### Texture Loader
```javascript
const textureLoader = new THREE.TextureLoader();
```

### Loading Textures
```javascript
const colorTexture = textureLoader.load('path/to/image.jpg');
```

### Applying Textures
```javascript
const material = new THREE.MeshStandardMaterial({
    map: colorTexture  // Color/diffuse texture
});
```

### Multiple Texture Types

#### Color Map (Diffuse)
The main image/color
```javascript
map: woodColorTexture
```

#### Normal Map
Adds surface detail without geometry
```javascript
normalMap: woodNormalTexture,
normalScale: new THREE.Vector2(0.5, 0.5)  // Strength
```

#### Roughness Map
Varies roughness across surface
```javascript
roughnessMap: woodRoughnessTexture
```

### Complete Textured Material
```javascript
const material = new THREE.MeshStandardMaterial({
    map: colorTexture,              // Base color
    normalMap: normalTexture,       // Surface bumps
    roughnessMap: roughnessTexture, // Shine variation
    roughness: 0.8,
    metalness: 0,
    normalScale: new THREE.Vector2(0.5, 0.5)
});
```

---

## 10. Animation {#animation}

### The Animation Loop
Creates smooth 60 FPS animation.

```javascript
function animate() {
    requestAnimationFrame(animate);  // Call this function next frame
    
    // Update objects here
    sphere.rotation.y += 0.01;
    
    renderer.render(scene, camera);  // Draw the frame
}

animate(); // Start the loop
```

**How it works:**
1. `requestAnimationFrame` calls your function ~60 times/second
2. You update object positions/rotations
3. Renderer draws the new frame
4. Repeat forever

### Rotation
```javascript
object.rotation.x += 0.01;  // Rotate around X axis
object.rotation.y += 0.01;  // Rotate around Y axis
object.rotation.z += 0.01;  // Rotate around Z axis
```

**Units**: Radians (not degrees)
- Full circle = 2π ≈ 6.28 radians
- 90° = π/2 ≈ 1.57 radians

### Orbital Motion
Making objects orbit around a center:

```javascript
let angle = 0;
const radius = 5;
const speed = 0.01;

function animate() {
    requestAnimationFrame(animate);
    
    angle += speed;
    
    // Calculate position on circle
    sphere.position.x = Math.cos(angle) * radius;
    sphere.position.z = Math.sin(angle) * radius;
    
    renderer.render(scene, camera);
}
```

**Math Explained:**
- `cos(angle) * radius` = X position on circle
- `sin(angle) * radius` = Z position on circle
- Increasing angle = moving around circle

### Position
```javascript
object.position.x = 10;
object.position.y = 5;
object.position.z = 0;

// Or all at once:
object.position.set(10, 5, 0);
```

---

## 11. Particle Systems {#particle-systems}

Perfect for stars, snow, rain, etc.

### Creating Particles (Stars)

#### Step 1: Create Geometry
```javascript
const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const positions = new Float32Array(starCount * 3); // x,y,z for each star
```

#### Step 2: Generate Random Positions
```javascript
for (let i = 0; i < starCount * 3; i += 3) {
    // Random position in a sphere
    const radius = 200 + Math.random() * 300;
    const theta = Math.random() * Math.PI * 2;      // Horizontal angle
    const phi = Math.acos((Math.random() * 2) - 1); // Vertical angle
    
    // Convert spherical to Cartesian coordinates
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);     // x
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
    positions[i + 2] = radius * Math.cos(phi);                   // z
}
```

**Spherical Coordinates:**
- `theta` (θ): Rotation around Y axis (0 to 2π)
- `phi` (φ): Angle from top (0 to π)
- `radius`: Distance from center

#### Step 3: Set Positions
```javascript
starGeometry.setAttribute('position', 
    new THREE.BufferAttribute(positions, 3)
);
// 3 = three values per vertex (x, y, z)
```

#### Step 4: Create Material
```javascript
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    sizeAttenuation: true,  // Smaller when far away
    transparent: true,
    opacity: 0.8
});
```

#### Step 5: Create Points Object
```javascript
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);
```

---

## 12. User Interaction {#user-interaction}

### Keyboard Controls

#### Tracking Key States
```javascript
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key in keys) {
        keys[key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (key in keys) {
        keys[key] = false;
    }
});
```

#### Using Key States
```javascript
function updateMovement() {
    if (keys.w) camera.position.z -= 0.1;  // Move forward
    if (keys.s) camera.position.z += 0.1;  // Move backward
    if (keys.a) camera.position.x -= 0.1;  // Move left
    if (keys.d) camera.position.x += 0.1;  // Move right
}

function animate() {
    requestAnimationFrame(animate);
    updateMovement();  // Apply movement
    renderer.render(scene, camera);
}
```

### Mouse Controls

#### First-Person Camera Rotation
```javascript
let isMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;
let cameraRotationX = 0;  // Pitch (up/down)
let cameraRotationY = 0;  // Yaw (left/right)

window.addEventListener('mousedown', (event) => {
    if (event.button === 0) {  // Left click
        isMouseDown = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
});

window.addEventListener('mouseup', () => {
    isMouseDown = false;
});

window.addEventListener('mousemove', (event) => {
    if (!isMouseDown) return;
    
    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;
    
    cameraRotationY += deltaX * 0.003;  // Horizontal rotation
    cameraRotationX -= deltaY * 0.003;  // Vertical rotation
    
    // Limit vertical rotation (prevent flipping)
    cameraRotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraRotationX));
    
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});
```

#### Applying Camera Rotation
```javascript
function updateCamera() {
    // Calculate look direction
    const lookDirection = new THREE.Vector3(
        Math.sin(cameraRotationY) * Math.cos(cameraRotationX),
        Math.sin(cameraRotationX),
        Math.cos(cameraRotationY) * Math.cos(cameraRotationX)
    );
    
    // Look at point in front of camera
    const lookAtPoint = new THREE.Vector3(
        camera.position.x + lookDirection.x,
        camera.position.y + lookDirection.y,
        camera.position.z + lookDirection.z
    );
    
    camera.lookAt(lookAtPoint);
}
```

### Responsive Canvas
```javascript
window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();  // Apply changes
    
    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
});
```

---

## 13. Performance Optimization {#performance}

### Geometry Optimization

#### Reduce Segments
```javascript
// Bad: Too detailed for small objects
const geometry = new THREE.SphereGeometry(0.5, 128, 128);

// Good: Appropriate detail
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
```

#### Reuse Geometry
```javascript
// Bad: Create new geometry for each sphere
for (let i = 0; i < 100; i++) {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

// Good: Reuse same geometry
const geometry = new THREE.SphereGeometry(1, 32, 32);
for (let i = 0; i < 100; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}
```

### Material Optimization

#### Reuse Materials
```javascript
// Create once, use many times
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

const sphere1 = new THREE.Mesh(geometry, material);
const sphere2 = new THREE.Mesh(geometry, material);
```

### Rendering Optimization

#### Frustum Culling
Three.js automatically doesn't render objects outside camera view.

#### Level of Detail (LOD)
Use simpler geometry for distant objects:
```javascript
const lod = new THREE.LOD();

// High detail (close)
lod.addLevel(highDetailMesh, 0);

// Medium detail
lod.addLevel(mediumDetailMesh, 50);

// Low detail (far)
lod.addLevel(lowDetailMesh, 100);

scene.add(lod);
```

---

## Project Architecture: Solar System

### File Structure
```
project/
├── index.html          # HTML structure
├── styles.css          # Styling
├── main.js            # Three.js scene
├── cards.js           # UI interactions
└── assets/
    └── avatar.png     # Images
```

### Data Organization

#### Planet Configuration
```javascript
const sphereConfigs = [
    { 
        radius: 0.6,           // Size
        color: 0x3498db,       // Color
        orbitRadius: 5,        // Distance from sun
        speed: 0.020,          // Orbit speed
        metalness: 0.8         // Material property
    },
    // ... more planets
];
```

#### Creating from Config
```javascript
sphereConfigs.forEach((config, index) => {
    const geometry = new THREE.SphereGeometry(config.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: config.color,
        roughness: 0.4,
        metalness: config.metalness
    });
    const sphere = new THREE.Mesh(geometry, material);
    
    // Store for animation
    additionalSpheres.push({
        mesh: sphere,
        orbitRadius: config.orbitRadius,
        speed: config.speed,
        angle: startAngle
    });
});
```

### Animation System

#### Update Loop
```javascript
function animate() {
    requestAnimationFrame(animate);
    
    // Update camera
    updateMovement();
    updateCamera();
    
    // Update planets
    additionalSpheres.forEach(sphereData => {
        sphereData.angle += sphereData.speed;
        sphereData.mesh.position.x = Math.cos(sphereData.angle) * sphereData.orbitRadius;
        sphereData.mesh.position.z = Math.sin(sphereData.angle) * sphereData.orbitRadius;
        
        // Self-rotation
        sphereData.mesh.rotation.y += 0.01;
    });
    
    renderer.render(scene, camera);
}
```

---

## Common Patterns & Best Practices

### 1. Initialization Pattern
```javascript
// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Configuration
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 5);

// Add to DOM
document.body.appendChild(renderer.domElement);

// Start
animate();
```

### 2. Object Creation Pattern
```javascript
function createPlanet(radius, color, orbitRadius) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = orbitRadius;
    return mesh;
}

const earth = createPlanet(1, 0x0000ff, 10);
scene.add(earth);
```

### 3. Update Pattern
```javascript
const objects = [];

function animate() {
    requestAnimationFrame(animate);
    
    // Update all objects
    objects.forEach(obj => obj.update());
    
    renderer.render(scene, camera);
}
```

---

## Debugging Tips

### 1. Check Console
Always have browser console open (F12)

### 2. Verify Object Addition
```javascript
console.log('Scene children:', scene.children.length);
```

### 3. Check Positions
```javascript
console.log('Camera position:', camera.position);
console.log('Object position:', sphere.position);
```

### 4. Visualize Axes
```javascript
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// Red = X, Green = Y, Blue = Z
```

### 5. Check Lights
```javascript
const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(lightHelper);
```

---

## Next Steps

### Advanced Topics to Explore
1. **Shadows** - Realistic shadow casting
2. **Post-processing** - Screen effects (bloom, blur)
3. **Physics** - Collision detection
4. **3D Models** - Import .gltf/.obj files
5. **Shaders** - Custom visual effects
6. **VR/AR** - Immersive experiences

### Resources
- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Three.js Journey Course](https://threejs-journey.com/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

---

## Summary

You've learned:
✅ Scene, Camera, Renderer setup
✅ Geometry and Mesh creation
✅ Materials and Textures
✅ Lighting systems
✅ Animation loops
✅ Particle systems
✅ User input handling
✅ Performance optimization

**Congratulations!** You now understand the fundamentals of Three.js and can build interactive 3D experiences! 🚀

---

*Created by Zineddine - Solar System Project 2025*
