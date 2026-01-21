// GAME STATE
let hiddenSequence = [];
let platformSlots = [null, null, null, null, null]; // null means empty
let attempts = 0;
let maxAttempts = 12;
let guessHistory = [];
let bestScore = 0;
let gameOver = false;

// Timer variables
let timerInterval = null;
let startTime = null;
let elapsedSeconds = 0;

// Get today's date for daily challenge
const today = new Date().toDateString();

// Calculate day number (days since Jan 21, 2026)
function getDayNumber() {
    const epoch = new Date('2026-01-21');
    const now = new Date();
    const diff = now - epoch;
    const dayNumber = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    return dayNumber;
}

// GENERATE DAILY SEQUENCE
// Use today's date as seed to generate the same sequence for everyone today
function getDailySequence() {
    const date = new Date();
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

    // Simple seeded random number generator
    let rng = seed;
    const seededRandom = () => {
        rng = (rng * 9301 + 49297) % 233280;
        return rng / 233280;
    };

    // Fisher-Yates shuffle with seeded random
    const numbers = [1, 2, 3, 4, 5];
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers;
}

// INITIALIZE GAME
function initGame() {
    // Generate daily sequence (same for everyone today)
    hiddenSequence = getDailySequence();
    platformSlots = [null, null, null, null, null];
    attempts = 0;
    guessHistory = [];
    bestScore = 0;
    gameOver = false;

    // Reset timer
    elapsedSeconds = 0;
    startTime = null;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    renderPool();
    renderPlatform();
    updateGameInfo();
    document.getElementById('history-section').style.display = 'none';
}

// TIMER FUNCTIONS
function startTimer() {
    if (!startTime) {
        startTime = Date.now() - (elapsedSeconds * 1000);
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        elapsedSeconds = elapsed;
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2, '0')}`;
}

// RENDER NUMBER POOL
function renderPool() {
    const container = document.getElementById('pool-container');
    container.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const tile = document.createElement('div');
        tile.className = 'number-tile';
        tile.textContent = i;
        tile.draggable = true;
        tile.dataset.number = i;

        // Check if number is already used
        if (platformSlots.includes(i)) {
            tile.classList.add('used');
            tile.draggable = false;
        }

        tile.addEventListener('dragstart', handlePoolDragStart);
        tile.addEventListener('dragend', handleDragEnd);

        container.appendChild(tile);
    }
}

// RENDER PLATFORM SLOTS
function renderPlatform() {
    const container = document.getElementById('platform-slots');
    container.innerHTML = '';

    platformSlots.forEach((value, index) => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.index = index;

        if (value === null) {
            slot.classList.add('empty');
            slot.textContent = '?';
        } else {
            slot.classList.add('filled');
            slot.textContent = value;

            // Add remove button
            const removeBtn = document.createElement('div');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '×';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                removeFromSlot(index);
            };
            slot.appendChild(removeBtn);
        }

        slot.addEventListener('dragover', handleSlotDragOver);
        slot.addEventListener('drop', handleSlotDrop);
        slot.addEventListener('dragleave', handleSlotDragLeave);

        container.appendChild(slot);
    });

    // Enable/disable submit button
    const allFilled = platformSlots.every(slot => slot !== null);
    document.getElementById('submit-btn').disabled = !allFilled;
}

// DRAG AND DROP HANDLERS
let draggedNumber = null;

function handlePoolDragStart(e) {
    if (e.target.classList.contains('used')) {
        e.preventDefault();
        return;
    }

    // Start timer on first interaction
    startTimer();

    draggedNumber = parseInt(e.target.dataset.number);
    e.target.classList.add('dragging');
}

function handleSlotDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleSlotDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleSlotDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const slotIndex = parseInt(e.currentTarget.dataset.index);

    if (draggedNumber !== null) {
        // Place number in slot
        platformSlots[slotIndex] = draggedNumber;
        renderPool();
        renderPlatform();
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('drag-over');
    });
    draggedNumber = null;
}

function removeFromSlot(index) {
    platformSlots[index] = null;
    renderPool();
    renderPlatform();
}

// CALCULATE FEEDBACK
function calculateFeedback(guess, hidden) {
    let correctPosition = 0;

    for (let i = 0; i < 5; i++) {
        if (guess[i] === hidden[i]) {
            correctPosition++;
        }
    }

    return correctPosition;
}

// SUBMIT GUESS
document.getElementById('submit-btn').addEventListener('click', () => {
    if (gameOver) return;

    attempts++;

    // Calculate feedback
    const correctCount = calculateFeedback(platformSlots, hiddenSequence);

    // Update best score
    if (correctCount > bestScore) {
        bestScore = correctCount;
    }

    // Add to history
    guessHistory.unshift({
        attempt: attempts,
        correctCount: correctCount,
        guess: [...platformSlots]
    });

    // Check win condition
    if (correctCount === 5) {
        endGame(true);
        return;
    }

    // Check lose condition
    if (attempts >= maxAttempts) {
        endGame(false);
        return;
    }

    // Reset platform for next guess
    platformSlots = [null, null, null, null, null];

    // Update UI
    updateGameInfo();
    renderHistory();
    renderPool();
    renderPlatform();
    document.getElementById('history-section').style.display = 'block';
});

// UPDATE GAME INFO
function updateGameInfo() {
    document.getElementById('attempts').textContent = `${attempts}/${maxAttempts}`;
    document.getElementById('best-score').textContent = `${bestScore}/5`;
}

// RENDER GUESS HISTORY
function renderHistory() {
    const container = document.getElementById('history-container');
    container.innerHTML = '';

    guessHistory.forEach((item) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        // Create the guess display
        const guessDisplay = document.createElement('div');
        guessDisplay.style.display = 'flex';
        guessDisplay.style.gap = '8px';
        guessDisplay.style.justifyContent = 'center';
        guessDisplay.style.marginBottom = '10px';

        item.guess.forEach(num => {
            const numTile = document.createElement('div');
            numTile.style.width = '40px';
            numTile.style.height = '40px';
            numTile.style.background = '#ddd';
            numTile.style.borderRadius = '8px';
            numTile.style.display = 'flex';
            numTile.style.alignItems = 'center';
            numTile.style.justifyContent = 'center';
            numTile.style.fontSize = '18px';
            numTile.style.fontWeight = 'bold';
            numTile.style.color = '#333';
            numTile.textContent = num;
            guessDisplay.appendChild(numTile);
        });

        const feedbackText = document.createElement('div');
        feedbackText.innerHTML = `
                    <div class="attempt-number">Attempt ${item.attempt}</div>
                    <div class="feedback-text">
                        <span class="feedback-correct">${item.correctCount}</span> correct
                    </div>
                `;

        historyItem.appendChild(guessDisplay);
        historyItem.appendChild(feedbackText);
        container.appendChild(historyItem);
    });
}

// SHARE RESULTS
function shareResults() {
    const dayNumber = getDayNumber();
    const time = formatTime(elapsedSeconds);

    const shareText = `Sequencele #${dayNumber}

