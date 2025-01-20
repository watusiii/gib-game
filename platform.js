import { Entity } from './entity.js';

export class Platform extends Entity {
    constructor(gameContext, x, y, width = 100, height = 20) {
        // Calculate sprite columns and rows based on dimensions
        const spriteCols = Math.ceil(width / 20);
        const spriteRows = Math.ceil(height / 20);
        
        super(gameContext, {
            x,
            y,
            spriteSize: 20,
            spriteCols,
            spriteRows,
            scale: 1,
            debug: true
        });

        // Store actual dimensions
        this.actualWidth = width;
        this.actualHeight = height;

        // Add collision box for the entire platform
        this.addCollisionBox('platform', {
            width: this.actualWidth,
            height: this.actualHeight,
            type: 'platform',
            color: 'rgba(0, 255, 0, 0.3)',
            debug: true,
            // Initialize at platform position
            x: this.x,
            y: this.y
        });
    }

    update() {
        // Ensure collision boxes stay with platform
        super.update();
    }

    render(ctx) {
        // Draw platform base
        ctx.fillStyle = '#666';
        ctx.fillRect(this.x, this.y, this.actualWidth, this.actualHeight);

        // Draw platform edge highlight
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.actualWidth, this.actualHeight);

        // Draw grid for debugging
        if (this.debug) {
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 1;
            
            // Vertical grid lines
            for (let i = 1; i < this.spriteCols; i++) {
                const x = this.x + (i * this.spriteSize);
                ctx.beginPath();
                ctx.moveTo(x, this.y);
                ctx.lineTo(x, this.y + this.actualHeight);
                ctx.stroke();
            }
            
            // Horizontal grid lines
            for (let i = 1; i < this.spriteRows; i++) {
                const y = this.y + (i * this.spriteSize);
                ctx.beginPath();
                ctx.moveTo(this.x, y);
                ctx.lineTo(this.x + this.actualWidth, y);
                ctx.stroke();
            }
        }

        // Render collision boxes from Entity
        super.render(ctx);
    }
} 