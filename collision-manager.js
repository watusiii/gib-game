export class CollisionManager {
    constructor() {
        this.entities = new Set();
    }

    addEntity(entity) {
        this.entities.add(entity);
    }

    removeEntity(entity) {
        this.entities.delete(entity);
    }

    update() {
        // Check collisions between all entities
        const entities = Array.from(this.entities);
        
        for (let i = 0; i < entities.length; i++) {
            const entityA = entities[i];
            
            for (let j = i + 1; j < entities.length; j++) {
                const entityB = entities[j];
                
                // Check collisions between all collision boxes
                Object.entries(entityA.collisionBoxes).forEach(([boxNameA, boxA]) => {
                    Object.entries(entityB.collisionBoxes).forEach(([boxNameB, boxB]) => {
                        if (boxA.intersects(boxB)) {
                            // Notify both entities of collision
                            entityA.handleCollision(boxNameA, entityB, boxNameB);
                            entityB.handleCollision(boxNameB, entityA, boxNameA);
                        }
                    });
                });
            }
        }
    }
} 