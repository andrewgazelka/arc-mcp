/**
 * REPL utilities for executing user code
 */

/**
 * Create an async function from code string
 * This allows us to use await in the REPL without wrapping in async IIFE
 */
export const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
