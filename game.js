// ===== HORSE KICK: BARREL SMASH =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const GRAVITY = 0.35;
const GROUND_OFFSET = 60;

class Game {
    constructor() {
        this.state = 'menu'; // menu, aiming, flying, settling, levelComplete, gameOver, allClear
        this.levelIndex = 0;
        this.score = 0;
        this.kicksLeft = 0;
        this.barrels = [];
        this.horse = null;
        this.groundY = 0;
        this.particles = new ParticleSystem();
        this.trajectory = new Trajectory();
        this.ui = new UI(ctx, canvas);
        this.input = new InputHandler(canvas, this);
        this.projectile = null;
        this.settleTimer = 0;
        this.bestScore = parseInt(localStorage.getItem('horsekick_best') || '0');
        this.stars = 0;
        this.clickHandler = () => this.handleClick();
        canvas.addEventListener('click', this.clickHandler);
        canvas.addEventListener('touchend', (e) => {
            if (!this.input.dragging && ['menu','levelComplete','gameOver','allClear'].includes(this.state)) {
                e.preventDefault(); this.handleClick();
            }
        });
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    handleClick() {
        audio.init();
        if (this.state === 'menu') { this.startLevel(0); }
        else if (this.state === 'levelComplete') {
            if (this.levelIndex + 1 < LEVELS.length) { this.startLevel(this.levelIndex + 1); }
            else { this.state = 'allClear'; }
        }
        else if (this.state === 'gameOver') { this.startLevel(this.levelIndex); }
        else if (this.state === 'allClear') { this.levelIndex = 0; this.score = 0; this.state = 'menu'; }
    }

    startLevel(idx) {
        this.levelIndex = idx;
        const lvl = LEVELS[idx];
        this.kicksLeft = lvl.kicks;
        this.groundY = canvas.height - GROUND_OFFSET;
        this.horse = new Horse(canvas.width * 0.1, this.groundY);
        this.barrels = lvl.barrels.map(b => new Barrel(
            b.x * canvas.width, this.groundY - b.h/2 + b.y, b.w, b.h, b.hp
        ));
        this.projectile = null;
        this.state = 'aiming';
        this.settleTimer = 0;
    }

    launch(vx, vy) {
        if (this.kicksLeft <= 0) return;
        this.kicksLeft--;
        this.horse.triggerKick();
        audio.playKick();
        const origin = this.horse.getKickOrigin();
        this.projectile = { x: origin.x, y: origin.y, vx, vy, active: true, radius: 8 };
        this.state = 'flying';
    }

    updateProjectile() {
        const p = this.projectile;
        if (!p || !p.active) return;
        p.vy += GRAVITY;
        p.x += p.vx; p.y += p.vy;
        // ground collision
        if (p.y > this.groundY) {
            p.active = false;
            this.particles.emit(p.x, this.groundY, 8, '#aa8844', 3, 25);
            this.startSettling();
        }
        // out of bounds
        if (p.x > canvas.width + 50 || p.x < -50) {
            p.active = false;
            this.startSettling();
        }
        // barrel collisions
        for (const b of this.barrels) {
            if (b.destroyed) continue;
            const dx = p.x - b.x, dy = p.y - b.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const minDist = p.radius + Math.max(b.w, b.h) / 2;
            if (dist < minDist) {
                const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
                const destroyed = b.hit(speed);
                // transfer momentum
                b.vx += p.vx * 0.3 / b.mass;
                b.vy += p.vy * 0.3 / b.mass;
                b.va += (Math.random() - 0.5) * 0.3;
                if (destroyed) {
                    audio.playSmash();
                    this.score += 100;
                    this.particles.emit(b.x, b.y, 20, '#c8a050', 7, 45);
                    this.particles.emit(b.x, b.y, 10, '#ffcc44', 5, 30);
                } else {
                    this.particles.emit(p.x, p.y, 5, '#aa8844', 3, 20);
                }
                p.vx *= 0.4; p.vy *= 0.4;
                if (speed < 3) { p.active = false; this.startSettling(); }
            }
        }
    }

    startSettling() {
        this.state = 'settling';
        this.settleTimer = 60;
    }

    updateSettling() {
        this.settleTimer--;
        let moving = false;
        for (const b of this.barrels) {
            if (!b.destroyed && (Math.abs(b.vx) > 0.3 || Math.abs(b.vy) > 0.3)) moving = true;
        }
        if (this.settleTimer <= 0 && !moving) {
            this.checkLevelState();
        }
    }

    checkLevelState() {
        const remaining = this.barrels.filter(b => !b.destroyed).length;
        if (remaining === 0) {
            // calculate stars
            const totalKicks = LEVELS[this.levelIndex].kicks;
            const used = totalKicks - this.kicksLeft;
            this.stars = used <= Math.ceil(totalKicks * 0.4) ? 3 : used <= Math.ceil(totalKicks * 0.7) ? 2 : 1;
            this.score += this.kicksLeft * 50; // bonus for unused kicks
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('horsekick_best', this.bestScore.toString());
            }
            audio.playWin();
            this.state = 'levelComplete';
        } else if (this.kicksLeft <= 0) {
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('horsekick_best', this.bestScore.toString());
            }
            audio.playLose();
            this.state = 'gameOver';
        } else {
            this.projectile = null;
            this.state = 'aiming';
        }
    }

    drawBackground() {
        // sky gradient
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#0a0a2e'); grad.addColorStop(0.6, '#1a1a4e'); grad.addColorStop(1, '#2a4a2a');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
        // stars
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 50; i++) {
            const sx = (i * 137.5) % canvas.width;
            const sy = (i * 97.3) % (canvas.height * 0.6);
            const ss = (i % 3) + 1;
            ctx.globalAlpha = 0.3 + (i % 5) * 0.15;
            ctx.fillRect(sx, sy, ss, ss);
        }
        ctx.globalAlpha = 1;
        // ground
        ctx.fillStyle = '#2d5a1e';
        ctx.fillRect(0, this.groundY, canvas.width, GROUND_OFFSET);
        ctx.fillStyle = '#3a7a28';
        ctx.fillRect(0, this.groundY, canvas.width, 8);
    }

    loop() {
        resize(); // handle dynamic resize
        this.groundY = canvas.height - GROUND_OFFSET;
        if (this.horse) this.horse.groundY = this.groundY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawBackground();

        if (this.state === 'menu') {
            if (!this.horse) this.horse = new Horse(canvas.width * 0.1, this.groundY);
            this.horse.update(); this.horse.draw(ctx);
            this.ui.drawMenu(this.bestScore);
        } else {
            // update
            this.horse.update();
            this.particles.update();
            if (this.state === 'flying') this.updateProjectile();
            if (this.state === 'settling') {
                this.barrels.forEach(b => b.update(this.groundY));
                this.updateSettling();
            }
            // barrel-barrel simple collision
            for (let i = 0; i < this.barrels.length; i++) {
                for (let j = i+1; j < this.barrels.length; j++) {
                    const a = this.barrels[i], b = this.barrels[j];
                    if (a.destroyed || b.destroyed) continue;
                    const dx = b.x - a.x, dy = b.y - a.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const minD = (Math.max(a.w,a.h) + Math.max(b.w,b.h)) / 2;
                    if (dist < minD && dist > 0) {
                        const nx = dx/dist, ny = dy/dist;
                        const overlap = minD - dist;
                        a.x -= nx * overlap * 0.5; a.y -= ny * overlap * 0.5;
                        b.x += nx * overlap * 0.5; b.y += ny * overlap * 0.5;
                        const relV = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                        if (relV > 0) {
                            a.vx -= nx * relV * 0.5; a.vy -= ny * relV * 0.5;
                            b.vx += nx * relV * 0.5; b.vy += ny * relV * 0.5;
                        }
                    }
                }
            }

            // draw
            this.barrels.forEach(b => b.draw(ctx));
            this.horse.draw(ctx);
            this.particles.draw(ctx);
            if (this.state === 'flying' && this.projectile && this.projectile.active) {
                ctx.fillStyle = '#ff8';
                ctx.beginPath(); ctx.arc(this.projectile.x, this.projectile.y, 6, 0, Math.PI*2); ctx.fill();
                // trail
                ctx.strokeStyle = 'rgba(255,255,100,0.3)'; ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.projectile.x, this.projectile.y);
                ctx.lineTo(this.projectile.x - this.projectile.vx*3, this.projectile.y - this.projectile.vy*3);
                ctx.stroke();
            }
            // elastic + trajectory preview
            if (this.state === 'aiming' && this.input.dragging) {
                const origin = this.horse.getKickOrigin();
                this.input.drawElastic(ctx, origin);
                const power = this.input.getPower();
                this.trajectory.calculate(origin, power.vx, power.vy, GRAVITY, 25);
                this.trajectory.draw(ctx);
            }
            // HUD
            const remaining = this.barrels.filter(b => !b.destroyed).length;
            this.ui.drawHUD(this.score, this.kicksLeft, this.levelIndex + 1, remaining);
            // overlays
            if (this.state === 'levelComplete') this.ui.drawLevelComplete(this.score, this.stars, this.bestScore);
            if (this.state === 'gameOver') this.ui.drawGameOver(this.score, this.bestScore);
            if (this.state === 'allClear') this.ui.drawAllClear(this.bestScore);
        }
        requestAnimationFrame(this.loop);
    }
}

window.onload = () => new Game();
