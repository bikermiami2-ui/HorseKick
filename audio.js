// Procedural Audio System using Web Audio API
class AudioManager {
    constructor() {
        this.ctx = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch(e) { console.warn('Web Audio not supported'); }
    }

    playTone(freq, duration, type = 'sine', volume = 0.3) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playNoise(duration, volume = 0.2) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
    }

    playStretch() { this.playTone(150, 0.1, 'triangle', 0.1); }
    playKick() { 
        this.playTone(80, 0.15, 'square', 0.4);
        this.playNoise(0.1, 0.3);
    }
    playWoodCrack() {
        this.playNoise(0.2, 0.4);
        this.playTone(200, 0.1, 'sawtooth', 0.2);
    }
    playHit() {
        this.playTone(300, 0.1, 'square', 0.3);
        this.playNoise(0.05, 0.2);
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
}

const audio = new AudioManager();
