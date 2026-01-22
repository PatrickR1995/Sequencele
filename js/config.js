/**
 * Game Configuration
 * Contains all game constants and theme configurations
 */

const CONFIG = {
    MAX_ATTEMPTS: 12,
    SEQUENCE_LENGTH: 5,
    EPOCH_DATE: '2026-01-21',
    SHARE_URL: 'https://sequencele.pages.dev/',

    THEMES: {
        number: {
            name: 'Numbers',
            items: ['1', '2', '3', '4', '5'],
            useColorClass: false
        },
        color: {
            name: 'Colors',
            items: ['', '', '', '', ''], // Empty strings, colors come from CSS
            useColorClass: true,
            colors: ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7']
        },
        brainrot: {
            name: 'Brainrot',
            items: ['🤡', '💀', '🔥', '💯', '🧠'],
            useColorClass: false
        }
    },

    DIFFICULTIES: {
        easy: 'easy',
        normal: 'normal',
        hard: 'hard'
    },

    DISTRIBUTION_RANGES: ['1-2', '3-4', '5-6', '7-8', '9-10', '11-12']
};