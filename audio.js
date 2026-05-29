// Audio Manager - Procedural sounds via Web Audio API
class AudioManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playStretch() {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playKick() {
        this.playTone(60, 0.3, 'square', 0.5);
        this.playTone(40, 0.4, 'sawtooth', 0.4);
    }

    playWoodBreak() {
        if (!this.enabled || !this.ctx) return;
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.playTone(100 + Math.random() * 200, 0.1, 'sawtooth', 0.2);
            }, i * 30);
        }
    }

    playHit() {
        this.playTone(150, 0.2, 'square', 0.4);
        this.playTone(80, 0.3, 'triangle', 0.3);
    }

    playWin() {
        [523, 659, 784, 1047].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 0.3, 'sine', 0.3), i * 150);
        });
    }

    playLose() {
        [400, 350, 300, 200].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 0.4, 'sawtooth', 0.2), i * 200);
        });
    }

    playAdvice() {
        this.playTone(600, 0.1, 'sine', 0.2);
        setTimeout(() => this.playTone(800, 0.15, 'sine', 0.2), 100);
    }
}

const audio = new AudioManager();
