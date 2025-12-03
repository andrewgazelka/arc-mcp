/**
 * High-level Node.js API for browser automation
 * These functions run in Node.js and execute browser code via AppleScript
 */

import { executeArcJavaScript } from '@arc-mcp/applescript';
import type { LocatorStrategy } from './types/locator.js';
import type { ActionOptions, ActionResult } from './types/action.js';
import { BROWSER_BUNDLE } from './bundle-export.js';

/**
 * Execute browser action with bundled code
 */
async function executeBrowserAction(
  actionFn: string,
  args: string,
  tabId?: number
): Promise<ActionResult> {
  const code = `
    ${BROWSER_BUNDLE}
    ${actionFn}(${args})
  `;

  const result = await executeArcJavaScript(code, { tabId: tabId?.toString() });
  return JSON.parse(result as string);
}

/**
 * Click an element using semantic locators
 */
export async function click(
  locator: LocatorStrategy,
  options: ActionOptions = {}
): Promise<ActionResult> {
  return executeBrowserAction(
    'clickElement',
    JSON.stringify(locator),
    options.tab_id
  );
}

/**
 * Fill an input field (fast, replaces entire value)
 */
export async function fill(
  locator: LocatorStrategy,
  value: string,
  options: ActionOptions = {}
): Promise<ActionResult> {
  return executeBrowserAction(
    'fillElement',
    `${JSON.stringify(locator)}, ${JSON.stringify(value)}`,
    options.tab_id
  );
}

/**
 * Type text character by character (triggers autocomplete)
 */
export async function type(
  locator: LocatorStrategy,
  text: string,
  options: ActionOptions = {}
): Promise<ActionResult> {
  return executeBrowserAction(
    'typeElement',
    `${JSON.stringify(locator)}, ${JSON.stringify(text)}`,
    options.tab_id
  );
}

/**
 * Select an option from a dropdown
 */
export async function selectOption(
  locator: LocatorStrategy,
  option: string,
  options: ActionOptions = {}
): Promise<ActionResult> {
  return executeBrowserAction(
    'selectOption',
    `${JSON.stringify(locator)}, ${JSON.stringify(option)}`,
    options.tab_id
  );
}

/**
 * Get page structure as a tree
 */
export async function getPageStructure(
  maxDepth: number = 10,
  tabId?: number
): Promise<any> {
  const code = `
    ${BROWSER_BUNDLE}
    JSON.stringify(getPageStructure(${maxDepth}))
  `;

  const result = await executeArcJavaScript(code, { tabId: tabId?.toString() });
  return JSON.parse(result as string);
}
