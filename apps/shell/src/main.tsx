/**
 * Module Federation async entry point.
 * The dynamic import ensures shared dependencies (React, react-dom, etc.)
 * are resolved and negotiated with remotes before the app bootstraps.
 */
import('./bootstrap').catch(console.error);
