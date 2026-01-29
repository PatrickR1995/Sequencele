/**
 * Brainrot Effects System
 * TikTok vibes, Roblox energy, pure chaos 💀🔥
 */

class BrainrotEffects {
    constructor() {
        this.isActive = false;
        this.soundsEnabled = true;
        this.audioContext = null;
        this.bgMusic = null;
    }

    activate() {
        this.isActive = true;
        document.body.classList.add('brainrot-mode');
        this.startBackgroundEffects();
        this.playBackgroundMusic();
    }

    deactivate() {
        this.isActive = false;
        document.body.classList.remove('brainrot-mode');
        this.stopBackgroundEffects();
        this.stopBackgroundMusic();
    }

    // Background effects (floating emojis, rainbow borders, etc)
    startBackgroundEffects() {
        // Add rainbow border
        this.addRainbowBorder();

        // Add floating emojis
        this.createFloatingEmojis();

        // Add pulsing background
        document.body.classList.add('brainrot-pulse');
    }

    stopBackgroundEffects() {
        const rainbow = document.getElementById('rainbow-border');
        if (rainbow) rainbow.remove();

        const emojis = document.querySelectorAll('.floating-emoji');
        emojis.forEach(e => e.remove());

        // Remove the floating emoji container
        const emojiContainer = document.getElementById('floating-emojis');
        if (emojiContainer) emojiContainer.remove();

        // Remove all brainrot effect elements
        document.querySelectorAll('.screen-flash').forEach(el => el.remove());
        document.querySelectorAll('.vine-boom-effect').forEach(el => el.remove());
        document.querySelectorAll('.meme-text').forEach(el => el.remove());
        document.querySelectorAll('.particle').forEach(el => el.remove());
        document.querySelectorAll('.confetti').forEach(el => el.remove());

        // Remove glitch effect classes from all elements
        document.querySelectorAll('.glitch-effect').forEach(el => {
            el.classList.remove('glitch-effect');
        });

        // Reset container inline styles
        const container = document.querySelector('.container');
        if (container) {
            container.style.border = '';
            container.style.borderImage = '';
            container.style.animation = '';
        }

        // Remove body filter effects and animations
        document.body.style.filter = '';
        document.body.style.animation = '';

        // Remove all brainrot-related classes
        document.body.classList.remove('brainrot-pulse');
        document.body.classList.remove('brainrot-mode');
    }

    // Add rainbow border around container
    addRainbowBorder() {
        const container = document.querySelector('.container');
        if (container) {
            container.style.border = '4px solid';
            container.style.borderImage = 'linear-gradient(45deg, #FF006E, #8338EC, #3A86FF, #FB5607, #FFBE0B) 1';
            container.style.animation = 'rainbow-rotate 3s linear infinite';
        }
    }

    // Create floating emojis
    createFloatingEmojis() {
        const emojis = ['💀', '🔥', '💯', '🧠', '😈', '⚡', '💎', '👑'];
        const container = document.createElement('div');
        container.id = 'floating-emojis';
        container.className = 'floating-emojis-container';

        for (let i = 0; i < 10; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.animationDuration = (Math.random() * 10 + 10) + 's';
            emoji.style.animationDelay = Math.random() * 5 + 's';
            emoji.style.fontSize = (Math.random() * 20 + 20) + 'px';
            container.appendChild(emoji);
        }

        document.body.appendChild(container);
    }

