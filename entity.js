import { CollisionBox } from './collision-box.js';

export class Entity {
    constructor(gameContext, config = {}) {
        this.game = gameContext;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 0;
        this.height = config.height || 0;
        this.scale = config.scale || 1;
        
        // Collision system
        this.collisionBoxes = {};
        this.collisionHandlers = new Map();
        
        // Debug
        this.debug = config.debug || false;
    }

    addCollisionBox(name, config) {
        this.collisionBoxes[name] = new CollisionBox({
            ...config,
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
        // Update collision boxes positions
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