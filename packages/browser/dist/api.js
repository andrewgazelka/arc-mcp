/**
 * High-level Node.js API for browser automation
 * These functions run in Node.js and execute browser code via AppleScript
 */
import { executeArcJavaScript } from '@arc-mcp/applescript';
import { BROWSER_BUNDLE } from './bundle-export.js';
/**
 * Execute browser action with bundled code
 */
async function executeBrowserAction(actionFn, args, tabId) {
    const code = `
    ${BROWSER_BUNDLE}
    JSON.stringify(${actionFn}(${args}))
  `;
    const result = await executeArcJavaScript(code, { tabId: tabId?.toString() });
    // Handle "missing value" from Chrome on empty tabs
    if (!result || result === 'missing value') {
        return { success: false, error: 'Could not find element (page may be empty)' };
    }
    return JSON.parse(result);
}
/**
 * Click an element using semantic locators
 */
export async function click(locator, options = {}) {
    return executeBrowserAction('clickElement', JSON.stringify(locator), options.tab_id);
}
/**
 * Fill an input field (fast, replaces entire value)
 */
export async function fill(locator, value, options = {}) {
    return executeBrowserAction('fillElement', `${JSON.stringify(locator)}, ${JSON.stringify(value)}`, options.tab_id);
}
/**
 * Type text character by character (triggers autocomplete)
 */
export async function type(locator, text, options = {}) {
    return executeBrowserAction('typeElement', `${JSON.stringify(locator)}, ${JSON.stringify(text)}`, options.tab_id);
}
/**
 * Select an option from a dropdown
 */
export async function selectOption(locator, option, options = {}) {
    return executeBrowserAction('selectOption', `${JSON.stringify(locator)}, ${JSON.stringify(option)}`, options.tab_id);
}
/**
 * Get page structure as a tree
 */
export async function getPageStructure(maxDepth = 10, tabId) {
    const code = `
    ${BROWSER_BUNDLE}
    JSON.stringify(getPageStructure(${maxDepth}))
  `;
    const result = await executeArcJavaScript(code, { tabId: tabId?.toString() });
    // Handle "missing value" from Chrome on empty tabs
    if (!result || result === 'missing value') {
        return null;
    }
    return JSON.parse(result);
}
//# sourceMappingURL=api.js.map