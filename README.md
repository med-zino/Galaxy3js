# Three.js Solar System Project 🚀

A comprehensive Three.js learning project featuring an interactive 3D solar system simulation with complete documentation.

## 🌟 Features

### 1. Interactive 3D Solar System
- **Realistic planetary orbits** with varying speeds
- **First-person camera controls** (WASD + Mouse)
- **Particle star field** with 2000+ stars
- **Dynamic lighting** system
- **Smooth animations** at 60 FPS

### 2. Beautiful Documentation Blog
- **GitHub-inspired design** with clean, modern UI
- **Dark/Light mode toggle** with system preference detection
- **Sticky table of contents** for easy navigation
- **Copy-to-clipboard** for all code blocks
- **Reading progress indicator**
- **Smooth scroll navigation**
- **Fully responsive** design

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd windsurf-project-2

# Install dependencies
npm install

# Start development server
npm start
```

### Access the Project

- **Space Simulation**: Open `http://localhost:5173` (or the port Vite assigns)
- **Documentation Blog**: Open `blog.html` directly in your browser or via the dev server

## 📁 Project Structure

```
windsurf-project-2/
├── index.html              # Main space simulation page
├── blog.html              # Documentation blog page
├── main.js                # Three.js scene logic
├── cards.js               # UI card interactions
├── styles.css             # Space simulation styles
├── blog-styles.css        # Blog styles with theming
├── blog-script.js         # Blog functionality
├── THREE_JS_COURSE.md     # Original markdown documentation
├── package.json           # Project dependencies
└── README.md             # This file
```

## 🎮 Controls (Space Simulation)

### Keyboard
- **W** - Move forward
- **S** - Move backward
- **A** - Move left
- **D** - Move right

### Mouse
- **Left Click + Drag** - Look around (first-person view)

### UI
- **Info Cards** - Click on planet cards to learn more
- **Responsive** - Works on desktop and mobile

## 📚 Documentation Blog Features

### Theme Toggle
- Click the theme button (top-right) to switch between light/dark mode
- **Keyboard shortcut**: `Ctrl/Cmd + Shift + T`
- Automatically detects system preference
- Saves your preference in localStorage

### Navigation
- **Sticky TOC** - Always visible while scrolling
- **Active section highlighting** - Shows current section
- **Smooth scrolling** - Click any TOC link
- **Reading progress bar** - Top of page

### Code Blocks
- **Syntax highlighting** for JavaScript
- **Copy button** - Hover over code blocks
- **Responsive** - Horizontal scroll on mobile

## 🛠️ Technologies Used

### Core
- **Three.js** (v0.162.0) - 3D graphics library
- **Vite** (v5.0.0) - Build tool and dev server
- **Vanilla JavaScript** - No framework dependencies

### Design
- **CSS Variables** - For theming
- **Flexbox & Grid** - Modern layouts
- **CSS Animations** - Smooth transitions
- **Responsive Design** - Mobile-first approach

## 📖 Learning Resources

The project includes comprehensive documentation covering:

1. **Introduction to Three.js** - Basics and setup
2. **Core Concepts** - Coordinate systems and pipeline
3. **Scene Setup** - Creating and configuring scenes
4. **Camera Systems** - Perspective cameras explained
5. **Rendering** - WebGL renderer configuration
6. **Lighting** - Ambient and directional lights
7. **Geometry & Meshes** - Creating 3D objects
8. **Materials** - PBR materials and properties
9. **Textures** - Loading and applying textures
10. **Animation** - Animation loops and orbital motion
11. **Particle Systems** - Creating star fields
12. **User Interaction** - Keyboard and mouse controls
13. **Performance Optimization** - Best practices

## 🎨 Customization

### Modify Planets

Edit the `sphereConfigs` array in `main.js`:

```javascript
const sphereConfigs = [
    { 
        radius: 0.6,           // Planet size
        color: 0x3498db,       // Color (hex)
        orbitRadius: 5,        // Distance from sun
        speed: 0.020,          // Orbit speed
        metalness: 0.8         // Material property
    },
    // Add more planets...
];
```

### Change Theme Colors

Edit CSS variables in `blog-styles.css`:

```css
:root {
    --bg-primary: #ffffff;
    --text-primary: #24292f;
    --accent-color: #0969da;
    /* Modify colors here */
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Netlify

The project includes a `netlify.toml` configuration file. Simply:

1. Push to GitHub
2. Connect repository to Netlify
3. Deploy automatically

### Deploy to Other Platforms

- **Vercel**: Import from GitHub
- **GitHub Pages**: Use `gh-pages` branch
- **Cloudflare Pages**: Connect repository

## 🤝 Contributing

Feel free to fork this project and make it your own! Some ideas:

- Add more planets with realistic textures
- Implement planet selection/focus
- Add asteroid belt
- Include planet information panels
- Add sound effects
- Create VR/AR version

## 📝 License

This project is open source and available for learning purposes.

## 👨‍💻 Author

**Zineddine** - Solar System Project 2025

---

## 🎯 Key Takeaways

This project demonstrates:

✅ **Three.js fundamentals** - Scene, camera, renderer
✅ **3D mathematics** - Orbital motion, rotations
✅ **User interaction** - Keyboard and mouse controls
✅ **Performance optimization** - Geometry reuse, LOD
✅ **Modern web design** - Responsive, accessible
✅ **Documentation** - Clear, comprehensive guides
✅ **Theme implementation** - Dark/light mode
✅ **Best practices** - Clean code, modular structure

## 🔗 Useful Links

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Three.js Journey](https://threejs-journey.com/)

---

**Happy Coding! 🚀✨**
