// Trajectory predictor - parabolic path preview
class Trajectory {
    constructor() {
        this.points = [];
        this.visible = false;
    }

    calculate(startX, startY, vx, vy, gravity = 0.4, steps = 40) {
        this.points = [];
        let x = startX;
        let y = startY;
        let cvx = vx;
        let cvy = vy;
        
        for (let i = 0; i < steps; i++) {
            this.points.push({ x, y });
            cvy += gravity;
            x += cvx;
            y += cvy;
            
            // Stop at ground
            if (y > window.innerHeight - 60) break;
            // Stop at walls
            if (x < 0 || x > window.innerWidth) break;
        }
        this.visible = true;
    }

    hide() {
        this.visible = false;
        this.points = [];
    }

    draw(ctx) {
        if (!this.visible || this.points.length < 2) return;
        
        ctx.save();
        ctx.setLineDash([8, 8]);
        ctx.lineWidth = 3;
        
        for (let i = 1; i < this.points.length; i++) {
            const alpha = 1 - i / this.points.length;
            ctx.strokeStyle = `rgba(255, 255, 100, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.moveTo(this.points[i-1].x, this.points[i-1].y);
            ctx.lineTo(this.points[i].x, this.points[i].y);
            ctx.stroke();
        }
        
        // Draw endpoint circle
        if (this.points.length > 0) {
            const last = this.points[this.points.length - 1];
            ctx.fillStyle = 'rgba(255, 100, 100, 0.6)';
            ctx.beginPath();
            ctx.arc(last.x, last.y, 8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}
