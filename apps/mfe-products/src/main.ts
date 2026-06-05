/**
 * Async entry for mfe-products. Importing bootstrap.ts dynamically prevents
 * the federation shared modules from being evaluated before they are initialized.
 */
import('./bootstrap').catch(console.error);
