import { Entity } from './entity.js';
import { CollisionBox } from './collision-box.js';

// Sprite Sheet Management
class SpriteSheet {
    constructor() {
        this.image = new Image();
        this.image.src = 'sheet-export-tr.png';
        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
        };
    }

    getSprite(section, index) {
        if (!this.loaded) return null;
        const x = 1 + (section * 11);
        const y = 1 + (index * 11);
        return { x, y, width: 10, height: 10 };
    }
}

// Main Character Class
export class GibCharacter extends Entity {
    constructor(gameContext) {
        super(gameContext, {
            debug: true,
            scale: 3,
            spriteSize: 10,
            spriteCols: 6,    // Character is 6 sprites wide
            spriteRows: 1     // And 1 sprite tall
        });
        
        this.spriteSheet = new SpriteSheet();
        this.speed = 4;
        
        // Physics properties
        this.gravity = 0.5;
        this.jumpForce = -12;
        this.velocityY = 0;
        this.isJumping = false;
        this.isGrounded = true;  // New property to track if on any surface
        this.jumpStartTime = 0;
        this.fallStartTime = 0;
        this.isFalling = false;
        this.hasReachedPeak = false;  // Track if we've reached the peak
        this.peakStartTime = 0;       // When we started transitioning at peak
        
        // Position character
        this.x = Math.floor(gameContext.canvas.width / 2);
        this.baseY = gameContext.canvas.height - gameContext.groundHeight - this.height - (4 * this.scale);
        this.y = this.baseY;
        
        // Sprite indices
        this.spriteIndices = {
            leftArm: 0,
            leftEye: 0,
            mouth: 0,
            rightEye: 0,
            rightArm: 0,
            item: 0
        };
        
        this.maxIndices = Array(6).fill(43);
        
        this.movingLeft = false;
        this.movingRight = false;
        this.facingLeft = false;
        
        // Animation properties
        this.animations = {
            idle: {
                frameTime: 30,
                lastFrameTime: 0,
                frame: 0,
                totalFrames: 60,
                parts: {
                    leftEye: { 
                        amplitude: 2,
                        phaseOffset: 0,
                        verticalOnly: true
                    },
                    rightEye: { 
                        amplitude: 2,
                        phaseOffset: 0,
                        verticalOnly: true
                    },
                    mouth: { 
                        amplitude: 2,
                        phaseOffset: 0.1,
                        verticalOnly: true
                    },
                    leftArm: { 
                        amplitude: 0.5,
                        phaseOffset: 0.6,
                        horizontalAmplitude: 1
                    },
                    rightArm: { 
                        amplitude: 0.5,
                        phaseOffset: 0.6,
                        horizontalAmplitude: 1
                    },
                    item: { 
                        amplitude: 0,
                        phaseOffset: 0,
                        verticalOnly: true
                    }
                }
            },
            jump: {
                frameTime: 20,
                lastFrameTime: 0,
                frame: 0,
                totalFrames: 30,
                parts: {
                    mouth: { 
                        amplitude: 1,
                        phaseOffset: 0,
                        verticalOnly: true,
                        baseOffset: -8,  // Much bigger mouth jump
                        offsetDelay: 0
                    },
                    leftEye: { 
                        amplitude: 1,
                        phaseOffset: 0,
                        verticalOnly: true,
                        baseOffset: -5,  // Increased eye follow
                        offsetDelay: 150  // Longer delay for more separation
                    },
                    rightEye: { 
                        amplitude: 1,
                        phaseOffset: 0,
                        verticalOnly: true,
                        baseOffset: -5,  // Increased eye follow
                        offsetDelay: 150  // Longer delay for more separation
                    },
                    leftArm: { 
                        amplitude: 3,
                        phaseOffset: 0,
                        horizontalAmplitude: 2,
                        baseOffset: -3,
                        offsetDelay: 250  // Even longer delay for arms
                    },
                    rightArm: { 
                        amplitude: 3,
                        phaseOffset: 0.5,
                        horizontalAmplitude: 2,
                        baseOffset: -3,
                        offsetDelay: 250  // Even longer delay for arms
                    },
                    item: { 
                        amplitude: 1,
                        phaseOffset: 0.2,
                        verticalOnly: true,
                        baseOffset: -3,
                        offsetDelay: 250
                    }
                }
            }
        };
        
        this.currentAnimation = 'idle';
        this.lastTime = performance.now();
        this.partOffsets = {
            leftArm: { x: 0, y: 0 },
            leftEye: { x: 0, y: 0 },
            mouth: { x: 0, y: 0 },
            rightEye: { x: 0, y: 0 },
            rightArm: { x: 0, y: 0 },
            item: { x: 0, y: 0 }
        };
        
        this.animationRestartTimer = null;
        
        this.setupControls();

        // Setup collision boxes with percentage-based sizing
        this.addCollisionBox('body', {
            widthPercent: .5,     // 50% of total width
            heightPercent: 1.0,     // 80% of total height
            offset: { 
                // Center on mouth sprite (sprite index 2 out of 6)
                x: (this.width * 0.25) + (this.spriteSize * this.scale)*-1,  // Move right by one sprite width
                y: 0
            },
            type: 'hitbox',
            color: 'rgba(255, 0, 0, 0.3)',
            debug: true
        });

        this.addCollisionBox('interaction', {
            widthPercent: 1.0,      // 70% of total width
            heightPercent: 1.0,      // 100% of total height
            offset: { 
                // Center on mouth sprite (sprite index 2 out of 6)
                x: (this.width * 0.15) + (this.spriteSize * this.scale)*-1,  // Move right by one sprite width
                y: 0
            },
            type: 'interaction',
            color: 'rgba(0, 255, 0, 0.3)',
            debug: true
        });

        // Example collision handlers
        this.onCollision('body', (other, boxName) => {
            if (other.constructor.name === 'Enemy' && boxName === 'damage') {
                // Handle enemy damage
                console.log('Hit by enemy!');
            }
        });

        this.onCollision('interaction', (other, boxName) => {
            if (other.constructor.name === 'Item' && boxName === 'pickup') {
                // Handle item pickup
                console.log('Can pick up item!');
            }
        });

        // Platform collision handler
        this.onCollision('body', (other, boxName) => {
            if (other.constructor.name === 'Platform' && boxName === 'platform') {
                if (this.velocityY > 0) {  // Only collide when falling
                    console.log('Platform collision!');  // Debug log
                    this.y = other.y - this.height;
                    this.velocityY = 0;
                    this.isJumping = false;
                    this.isFalling = false;
                    this.hasReachedPeak = false;
                    this.isGrounded = true;
                    if (this.currentAnimation === 'jump') {
                        this.currentAnimation = 'idle';
                    }
                }
            }
        });
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                this.movingLeft = true;
                this.facingLeft = true;
            }
            if (e.key === 'ArrowRight' || e.key === 'd') {
                this.movingRight = true;
                this.facingLeft = false;
            }
            if (e.key === ' ' && !this.isJumping && this.isGrounded) {  // Check isGrounded instead of just !isJumping
                this.velocityY = this.jumpForce;
                this.isJumping = true;
                this.isGrounded = false;  // No longer grounded when jumping
                this.currentAnimation = 'jump';
                this.jumpStartTime = performance.now();
            }

