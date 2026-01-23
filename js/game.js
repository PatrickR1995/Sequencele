/**
 * Game Class
 * Main game logic and state management
 */

class Game {
    constructor() {
        this.difficulty = StorageManager.loadDifficulty();
        this.theme = StorageManager.loadTheme();
        this.hiddenSequence = [];
        this.platformSlots = [null, null, null, null, null];
        this.attempts = 0;
        this.guessHistory = [];
        this.bestScore = 0;
        this.gameOver = false;

        this.timer = new TimerManager();
        this.uiRenderer = new UIRenderer(this);
        this.clickHandler = new ClickHandler(this, this.uiRenderer);
        this.statistics = new StatisticsManager();

        this.init();
    }

    init() {
        // Load saved settings first
        this.loadSavedSettings();

        // Generate sequence for current difficulty
        this.hiddenSequence = SequenceGenerator.generateSequence(this.difficulty);

        // Try to load saved game state for this difficulty
        const savedState = StorageManager.loadGameState(this.difficulty);
        if (savedState && savedState.dayNumber === SequenceGenerator.getDayNumber()) {
            this.loadState(savedState);
        }

        // Render initial UI
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('submit-btn').addEventListener('click', () => this.submitGuess());
        document.getElementById('history-toggle').addEventListener('click', () => this.toggleHistory());
    }

    startTimer() {
        this.timer.start();
    }

    placeInSlot(slotIndex, number) {
        this.platformSlots[slotIndex] = number;
        this.render();
        this.saveState();
    }

    removeFromSlot(slotIndex) {
        this.platformSlots[slotIndex] = null;
        this.render();
        this.saveState();
    }

    submitGuess() {
        if (this.gameOver) return;

        this.attempts++;

        // Calculate feedback
        const correctCount = this.calculateFeedback(this.platformSlots, this.hiddenSequence);

        // Update best score
        if (correctCount > this.bestScore) {
            this.bestScore = correctCount;
        }

        // Add to history
        this.guessHistory.unshift({
            attempt: this.attempts,
            correctCount: correctCount,
            guess: [...this.platformSlots]
        });

        // Check win condition
        if (correctCount === CONFIG.SEQUENCE_LENGTH) {
            this.endGame(true);
            return;
        }

        // Check lose condition
        if (this.attempts >= CONFIG.MAX_ATTEMPTS) {
            this.endGame(false);
            return;
        }

        // Reset platform for next guess
        this.platformSlots = [null, null, null, null, null];

        // Update UI
        this.render();
        this.uiRenderer.showHistory();
        this.saveState();
    }

    calculateFeedback(guess, hidden) {
        let correctPosition = 0;
        for (let i = 0; i < CONFIG.SEQUENCE_LENGTH; i++) {
            if (guess[i] === hidden[i]) {
                correctPosition++;
            }
        }
        return correctPosition;
    }

    endGame(won) {
        this.gameOver = true;
        this.timer.stop();
        document.getElementById('submit-btn').disabled = true;

        // Update statistics
        const dayNumber = SequenceGenerator.getDayNumber();
        this.statistics.updateStats(won, this.attempts, dayNumber);

        // Show game over modal
        const time = this.timer.formatTime(this.timer.getElapsedSeconds());
        this.uiRenderer.showGameOverModal(
            won,
            this.attempts,
            time,
            this.hiddenSequence,
            dayNumber
        );

        // Clear saved state for this difficulty
        StorageManager.clearGameState(this.difficulty);
    }

    changeDifficulty(newDifficulty) {
        if (this.difficulty === newDifficulty) return;

        // Save current state before switching
        this.saveState();

        // Reset game for new difficulty
        this.difficulty = newDifficulty;
        this.hiddenSequence = SequenceGenerator.generateSequence(newDifficulty);
        this.platformSlots = [null, null, null, null, null];
        this.attempts = 0;
        this.guessHistory = [];
        this.bestScore = 0;
        this.gameOver = false;
        this.timer.reset();

        // Try to load saved state for new difficulty
        const savedState = StorageManager.loadGameState(newDifficulty);
        if (savedState && savedState.dayNumber === SequenceGenerator.getDayNumber()) {
            this.loadState(savedState);
        }

        // Update UI - set radio button
        StorageManager.saveDifficulty(newDifficulty);
        document.getElementById(`difficulty-${newDifficulty}`).checked = true;

        // Handle history visibility
        if (newDifficulty === 'hard') {
            this.uiRenderer.hideHistory();
        } else if (this.guessHistory.length > 0) {
            this.uiRenderer.showHistory();
        }

        this.render();
    }

    changeTheme(newTheme) {
        this.theme = newTheme;
        this.uiRenderer.setTheme(newTheme);
        StorageManager.saveTheme(newTheme);
        document.getElementById(`theme-${newTheme}`).checked = true;
        this.render();
    }

    loadSavedSettings() {
        // Load and apply saved difficulty
        const savedDifficulty = StorageManager.loadDifficulty();
        if (savedDifficulty) {
            this.difficulty = savedDifficulty;
            document.getElementById(`difficulty-${savedDifficulty}`).checked = true;
        }

        // Load and apply saved theme
        const savedTheme = StorageManager.loadTheme();
        if (savedTheme) {
            this.theme = savedTheme;
            this.uiRenderer.setTheme(savedTheme);
            document.getElementById(`theme-${savedTheme}`).checked = true;
        }
    }

    toggleHistory() {
        const container = document.getElementById('history-container');
        const toggle = document.querySelector('.history-toggle-icon');

        if (container.style.display === 'none') {
            container.style.display = 'block';
            toggle.classList.remove('collapsed');
        } else {
            container.style.display = 'none';
            toggle.classList.add('collapsed');
        }
    }

    render() {
        this.uiRenderer.renderPool();
        this.uiRenderer.renderPlatform();
        this.uiRenderer.renderHistory();
        this.uiRenderer.updateGameInfo();
    }

    saveState() {
        if (this.gameOver) return;

        const state = {
            dayNumber: SequenceGenerator.getDayNumber(),
            platformSlots: this.platformSlots,
            attempts: this.attempts,
            guessHistory: this.guessHistory,
            bestScore: this.bestScore,
            elapsedSeconds: this.timer.getElapsedSeconds()
        };

        StorageManager.saveGameState(this.difficulty, state);
    }

    loadState(state) {
        this.platformSlots = state.platformSlots || [null, null, null, null, null];
        this.attempts = state.attempts || 0;
        this.guessHistory = state.guessHistory || [];
        this.bestScore = state.bestScore || 0;
        this.timer.loadState(state.elapsedSeconds);

        if (this.guessHistory.length > 0 && this.difficulty !== 'hard') {
            this.uiRenderer.showHistory();
        }
    }
}