    // Sound effects using Web Audio API
    playSound(frequency, duration, type = 'sine') {
        if (!this.soundsEnabled) return;

        this.audioContext = this.audioContext || new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Vine boom sound
    playVineBoom() {
        if (!this.isActive) return;

        this.playSound(150, 0.3, 'sine');

        // Add visual boom effect
        const boom = document.createElement('div');
        boom.className = 'vine-boom-effect';
        boom.textContent = '💥';
        document.body.appendChild(boom);
        setTimeout(() => boom.remove(), 500);
    }

    // Sheesh sound
    playSheesh() {
        if (!this.isActive) return;

        // Rising pitch
        this.audioContext = this.audioContext || new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // Victory sound (arpeggio)
    playVictory() {
        if (!this.isActive) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
        this.audioContext = this.audioContext || new (window.AudioContext || window.webkitAudioContext)();

        notes.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = this.audioContext.currentTime + (i * 0.15);
            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    // Bruh sound (descending)
    playBruh() {
        if (!this.isActive) return;

        this.audioContext = this.audioContext || new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    // Background phonk beat (looping)
    playBackgroundMusic() {
        if (!this.soundsEnabled) return;

        // Simple beat pattern
        const playBeat = () => {
            if (!this.isActive) return;

            this.playSound(60, 0.1, 'sine'); // Kick
            setTimeout(() => this.playSound(200, 0.05, 'square'), 250); // Snare
            setTimeout(() => this.playSound(150, 0.05, 'sine'), 500); // Hat

            this.bgMusic = setTimeout(playBeat, 600);
        };

        playBeat();
    }

    stopBackgroundMusic() {
        if (this.bgMusic) {
            clearTimeout(this.bgMusic);
            this.bgMusic = null;
        }
    }

    // Screen shake
    screenShake(intensity = 5) {
        if (!this.isActive) return;

        const container = document.querySelector('.container');
        if (!container) return;

        container.style.animation = `shake 0.5s`;
        setTimeout(() => {
            container.style.animation = '';
        }, 500);
    }

    // Flash screen
    flashScreen(color = '#fff') {
        if (!this.isActive) return;

        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        flash.style.backgroundColor = color;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 100);
    }

    // Show meme text overlay
    showMemeText(text, type = 'default') {
        if (!this.isActive) return;

        const meme = document.createElement('div');
        meme.className = `meme-text meme-${type}`;
        meme.textContent = text;
        document.body.appendChild(meme);

        setTimeout(() => {
            meme.classList.add('fade-out');
            setTimeout(() => meme.remove(), 500);
        }, 1500);
    }

    // Particle explosion
    createParticles(x, y, emojis, count = 20) {
        if (!this.isActive) return;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            const angle = (Math.PI * 2 * i) / count;
            const velocity = 100 + Math.random() * 100;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
            particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }

    // Confetti explosion
    confettiExplosion() {
        if (!this.isActive) return;

        const emojis = ['🎉', '💎', '👑', '⭐', '🏆', '💯', '🔥', '💀'];

        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
                confetti.style.fontSize = (Math.random() * 30 + 20) + 'px';

                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }

    // Glitch effect on element
    glitchElement(element, duration = 300) {
        if (!this.isActive) return;

        element.classList.add('glitch-effect');
        setTimeout(() => element.classList.remove('glitch-effect'), duration);
    }

    // On tile click
    onTileClick(event, tileNumber) {
        if (!this.isActive) return;

        const texts = ['no cap', 'fr fr', 'sheesh', 'bussin', 'slay'];
        const emojis = ['💀', '🔥', '💯', '🧠'];

        this.playVineBoom();
        this.createParticles(event.clientX, event.clientY, emojis, 10);
        this.showMemeText(texts[Math.floor(Math.random() * texts.length)], 'click');
        this.screenShake(2);
    }

    // On correct guess
    onCorrectGuess() {
        if (!this.isActive) return;

        const texts = ['W', 'based', 'valid', 'fire', 'goated'];

        this.playSheesh();
        this.showMemeText(texts[Math.floor(Math.random() * texts.length)], 'correct');
        this.flashScreen('#00ff00');
        this.screenShake(5);
    }

    // On wrong guess
    onWrongGuess() {
        if (!this.isActive) return;

        const texts = ['L', 'mid', 'cringe', 'ratio', 'cap'];

        this.playBruh();
        this.showMemeText(texts[Math.floor(Math.random() * texts.length)], 'wrong');
        this.flashScreen('#ff0000');
        this.screenShake(8);
    }

    // On win
    onWin() {
        if (!this.isActive) return;

        const texts = ['GG EZ', 'W STREAK', 'GOAT', 'SIGMA', 'BASED'];

        this.playVictory();
        this.confettiExplosion();
        this.showMemeText(texts[Math.floor(Math.random() * texts.length)], 'win');
        this.flashScreen('#ffd700');
        this.screenShake(15);
    }

    // On lose
    onLose() {
        if (!this.isActive) return;

        const texts = ['L BOZO', 'TOUCH GRASS', 'SKILL ISSUE', 'RIP BOZO'];

        this.playBruh();
        this.showMemeText(texts[Math.floor(Math.random() * texts.length)], 'lose');
        this.flashScreen('#000000');
        this.screenShake(10);
    }

    // Toggle sounds
    toggleSound() {
        this.soundsEnabled = !this.soundsEnabled;
        if (!this.soundsEnabled) {
            this.stopBackgroundMusic();
        } else if (this.isActive) {
            this.playBackgroundMusic();
        }
        return this.soundsEnabled;
    }
}

// Create global instance
window.brainrotEffects = new BrainrotEffects();