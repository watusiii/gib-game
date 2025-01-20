import { CollisionBox } from './collision-box.js';

export class Entity {
    constructor(gameContext, config = {}) {
        this.game = gameContext;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.scale = config.scale || 1;
        
        // Sprite configuration
        this.spriteSize = config.spriteSize || 10;  // Default 10x10 sprites
        this.spriteCols = config.spriteCols || 1;   // Number of sprites horizontally
        this.spriteRows = config.spriteRows || 1;   // Number of sprites vertically
        
        // Calculate total dimensions based on sprite configuration
        this.width = this.spriteSize * this.spriteCols * this.scale;
        this.height = this.spriteSize * this.spriteRows * this.scale;
        
        // Collision system
        this.collisionBoxes = {};
        this.collisionHandlers = new Map();
        
        // Debug
        this.debug = config.debug || false;
    }

    // Helper method to get actual rendered dimensions
    getRenderedDimensions() {
        return {
            width: this.width,
            height: this.height,
            spriteWidth: this.spriteSize * this.scale,
            spriteHeight: this.spriteSize * this.scale
        };
    }

    // Helper to calculate collision box size relative to entity size
    calculateBoxSize(widthPercent, heightPercent) {
        return {
            width: this.width * widthPercent,
            height: this.height * heightPercent
        };
    }

    addCollisionBox(name, config) {
        // If percentages are provided, calculate actual sizes
        if (config.widthPercent || config.heightPercent) {
            const size = this.calculateBoxSize(
                config.widthPercent || 1, 
                config.heightPercent || 1
            );
            config.width = size.width;
            config.height = size.height;
        }

        // Create collision box with current entity position
        this.collisionBoxes[name] = new CollisionBox({
            ...config,
            x: this.x,
            y: this.y,
            debug: this.debug
        });

        return this.collisionBoxes[name];
    }

    onCollision(boxName, handler) {
        if (!this.collisionHandlers.has(boxName)) {
            this.collisionHandlers.set(boxName, []);
        }
        this.collisionHandlers.get(boxName).push(handler);
    }

    handleCollision(boxName, other, otherBoxName) {
        const handlers = this.collisionHandlers.get(boxName);
        if (handlers) {
            handlers.forEach(handler => handler(other, otherBoxName));
        }
    }

    update() {
        // Update all collision boxes with current entity position
        Object.values(this.collisionBoxes).forEach(box => {
            box.update(this.x, this.y, this.scale);
        });
    }

    render(ctx) {
        // Render collision boxes in debug mode
        if (this.debug) {
            Object.values(this.collisionBoxes).forEach(box => {
                box.render(ctx);
            });
        }
    }

    setDebug(enabled) {
        this.debug = enabled;
        Object.values(this.collisionBoxes).forEach(box => {
            box.debug = enabled;
        });
    }
} 