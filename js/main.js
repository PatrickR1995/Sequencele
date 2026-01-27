/**
 * Main Entry Point
 * Initializes the game and sets up global event listeners
 */

let game;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if StorageManager is loaded
    if (typeof StorageManager === 'undefined') {
        console.error('StorageManager not loaded! Check script order.');
        return;
    }

    // Apply saved dark mode (default is false/light mode)
    const isDark = StorageManager.loadDarkMode ? StorageManager.loadDarkMode() : false;
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
    document.getElementById('dark-mode-toggle').checked = isDark;

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

    // Dark mode toggle
    document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
        const isDark = e.target.checked;
        document.body.classList.toggle('dark-mode', isDark);
        if (StorageManager.saveDarkMode) {
            StorageManager.saveDarkMode(isDark);
        }
    });

    // Theme toggle (Numbers=OFF/Brainrot=ON)
    document.getElementById('theme-toggle').addEventListener('change', (e) => {
        const theme = e.target.checked ? 'brainrot' : 'number';
        if (game) {
            game.changeTheme(theme);
        }
    });

    // Difficulty toggle (Normal=OFF/Hard=ON)
    document.getElementById('difficulty-toggle').addEventListener('change', (e) => {
        const difficulty = e.target.checked ? 'hard' : 'normal';
        if (game) {
            game.changeDifficulty(difficulty);
        }
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