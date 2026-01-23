/**
 * Click Handler
 * Manages click/tap interactions - click a number to place it in first available slot
 */

class ClickHandler {
    constructor(game, uiRenderer) {
        this.game = game;
        this.uiRenderer = uiRenderer;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Delegate events to the pool container
        const poolContainer = document.getElementById('pool-container');

        // Click/tap events
        poolContainer.addEventListener('click', (e) => this.handleTileClick(e));
        poolContainer.addEventListener('touchend', (e) => this.handleTileTouchEnd(e), { passive: true });
    }

    handleTileClick(e) {
        const tile = e.target.closest('.number-tile');
        if (!tile) return;
        if (tile.classList.contains('used')) return;

        this.game.startTimer();

        const number = parseInt(tile.dataset.number);
        this.placeInFirstAvailableSlot(number);
    }

    handleTileTouchEnd(e) {
        const tile = e.target.closest('.number-tile');
        if (!tile) return;
        if (tile.classList.contains('used')) return;

        // Prevent the click event from also firing
        e.preventDefault();

        this.game.startTimer();

        const number = parseInt(tile.dataset.number);
        this.placeInFirstAvailableSlot(number);
    }

    placeInFirstAvailableSlot(number) {
        // Find first empty slot
        const firstEmptyIndex = this.game.platformSlots.findIndex(slot => slot === null);

        if (firstEmptyIndex !== -1) {
            this.game.placeInSlot(firstEmptyIndex, number);
        }
    }
}