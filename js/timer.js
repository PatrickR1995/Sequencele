/**
 * Timer Manager
 * Handles game timing functionality
 */

class TimerManager {
    constructor() {
        this.interval = null;
        this.startTime = null;
        this.elapsedSeconds = 0;
        this.timerElement = document.getElementById('timer');
    }

    start() {
        if (!this.startTime) {
            this.startTime = Date.now() - (this.elapsedSeconds * 1000);
            this.interval = setInterval(() => this.update(), 1000);
        }
    }

    update() {
        if (this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.elapsedSeconds = elapsed;

            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;

            this.timerElement.textContent =
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    reset() {
        this.stop();
        this.startTime = null;
        this.elapsedSeconds = 0;
        this.timerElement.textContent = '00:00';
    }

    getElapsedSeconds() {
        return this.elapsedSeconds;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    }

    loadState(elapsedSeconds) {
        this.elapsedSeconds = elapsedSeconds || 0;
        this.update();
    }
}