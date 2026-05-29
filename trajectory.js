class Trajectory {
    constructor() { this.points = []; }
    calculate(origin, vx, vy, gravity, steps = 30) {
        this.points = [];
        let x = origin.x, y = origin.y, cvx = vx, cvy = vy;
        for (let i = 0; i < steps; i++) {
            this.points.push({x, y});
            x += cvx * 3; y += cvy * 3;
            cvy += gravity * 3;
            if (y > 2000) break;
        }
    }
    draw(ctx) {
        if (this.points.length < 2) return;
        ctx.save();
        ctx.setLineDash([8, 8]);
        ctx.lineWidth = 3;
        for (let i = 1; i < this.points.length; i++) {
            const alpha = 1 - i / this.points.length;
            ctx.strokeStyle = `rgba(255, 255, 100, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(this.points[i-1].x, this.points[i-1].y);
            ctx.lineTo(this.points[i].x, this.points[i].y);
            ctx.stroke();
        }
        ctx.restore();
    }
}
