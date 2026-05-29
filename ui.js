// UI Manager - menus, score, farmer target, advice modal
const HORSE_WISDOM = [
    "🐴 Не пинай бочку, пока не увидишь фермера.",
    "🥕 Морковь — это топливо для великих побед.",
    "🌾 Терпение и сено — вот секрет успеха.",
    "🐎 Лучше один точный удар, чем десять слабых.",
    "🤠 Шляпа делает лошадь на 50% круче.",
    "💨 Ветер в гриве — лучший навигатор.",
    "🛢️ Бочка летит туда, куда смотрит копыто.",
    "🌅 Рассвет в поле лучше любого экрана.",
    "🐴 Лошадь не судит по размеру бочки.",
    "🎯 Прицеливайся сердцем, а не глазами.",
    "🌿 Трава всегда зеленее после дождя.",
    "🐎 Быстрый галоп не заменит мудрого шага.",
    "🤔 Если бочка не летит — попробуй другую шляпу.",
    "🌻 Подсолнух всегда знает, где цель.",
    "🐴 Ржание победы слышно за три поля.",
    "💪 Сила в копытах, мудрость в голове.",
    "🌙 Ночной рейд на бочки — особая магия.",
    "🎶 Стук копыт — лучшая музыка.",
    "🐎 Каждый промах — урок для следующего удара.",
    "🏆 Настоящая победа — когда фермер улыбается."
];

