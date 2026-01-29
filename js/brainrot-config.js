/**
 * Brainrot Mode Configuration
 * Maximum Gen Z/Gen Alpha energy 🔥💀
 */

const BRAINROT_CONFIG = {
    // Sound effects (using Howler.js)
    SOUNDS: {
        CLICK: 'sounds/vine-boom.mp3',
        CORRECT: 'sounds/sheesh.mp3',
        WRONG: 'sounds/vine-boom.mp3',
        WIN: 'sounds/victory.mp3',
        LOSE: 'sounds/bruh.mp3',
        BACKGROUND: 'sounds/phonk-beat.mp3'
    },

    // Particle effects
    EFFECTS: {
        CLICK: ['💀', '🔥', '💯', '🧠'],
        WIN: ['🎉', '💎', '👑', '⭐', '🏆'],
        LOSE: ['💀', '😭', 'L', '🤡']
    },

    // Meme text overlays
    TEXT_OVERLAYS: {
        CLICK: ['no cap', 'fr fr', 'sheesh', 'bussin', 'slay'],
        CORRECT: ['W', 'based', 'valid', 'fire', 'goated'],
        WRONG: ['L', 'mid', 'cringe', 'ratio', 'cap'],
        WIN: ['GG EZ', 'W STREAK', 'GOAT', 'SIGMA', 'BASED'],
        LOSE: ['L BOZO', 'TOUCH GRASS', 'SKILL ISSUE', 'RIP BOZO']
    },

    // Screen shake intensities
    SHAKE: {
        CLICK: 2,
        CORRECT: 5,
        WRONG: 8,
        WIN: 15,
        LOSE: 10
    },

    // RGB/Neon effects
    COLORS: {
        PRIMARY: ['#FF006E', '#8338EC', '#3A86FF', '#FB5607', '#FFBE0B'],
        NEON_GLOW: 'drop-shadow(0 0 10px currentColor) drop-shadow(0 0 20px currentColor)'
    },

    // Rotation animations (TikTok style)
    ANIMATIONS: {
        SPIN: true,
        ZOOM: true,
        GLITCH: true,
        RAINBOW: true
    }
};