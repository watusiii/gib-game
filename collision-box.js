export class CollisionBox {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 10;
        this.height = config.height || 10;
        this.type = config.type || 'hitbox'; // hitbox, hurtbox, interaction, platform
        this.offset = config.offset || { x: 0, y: 0 };
        this.active = config.active !== undefined ? config.active : true;
        this.debug = config.debug || false;
        this.color = config.color || this.getDefaultColor();
    }

    getDefaultColor() {
        switch(this.type) {
            case 'hitbox': return 'rgba(255, 0, 0, 0.3)';
            case 'hurtbox': return 'rgba(0, 0, 255, 0.3)';
            case 'interaction': return 'rgba(0, 255, 0, 0.3)';
            case 'platform': return 'rgba(255, 255, 0, 0.3)';
            default: return 'rgba(255, 255, 255, 0.3)';
        }
    }

    update(parentX, parentY, scale = 1) {
        // Always update base position to parent's position
        this.x = parentX;
        this.y = parentY;

        // Apply offset if exists
        if (this.offset) {
            this.x += this.offset.x * scale;
            this.y += this.offset.y * scale;
        }
    }

    intersects(other) {
        return this.active && other.active &&
               this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }

    render(ctx) {
        if (!this.debug || !this.active) return;
        
        ctx.save();
        
        // Fill collision box
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw outline
        ctx.strokeStyle = this.color.replace('0.3', '1.0');
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw type label and dimensions
        ctx.fillStyle = '#000';
        ctx.font = '12px monospace';
        ctx.fillText(`${this.type} (${Math.round(this.width)}x${Math.round(this.height)})`, 
                    this.x + 4, this.y + 16);
        
        ctx.restore();
    }
} 