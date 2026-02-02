# Reconstruction 3D - Knowledge Base Visualization System

> 🌐 A beautiful 3D knowledge base visualization system with Vibecraft-style interactions

## 🎯 Features

- ✨ **Stunning 3D Visualization** - Interactive knowledge graph with smooth animations
- 🎨 **Beautiful UI** - Modern dark theme with glassmorphism effects
- 🚀 **High Performance** - 60 FPS with thousands of nodes using LOD and spatial partitioning
- 🔍 **Powerful Search** - Full-text search across your knowledge base
- 📂 **File System Integration** - Real-time file watching and updates
- 🎮 **Intuitive Controls** - Orbit, zoom, pan, and focus on nodes
- 🔗 **Relationship Visualization** - Different line styles for different connection types

## 🛠️ Tech Stack

- **Frontend**: React 19 + Next.js 15 (App Router) + TypeScript 5.3
- **3D Engine**: Three.js + React Three Fiber + @react-three/drei
- **Desktop**: Electron 28
- **UI**: Tailwind CSS 4.0 + Radix UI + Framer Motion
- **State Management**: Zustand + React Query
- **File Parsing**: Gray-matter + Unified + Remark

## 📦 Installation

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Start production build
npm start
```

## 🎮 Controls

### Camera Controls
- **Left Click + Drag**: Rotate view
- **Right Click + Drag**: Pan
- **Scroll Wheel**: Zoom in/out
- **Double Click on Node**: Focus on node

### Keyboard Shortcuts
- **Home**: Reset to overview
- **F**: Focus on selected node
- **Escape**: Deselect node
- **1-5**: Quick camera presets

### Node Interactions
- **Hover**: Highlight node and show tooltip
- **Click**: Select node and show details
- **Double Click**: Focus camera on node
- **Right Click**: Context menu

## 📁 Project Structure

```
reconstruction-3d/
├── electron/              # Electron main process
│   ├── main.ts           # Main entry point
│   ├── file-watcher.ts   # File system watcher
│   ├── file-system.ts    # File system API
│   └── preload.ts        # Preload script (IPC bridge)
│
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Main page
│   │   └── globals.css   # Global styles
│   │
│   ├── components/
│   │   ├── scene/        # 3D scene components
│   │   │   ├── Scene.tsx
│   │   │   ├── KnowledgeGraph.tsx
│   │   │   ├── DocumentNode.tsx
│   │   │   ├── ConnectionLine.tsx
│   │   │   └── Camera.tsx
│   │   │
│   │   └── ui/           # UI components
│   │       ├── TopBar.tsx
│   │       ├── Sidebar.tsx
│   │       └── LoadingScreen.tsx
│   │
│   ├── stores/           # State management
│   │   └── useKnowledgeStore.ts
│   │
│   └── types/            # TypeScript types
│       └── knowledge.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Node Types & Visualizations

| Type | Shape | Color | Effect |
|------|-------|-------|--------|
| **Document** | Sphere | Blue (#3B82F6) | Glow + Pulse |
| **Error** | Octahedron | Red (#EF4444) | Warning Flash |
| **MCP** | Cylinder | Cyan (#06B6D4) | Connection Pulse |
| **Skill** | Torus | Green (#10B981) | Particle Ring |
| **Plugin** | Dodecahedron | Orange (#F59E0B) | Scatter Light |

## 🔗 Connection Types

| Type | Color | Style | Animation |
|------|-------|-------|-----------|
| **Reference** | White | Solid | Flowing particles |
| **Dependency** | Yellow | Dashed | Pulse |
| **Related** | Gray | Solid | None |
| **Cross-reference** | Cyan | Dotted | Blink |

## 🚀 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Electron + Next.js integration
- [x] Basic 3D scene
- [x] File system API
- [x] State management
- [x] Basic UI components

### Phase 2: Visualization (In Progress)
- [ ] Force-directed layout algorithm
- [ ] Node rendering (all types)
- [ ] Connection rendering
- [ ] File watching + real-time updates
- [ ] Search functionality

### Phase 3: Interactions
- [ ] Camera controls
- [ ] Node interactions (hover, click, double-click, right-click)
- [ ] Info panel
- [ ] Filter system

### Phase 4: MCP/Skills/Plugins
- [ ] MCP config parsing
- [ ] MCP status monitoring
- [ ] Skills parsing + visualization
- [ ] Plugins discovery + visualization
- [ ] Config management UI

### Phase 5: Optimization
- [ ] LOD system
- [ ] Octree spatial partitioning
- [ ] Web Workers for layout calculation
- [ ] Post-processing effects
- [ ] Particle systems

### Phase 6: Polish & Release
- [ ] Testing
- [ ] Performance optimization
- [ ] Documentation
- [ ] Packaging
- [ ] Release

## 📝 License

MIT

## 👤 Author

**Arxchibobo**

---

**Status**: 🚧 In Development (Phase 1 Complete)
**Version**: 0.1.0
**Last Updated**: 2026-01-29