class Farmer {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 70;
        this.hit = false;
        this.hitAnim = 0;
        this.shakeX = 0;
        this.stars = [];
    }

    onHit() {
        if (this.hit) return;
        this.hit = true;
        this.hitAnim = 1;
        audio.playHit();
        // Spawn stars
        for (let i = 0; i < 5; i++) {
            this.stars.push({
                x: this.x + this.width/2 + (Math.random()-0.5) * 40,
                y: this.y + (Math.random()-0.5) * 30,
                size: 5 + Math.random() * 8,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    update() {
        if (this.hit) {
            this.hitAnim = Math.max(0, this.hitAnim - 0.02);
            this.shakeX = Math.sin(Date.now() * 0.05) * 5 * this.hitAnim;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.shakeX, this.y);

        // Body (overalls)
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(5, 25, 30, 35);
        
        // Overall straps
        ctx.strokeStyle = '#3158C0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(10, 25); ctx.lineTo(12, 15);
        ctx.moveTo(30, 25); ctx.lineTo(28, 15);
        ctx.stroke();

        // Shirt
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(8, 15, 24, 15);

        // Head
        ctx.fillStyle = '#FFDAB9';
        ctx.beginPath();
        ctx.arc(20, 10, 12, 0, Math.PI * 2);
        ctx.fill();

        // Hat (straw hat)
        ctx.fillStyle = '#F5DEB3';
        ctx.beginPath();
        ctx.ellipse(20, 2, 18, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(10, -8, 20, 10);

        // Face
        if (this.hit) {
            // X eyes
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            [-5, 5].forEach(offset => {
                const ex = 20 + offset;
                ctx.beginPath();
                ctx.moveTo(ex-3, 7); ctx.lineTo(ex+3, 13);
                ctx.moveTo(ex+3, 7); ctx.lineTo(ex-3, 13);
                ctx.stroke();
            });
            // Open mouth
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.ellipse(20, 18, 4, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Normal eyes
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(15, 10, 2, 0, Math.PI * 2);
            ctx.arc(25, 10, 2, 0, Math.PI * 2);
            ctx.fill();
            // Smile
            ctx.beginPath();
            ctx.arc(20, 14, 5, 0.2, Math.PI - 0.2);
            ctx.stroke();
        }

        // Legs
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(8, 58, 10, 12);
        ctx.fillRect(22, 58, 10, 12);
        
        // Boots
        ctx.fillStyle = '#5C3317';
        ctx.fillRect(6, 68, 14, 5);
        ctx.fillRect(20, 68, 14, 5);

        // Stars when hit
        if (this.hit) {
            this.stars.forEach(star => {
                star.phase += 0.1;
                const sy = star.y - this.y + Math.sin(star.phase) * 5;
                ctx.fillStyle = '#FFD700';
                ctx.font = `${star.size}px Arial`;
                ctx.fillText('⭐', star.x - this.x - this.shakeX, sy);
            });
        }

        ctx.restore();
    }

    getBounds() {
        return { x: this.x, y: this.y, w: this.width, h: this.height };
    }
}

class UIManager {
    constructor(game) {
        this.game = game;
        this.adviceModal = document.getElementById('adviceModal');
        this.adviceText = document.getElementById('adviceText');
        this.adviceBtn = document.getElementById('adviceBtn');
        this.closeAdvice = document.getElementById('closeAdvice');
        this.nextAdvice = document.getElementById('nextAdvice');
        
        this.setupAdvice();
    }

    setupAdvice() {
        const showAdvice = () => {
            this.adviceText.textContent = HORSE_WISDOM[Math.floor(Math.random() * HORSE_WISDOM.length)];
            this.adviceModal.classList.remove('hidden');
            audio.init();
            audio.playAdvice();
        };
        
        this.adviceBtn.addEventListener('click', showAdvice);
        this.adviceBtn.addEventListener('touchstart', (e) => { e.preventDefault(); showAdvice(); });
        
        const hideAdvice = () => this.adviceModal.classList.add('hidden');
        this.closeAdvice.addEventListener('click', hideAdvice);
        this.nextAdvice.addEventListener('click', () => {
            this.adviceText.textContent = HORSE_WISDOM[Math.floor(Math.random() * HORSE_WISDOM.length)];
            audio.playAdvice();
        });
        this.adviceModal.addEventListener('click', (e) => {
            if (e.target === this.adviceModal) hideAdvice();
        });
    }

    draw(ctx, canvasW, canvasH) {
        // Ground
        const groundY = canvasH - 60;
        const groundGrad = ctx.createLinearGradient(0, groundY, 0, canvasH);
        groundGrad.addColorStop(0, '#4a7c2f');
        groundGrad.addColorStop(0.3, '#3d6b25');
        groundGrad.addColorStop(1, '#2d5018');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, groundY, canvasW, 60);
        
        // Grass blades
        ctx.strokeStyle = '#5a9c3f';
        ctx.lineWidth = 2;
        for (let i = 0; i < canvasW; i += 15) {
            const h = 5 + Math.sin(i * 0.1 + Date.now() * 0.002) * 3;
            ctx.beginPath();
            ctx.moveTo(i, groundY);
            ctx.lineTo(i + 3, groundY - h);
            ctx.stroke();
        }

        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        skyGrad.addColorStop(0, '#1a1a3e');
        skyGrad.addColorStop(0.5, '#2d3a6e');
        skyGrad.addColorStop(1, '#4a6fa5');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvasW, groundY);

        // HUD
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Уровень: ${this.game.currentLevel + 1}/${this.game.levels.length}`, 20, 35);
        ctx.fillText(`Удары: ${this.game.shotsLeft}`, 20, 65);
        ctx.fillText(`Счёт: ${this.game.score}`, 20, 95);
        
        // Best score
        const best = localStorage.getItem('horseKickBest') || 0;
        ctx.font = '18px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`🏆 Рекорд: ${best}`, 20, 120);

        // State overlays
        if (this.game.state === 'menu') {
            this.drawOverlay(ctx, canvasW, canvasH, '🐴 Horse Kick', 'Оттяни и отпусти, чтобы пнуть бочку!', 'Нажми для старта');
        } else if (this.game.state === 'levelComplete') {
            this.drawOverlay(ctx, canvasW, canvasH, '✅ Уровень пройден!', `Счёт: ${this.game.score}`, 'Нажми для продолжения');
        } else if (this.game.state === 'gameOver') {
            this.drawOverlay(ctx, canvasW, canvasH, '❌ Проигрыш', `Финальный счёт: ${this.game.score}`, 'Нажми для рестарта');
        } else if (this.game.state === 'victory') {
            this.drawOverlay(ctx, canvasW, canvasH, '🏆 ПОБЕДА!', `Все уровни пройдены! Счёт: ${this.game.score}`, 'Нажми для новой игры');
        }
    }

    drawOverlay(ctx, w, h, title, subtitle, action) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, w, h);
        
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 48px Arial';
        ctx.fillText(title, w/2, h/2 - 40);
        
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText(subtitle, w/2, h/2 + 10);
        
        ctx.fillStyle = '#aaa';
        ctx.font = '20px Arial';
        ctx.fillText(action, w/2, h/2 + 60);
    }
}
