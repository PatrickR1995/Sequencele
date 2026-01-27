/**
 * Storage Manager
 * Handles all localStorage operations
 */

class StorageManager {
    static KEYS = {
        THEME: 'sequencele-theme',
        DIFFICULTY: 'sequencele-difficulty',
        STATS: 'sequencele-stats',
        GAME_STATE: 'sequencele-game-state',
        DARK_MODE: 'sequencele-dark-mode'
    };

    static saveTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
    }

    static loadTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'number';
    }

    static saveDifficulty(difficulty) {
        localStorage.setItem(this.KEYS.DIFFICULTY, difficulty);
    }

    static loadDifficulty() {
        return localStorage.getItem(this.KEYS.DIFFICULTY) || 'normal';
    }

    static saveDarkMode(isDark) {
        localStorage.setItem(this.KEYS.DARK_MODE, isDark ? 'true' : 'false');
    }

    static loadDarkMode() {
        const saved = localStorage.getItem(this.KEYS.DARK_MODE);
        // Return false as default if nothing saved
        if (saved === null || saved === undefined) {
            return false;
        }
        return saved === 'true';
    }

    static saveStats(stats) {
        localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
    }

    static loadStats() {
        const saved = localStorage.getItem(this.KEYS.STATS);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            played: 0,
            won: 0,
            currentStreak: 0,
            maxStreak: 0,
            guessDistribution: {
                '1-2': 0,
                '3-4': 0,
                '5-6': 0,
                '7-8': 0,
                '9-10': 0,
                '11-12': 0
            },
            lastPlayedDate: null
        };
    }

    static saveGameState(difficulty, state) {
        const gameStates = this.loadAllGameStates();
        gameStates[difficulty] = state;
        localStorage.setItem(this.KEYS.GAME_STATE, JSON.stringify(gameStates));
    }

    static loadGameState(difficulty) {
        const gameStates = this.loadAllGameStates();
        return gameStates[difficulty] || null;
    }

    static loadAllGameStates() {
        const saved = localStorage.getItem(this.KEYS.GAME_STATE);
        return saved ? JSON.parse(saved) : {};
    }

    static clearGameState(difficulty) {
        const gameStates = this.loadAllGameStates();
        delete gameStates[difficulty];
        localStorage.setItem(this.KEYS.GAME_STATE, JSON.stringify(gameStates));
    }
}