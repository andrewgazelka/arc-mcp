/**
 * @arc-mcp/browser - High-level browser automation API for Arc
 *
 * This package provides a Node.js API for controlling Arc browser via AppleScript.
 * It combines low-level AppleScript execution with high-level semantic actions.
 */
export type { LocatorStrategy } from './types/locator.js';
export type { ActionOptions, ActionResult } from './types/action.js';
export { executeArcJavaScript } from '@arc-mcp/applescript';
export { ensureArcRunning } from './navigation.js';
export { click, fill, type, selectOption, getPageStructure } from './api.js';
export { openUrl, getCurrentTab, listTabs, closeTab, switchToTab, reloadTab, goBack, goForward, executeJavaScript, } from './navigation.js';
export type { TabInfo } from './navigation.js';
//# sourceMappingURL=index.d.ts.map