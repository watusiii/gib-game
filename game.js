import { GibCharacter } from './gib-character.js';
import { Platform } from './platform.js';
import { CollisionManager } from './collision-manager.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Disable image smoothing for crisp pixels
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        
        this.setupCanvas();
        window.addEventListener('resize', () => this.setupCanvas());

        // Create collision manager
        this.collisionManager = new CollisionManager();

        // Debug mode for collision boxes
        this.debugMode = true;
        
        // Create character instance
        this.character = new GibCharacter(this);
        this.collisionManager.addEntity(this.character);
        
        // Create test platforms
        this.platforms = [
            new Platform(this, 300, 400, 200, 20),  // Mid-height platform
            new Platform(this, 600, 300, 200, 20),  // Higher platform
            new Platform(this, 100, 500, 200, 20)   // Lower platform
        ];
        
        this.platforms.forEach(platform => {
            this.collisionManager.addEntity(platform);
        });
        
        requestAnimationFrame(() => this.gameLoop());

        // Add debug toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'b') {
                this.debugMode = !this.debugMode;
                [this.character, ...this.platforms].forEach(entity => {
                    entity.setDebug(this.debugMode);
                });
            }
            // Add sprite outline debug toggle
            if (e.key === 'v') {
                this.character.debugSprites = !this.character.debugSprites;
            }
        });
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.groundHeight = Math.floor(this.canvas.height / 3);
        
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
    }

    drawGround() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, this.canvas.height - this.groundHeight, 
                         this.canvas.width, this.groundHeight);
    }

    update() {
        this.character.update();
        this.collisionManager.update();
    }

    render() {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGround();
        
        // Render platforms
        this.platforms.forEach(platform => {
            platform.render(this.ctx);
        });
        
        this.character.render(this.ctx);
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
}; 