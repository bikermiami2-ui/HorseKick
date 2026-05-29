class AudioSystem {
    constructor() {
        this.ctx = null;
        this.enabled = false;
    }
    init() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.enabled = true;
        } catch(e) { this.enabled = false; }
    }
    playTone(freq, duration, type = 'sine', vol = 0.3) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
    playStretch(power) {
        if (!this.enabled) return;
        const freq = 100 + power * 400;
        this.playTone(freq, 0.1, 'sawtooth', 0.1);
    }
    playKick() {
        if (!this.enabled) return;
        this.playTone(80, 0.3, 'square', 0.5);
        this.playTone(60, 0.4, 'sawtooth', 0.3);
    }
    playSmash() {
        if (!this.enabled) return;
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.playTone(200 + Math.random() * 300, 0.15, 'sawtooth', 0.2), i * 30);
        }
    }
    playWin() {
        if (!this.enabled) return;
        [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.playTone(f, 0.3, 'sine', 0.3), i * 150));
    }
    playLose() {
        if (!this.enabled) return;
        [400, 350, 300, 200].forEach((f, i) => setTimeout(() => this.playTone(f, 0.4, 'sawtooth', 0.2), i * 200));
    }
}
const audio = new AudioSystem();
