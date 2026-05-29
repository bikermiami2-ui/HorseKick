// Particle System for wood splinters, dust, stars
class Particle {
    constructor(x, y, type = 'wood') {
        this.x = x;
        this.y = y;
        this.type = type;
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 3;
        this.life = 1;
        this.decay = 0.015 + Math.random() * 0.02;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.3;
        
        if (type === 'wood') {
            this.size = 3 + Math.random() * 8;
            this.color = `hsl(${30 + Math.random() * 20}, ${60 + Math.random() * 30}%, ${30 + Math.random() * 30}%)`;
        } else if (type === 'dust') {
            this.size = 5 + Math.random() * 10;
            this.color = `rgba(180,160,120,${0.5 + Math.random() * 0.3})`;
            this.vy = -1 - Math.random() * 2;
            this.vx = (Math.random() - 0.5) * 3;
        } else if (type === 'star') {
            this.size = 4 + Math.random() * 6;
            this.color = '#FFD700';
            this.vy = -2 - Math.random() * 3;
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15; // gravity
        this.rotation += this.rotSpeed;
        this.life -= this.decay;
        if (this.type === 'dust') this.size *= 0.98;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.type === 'wood') {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size/2, -this.size/4, this.size, this.size/2);
        } else if (this.type === 'dust') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'star') {
            ctx.fillStyle = this.color;
            this.drawStar(ctx, 0, 0, 5, this.size, this.size/2);
        }
        
        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerR, innerR) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerR);
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
            rot += step;
        }
        ctx.closePath();
        ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, count, type = 'wood') {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, type));
        }
    }

    update() {
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => p.update());
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}
