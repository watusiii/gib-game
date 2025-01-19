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
export class GibCharacter {
    constructor(gameContext) {
        this.game = gameContext;
        this.spriteSheet = new SpriteSheet();
        
        this.scale = 6;
        this.spriteSize = 10;
        this.width = this.spriteSize * 6 * this.scale;
        this.height = this.spriteSize * this.scale;
        this.speed = 8;
        
        // Physics properties
        this.gravity = 0.8;
        this.jumpForce = -15;
        this.velocityY = 0;
        this.isJumping = false;
        
        // Position character
        this.x = Math.floor(gameContext.canvas.width / 2);
        this.baseY = gameContext.canvas.height - gameContext.groundHeight - this.height - (8 * this.scale);
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
            if (e.key === ' ' && !this.isJumping) {
                this.velocityY = this.jumpForce;
                this.isJumping = true;
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

        if (this.isJumping) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;

            if (this.y >= this.baseY) {
                this.y = this.baseY;
                this.velocityY = 0;
                this.isJumping = false;
            }
        }

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.updateAnimation(deltaTime);
        this.lastTime = currentTime;
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
                
                ctx.drawImage(
                    this.spriteSheet.image,
                    sprite.x, sprite.y,
                    sprite.width, sprite.height,
                    xPos, yPos,
                    this.spriteSize * this.scale,
                    this.spriteSize * this.scale
                );
            }
        });

        ctx.restore();
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
} 