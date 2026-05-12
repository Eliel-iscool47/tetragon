/**
 * Returns a styled HTML span for game descriptions.
 * @param {string} style The CSS class to apply (e.g., 'damage', 'health', 'ammo').
 * @param {string} message The text to display inside the span.
 * @returns {string} The HTML string.
 */
const text = (style, message) => `<span class="styled-text ${style}">${message}</span>`;