            const numberKey = parseInt(e.key);
            if (numberKey >= 1 && numberKey <= 6) {
                const section = numberKey - 1;
                this.cycleSprite(section);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') this.movingLeft = false;
            if (e.key === 'ArrowRight' || e.key === 'd') this.movingRight = false;
        });
    }

    cycleSprite(section) {
        const properties = ['leftArm', 'leftEye', 'mouth', 'rightEye', 'rightArm', 'item'];
        const property = properties[section];

        this.currentAnimation = null;
        
        if (this.animationRestartTimer) {
            clearTimeout(this.animationRestartTimer);
        }

        this.animationRestartTimer = setTimeout(() => {
            this.currentAnimation = 'idle';
            if (this.animations.idle) {
                this.animations.idle.frame = 0;
                this.animations.idle.lastFrameTime = 0;
            }
        }, 1000);

        this.spriteIndices[property] = (this.spriteIndices[property] + 1) % (this.maxIndices[section] + 1);
    }

    update() {
        if (this.movingLeft) this.x -= this.speed;
        if (this.movingRight) this.x += this.speed;
        this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));

        // Track state transitions
        if (this.isJumping) {
            if (this.velocityY > 0 && !this.hasReachedPeak) {
                // Just reached peak
                this.hasReachedPeak = true;
                this.peakStartTime = performance.now();
            } else if (this.velocityY > 0 && this.hasReachedPeak) {
                // Check if we've finished peak transition (200ms after reaching peak)
                if (performance.now() - this.peakStartTime > 200 && !this.isFalling) {
                    this.isFalling = true;
                    this.fallStartTime = performance.now();
                }
            }
        }

        // Apply gravity if not grounded
        if (!this.isGrounded) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;
        }

        // Ground collision check
        if (this.y >= this.baseY) {
            this.y = this.baseY;
            this.velocityY = 0;
            this.isJumping = false;
            this.isFalling = false;
            this.hasReachedPeak = false;
            this.isGrounded = true;
            this.currentAnimation = 'idle';
        }

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.updateAnimation(deltaTime);
        this.lastTime = currentTime;

        // Update collision boxes
        super.update();
    }

    updateAnimation(deltaTime) {
        const anim = this.animations[this.currentAnimation];
        if (!anim) return;

        anim.lastFrameTime += deltaTime;
        if (anim.lastFrameTime >= anim.frameTime) {
            anim.lastFrameTime = 0;
            anim.frame = (anim.frame + 1) % anim.totalFrames;
            
            const baseAngle = (anim.frame / anim.totalFrames) * Math.PI * 2;
            
            for (const [partName, settings] of Object.entries(anim.parts)) {
                const adjustedAngle = baseAngle + (settings.phaseOffset * Math.PI * 2);
                this.partOffsets[partName].y = Math.sin(adjustedAngle) * settings.amplitude;
                
                if (!settings.verticalOnly && settings.horizontalAmplitude) {
                    this.partOffsets[partName].x = Math.cos(adjustedAngle) * settings.horizontalAmplitude;
                } else {
                    this.partOffsets[partName].x = 0;
                }

                // Apply jump wave effect if jumping
                if (this.isJumping && settings.baseOffset) {
                    const timeSinceJump = performance.now() - this.jumpStartTime;
                    const timeSincePeak = performance.now() - this.peakStartTime;
                    const timeSinceFall = performance.now() - this.fallStartTime;

                    if (this.isFalling && settings.fallOffset) {
                        // Falling animation
                        if (timeSinceFall >= settings.offsetDelay) {
                            let transitionDuration = 100; // Default fast for mouth
                            
                            // Different durations for different parts
                            if (partName.includes('Eye')) {
                                transitionDuration = 200;
                            } else if (partName.includes('Arm') || partName === 'item') {
                                transitionDuration = 250;
                            }
                            
                            const fallProgress = Math.min((timeSinceFall - settings.offsetDelay) / transitionDuration, 1);
                            const easeInOut = fallProgress < 0.5 
                                ? 2 * fallProgress * fallProgress 
                                : 1 - Math.pow(-2 * fallProgress + 2, 2) / 2;
                            
                            // Once fall animation completes, maintain the fall offset
                            const finalOffset = fallProgress >= 1 ? settings.fallOffset : settings.fallOffset * easeInOut;
                            this.partOffsets[partName].y += finalOffset;
                        }
                    } else if (this.hasReachedPeak) {
                        // Transition to neutral at peak
                        const peakProgress = Math.min(timeSincePeak / 200, 1); // 200ms transition
                        const easeOut = 1 - Math.pow(1 - peakProgress, 2);
                        
                        // Gradually reduce the jump offset to 0
                        const currentJumpOffset = settings.baseOffset * (1 - easeOut);
                        this.partOffsets[partName].y += currentJumpOffset;
                    } else if (timeSinceJump >= settings.offsetDelay) {
                        // Rising animation
                        let transitionDuration = 100;
                        if (partName.includes('Eye')) {
                            transitionDuration = 200;
                        } else if (partName.includes('Arm') || partName === 'item') {
                            transitionDuration = 250;
                        }
                        
                        const jumpProgress = Math.min((timeSinceJump - settings.offsetDelay) / transitionDuration, 1);
                        const easeInOut = jumpProgress < 0.5 
                            ? 2 * jumpProgress * jumpProgress 
                            : 1 - Math.pow(-2 * jumpProgress + 2, 2) / 2;
                        
                        this.partOffsets[partName].y += settings.baseOffset * easeInOut;
                    }
                }
            }
        }
    }

    render(ctx) {
        if (!this.spriteSheet.loaded) {
            this.renderPlaceholders(ctx);
            return;
        }

        ctx.save();

        if (this.facingLeft) {
            ctx.translate(this.x + this.width, 0);
            ctx.scale(-1, 1);
            ctx.translate(-this.x, 0);
        }

        const parts = [
            { section: 0, index: this.spriteIndices.leftArm, name: 'leftArm' },
            { section: 1, index: this.spriteIndices.leftEye, name: 'leftEye' },
            { section: 2, index: this.spriteIndices.mouth, name: 'mouth' },
            { section: 3, index: this.spriteIndices.rightEye, name: 'rightEye' },
            { section: 4, index: this.spriteIndices.rightArm, name: 'rightArm' },
            { section: 5, index: this.spriteIndices.item, name: 'item' }
        ];

        parts.forEach((part, i) => {
            const sprite = this.spriteSheet.getSprite(part.section, part.index);
            if (sprite) {
                const offset = this.partOffsets[part.name];
                const xPos = this.x + (i * this.spriteSize * this.scale) + (offset.x * this.scale);
                const yPos = this.y + (offset.y * this.scale);
                
                // Draw the sprite
                ctx.drawImage(
                    this.spriteSheet.image,
                    sprite.x, sprite.y,
                    sprite.width, sprite.height,
                    xPos, yPos,
                    this.spriteSize * this.scale,
                    this.spriteSize * this.scale
                );

                // Draw debug outline if enabled
                if (this.debugSprites) {
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(
                        xPos, yPos,
                        this.spriteSize * this.scale,
                        this.spriteSize * this.scale
                    );
                    
                    // Add part name above sprite
                    ctx.fillStyle = 'red';
                    ctx.font = '12px monospace';
                    ctx.fillText(part.name, xPos, yPos - 5);
                }
            }
        });

        ctx.restore();

        // Render collision boxes through Entity class
        super.render(ctx);
    }

    renderPlaceholders(ctx) {
        ctx.save();
        if (this.facingLeft) {
            ctx.translate(this.x + this.width, 0);
            ctx.scale(-1, 1);
            ctx.translate(-this.x, 0);
        }
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = '#000';
            ctx.fillRect(
                this.x + (i * this.spriteSize * this.scale), 
                this.y, 
                this.spriteSize * this.scale, 
                this.spriteSize * this.scale
            );
        }
        ctx.fillStyle = '#666';
        ctx.fillRect(
            this.x + (5 * this.spriteSize * this.scale), 
            this.y, 
            this.spriteSize * this.scale, 
            this.spriteSize * this.scale
        );
        ctx.restore();
    }

    // Add collision detection method
    checkCollision(other) {
        return this.collisionBoxes.body.intersects(other.collisionBoxes.body);
    }

    // Modify platform collision handler
    onCollision(boxName, callback) {
        if (boxName === 'body') {
            super.onCollision(boxName, (other, otherBoxName) => {
                if (other.constructor.name === 'Platform' && otherBoxName === 'platform') {
                    if (this.velocityY > 0) {  // Only collide when falling
                        this.y = other.y - this.height;
                        this.velocityY = 0;
                        this.isJumping = false;
                        this.isFalling = false;
                        this.hasReachedPeak = false;
                        this.isGrounded = true;
                        if (this.currentAnimation === 'jump') {
                            this.currentAnimation = 'idle';
                        }
                    }
                }
                // Call the original callback
                callback(other, otherBoxName);
            });
        } else {
            super.onCollision(boxName, callback);
        }
    }
} 