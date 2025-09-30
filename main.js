import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black space background

// Create a camera
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(-4.72, 22.20, 24.24); // Initial camera position
camera.lookAt(0, 0, 0); // Look at the center where sphere will be

// Store initial camera position for reset
const initialCameraPosition = { x: -4.72, y: 22.20, z: 24.24 };
const initialCameraRotation = { x: -0.873, y: 2.509 };

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Add enhanced lighting for realistic wood appearance
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft ambient light
scene.add(ambientLight);

// Main directional light (like sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Add a second light from the opposite side for better depth
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-5, -3, -5);
scene.add(fillLight);

// Create starfield background
const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i += 3) {
    // Random positions in a large sphere around the scene
    const radius = 200 + Math.random() * 300; // Stars far away
    const theta = Math.random() * Math.PI * 2; // Random angle around
    const phi = Math.acos((Math.random() * 2) - 1); // Random angle up/down
    
    starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);     // x
    starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
    starPositions[i + 2] = radius * Math.cos(phi);                   // z
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create realistic wood sphere with texture
const textureLoader = new THREE.TextureLoader();

// Load wood textures from online sources
const woodColorTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
const woodNormalTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_bump.jpg');
const woodRoughnessTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_roughness.jpg');

// Create high-quality sphere geometry
const woodGeometry = new THREE.SphereGeometry(1.5, 64, 64);

// Create realistic wood material with textures
const woodMaterial = new THREE.MeshStandardMaterial({
    map: woodColorTexture,              // Color/diffuse texture
    normalMap: woodNormalTexture,       // Adds surface detail
    roughnessMap: woodRoughnessTexture, // Controls shininess variation
    roughness: 0.8,
    metalness: 0,
    normalScale: new THREE.Vector2(0.5, 0.5) // Subtle bump effect
});

const woodSphere = new THREE.Mesh(woodGeometry, woodMaterial);
woodSphere.position.set(8, 0, 0); // Start at distance 8 from center
scene.add(woodSphere);

// Create 5 additional orbiting spheres with different properties
const additionalSpheres = [];
const sphereConfigs = [
    { radius: 0.6, color: 0x3498db, orbitRadius: 5, speed: 0.020, metalness: 0.8 },   // Blue, close & very fast
    { radius: 0.8, color: 0xe74c3c, orbitRadius: 12, speed: 0.007, metalness: 0.3 },  // Red, far & slow
    { radius: 0.5, color: 0x2ecc71, orbitRadius: 7, speed: 0.014, metalness: 0.5 },   // Green, medium & fast
    { radius: 0.7, color: 0xf39c12, orbitRadius: 16, speed: 0.004, metalness: 0.6 },  // Orange, very far & very slow
    { radius: 0.9, color: 0x9b59b6, orbitRadius: 10, speed: 0.009, metalness: 0.4 }   // Purple, medium-far
];

sphereConfigs.forEach((config, index) => {
    const geometry = new THREE.SphereGeometry(config.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: config.color,
        roughness: 0.4,
        metalness: config.metalness
    });
    const sphere = new THREE.Mesh(geometry, material);
    
    // Set initial position on orbit
    const startAngle = (index / sphereConfigs.length) * Math.PI * 2; // Spread them out
    sphere.position.x = Math.cos(startAngle) * config.orbitRadius;
    sphere.position.z = Math.sin(startAngle) * config.orbitRadius;
    
    scene.add(sphere);
    
    // Store sphere with its orbit properties
    additionalSpheres.push({
        mesh: sphere,
        orbitRadius: config.orbitRadius,
        speed: config.speed,
        angle: startAngle
    });
});

// Create a larger central sphere (like a sun/planet)
const centralGeometry = new THREE.SphereGeometry(2.5, 64, 64);
const centralMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b35,
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0xff4500,
    emissiveIntensity: 0.3
});
const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
centralSphere.position.set(0, 0, 0); // At the center
scene.add(centralSphere);

// Orbit parameters
let orbitAngle = 0;
const orbitRadius = 8;
const orbitSpeed = 0.011;

// Draw orbit paths for all spheres
function createOrbitLine(radius, color = 0xffffff) {
    const curve = new THREE.EllipseCurve(
        0, 0,
        radius, radius,
        0, 2 * Math.PI,
        false,
        0
    );
    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.3
    });
    const line = new THREE.Line(geometry, material);
    line.rotation.x = Math.PI / 2;
    return line;
}

