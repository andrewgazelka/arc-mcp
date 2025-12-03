/**
 * High-level Node.js API for browser automation
 * These functions run in Node.js and execute browser code via AppleScript
 */
import type { LocatorStrategy } from './types/locator.js';
import type { ActionOptions, ActionResult } from './types/action.js';
/**
 * Click an element using semantic locators
 */
export declare function click(locator: LocatorStrategy, options?: ActionOptions): Promise<ActionResult>;
/**
 * Fill an input field (fast, replaces entire value)
 */
export declare function fill(locator: LocatorStrategy, value: string, options?: ActionOptions): Promise<ActionResult>;
/**
 * Type text character by character (triggers autocomplete)
 */
export declare function type(locator: LocatorStrategy, text: string, options?: ActionOptions): Promise<ActionResult>;
/**
 * Select an option from a dropdown
 */
export declare function selectOption(locator: LocatorStrategy, option: string, options?: ActionOptions): Promise<ActionResult>;
/**
 * Get page structure as a tree
 */
export declare function getPageStructure(maxDepth?: number, tabId?: number): Promise<any>;
//# sourceMappingURL=api.d.ts.map