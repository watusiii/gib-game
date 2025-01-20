# GIB Character System (づ｡◕‿‿◕｡)づ

A modular pixel character framework for all GIB Raiders game projects! Build your own games with our community's character system. Pure JavaScript, infinitely customizable, ready to GIB! 

## ⭐ Why Use This?

- **Drop-in Ready**: Add to any web game project in minutes
- **Community Resource**: Built by Raiders, for Raiders
- **Pixel Perfect**: Crisp, clean, retro style
- **Ultra Light**: No dependencies, just pure JavaScript goodness
- **Unity-like Collisions**: Entity-based collision system with event handling

## 🎮 Core Systems

### Character System
- Modular 10x10 pixel sprites
- Hot-swappable character parts
- Smooth animations and physics
- Scale-independent rendering

### Collision System
- Entity-based architecture
- Multiple collision box types:
  - `hitbox`: For physical collisions
  - `hurtbox`: For damage detection
  - `interaction`: For item pickup/NPC interaction
- Event-driven collision handling
- Debug visualization (press 'B' to toggle)
- Sprite boundary visualization (press 'V' to toggle)

## 🔧 Quick Setup

1. **Local Server Setup** (choose one):
   ```bash
   # Using Python 3
   python -m http.server

   # Using Python 2
   python -m SimpleHTTPServer

   # Using Node.js
   npm install -g http-server
   http-server
   
   # Using VS Code
   Install "Live Server" extension and click "Go Live"
   ```

2. **Add Files to Your Project**:
   ```
   gib-character.js   # The core character system
   entity.js          # Base entity class
   collision-box.js   # Collision system
   sheet-export.png   # The sprite sheet
   ```

3. **Import and Create**:
   ```javascript
   import { GibCharacter } from './gib-character.js';

   // Create character (needs canvas context with groundHeight property)
   const character = new GibCharacter(gameContext);

   // In your game loop
   character.update();
   character.render(ctx);
   ```

## 🎮 Controls

- **Move**: `A`/`D` or Arrow Keys
- **Jump**: `Space`
- **Customize Parts**: Number Keys `1-6`
- **Toggle Collision Boxes**: `B`
- **Toggle Sprite Outlines**: `V`

## 🚀 For Developers

### Creating New Entities
```javascript
class MyEntity extends Entity {
    constructor(gameContext) {
        super(gameContext);
        
        // Add collision boxes
        this.addCollisionBox('main', {
            width: this.width * 0.8,
            height: this.height * 0.8,
            type: 'hitbox'
        });
        
        // Handle collisions
        this.onCollision('main', (other, boxName) => {
            // Collision response here
        });
    }
}
```

### Game Context Requirements
```javascript
{
    canvas: HTMLCanvasElement,    // The game canvas
    groundHeight: number,         // Height of ground from bottom
    ctx: CanvasRenderingContext2D // 2D rendering context
}
```

## 🎨 Sprite System

Each character is built from 6 modular 10x10 pixel parts:
- Independently animated
- Hot-swappable
- Easy to create new variations

## 🌟 Community Resource

This is YOUR character system! Feel free to:
- Use in your GIB games
- Create new sprite variations
- Share your implementations
- Build something awesome!

## 🎮 Try the Demo

1. Set up a local server (see Quick Setup)
2. Open in your browser (usually `http://localhost:8000`)
3. Start GIBing! (づ｡◕‿‿◕｡)づ

## 🔄 Updates & Contributions

Got ideas? Want to add features? Let's make it even better together!

## 🛠️ Troubleshooting

- **"Failed to load module script"**: Make sure you're running a local server
- **Black rectangles instead of sprites**: Check if sprite sheet path is correct
- **No movement**: Ensure game context has required properties
- **Collision boxes not showing**: Press 'B' to toggle debug mode

Made with 💜 by the GIB Raiders Community 