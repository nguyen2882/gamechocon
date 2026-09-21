/**
 * Bộ tạo âm thanh sống động cho bé bằng Web Audio API
 * Tự tổng hợp 100% âm thanh bằng sóng âm, chạy mượt mà không lo tải file chậm hoặc mất mạng
 */

class KidsAudio {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isBgmMuted = false;
        this.bgmTimer = null;
        this.bgmPlaying = false;
        this.initAudioContext();
    }

    initAudioContext() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    }

    ensureContext() {
        this.initAudioContext();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Âm thanh bong bóng nảy "Pop!" khi bé bấm nút
    playPop() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    // Âm thanh chúc mừng chuông vàng reo vui khi bé chọn đúng
    playSuccess() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + idx * 0.09;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.36);
        });
    }

    // Âm thanh vui nhộn khi bé chọn chưa đúng (tiếng lò xo ngộ nghĩnh)
    playGentleBoing() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.15);
        osc.frequency.linearRampToValueAtTime(260, now + 0.25);
        osc.frequency.linearRampToValueAtTime(140, now + 0.4);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.42);
    }

    // Âm thanh ngôi sao lấp lánh (Sparkle)
    playSparkle() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const freqs = [1200, 1500, 1800, 2200, 2600];
        const now = this.ctx.currentTime;

        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const st = now + i * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, st);

            gain.gain.setValueAtTime(0.15, st);
            gain.gain.exponentialRampToValueAtTime(0.001, st + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(st);
            osc.stop(st + 0.2);
        });
    }

    // Âm thanh kèn chiến thắng (Tada Fanfare)
    playTada() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major
        const now = this.ctx.currentTime;

        // Tiếng kèn mở màn
        [523.25, 659.25, 783.99].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const st = now + i * 0.12;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, st);

            gain.gain.setValueAtTime(0.15, st);
            gain.gain.exponentialRampToValueAtTime(0.01, st + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(st);
            osc.stop(st + 0.2);
        });

        // Hợp âm vang cuối
        const finalTime = now + 0.45;
        chord.forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, finalTime);

            gain.gain.setValueAtTime(0.25, finalTime);
            gain.gain.exponentialRampToValueAtTime(0.001, finalTime + 0.8);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(finalTime);
            osc.stop(finalTime + 0.85);
        });
    }

    // Mô phỏng âm thanh đồ vật/con vật quen thuộc
    playItemSound(soundKey) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        switch (soundKey) {
            case 'car': // Bíp bíp
                [0, 0.15].forEach(offset => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(440, now + offset);
                    gain.gain.setValueAtTime(0.3, now + offset);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.12);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + offset);
                    osc.stop(now + offset + 0.13);
                });
                break;

            case 'train': // Xình xịch còi tàu tu tu
                [0, 0.2].forEach(offset => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(587.33, now + offset); // D5
                    gain.gain.setValueAtTime(0.2, now + offset);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.18);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + offset);
                    osc.stop(now + offset + 0.19);
                });
                break;

            case 'dog': // Gâu gâu (trầm bổng)
                [0, 0.18].forEach(offset => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(260, now + offset);
                    osc.frequency.exponentialRampToValueAtTime(140, now + offset + 0.12);
                    gain.gain.setValueAtTime(0.3, now + offset);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.12);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + offset);
                    osc.stop(now + offset + 0.13);
                });
                break;

            case 'cat': // Meo meo (vuốt cao xuống)
                const catOsc = this.ctx.createOscillator();
                const catGain = this.ctx.createGain();
                catOsc.type = 'sine';
                catOsc.frequency.setValueAtTime(550, now);
                catOsc.frequency.linearRampToValueAtTime(800, now + 0.15);
                catOsc.frequency.exponentialRampToValueAtTime(450, now + 0.4);
                catGain.gain.setValueAtTime(0.25, now);
                catGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                catOsc.connect(catGain);
                catGain.connect(this.ctx.destination);
                catOsc.start(now);
                catOsc.stop(now + 0.42);
                break;

            case 'duck': // Cạp cạp
                [0, 0.2].forEach(offset => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(320, now + offset);
                    osc.frequency.linearRampToValueAtTime(220, now + offset + 0.14);
                    gain.gain.setValueAtTime(0.25, now + offset);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.14);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + offset);
                    osc.stop(now + offset + 0.15);
                });
                break;

            case 'airplane': // Vù vù tiếng động cơ
                const airOsc = this.ctx.createOscillator();
                const airGain = this.ctx.createGain();
                airOsc.type = 'sine';
                airOsc.frequency.setValueAtTime(150, now);
                airOsc.frequency.exponentialRampToValueAtTime(400, now + 0.35);
                airGain.gain.setValueAtTime(0.2, now);
                airGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                airOsc.connect(airGain);
                airGain.connect(this.ctx.destination);
                airOsc.start(now);
                airOsc.stop(now + 0.52);
                break;

            default:
                this.playPop();
                break;
        }
    }

    // Nhạc nền thiếu nhi vui tươi, nhẹ nhàng hộp âm nhạc (Music Box)
    startBGM() {
        if (this.bgmPlaying || this.isBgmMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        this.bgmPlaying = true;
        // Điệu nhạc thiếu nhi ngũ cung (Twinkle Twinkle Little Star pattern)
        const melody = [
            { note: 261.63, dur: 0.35 }, { note: 261.63, dur: 0.35 },
            { note: 392.00, dur: 0.35 }, { note: 392.00, dur: 0.35 },
            { note: 440.00, dur: 0.35 }, { note: 440.00, dur: 0.35 },
            { note: 392.00, dur: 0.70 },
            { note: 349.23, dur: 0.35 }, { note: 349.23, dur: 0.35 },
            { note: 329.63, dur: 0.35 }, { note: 329.63, dur: 0.35 },
            { note: 293.66, dur: 0.35 }, { note: 293.66, dur: 0.35 },
            { note: 261.63, dur: 0.70 }
        ];

        let noteIndex = 0;
        const playNext = () => {
            if (!this.bgmPlaying || this.isBgmMuted || !this.ctx) return;

            const item = melody[noteIndex];
            const now = this.ctx.currentTime;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            // Sóng sin trong trẻo như hộp nhạc
            osc.type = 'sine';
            osc.frequency.setValueAtTime(item.note * 2, now); // Lên quãng 8 cho êm dịu

            gain.gain.setValueAtTime(0.04, now); // Âm lượng nền rất nhỏ dịu
            gain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur * 0.9);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + item.dur);

            noteIndex = (noteIndex + 1) % melody.length;
            this.bgmTimer = setTimeout(playNext, item.dur * 1000);
        };

        playNext();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    toggleBGM() {
        this.isBgmMuted = !this.isBgmMuted;
        if (this.isBgmMuted) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return !this.isBgmMuted;
    }
}

window.kidsAudio = new KidsAudio();
