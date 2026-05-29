class Particle {
    constructor(x, y, color, speed, life) {
        this.x = x; this.y = y;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed * (0.5 + Math.random());
        this.vy = Math.sin(angle) * speed * (0.5 + Math.random()) - 2;
        this.life = life; this.maxLife = life;
        this.color = color; this.size = 2 + Math.random() * 4;
        this.gravity = 0.15;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.vy += this.gravity; this.life--;
        this.size *= 0.97;
    }
    draw(ctx) {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}
class ParticleSystem {
    constructor() { this.particles = []; }
    emit(x, y, count, color, speed = 5, life = 40) {
        for (let i = 0; i < count; i++) this.particles.push(new Particle(x, y, color, speed, life));
    }
    update() { this.particles = this.particles.filter(p => p.life > 0); this.particles.forEach(p => p.update()); }
    draw(ctx) { this.particles.forEach(p => p.draw(ctx)); }
}
