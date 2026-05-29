// Main Game - ties everything together
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        this.state = 'menu'; // menu, aiming, flying, levelComplete, gameOver, victory
        this.currentLevel = 0;
        this.score = 0;
        this.shotsLeft = 3;
        
        this.horse = new Horse(50, 0);
        this.particles = new ParticleSystem();
        this.trajectory = new Trajectory();
        this.input = new InputHandler(this);
        this.ui = new UIManager(this);
        this.farmer = null;
        
        this.projectileBarrel = null; // The barrel being kicked
        this.obstacleBarrels = [];
        this.activeProjectile = null; // Flying barrel after kick
        
        this.levels = LEVELS;
        
        // Click/tap to start/restart
        const handleAction = () => {
            audio.init();
            if (this.state === 'menu') {
                this.startLevel(0);
            } else if (this.state === 'levelComplete') {
                if (this.currentLevel + 1 < this.levels.length) {
                    this.startLevel(this.currentLevel + 1);
                } else {
                    this.state = 'victory';
                }
            } else if (this.state === 'gameOver' || this.state === 'victory') {
                this.score = 0;
                this.startLevel(0);
            }
        };
        this.canvas.addEventListener('click', handleAction);
        this.canvas.addEventListener('touchstart', (e) => {
            if (this.state !== 'aiming') {
                e.preventDefault();
                handleAction();
            }
        }, { passive: false });
        
        window.addEventListener('resize', () => this.resize());
        
        this.loop();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.groundY = this.canvas.height - 60;
        if (this.horse) this.horse.y = this.groundY - 88;
    }

    startLevel(levelIdx) {
        this.currentLevel = levelIdx;
        const level = this.levels[levelIdx];
        this.shotsLeft = level.shots;
        this.state = 'aiming';
        this.activeProjectile = null;
        
        // Position horse
        this.horse.x = 50;
        this.horse.y = this.groundY - 88;
        
        // Create projectile barrel (next to horse)
        this.projectileBarrel = new Barrel(160, this.groundY - 25, 25, true);
        
        // Create obstacle barrels
        this.obstacleBarrels = level.barrels.map((b, i) => {
            let y = this.groundY - b.r;
            if (b.stackOn !== undefined && this.obstacleBarrels[b.stackOn]) {
                y = this.obstacleBarrels[b.stackOn].y - b.r * 2;
            }
            return new Barrel(b.x, y, b.r, false);
        });
        
        // Create farmer
        let farmerY = this.groundY - 70;
        if (level.farmer.elevated) {
            farmerY = this.groundY - 120;
        }
        this.farmer = new Farmer(level.farmer.x, farmerY);
    }

    launchBarrel(vx, vy) {
        if (this.shotsLeft <= 0 || this.state !== 'aiming') return;
        
        this.shotsLeft--;
        this.horse.kick();
        
        // Launch the projectile barrel
        this.activeProjectile = new Barrel(
            this.projectileBarrel.x,
            this.projectileBarrel.y,
            25, true
        );
        this.activeProjectile.vx = vx;
        this.activeProjectile.vy = vy;
        
        this.state = 'flying';
        audio.playKick();
        this.particles.emit(this.projectileBarrel.x, this.projectileBarrel.y, 5, 'dust');
    }

    checkCollisions() {
        if (!this.activeProjectile || !this.activeProjectile.active) return;
        
        const proj = this.activeProjectile;
        const speed = Math.hypot(proj.vx, proj.vy);
        
        // Check vs obstacle barrels
        this.obstacleBarrels.forEach(barrel => {
            if (!barrel.active) return;
            const dist = Math.hypot(proj.x - barrel.x, proj.y - barrel.y);
            if (dist < proj.radius + barrel.radius) {
                // Collision!
                if (speed > 3) {
                    const destroyed = barrel.takeDamage(speed * 0.5);
                    if (destroyed) {
                        this.particles.emit(barrel.x, barrel.y, 15, 'wood');
                        audio.playWoodBreak();
                        this.score += 100;
                    } else {
                        audio.playHit();
                        this.particles.emit(barrel.x, barrel.y, 5, 'dust');
                    }
                    // Transfer momentum
                    barrel.vx += proj.vx * 0.5;
                    barrel.vy += proj.vy * 0.5;
                    proj.vx *= 0.4;
                    proj.vy *= 0.4;
                }
            }
        });
        
        // Check vs farmer
        if (this.farmer && !this.farmer.hit) {
            const fb = this.farmer.getBounds();
            if (proj.x + proj.radius > fb.x && proj.x - proj.radius < fb.x + fb.w &&
                proj.y + proj.radius > fb.y && proj.y - proj.radius < fb.y + fb.h) {
                this.farmer.onHit();
                this.particles.emit(fb.x + fb.w/2, fb.y + fb.h/2, 10, 'star');
                this.score += 500;
                proj.vx *= 0.2;
                proj.vy *= 0.2;
                
                // Level complete after short delay
                setTimeout(() => {
                    if (this.state === 'flying') {
                        audio.playWin();
                        this.saveBest();
                        this.state = 'levelComplete';
                    }
                }, 1000);
            }
        }
    }

    saveBest() {
        const best = parseInt(localStorage.getItem('horseKickBest') || '0');
        if (this.score > best) {
            localStorage.setItem('horseKickBest', this.score.toString());
        }
    }

    update() {
        this.horse.update();
        this.particles.update();
        if (this.farmer) this.farmer.update();
        
        // Update obstacle barrels physics
        this.obstacleBarrels.forEach(b => b.update());
        
        // Barrel-barrel collisions for obstacles
        for (let i = 0; i < this.obstacleBarrels.length; i++) {
            for (let j = i + 1; j < this.obstacleBarrels.length; j++) {
                const a = this.obstacleBarrels[i];
                const b = this.obstacleBarrels[j];
                if (!a.active || !b.active) continue;
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                const minDist = a.radius + b.radius;
                if (dist < minDist) {
                    const nx = (b.x - a.x) / dist;
                    const ny = (b.y - a.y) / dist;
                    const overlap = minDist - dist;
                    a.x -= nx * overlap * 0.5;
                    a.y -= ny * overlap * 0.5;
                    b.x += nx * overlap * 0.5;
                    b.y += ny * overlap * 0.5;
                    // Exchange velocity
                    const dvx = a.vx - b.vx;
                    const dvy = a.vy - b.vy;
                    a.vx -= dvx * 0.5;
                    a.vy -= dvy * 0.5;
                    b.vx += dvx * 0.5;
                    b.vy += dvy * 0.5;
                }
            }
        }
        
        if (this.state === 'flying' && this.activeProjectile) {
            this.activeProjectile.update();
            this.checkCollisions();
            
            // Check if projectile stopped
            const p = this.activeProjectile;
            if (p.onGround && Math.abs(p.vx) < 0.5 && Math.abs(p.vy) < 0.5) {
                // Projectile stopped
                if (!this.farmer.hit) {
                    if (this.shotsLeft > 0) {
                        this.state = 'aiming';
                        this.activeProjectile = null;
                        // Reset projectile barrel position
                        this.projectileBarrel = new Barrel(160, this.groundY - 25, 25, true);
                    } else {
                        this.state = 'gameOver';
                        audio.playLose();
                        this.saveBest();
                    }
                }
            }
            
            // Out of bounds
            if (p.x < -100 || p.x > this.canvas.width + 100 || p.y > this.canvas.height + 100) {
                if (!this.farmer.hit) {
                    if (this.shotsLeft > 0) {
                        this.state = 'aiming';
                        this.activeProjectile = null;
                        this.projectileBarrel = new Barrel(160, this.groundY - 25, 25, true);
                    } else {
                        this.state = 'gameOver';
                        audio.playLose();
                        this.saveBest();
                    }
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Background & ground
        this.ui.draw(this.ctx, this.canvas.width, this.canvas.height);
        
        // Farmer
        if (this.farmer) this.farmer.draw(this.ctx);
        
        // Obstacle barrels
        this.obstacleBarrels.forEach(b => b.draw(this.ctx));
        
        // Projectile barrel (waiting to be kicked)
        if (this.state === 'aiming' && this.projectileBarrel) {
            this.projectileBarrel.draw(this.ctx);
        }
        
        // Active flying barrel
        if (this.activeProjectile && this.activeProjectile.active) {
            this.activeProjectile.draw(this.ctx);
        }
        
        // Horse
        this.horse.draw(this.ctx);
        
        // Particles
        this.particles.draw(this.ctx);
        
        // Trajectory preview
        this.trajectory.draw(this.ctx);
        
        // Input visualization (elastic band)
        this.input.draw(this.ctx);
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// Start game when DOM ready
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