// Create orbit line for wood sphere
scene.add(createOrbitLine(orbitRadius, 0xffffff));

// Create orbit lines for additional spheres
sphereConfigs.forEach(config => {
    scene.add(createOrbitLine(config.orbitRadius, config.color));
});

// Movement controls
const moveSpeed = 0.1;
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    q: false, // Move up
    e: false  // Move down
};

// Camera rotation controls (first-person style)
let isLeftMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;
let cameraRotationX = initialCameraRotation.x; // Pitch (up/down)
let cameraRotationY = initialCameraRotation.y; // Yaw (left/right)
const mouseSensitivity = 0.003;

// Keyboard event listeners
window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key in keys) {
        keys[key] = true;
    }
    
    // Press 'P' to reset camera to initial position
    if (key === 'p') {
        camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
        cameraRotationX = initialCameraRotation.x;
        cameraRotationY = initialCameraRotation.y;
        console.log('Camera reset to initial position!');
    }
});

window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (key in keys) {
        keys[key] = false;
    }
});

// Mouse event listeners for camera rotation
window.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // Left mouse button
        isLeftMouseDown = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
});

window.addEventListener('mouseup', (event) => {
    if (event.button === 0) {
        isLeftMouseDown = false;
    }
});

window.addEventListener('mousemove', (event) => {
    if (isLeftMouseDown) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;
        
        cameraRotationY += deltaX * mouseSensitivity; // Yaw (left/right)
        cameraRotationX -= deltaY * mouseSensitivity; // Pitch (up/down) - inverted for natural feel
        
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
});

// Function to update camera position based on keys pressed
function updateMovement() {
    // Calculate forward/right directions based on camera rotation
    const forward = new THREE.Vector3(
        Math.sin(cameraRotationY),
        0,
        Math.cos(cameraRotationY)
    );
    const right = new THREE.Vector3(
        Math.cos(cameraRotationY),
        0,
        -Math.sin(cameraRotationY)
    );
    
    if (keys.w) camera.position.addScaledVector(forward, moveSpeed); // Move forward
    if (keys.s) camera.position.addScaledVector(forward, -moveSpeed); // Move backward
    if (keys.a) camera.position.addScaledVector(right, -moveSpeed); // Move left
    if (keys.d) camera.position.addScaledVector(right, moveSpeed); // Move right
    if (keys.q) camera.position.y += moveSpeed; // Move up
    if (keys.e) camera.position.y -= moveSpeed; // Move down
}

// Function to update camera rotation (first-person view)
function updateCamera() {
    // Limit vertical rotation to prevent flipping
    cameraRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotationX));
    
    // Calculate the direction the camera is looking at
    const lookDirection = new THREE.Vector3(
        Math.sin(cameraRotationY) * Math.cos(cameraRotationX),
        Math.sin(cameraRotationX),
        Math.cos(cameraRotationY) * Math.cos(cameraRotationX)
    );
    
    // Set camera to look at a point in front of it
    const lookAtPoint = new THREE.Vector3(
        camera.position.x + lookDirection.x,
        camera.position.y + lookDirection.y,
        camera.position.z + lookDirection.z
    );
    
    camera.lookAt(lookAtPoint);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update movement based on key presses
    updateMovement();
    
    // Update camera position based on mouse rotation
    updateCamera();
    
    // Make wood sphere orbit around the central sphere
    orbitAngle += orbitSpeed;
    woodSphere.position.x = Math.cos(orbitAngle) * orbitRadius;
    woodSphere.position.z = Math.sin(orbitAngle) * orbitRadius;
    
    // Rotate wood sphere on its own axis
    woodSphere.rotation.y += 0.005;
    woodSphere.rotation.x += 0.002;
    
    // Update all additional orbiting spheres
    additionalSpheres.forEach(sphereData => {
        sphereData.angle += sphereData.speed;
        sphereData.mesh.position.x = Math.cos(sphereData.angle) * sphereData.orbitRadius;
        sphereData.mesh.position.z = Math.sin(sphereData.angle) * sphereData.orbitRadius;
        
        // Rotate each sphere on its own axis
        sphereData.mesh.rotation.y += 0.01;
        sphereData.mesh.rotation.x += 0.005;
    });
    
    // Rotate central sphere slowly
    centralSphere.rotation.y += 0.002;
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();
