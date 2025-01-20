# GIB Engine System (づ｡◕‿‿◕｡)づ

A modular framework for all GIB Raiders game projects! Build your own games with our community's character system. Pure JavaScript, infinitely customizable, ready to GIB! 

## ⭐ Features

- **Modular Character System**: 
  - 6-part character composition (arms, eyes, mouth, item)
  - Hot-swappable sprite parts
  - Independent part animations
  - Scale-independent rendering

- **Advanced Collision System**:
  - Entity-based architecture
  - Multiple collision box types:
    - `hitbox`: For physical collisions (centered on character)
    - `interaction`: For item pickup/NPC interaction (larger area around character)
    - `platform`: For solid objects and surfaces
  - Event-driven collision handling
  - Visual debugging tools

- **Platform System**:
  - Solid collision detection
  - Grid-based sprite system
  - Customizable dimensions
  - Automatic collision box generation

- **Debug Features**:
  - 'B' key: Toggle collision box visualization
  - 'V' key: Toggle sprite part boundaries
  - Real-time dimension display
  - Color-coded collision types

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
   gib-character.js   # Core character system
   entity.js          # Base entity class
   collision-box.js   # Collision system
   platform.js        # Platform system
   sheet-export.png   # Character sprite sheet
   ```

3. **Import and Create Character**:
   ```javascript
   import { GibCharacter } from './gib-character.js';

   const character = new GibCharacter(gameContext);
   ```

4. **Add Platforms**:
   ```javascript
   import { Platform } from './platform.js';

   const platform = new Platform(gameContext, x, y, width, height);
   ```

## 🎮 Controls

- **Movement**: Arrow Keys or A/D
- **Jump**: Space
- **Change Parts**: Number Keys 1-6
- **Debug Toggles**:
  - B: Show collision boxes
  - V: Show sprite boundaries

## 🚀 For Developers

### Entity System
All game objects inherit from the Entity base class:
```javascript
class MyEntity extends Entity {
    constructor(gameContext) {
        super(gameContext, {
            spriteSize: 20,    // Size of each sprite
            spriteCols: 2,     // Horizontal sprites
            spriteRows: 2,     // Vertical sprites
            scale: 1           // Render scale
        });

        // Add collision boxes
        this.addCollisionBox('main', {
            widthPercent: 0.8,   // Percent of entity width
            heightPercent: 0.8,   // Percent of entity height
            offset: {            // Position offset
                x: this.width * 0.1,
                y: this.height * 0.1
            },
            type: 'hitbox'
        });
    }
}
```

### Collision System
Collision boxes can be:
- Percentage-based or fixed size
- Offset from parent entity
- Multiple types per entity
- Event-driven responses

```javascript
// Handle collisions
this.onCollision('boxName', (other, otherBoxName) => {
    if (other.constructor.name === 'Platform') {
        // Handle platform collision
    }
});
```

### Platform Creation
```javascript
const platform = new Platform(gameContext, 100, 300, 200, 20);
```

## 🎨 Sprite System

Character sprites are:
- 10x10 pixels each
- Arranged in 6 columns (parts)
- Multiple variations per part
- Independently animated

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
- **Sprite boundaries not visible**: Press 'V' to toggle sprite debug
- **Platform collision issues**: Ensure collision boxes are properly sized
- **Character not landing**: Check platform collision box type is 'platform'

## 🔄 Future Enhancements

- Moving platforms
- More collision box types
- Additional character parts
- Animation system expansion

Made with 💜 by the GIB Raiders Community 