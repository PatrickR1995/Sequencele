/**
 * Sequence Generator
 * Generates deterministic daily sequences based on date and difficulty
 */

class SequenceGenerator {
    static getDayNumber() {
        const epoch = new Date(CONFIG.EPOCH_DATE);
        const now = new Date();
        const diff = now - epoch;
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    }

    static generateSequence(difficulty) {
        const dayNumber = this.getDayNumber();

        // Create unique seed for each difficulty level
        // This ensures different sequences for easy/normal/hard on the same day
        const difficultySeed = {
            'easy': 1,
            'normal': 2,
            'hard': 3
        };

        const seed = dayNumber * 1000 + (difficultySeed[difficulty] || 2);

        return this.shuffleWithSeed([1, 2, 3, 4, 5], seed);
    }

    static shuffleWithSeed(array, seed) {
        const shuffled = [...array];
        let rng = seed;

        const seededRandom = () => {
            rng = (rng * 9301 + 49297) % 233280;
            return rng / 233280;
        };

        // Fisher-Yates shuffle with seeded random
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    }

    static getTodayString() {
        return new Date().toDateString();
    }
}