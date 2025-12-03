/**
 * @arc-mcp/browser - High-level browser automation API for Arc
 *
 * This package provides a Node.js API for controlling Arc browser via AppleScript.
 * It combines low-level AppleScript execution with high-level semantic actions.
 */
// Re-export low-level AppleScript functions
export { executeArcJavaScript } from '@arc-mcp/applescript';
export { ensureArcRunning } from './navigation.js';
// Export high-level browser actions
export { click, fill, type, selectOption, getPageStructure } from './api.js';
// Export navigation functions
export { openUrl, getCurrentTab, listTabs, closeTab, switchToTab, reloadTab, goBack, goForward, executeJavaScript, } from './navigation.js';
//# sourceMappingURL=index.js.map