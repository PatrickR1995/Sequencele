/**
 * UI Renderer
 * Handles all UI rendering and updates
 */

class UIRenderer {
    constructor(game) {
        this.game = game;
        this.currentTheme = 'number';
    }

    setTheme(theme) {
        this.currentTheme = theme;

        // Preload images if the theme uses images to reduce flicker
        const themeConfig = CONFIG.THEMES[this.currentTheme];
        if (themeConfig && themeConfig.useImages) {
            this.preloadImages(themeConfig.items.map(i => `images/${i}`));
        }

        // Add a body-level class so CSS can switch tile/slot appearance when using images
        if (typeof document !== 'undefined' && document.body) {
            document.body.classList.toggle('theme-images', !!(themeConfig && themeConfig.useImages));
        }
    }

    // Helper to preload images
    preloadImages(urls) {
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    renderPool() {
        const container = document.getElementById('pool-container');
        container.innerHTML = '';

        const themeConfig = CONFIG.THEMES[this.currentTheme];

        for (let i = 1; i <= CONFIG.SEQUENCE_LENGTH; i++) {
            const tile = this.createTile(i, themeConfig);

            // Check if number is already used
            if (this.game.platformSlots.includes(i)) {
                tile.classList.add('used');
            }

            container.appendChild(tile);
        }
    }

    createTile(number, themeConfig) {
        const tile = document.createElement('div');
        tile.className = 'number-tile';
        tile.dataset.number = number;

        if (themeConfig.useColorClass) {
            tile.classList.add('color-theme', `color-${number}`);
        } else if (themeConfig.useImages) {
            // Create image element for brainrot theme
            const img = document.createElement('img');
            img.src = `images/${themeConfig.items[number - 1]}`;
            img.alt = `Item ${number}`;
            img.className = 'tile-image';
            img.onerror = function() {
                // Fallback if image not found - show placeholder
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.textContent = number;
                this.parentElement.appendChild(placeholder);
            };
            tile.appendChild(img);
        } else {
            tile.textContent = themeConfig.items[number - 1];
        }

        return tile;
    }

    renderPlatform() {
        const container = document.getElementById('platform-slots');
        container.innerHTML = '';

        const themeConfig = CONFIG.THEMES[this.currentTheme];

        this.game.platformSlots.forEach((value, index) => {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.dataset.index = index;

            if (value === null) {
                slot.classList.add('empty');
                slot.textContent = '?';
            } else {
                slot.classList.add('filled');

                // Make entire slot clickable to remove
                slot.style.cursor = 'pointer';
                slot.onclick = () => {
                    this.game.removeFromSlot(index);
                };

                if (themeConfig.useColorClass) {
                    slot.classList.add('color-theme', `color-${value}`);
                } else if (themeConfig.useImages) {
                    // Add image for brainrot theme
                    const img = document.createElement('img');
                    img.src = `images/${themeConfig.items[value - 1]}`;
                    img.alt = `Item ${value}`;
                    img.className = 'tile-image';
                    img.onerror = function() {
                        this.style.display = 'none';
                        const placeholder = document.createElement('div');
                        placeholder.className = 'image-placeholder';
                        placeholder.textContent = value;
                        this.parentElement.appendChild(placeholder);
                    };
                    slot.appendChild(img);
                } else {
                    slot.textContent = themeConfig.items[value - 1];
                }
            }

            container.appendChild(slot);
        });

        // Enable/disable submit button
        const allFilled = this.game.platformSlots.every(slot => slot !== null);
        document.getElementById('submit-btn').disabled = !allFilled;
    }

    renderHistory() {
        const container = document.getElementById('history-container');
        container.innerHTML = '';

        const themeConfig = CONFIG.THEMES[this.currentTheme];

        this.game.guessHistory.forEach((item) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            // Create the guess display
            const guessDisplay = document.createElement('div');
            guessDisplay.style.display = 'flex';
            guessDisplay.style.gap = '8px';
            guessDisplay.style.justifyContent = 'center';
            guessDisplay.style.marginBottom = '10px';

            item.guess.forEach((num, index) => {
                const numTile = document.createElement('div');
                numTile.style.width = '40px';
                numTile.style.height = '40px';
                numTile.style.borderRadius = '8px';
                numTile.style.display = 'flex';
                numTile.style.alignItems = 'center';
                numTile.style.justifyContent = 'center';
                numTile.style.fontSize = '18px';
                numTile.style.fontWeight = 'bold';

                // Easy mode: highlight correct positions in green
                const isCorrect = this.game.difficulty === 'easy' &&
                    num === this.game.hiddenSequence[index];

                if (themeConfig.useColorClass) {
                    if (isCorrect) {
                        numTile.style.background = '#4caf50';
                    } else {
                        numTile.style.background = themeConfig.colors[num - 1];
                    }
                } else if (themeConfig.useImages) {
                    // Add image for brainrot theme
                    const img = document.createElement('img');
                    img.src = `images/${themeConfig.items[num - 1]}`;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'contain';
                    img.onerror = function() {
                        this.style.display = 'none';
                        numTile.textContent = num;
                    };
                    numTile.appendChild(img);

                    if (isCorrect) {
                        numTile.style.background = '#4caf50';
                    } else {
                        numTile.style.background = '#ddd';
                    }
                } else {
                    numTile.textContent = themeConfig.items[num - 1];
                    if (isCorrect) {
                        numTile.style.background = '#4caf50';
                        numTile.style.color = 'white';
                    } else {
                        numTile.style.background = '#ddd';
                        numTile.style.color = '#333';
                    }
                }

                guessDisplay.appendChild(numTile);
            });

            const feedbackText = document.createElement('div');
            feedbackText.innerHTML = `
                <div class="attempt-number">Attempt ${item.attempt}</div>
                <div class="feedback-text">
                    <span class="feedback-correct">${item.correctCount}</span> in the right spot
                </div>
            `;

            historyItem.appendChild(guessDisplay);
            historyItem.appendChild(feedbackText);
            container.appendChild(historyItem);
        });
    }

