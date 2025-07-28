// Utility functions for viewport unit fallbacks
// Modern browsers will upgrade to dvh/dvw via CSS fallback mechanism

export function calcViewportHeight(percentage = 100) {
  return `calc(var(--vh-fallback)*${percentage})`;
}

export function calcViewportWidth(percentage = 100) {
  return `calc(var(--vw-fallback)*${percentage})`;
}