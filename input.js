class InputHandler {
    constructor(canvas, game) {
        this.canvas = canvas; this.game = game;
        this.dragging = false; this.startX = 0; this.startY = 0;
        this.curX = 0; this.curY = 0;
        this.maxDrag = 150;
        const onStart = (x, y) => {
            if (game.state !== 'aiming') return;
            audio.init();
            this.dragging = true; this.startX = x; this.startY = y;
            this.curX = x; this.curY = y;
        };
        const onMove = (x, y) => {
            if (!this.dragging) return;
            this.curX = x; this.curY = y;
            const power = this.getPower();
            audio.playStretch(power.ratio);
        };
        const onEnd = () => {
            if (!this.dragging) return;
            this.dragging = false;
            const power = this.getPower();
            if (power.ratio > 0.05) this.game.launch(power.vx, power.vy);
        };
        canvas.addEventListener('mousedown', e => onStart(e.clientX, e.clientY));
        canvas.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
        canvas.addEventListener('mouseup', onEnd);
        canvas.addEventListener('touchstart', e => { e.preventDefault(); onStart(e.touches[0].clientX, e.touches[0].clientY); }, {passive:false});
        canvas.addEventListener('touchmove', e => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); }, {passive:false});
        canvas.addEventListener('touchend', e => { e.preventDefault(); onEnd(); }, {passive:false});
    }
    getPower() {
        const origin = this.game.horse.getKickOrigin();
        let dx = this.startX - this.curX;
        let dy = this.startY - this.curY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const ratio = Math.min(dist / this.maxDrag, 1);
        const angle = Math.atan2(dy, dx);
        const force = ratio * 22;
        return { vx: Math.cos(angle) * force, vy: Math.sin(angle) * force, ratio };
    }
    drawElastic(ctx, origin) {
        if (!this.dragging) return;
        const power = this.getPower();
        const r = power.ratio;
        const color = r < 0.4 ? '#4f4' : r < 0.75 ? '#ff4' : '#f44';
        ctx.save();
        ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(this.curX, this.curY); ctx.stroke();
        // drag point
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(this.curX, this.curY, 8, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }
}