Attempts: ${attempts}/${maxAttempts}
Time: ${time}

https://sequencele.pages.dev/`;

    // Copy to clipboard
    copyToClipboard(shareText);
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showShareMessage();
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showShareMessage();
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textarea);
}

function showShareMessage() {
    const modal = document.querySelector('.modal-content .game-over');
    if (modal) {
        // Remove any existing message
        const existingMsg = modal.querySelector('.share-message');
        if (existingMsg) {
            existingMsg.remove();
        }

        const msg = document.createElement('div');
        msg.className = 'share-message';
        msg.textContent = '✓ Results copied to clipboard!';
        modal.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    }
}

// END GAME
function endGame(won) {
    gameOver = true;
    stopTimer();
    document.getElementById('submit-btn').disabled = true;

    const time = formatTime(elapsedSeconds);

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
                <div class="modal-content">
                    <div class="game-over">
                        <div class="game-over-title ${won ? 'win' : 'lose'}">
                            ${won ? '🎉 You Won!' : '😔 Game Over'}
                        </div>
                        <div class="game-over-stats">
                            <div class="stat-row">
                                <span class="stat-label">Attempts:</span>
                                <span class="stat-value">${attempts}/${maxAttempts}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Time:</span>
                                <span class="stat-value">${time}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Date:</span>
                                <span class="stat-value">${today}</span>
                            </div>
                            ${!won ? `<div class="stat-row">
                                <span class="stat-label">Answer:</span>
                                <span class="stat-value">${hiddenSequence.join(' ')}</span>
                            </div>` : ''}
                        </div>
                        <button class="share-btn" onclick="shareResults()">📤 Share Results</button>
                    </div>
                </div>
            `;

    document.body.appendChild(modal);
}

// Start the game on page load
initGame();
