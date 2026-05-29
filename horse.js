// Horse class with cowboy hat and kick animation
class Horse {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 80;
        this.kickAnim = 0; // 0-1 kick animation progress
        this.isKicking = false;
        this.breathPhase = 0;
        this.tailPhase = 0;
    }

    update() {
        this.breathPhase += 0.03;
        this.tailPhase += 0.05;
        
        if (this.isKicking) {
            this.kickAnim += 0.08;
            if (this.kickAnim >= 1) {
                this.kickAnim = 0;
                this.isKicking = false;
            }
        }
    }

    kick() {
        if (!this.isKicking) {
            this.isKicking = true;
            this.kickAnim = 0;
            audio.playKick();
        }
    }

    getKickPoint() {
        // Point where the hoof strikes (rear of horse)
        return {
            x: this.x + this.width * 0.7,
            y: this.y + this.height * 0.6
        };
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const breathOffset = Math.sin(this.breathPhase) * 2;
        const tailSwing = Math.sin(this.tailPhase) * 15;
        
        // Kick animation offset for rear legs
        let rearLegAngle = 0;
        if (this.isKicking) {
            // Quick kick motion: back -> forward
            const t = this.kickAnim < 0.4 ? this.kickAnim / 0.4 : 1 - (this.kickAnim - 0.4) / 0.6;
            rearLegAngle = t * -60 * Math.PI / 180;
        }

        // === BODY ===
        ctx.fillStyle = '#8B6914';
        ctx.beginPath();
        ctx.ellipse(40, 45 + breathOffset, 45, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body shading
        const bodyGrad = ctx.createRadialGradient(35, 40 + breathOffset, 5, 40, 45 + breathOffset, 45);
        bodyGrad.addColorStop(0, '#A07828');
        bodyGrad.addColorStop(1, '#6B4F10');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(40, 45 + breathOffset, 45, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        // === NECK ===
        ctx.fillStyle = '#8B6914';
        ctx.beginPath();
        ctx.moveTo(5, 35 + breathOffset);
        ctx.quadraticCurveTo(-15, 10 + breathOffset, -10, -10 + breathOffset);
        ctx.lineTo(10, -15 + breathOffset);
        ctx.quadraticCurveTo(15, 15 + breathOffset, 20, 35 + breathOffset);
        ctx.fill();

        // === HEAD ===
        ctx.fillStyle = '#9B7924';
        ctx.beginPath();
        ctx.ellipse(-15, -18 + breathOffset, 18, 14, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#A08030';
        ctx.beginPath();
        ctx.ellipse(-30, -14 + breathOffset, 10, 8, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(-18, -22 + breathOffset, 3, 0, Math.PI * 2);
        ctx.fill();
        // Eye shine
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-17, -23 + breathOffset, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Ear
        ctx.fillStyle = '#7B5910';
        ctx.beginPath();
        ctx.moveTo(-10, -30 + breathOffset);
        ctx.lineTo(-5, -42 + breathOffset);
        ctx.lineTo(0, -28 + breathOffset);
        ctx.fill();

        // Mane
        ctx.strokeStyle = '#4a3510';
        ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            const mx = -8 + i * 5;
            const my = -28 + i * 8 + breathOffset;
            ctx.moveTo(mx, my);
            ctx.quadraticCurveTo(mx - 8, my + 5, mx - 5, my + 12);
            ctx.stroke();
        }

        // === COWBOY HAT === 🤠
        ctx.save();
        ctx.translate(-15, -35 + breathOffset);
        ctx.rotate(-0.15);
        
        // Hat brim
        ctx.fillStyle = '#5C3317';
        ctx.beginPath();
        ctx.ellipse(0, 5, 28, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Hat crown
        const hatGrad = ctx.createLinearGradient(-12, -15, 12, 5);
        hatGrad.addColorStop(0, '#8B5A2B');
        hatGrad.addColorStop(0.5, '#6B3A1B');
        hatGrad.addColorStop(1, '#5C3317');
        ctx.fillStyle = hatGrad;
        ctx.beginPath();
        ctx.moveTo(-12, 3);
        ctx.quadraticCurveTo(-14, -12, -8, -16);
        ctx.quadraticCurveTo(0, -20, 8, -16);
        ctx.quadraticCurveTo(14, -12, 12, 3);
        ctx.closePath();
        ctx.fill();
        
        // Hat band
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-12, -2, 24, 3);
        
        // Hat band buckle
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(-2, -3, 4, 5);
        
        ctx.restore();

        // === FRONT LEGS ===
        ctx.fillStyle = '#7B5910';
        // Front left
        ctx.fillRect(8, 60 + breathOffset, 8, 25);
        // Front right
        ctx.fillRect(20, 60 + breathOffset, 8, 25);
        // Hooves
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(6, 83 + breathOffset, 12, 5);
        ctx.fillRect(18, 83 + breathOffset, 12, 5);

        // === REAR LEGS (with kick animation) ===
        ctx.save();
        ctx.translate(65, 58 + breathOffset);
        ctx.rotate(rearLegAngle);
        
        ctx.fillStyle = '#7B5910';
        // Rear leg upper
        ctx.fillRect(-5, 0, 10, 18);
        // Rear leg lower
        ctx.fillRect(-4, 16, 8, 14);
        // Hoof
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-6, 28, 14, 6);
        
        // Kick effect
        if (this.isKicking && this.kickAnim > 0.2 && this.kickAnim < 0.5) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(5, 30, 10 + i * 8, -0.5, 0.5);
                ctx.stroke();
            }
        }
        
        ctx.restore();

        // Second rear leg (behind)
        ctx.save();
        ctx.translate(58, 58 + breathOffset);
        ctx.rotate(rearLegAngle * 0.8);
        ctx.fillStyle = '#6B4910';
        ctx.fillRect(-5, 0, 10, 18);
        ctx.fillRect(-4, 16, 8, 14);
        ctx.fillStyle = '#222';
        ctx.fillRect(-6, 28, 14, 6);
        ctx.restore();

        // === TAIL ===
        ctx.strokeStyle = '#4a3510';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(82, 38 + breathOffset);
        ctx.quadraticCurveTo(
            95 + tailSwing * 0.5, 30 + breathOffset,
            100 + tailSwing, 45 + breathOffset
        );
        ctx.stroke();
        // Tail hair
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(100 + tailSwing, 45 + breathOffset);
            ctx.quadraticCurveTo(
                105 + tailSwing + i * 3, 50 + breathOffset,
                102 + tailSwing + i * 2, 58 + breathOffset + i * 2
            );
            ctx.stroke();
        }

        ctx.restore();
    }
}
