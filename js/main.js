/**
 * Main Entry Point
 * Initializes the game and sets up global event listeners
 */

let game;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Close splash screen
    document.getElementById('play-btn').addEventListener('click', () => {
        document.getElementById('splash-screen').style.display = 'none';
        game = new Game();
    });

    // Settings button
    document.getElementById('settings-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('settings-dropdown');
        dropdown.classList.toggle('show');
    });

    // Close settings when clicking outside
    document.addEventListener('click', (e) => {
        const settingsContainer = document.querySelector('.settings-container');
        const dropdown = document.getElementById('settings-dropdown');
        if (settingsContainer && !settingsContainer.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });

    // Theme options
    document.querySelectorAll('[data-theme]').forEach(option => {
        option.addEventListener('click', (e) => {
            const theme = e.currentTarget.dataset.theme;
            if (game) {
                game.changeTheme(theme);
            }
        });
    });

    // Difficulty options
    document.querySelectorAll('[data-difficulty]').forEach(option => {
        option.addEventListener('click', (e) => {
            const difficulty = e.currentTarget.dataset.difficulty;
            if (game) {
                game.changeDifficulty(difficulty);
            }
        });
    });

    // Statistics button
    document.getElementById('stats-btn').addEventListener('click', () => {
        if (game) {
            game.statistics.showModal();
        }
    });

    // Close statistics
    document.getElementById('close-stats').addEventListener('click', () => {
        if (game) {
            game.statistics.hideModal();
        }
    });

    // Close stats modal when clicking outside
    document.getElementById('stats-modal').addEventListener('click', (e) => {
        if (e.target.id === 'stats-modal') {
            if (game) {
                game.statistics.hideModal();
            }
        }
    });
});