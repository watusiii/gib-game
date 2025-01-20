import { GibCharacter } from './gib-character.js';

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

        // Debug mode for collision boxes
        this.debugMode = true;
        
        // Create character instance
        this.character = new GibCharacter(this);
        
        requestAnimationFrame(() => this.gameLoop());

        // Add debug toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'b') {
                this.debugMode = !this.debugMode;
                Object.values(this.character.collisionBoxes)
                    .forEach(box => box.debug = this.debugMode);
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
    }

    render() {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGround();
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