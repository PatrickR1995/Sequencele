/**
 * Drag Handler
 * Manages drag and drop interactions for both desktop and mobile
 */

class DragHandler {
    constructor(game, uiRenderer) {
        this.game = game;
        this.uiRenderer = uiRenderer;
        this.draggedNumber = null;
        this.touchStartElement = null;
        this.isDragging = false;
        this.dragGhost = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Delegate events to the pool container
        const poolContainer = document.getElementById('pool-container');
        const platformSlots = document.getElementById('platform-slots');

        // Desktop drag events
        poolContainer.addEventListener('dragstart', (e) => this.handlePoolDragStart(e));
        poolContainer.addEventListener('dragend', (e) => this.handleDragEnd(e));

        // Touch events
        poolContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        poolContainer.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        poolContainer.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        // Platform slot events
        platformSlots.addEventListener('dragover', (e) => this.handleSlotDragOver(e));
        platformSlots.addEventListener('drop', (e) => this.handleSlotDrop(e));
        platformSlots.addEventListener('dragleave', (e) => this.handleSlotDragLeave(e));
    }

    // Desktop Drag Handlers
    handlePoolDragStart(e) {
        if (!e.target.classList.contains('number-tile')) return;
        if (e.target.classList.contains('used')) {
            e.preventDefault();
            return;
        }

        this.game.startTimer();
        document.body.classList.add('dragging');

        this.draggedNumber = parseInt(e.target.dataset.number);
        e.target.classList.add('dragging');
    }

    handleSlotDragOver(e) {
        if (!e.target.classList.contains('slot')) return;
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    handleSlotDragLeave(e) {
        if (!e.target.classList.contains('slot')) return;
        e.target.classList.remove('drag-over');
    }

    handleSlotDrop(e) {
        if (!e.target.classList.contains('slot')) return;

        e.preventDefault();
        e.target.classList.remove('drag-over');

        const slotIndex = parseInt(e.target.dataset.index);

        if (this.draggedNumber !== null && !isNaN(slotIndex)) {
            this.game.placeInSlot(slotIndex, this.draggedNumber);
        }
    }

    handleDragEnd(e) {
        if (!e.target.classList.contains('number-tile')) return;

        e.target.classList.remove('dragging');
        document.querySelectorAll('.slot').forEach(slot => {
            slot.classList.remove('drag-over');
        });
        this.draggedNumber = null;
        document.body.classList.remove('dragging');
    }

    // Touch Handlers
    handleTouchStart(e) {
        const tile = e.target.closest('.number-tile');
        if (!tile) return;
        if (tile.classList.contains('used')) return;

        e.preventDefault();
        e.stopPropagation();

        this.game.startTimer();
        document.body.classList.add('dragging');

        this.touchStartElement = tile;
        this.draggedNumber = parseInt(tile.dataset.number);
        this.isDragging = true;

        tile.classList.add('dragging');

        // Create ghost element
        const touch = e.touches[0];
        this.dragGhost = this.uiRenderer.createDragGhost(this.draggedNumber);
        this.dragGhost.style.left = touch.clientX + 'px';
        this.dragGhost.style.top = touch.clientY + 'px';
        document.body.appendChild(this.dragGhost);
    }

    handleTouchMove(e) {
        if (!this.draggedNumber || !this.isDragging) return;

        e.preventDefault();
        e.stopPropagation();

        const touch = e.touches[0];

        // Move ghost
        if (this.dragGhost) {
            this.dragGhost.style.left = touch.clientX + 'px';
            this.dragGhost.style.top = touch.clientY + 'px';
        }

        // Update slot highlighting
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);

        document.querySelectorAll('.slot').forEach(slot => {
            slot.classList.remove('drag-over');
        });

        if (elementAtPoint) {
            const slot = elementAtPoint.classList.contains('slot')
                ? elementAtPoint
                : elementAtPoint.closest('.slot');

            if (slot) {
                slot.classList.add('drag-over');
            }
        }
    }

    handleTouchEnd(e) {
        if (!this.draggedNumber || !this.isDragging) return;

        e.preventDefault();
        e.stopPropagation();

        const touch = e.changedTouches[0];
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);

        // Place number if dropped on slot
        if (elementAtPoint) {
            const slot = elementAtPoint.classList.contains('slot')
                ? elementAtPoint
                : elementAtPoint.closest('.slot');

            if (slot) {
                const slotIndex = parseInt(slot.dataset.index);
                if (!isNaN(slotIndex)) {
                    this.game.placeInSlot(slotIndex, this.draggedNumber);
                }
            }
        }

        // Cleanup
        if (this.touchStartElement) {
            this.touchStartElement.classList.remove('dragging');
        }
        if (this.dragGhost) {
            this.dragGhost.remove();
            this.dragGhost = null;
        }
        document.querySelectorAll('.slot').forEach(slot => {
            slot.classList.remove('drag-over');
        });

        this.draggedNumber = null;
        this.touchStartElement = null;
        this.isDragging = false;
        document.body.classList.remove('dragging');
    }
}