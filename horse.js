class Horse {
    constructor(x, groundY) {
        this.x = x; this.groundY = groundY;
        this.kickAnim = 0; this.idleAnim = 0;
        this.scale = 1;
    }
    triggerKick() { this.kickAnim = 1.0; }
    update() {
        this.idleAnim += 0.05;
        if (this.kickAnim > 0) this.kickAnim -= 0.05;
        if (this.kickAnim < 0) this.kickAnim = 0;
    }
    getKickOrigin() {
        return { x: this.x + 30 * this.scale, y: this.groundY - 35 * this.scale };
    }
    draw(ctx) {
        const s = this.scale;
        const breathe = Math.sin(this.idleAnim) * 2;
        const kick = this.kickAnim;
        const gy = this.groundY;
        ctx.save(); ctx.translate(this.x, gy);
        // body
        ctx.fillStyle = '#8B6914';
        ctx.beginPath();
        ctx.ellipse(0, -40*s + breathe, 40*s, 25*s, 0, 0, Math.PI*2);
        ctx.fill();
        // neck + head
        ctx.fillStyle = '#7A5C12';
        ctx.beginPath();
        ctx.moveTo(-25*s, -55*s + breathe);
        ctx.quadraticCurveTo(-40*s, -90*s + breathe, -35*s, -100*s + breathe);
        ctx.quadraticCurveTo(-20*s, -105*s + breathe, -15*s, -90*s + breathe);
        ctx.quadraticCurveTo(-10*s, -60*s + breathe, -15*s, -50*s + breathe);
        ctx.fill();
        // ear
        ctx.fillStyle = '#6B4F10';
        ctx.beginPath();
        ctx.moveTo(-32*s, -100*s + breathe);
        ctx.lineTo(-38*s, -115*s + breathe);
        ctx.lineTo(-26*s, -103*s + breathe);
        ctx.fill();
        // eye
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-30*s, -95*s + breathe, 3*s, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(-30*s, -95*s + breathe, 1.5*s, 0, Math.PI*2); ctx.fill();
        // front legs
        ctx.strokeStyle = '#7A5C12'; ctx.lineWidth = 6*s; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-20*s, -20*s + breathe); ctx.lineTo(-22*s, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-10*s, -20*s + breathe); ctx.lineTo(-8*s, 0); ctx.stroke();
        // back legs with kick animation
        const kickAngle = kick * 1.2;
        ctx.save();
        ctx.translate(25*s, -20*s + breathe);
        ctx.rotate(-kickAngle);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(5*s, 25*s); ctx.stroke();
        // hoof
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(5*s, 25*s, 4*s, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.translate(30*s, -20*s + breathe);
        ctx.rotate(-kickAngle * 0.8);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(3*s, 25*s); ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(3*s, 25*s, 4*s, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        // tail
        ctx.strokeStyle = '#5a4010'; ctx.lineWidth = 3*s;
        const tailWag = Math.sin(this.idleAnim * 2) * 0.3;
        ctx.beginPath();
        ctx.moveTo(38*s, -45*s + breathe);
        ctx.quadraticCurveTo(55*s, -50*s + breathe + tailWag*10, 50*s, -30*s + breathe);
        ctx.stroke();
        // mane
        ctx.strokeStyle = '#5a4010'; ctx.lineWidth = 2*s;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo((-25 - i*3)*s, (-95 + i*5)*s + breathe);
            ctx.lineTo((-30 - i*2)*s, (-85 + i*5)*s + breathe);
            ctx.stroke();
        }
        ctx.restore();
    }
}