    updateGameInfo() {
        document.getElementById('attempts').textContent =
            `${this.game.attempts}/${CONFIG.MAX_ATTEMPTS}`;
        document.getElementById('best-score').textContent =
            `${this.game.bestScore}/${CONFIG.SEQUENCE_LENGTH}`;
    }

    showHistory() {
        if (this.game.difficulty !== 'hard') {
            document.getElementById('history-section').style.display = 'block';
        }
    }

    hideHistory() {
        document.getElementById('history-section').style.display = 'none';
    }

    createDragGhost(number) {
        const themeConfig = CONFIG.THEMES[this.currentTheme];
        const ghost = document.createElement('div');
        ghost.className = 'drag-ghost';

        if (themeConfig.useColorClass) {
            ghost.classList.add('color-theme', `color-${number}`);
        } else {
            ghost.textContent = themeConfig.items[number - 1];
        }

        return ghost;
    }

    showGameOverModal(won, attempts, time, hiddenSequence, dayNumber) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        const sequenceDisplay = hiddenSequence.map(num =>
            CONFIG.THEMES[this.currentTheme].items[num - 1]
        ).join(' ');

        modal.innerHTML = `
            <div class="modal-content">
                <div class="game-over">
                    <div class="game-over-title ${won ? 'win' : 'lose'}">
                        ${won ? '🎉 You Won!' : '😔 Game Over'}
                    </div>
                    <div class="game-over-stats">
                        <div class="stat-row">
                            <span class="stat-label">Attempts:</span>
                            <span class="stat-value">${attempts}/${CONFIG.MAX_ATTEMPTS}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Time:</span>
                            <span class="stat-value">${time}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Date:</span>
                            <span class="stat-value">${SequenceGenerator.getTodayString()}</span>
                        </div>
                        ${!won ? `<div class="stat-row">
                            <span class="stat-label">Answer:</span>
                            <span class="stat-value">${sequenceDisplay}</span>
                        </div>` : ''}
                    </div>
                    <button class="share-btn" id="share-results-btn">📤 Share Results</button>
                </div>
            </div>
        `;

        const container = document.getElementById('game-over-modal-container');
        container.innerHTML = '';
        container.appendChild(modal);

        // Add share button handler
        document.getElementById('share-results-btn').onclick = () => {
            this.shareResults(dayNumber, attempts, time);
        };
    }

    shareResults(dayNumber, attempts, time) {
        const shareText = `Sequencele #${dayNumber}

Attempts: ${attempts}/${CONFIG.MAX_ATTEMPTS}
Time: ${time}

${CONFIG.SHARE_URL}`;

        this.copyToClipboard(shareText);
    }

    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showShareMessage();
            }).catch(() => {
                this.fallbackCopy(text);
            });
        } else {
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            this.showShareMessage();
        } catch (err) {
            console.error('Copy failed:', err);
        }
        document.body.removeChild(textarea);
    }

    showShareMessage() {
        const modal = document.querySelector('.modal-content .game-over');
        if (modal) {
            const existingMsg = modal.querySelector('.share-message');
            if (existingMsg) existingMsg.remove();

            const msg = document.createElement('div');
            msg.className = 'share-message';
            msg.textContent = '✓ Results copied to clipboard!';
            modal.appendChild(msg);
            setTimeout(() => msg.remove(), 3000);
        }
    }
}