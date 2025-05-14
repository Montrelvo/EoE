import { MAX_LOG_MESSAGES } from '../config/constants.js';

export function updateCombatLog(combatLogElement, message) {
    if (!combatLogElement) {
        console.warn("Combat log element not provided! Message not logged to UI:", message);
        return;
    }

    const messageElement = document.createElement('p');
    messageElement.textContent = message;

    // Add the new message to the top (which appears as bottom due to flex-direction: column-reverse)
    combatLogElement.insertBefore(messageElement, combatLogElement.firstChild);

    // Limit the number of messages
    while (combatLogElement.children.length > MAX_LOG_MESSAGES) {
        combatLogElement.removeChild(combatLogElement.lastChild);
    }
}

// --- End UI Utility Functions ---
// (Comment from original file, kept for context if needed, can be removed)