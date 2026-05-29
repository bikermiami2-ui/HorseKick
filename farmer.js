class Farmer {
    constructor(x, groundY) {
        this.x = x;
        this.groundY = groundY;
        this.idleAnim = 0;
        this.hitAnim = 0;
        this.scale = 1;
        this.isHit = false;
    }
    triggerHit() {
        this.hitAnim = 1.0;
        this.isHit = true;
    }
    update() {
        this.idleAnim += 0.04;
        if (this.hitAnim > 0) this.hitAnim -= 0.03;
        if (this.hitAnim < 0) this.hitAnim = 0;
    }
    getBounds() {
        const s = this.scale;
        return { x: this.x - 15*s, y: this.groundY - 80*s, w: 30*s, h: 80*s };
    }
    draw(ctx) {
        const s = this.scale;
        const gy = this.groundY;
        const breathe = Math.sin(this.idleAnim) * 1.5;
        const hit = this.hitAnim;
        const hitShake = hit * Math.sin(hit * 20) * 5;

        ctx.save();
        ctx.translate(this.x + hitShake, gy);

        // legs
        ctx.strokeStyle = '#2a4a8a'; ctx.lineWidth = 7*s; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-6*s, -20*s); ctx.lineTo(-8*s, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(6*s, -20*s); ctx.lineTo(8*s, 0); ctx.stroke();

        // boots
        ctx.fillStyle = '#3a2010';
        ctx.fillRect(-12*s, -4*s, 10*s, 4*s);
        ctx.fillRect(2*s, -4*s, 10*s, 4*s);

        // body (overalls)
        ctx.fillStyle = '#3a6ad0';
        ctx.beginPath();
        ctx.roundRect(-14*s, -55*s + breathe, 28*s, 38*s, 4*s);
        ctx.fill();

        // overall straps
        ctx.strokeStyle = '#2a5ab0'; ctx.lineWidth = 3*s;
        ctx.beginPath(); ctx.moveTo(-8*s, -55*s + breathe); ctx.lineTo(-8*s, -65*s + breathe); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(8*s, -55*s + breathe); ctx.lineTo(8*s, -65*s + breathe); ctx.stroke();

        // shirt / arms
        ctx.fillStyle = '#cc3333';
        ctx.beginPath();
        ctx.roundRect(-16*s, -68*s + breathe, 32*s, 18*s, 3*s);
        ctx.fill();

        // arms
        ctx.strokeStyle = '#cc3333'; ctx.lineWidth = 6*s; ctx.lineCap = 'round';
        const armWave = Math.sin(this.idleAnim * 1.5) * 0.15;
        ctx.save();
        ctx.translate(-16*s, -62*s + breathe);
        ctx.rotate(-0.3 + armWave);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-12*s, 15*s); ctx.stroke();
        // hand
        ctx.fillStyle = '#e8b878';
        ctx.beginPath(); ctx.arc(-12*s, 15*s, 4*s, 0, Math.PI*2); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(16*s, -62*s + breathe);
        ctx.rotate(0.3 - armWave);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(12*s, 15*s); ctx.stroke();
        ctx.fillStyle = '#e8b878';
        ctx.beginPath(); ctx.arc(12*s, 15*s, 4*s, 0, Math.PI*2); ctx.fill();
        ctx.restore();

        // head
        ctx.fillStyle = '#e8b878';
        ctx.beginPath();
        ctx.ellipse(0, -78*s + breathe, 12*s, 14*s, 0, 0, Math.PI*2);
        ctx.fill();

        // eyes
        if (hit > 0.3) {
            // X eyes when hit
            ctx.strokeStyle = '#000'; ctx.lineWidth = 2*s;
            [-5, 5].forEach(ex => {
                ctx.beginPath();
                ctx.moveTo((ex-2)*s, -80*s + breathe); ctx.lineTo((ex+2)*s, -76*s + breathe);
                ctx.moveTo((ex+2)*s, -80*s + breathe); ctx.lineTo((ex-2)*s, -76*s + breathe);
                ctx.stroke();
            });
        } else {
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(-5*s, -79*s + breathe, 3.5*s, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(5*s, -79*s + breathe, 3.5*s, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath(); ctx.arc(-5*s, -79*s + breathe, 1.8*s, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(5*s, -79*s + breathe, 1.8*s, 0, Math.PI*2); ctx.fill();
        }

        // mouth
        ctx.strokeStyle = '#8a5030'; ctx.lineWidth = 1.5*s;
        ctx.beginPath();
        if (hit > 0.3) {
            ctx.ellipse(0, -72*s + breathe, 4*s, 3*s, 0, 0, Math.PI*2);
        } else {
            ctx.arc(0, -74*s + breathe, 4*s, 0.2, Math.PI - 0.2);
        }
        ctx.stroke();

        // straw hat
        const hatY = -90*s + breathe;
        ctx.fillStyle = '#d4a830';
        ctx.beginPath();
        ctx.ellipse(0, hatY, 20*s, 5*s, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#c89820';
        ctx.beginPath();
        ctx.moveTo(-10*s, hatY);
        ctx.quadraticCurveTo(-11*s, hatY - 14*s, -4*s, hatY - 16*s);
        ctx.quadraticCurveTo(0, hatY - 13*s, 4*s, hatY - 16*s);
        ctx.quadraticCurveTo(11*s, hatY - 14*s, 10*s, hatY);
        ctx.fill();
        // hat band
        ctx.strokeStyle = '#8a3020'; ctx.lineWidth = 2*s;
        ctx.beginPath();
        ctx.moveTo(-9*s, hatY - 4*s);
        ctx.quadraticCurveTo(0, hatY - 2*s, 9*s, hatY - 4*s);
        ctx.stroke();

        // hit stars effect
        if (hit > 0.1) {
            ctx.fillStyle = '#FFD700';
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 + hit * 10;
                const dist = 25*s * hit;
                const sx = Math.cos(angle) * dist;
                const sy = -80*s + breathe + Math.sin(angle) * dist;
                ctx.font = `${10*s}px Arial`;
                ctx.fillText('⭐', sx - 5*s, sy);
            }
        }

        ctx.restore();
    }
}
