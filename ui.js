class UI {
    constructor(ctx, canvas) { this.ctx = ctx; this.canvas = canvas; }
    drawMenu(bestScore) {
        const c = this.ctx, w = this.canvas.width, h = this.canvas.height;
        c.fillStyle = 'rgba(0,0,0,0.7)'; c.fillRect(0,0,w,h);
        c.textAlign = 'center'; c.fillStyle = '#FFD700';
        c.font = 'bold 48px Impact, Arial Black, sans-serif';
        c.fillText('🐴 HORSE KICK', w/2, h/2 - 60);
        c.font = 'bold 32px Impact, Arial Black, sans-serif';
        c.fillStyle = '#fff';
        c.fillText('BARREL SMASH', w/2, h/2 - 15);
        c.font = '20px Arial, sans-serif'; c.fillStyle = '#ccc';
        c.fillText('Пни бочку в фермера!', w/2, h/2 + 25);
        c.font = '18px Arial, sans-serif'; c.fillStyle = '#aaa';
        c.fillText('Оттяни и отпусти чтобы пнуть', w/2, h/2 + 50);
        c.fillStyle = '#4f4'; c.font = 'bold 28px Arial, sans-serif';
        c.fillText('▶ НАЖМИ ЧТОБЫ ИГРАТЬ', w/2, h/2 + 95);
        if (bestScore > 0) {
            c.fillStyle = '#FFD700'; c.font = '18px Arial, sans-serif';
            c.fillText(`Лучший счёт: ${bestScore}`, w/2, h/2 + 130);
        }
    }
    drawHUD(score, kicksLeft, level, targetBarrels) {
        const c = this.ctx, w = this.canvas.width;
        c.textAlign = 'left'; c.fillStyle = '#fff'; c.font = 'bold 22px Arial, sans-serif';
        c.fillText(`Уровень: ${level}`, 15, 35);
        c.fillText(`Счёт: ${score}`, 15, 62);
        c.textAlign = 'right';
        c.fillText(`Удары: ${kicksLeft}`, w - 15, 35);
        c.fillText(`Бочки: ${targetBarrels}`, w - 15, 62);
        // Farmer indicator
        c.textAlign = 'center'; c.fillStyle = '#ff8888'; c.font = '16px Arial, sans-serif';
        c.fillText('🎯 Цель: Фермер', w/2, 30);
    }
    drawLevelComplete(score, stars, bestScore) {
        const c = this.ctx, w = this.canvas.width, h = this.canvas.height;
        c.fillStyle = 'rgba(0,0,0,0.75)'; c.fillRect(0,0,w,h);
        c.textAlign = 'center'; c.fillStyle = '#4f4';
        c.font = 'bold 42px Impact, Arial Black, sans-serif';
        c.fillText('ФЕРМЕР ПОЛУЧИЛ!', w/2, h/2 - 50);
        c.fillStyle = '#FFD700'; c.font = '36px Arial, sans-serif';
        c.fillText('⭐'.repeat(stars), w/2, h/2);
        c.fillStyle = '#fff'; c.font = '24px Arial, sans-serif';
        c.fillText(`Счёт: ${score}  |  Рекорд: ${bestScore}`, w/2, h/2 + 45);
        c.fillStyle = '#4f4'; c.font = 'bold 26px Arial, sans-serif';
        c.fillText('▶ СЛЕДУЮЩИЙ УРОВЕНЬ', w/2, h/2 + 95);
    }
    drawGameOver(score, bestScore) {
        const c = this.ctx, w = this.canvas.width, h = this.canvas.height;
        c.fillStyle = 'rgba(0,0,0,0.75)'; c.fillRect(0,0,w,h);
        c.textAlign = 'center'; c.fillStyle = '#f44';
        c.font = 'bold 42px Impact, Arial Black, sans-serif';
        c.fillText('ФЕРМЕР УСКОЛЬЗНУЛ!', w/2, h/2 - 40);
        c.fillStyle = '#fff'; c.font = '24px Arial, sans-serif';
        c.fillText(`Счёт: ${score}  |  Рекорд: ${bestScore}`, w/2, h/2 + 10);
        c.fillStyle = '#ff4'; c.font = 'bold 26px Arial, sans-serif';
        c.fillText('↻ ПОПРОБОВАТЬ СНОВА', w/2, h/2 + 65);
    }
    drawAllClear(bestScore) {
        const c = this.ctx, w = this.canvas.width, h = this.canvas.height;
        c.fillStyle = 'rgba(0,0,0,0.8)'; c.fillRect(0,0,w,h);
        c.textAlign = 'center'; c.fillStyle = '#FFD700';
        c.font = 'bold 46px Impact, Arial Black, sans-serif';
        c.fillText('🏆 ВСЕ ФЕРМЕРЫ ПОЛУЧИЛИ! 🏆', w/2, h/2 - 40);
        c.fillStyle = '#fff'; c.font = '26px Arial, sans-serif';
        c.fillText(`Финальный счёт: ${bestScore}`, w/2, h/2 + 15);
        c.fillStyle = '#4f4'; c.font = 'bold 24px Arial, sans-serif';
        c.fillText('▶ ИГРАТЬ СНОВА', w/2, h/2 + 70);
    }
}
