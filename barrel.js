// Barrel class - can be static obstacle or projectile
class Barrel {
    constructor(x, y, radius = 25, isProjectile = false) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.isProjectile = isProjectile;
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0;
        this.mass = isProjectile ? 1 : 2;
        this.restitution = 0.4;
        this.friction = 0.98;
        this.hp = isProjectile ? 999 : 3; // projectile barrel is indestructible
        this.maxHp = this.hp;
        this.active = true;
        this.onGround = false;
    }

    update(gravity = 0.4) {
        if (!this.active) return;
        
        this.vy += gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.friction;
        this.rotation += this.vx * 0.05;

        // Ground collision
        const groundY = window.innerHeight - 60;
        if (this.y + this.radius > groundY) {
            this.y = groundY - this.radius;
            this.vy *= -this.restitution;
            this.vx *= 0.9;
            this.onGround = true;
            if (Math.abs(this.vy) < 1) this.vy = 0;
        } else {
            this.onGround = false;
        }

        // Wall collisions
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -this.restitution;
        }
        if (this.x + this.radius > window.innerWidth) {
            this.x = window.innerWidth - this.radius;
            this.vx *= -this.restitution;
        }
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Barrel body
        const grad = ctx.createLinearGradient(-this.radius, 0, this.radius, 0);
        grad.addColorStop(0, '#5C3317');
        grad.addColorStop(0.3, '#8B5A2B');
        grad.addColorStop(0.5, '#A0722D');
        grad.addColorStop(0.7, '#8B5A2B');
        grad.addColorStop(1, '#5C3317');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Metal bands
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
        ctx.stroke();

        // Highlight for projectile barrel
        if (this.isProjectile) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius - 2, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Damage cracks
        if (!this.isProjectile && this.hp < this.maxHp) {
            ctx.strokeStyle = '#2a1a0a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-5, -5);
            ctx.lineTo(5, 5);
            ctx.moveTo(5, -5);
            ctx.lineTo(-5, 5);
            ctx.stroke();
        }

        ctx.restore();
    }

    takeDamage(amount) {
        if (this.isProjectile) return false;
        this.hp -= amount;
        if (this.hp <= 0) {
            this.active = false;
            return true; // destroyed
        }
        return false;
    }

    getBounds() {
        return { x: this.x, y: this.y, r: this.radius };
    }
}
