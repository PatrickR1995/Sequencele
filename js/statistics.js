/**
 * Statistics Manager
 * Handles game statistics tracking and display
 */

class StatisticsManager {
    constructor() {
        this.stats = StorageManager.loadStats();
    }

    updateStats(won, attempts, dayNumber) {
        const todayKey = `day-${dayNumber}`;

        // Check if already played today
        if (this.stats.lastPlayedDate === todayKey) {
            return; // Already recorded
        }

        this.stats.played++;

        if (won) {
            this.stats.won++;
            this.stats.currentStreak++;
            if (this.stats.currentStreak > this.stats.maxStreak) {
                this.stats.maxStreak = this.stats.currentStreak;
            }

            // Update guess distribution
            if (attempts <= 2) this.stats.guessDistribution['1-2']++;
            else if (attempts <= 4) this.stats.guessDistribution['3-4']++;
            else if (attempts <= 6) this.stats.guessDistribution['5-6']++;
            else if (attempts <= 8) this.stats.guessDistribution['7-8']++;
            else if (attempts <= 10) this.stats.guessDistribution['9-10']++;
            else this.stats.guessDistribution['11-12']++;
        } else {
            this.stats.currentStreak = 0;
        }

        this.stats.lastPlayedDate = todayKey;
        StorageManager.saveStats(this.stats);
    }

    getWinRate() {
        return this.stats.played > 0
            ? Math.round((this.stats.won / this.stats.played) * 100)
            : 0;
    }

    displayStats() {
        document.getElementById('stat-played').textContent = this.stats.played;
        document.getElementById('stat-winrate').textContent = this.getWinRate();
        document.getElementById('stat-current').textContent = this.stats.currentStreak;
        document.getElementById('stat-max').textContent = this.stats.maxStreak;

        this.renderDistribution();
    }

    renderDistribution() {
        const container = document.getElementById('distribution-bars');
        container.innerHTML = '';

        const maxCount = Math.max(...Object.values(this.stats.guessDistribution), 1);

        Object.entries(this.stats.guessDistribution).forEach(([range, count]) => {
            const barDiv = document.createElement('div');
            barDiv.className = 'distribution-bar';

            const percentage = (count / maxCount) * 100;

            barDiv.innerHTML = `
                <div class="distribution-label">${range}</div>
                <div class="distribution-graph">
                    <div class="distribution-fill" style="width: ${percentage}%">
                        ${count > 0 ? count : ''}
                    </div>
                </div>
            `;

            container.appendChild(barDiv);
        });
    }

    showModal() {
        this.displayStats();
        document.getElementById('stats-modal').style.display = 'flex';
    }

    hideModal() {
        document.getElementById('stats-modal').style.display = 'none';
    }
}