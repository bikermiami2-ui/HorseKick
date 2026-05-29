class Barrel {
    constructor(x, y, w, h, hp) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.hp = hp; this.maxHp = hp;
        this.vx = 0; this.vy = 0;
        this.mass = w * h * 0.01;
        this.restitution = 0.3; this.friction = 0.92;
        this.grounded = false; this.destroyed = false;
        this.angle = 0; this.va = 0;
    }
    update(groundY) {
        if (this.destroyed) return;
        this.vy += 0.4;
        this.x += this.vx; this.y += this.vy;
        this.angle += this.va; this.va *= 0.95;
        this.vx *= this.friction;
        if (this.y + this.h / 2 > groundY) {
            this.y = groundY - this.h / 2;
            this.vy *= -this.restitution;
            if (Math.abs(this.vy) < 1) this.vy = 0;
            this.grounded = true;
        } else { this.grounded = false; }
        if (this.x - this.w/2 < 0) { this.x = this.w/2; this.vx *= -0.5; }
    }
    hit(speed) {
        if (speed > 6) {
            this.hp -= speed * 2;
            if (this.hp <= 0) { this.destroyed = true; return true; }
        }
        return false;
    }
    draw(ctx) {
        if (this.destroyed) return;
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
        const dmg = 1 - this.hp / this.maxHp;
        ctx.fillStyle = `rgb(${139 - dmg*60}, ${90 - dmg*40}, ${43 - dmg*20})`;
        ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
        ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 3;
        ctx.strokeRect(-this.w/2, -this.h/2, this.w, this.h);
        // bands
        ctx.fillStyle = '#444';
        ctx.fillRect(-this.w/2, -this.h/2 + 5, this.w, 4);
        ctx.fillRect(-this.w/2, this.h/2 - 9, this.w, 4);
        // cracks
        if (dmg > 0.3) {
            ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(-5, -this.h/4); ctx.lineTo(8, this.h/4); ctx.stroke();
        }
        ctx.restore();
    }
}
