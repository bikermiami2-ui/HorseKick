// Input handler - Angry Birds style drag & release
class InputHandler {
    constructor(game) {
        this.game = game;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.dragCurrent = { x: 0, y: 0 };
        this.maxDragDistance = 150;
        this.powerMultiplier = 0.18;

        const canvas = document.getElementById('gameCanvas');
        
        // Mouse events
        canvas.addEventListener('mousedown', e => this.onStart(e.clientX, e.clientY));
        canvas.addEventListener('mousemove', e => this.onMove(e.clientX, e.clientY));
        canvas.addEventListener('mouseup', e => this.onEnd());
        canvas.addEventListener('mouseleave', () => this.onEnd());
        
        // Touch events
        canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            this.onStart(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            this.onMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        canvas.addEventListener('touchend', e => {
            e.preventDefault();
            this.onEnd();
        }, { passive: false });
    }

    onStart(x, y) {
        if (this.game.state !== 'aiming') return;
        
        // Check if near the horse/barrel area
        const horse = this.game.horse;
        const dist = Math.hypot(x - horse.x - 50, y - horse.y - 40);
        if (dist < 120) {
            this.isDragging = true;
            this.dragStart = { x: horse.getKickPoint().x, y: horse.getKickPoint().y };
            this.dragCurrent = { x, y };
            audio.init();
        }
    }

    onMove(x, y) {
        if (!this.isDragging) return;
        this.dragCurrent = { x, y };
        
        // Calculate pull vector (opposite direction = launch direction)
        const dx = this.dragStart.x - x;
        const dy = this.dragStart.y - y;
        const dist = Math.min(Math.hypot(dx, dy), this.maxDragDistance);
        const angle = Math.atan2(dy, dx);
        
        // Update trajectory preview
        const power = dist * this.powerMultiplier;
        const vx = Math.cos(angle) * power;
        const vy = Math.sin(angle) * power;
        
        this.game.trajectory.calculate(
            this.dragStart.x, this.dragStart.y,
            vx, vy
        );
        
        // Stretch sound feedback
        if (dist > 20 && Math.random() < 0.1) {
            audio.playStretch();
        }
    }

    onEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.game.trajectory.hide();
        
        const dx = this.dragStart.x - this.dragCurrent.x;
        const dy = this.dragStart.y - this.dragCurrent.y;
        const dist = Math.min(Math.hypot(dx, dy), this.maxDragDistance);
        
        if (dist > 15) { // Minimum pull threshold
            const angle = Math.atan2(dy, dx);
            const power = dist * this.powerMultiplier;
            this.game.launchBarrel(
                Math.cos(angle) * power,
                Math.sin(angle) * power
            );
        }
    }

    draw(ctx) {
        if (!this.isDragging) return;
        
        const kickPt = this.game.horse.getKickPoint();
        const dx = this.dragStart.x - this.dragCurrent.x;
        const dy = this.dragStart.y - this.dragCurrent.y;
        const dist = Math.min(Math.hypot(dx, dy), this.maxDragDistance);
        const ratio = dist / this.maxDragDistance;
        
        // Elastic band from hoof to drag point
        ctx.save();
        ctx.lineWidth = 4 + ratio * 4;
        
        // Color based on power: green -> yellow -> red
        const r = Math.min(255, ratio * 2 * 255);
        const g = Math.min(255, (1 - ratio) * 2 * 255);
        ctx.strokeStyle = `rgb(${r}, ${g}, 50)`;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(kickPt.x, kickPt.y);
        ctx.lineTo(this.dragCurrent.x, this.dragCurrent.y);
        ctx.stroke();
        
        // Drag handle circle
        ctx.fillStyle = `rgba(${r}, ${g}, 50, 0.8)`;
        ctx.beginPath();
        ctx.arc(this.dragCurrent.x, this.dragCurrent.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Power indicator text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(ratio * 100)}%`, this.dragCurrent.x, this.dragCurrent.y - 20);
        
        ctx.restore();
    }
}
