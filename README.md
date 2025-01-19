# GIB Character System (づ｡◕‿‿◕｡)づ

A modular pixel character framework for all GIB Raiders game projects! Build your own games with our community's character system. Pure JavaScript, infinitely customizable, ready to GIB! 

## ⭐ Why Use This?

- **Drop-in Ready**: Add to any web game project in minutes
- **Community Resource**: Built by Raiders, for Raiders
- **Pixel Perfect**: Crisp, clean, retro style
- **Ultra Light**: No dependencies, just pure JavaScript goodness

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
   gib-character.js   # The core system
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

4. GIB IT LIFE! (づ｡◕‿‿◕｡)づ

## 🎮 Demo Controls

- **Move**: `A`/`D` or Arrow Keys
- **Jump**: `Space`
- **Customize Parts**: Number Keys `1-6`

## 🚀 For Developers

- **HTML Setup**:
  ```html
  <!-- Make sure to use type="module" -->
  <script type="module" src="your-game.js"></script>
  ```

- **Game Context Requirements**:
  ```javascript
  // Your game context needs:
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

Made with 💜 by the GIB Raiders Community 