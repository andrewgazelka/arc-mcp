/**
 * Semantic action tool handlers
 */

import { executeJavaScript } from '../applescript.js';
import type { LocatorStrategy } from '../../types/locator.js';
import type { ActionOptions, ActionResult } from '../../types/action.js';
import type { ToolResult } from '../../types/tool.js';
import { BROWSER_BUNDLE } from '../../browser/bundle-export.js';

/**
 * Execute browser action with bundled code
 */
function executeBrowserAction(
  actionFn: string,
  args: string,
  tabId?: number
): ActionResult {
  const code = `
    ${BROWSER_BUNDLE}
    ${actionFn}(${args})
  `;

  const result = executeJavaScript(code, tabId);
  return JSON.parse(result);
}

/**
 * Handle click action
 */
export function handleClick(
  locator: LocatorStrategy,
  options: ActionOptions = {}
): ToolResult {
  const result = executeBrowserAction(
    'clickElement',
    JSON.stringify(locator),
    options.tab_id
  );

  if (!result.success) {
    return {
      content: [{ type: 'text', text: result.error || 'Click failed' }],
      isError: true,
    };
  }

  return {
    content: [{ type: 'text', text: `Clicked: ${result.element}` }],
  };
}

/**
 * Handle fill action
 */
export function handleFill(
  locator: LocatorStrategy,
  value: string,
  options: ActionOptions = {}
): ToolResult {
  const result = executeBrowserAction(
    'fillElement',
    `${JSON.stringify(locator)}, ${JSON.stringify(value)}`,
    options.tab_id
  );

  if (!result.success) {
    return {
      content: [{ type: 'text', text: result.error || 'Fill failed' }],
      isError: true,
    };
  }

  return {
    content: [{ type: 'text', text: `Filled: ${result.element}` }],
  };
}

/**
 * Handle type action
 */
export function handleType(
  locator: LocatorStrategy,
  text: string,
  options: ActionOptions = {}
): ToolResult {
  const result = executeBrowserAction(
    'typeElement',
    `${JSON.stringify(locator)}, ${JSON.stringify(text)}`,
    options.tab_id
  );

  if (!result.success) {
    return {
      content: [{ type: 'text', text: result.error || 'Type failed' }],
      isError: true,
    };
  }

  return {
    content: [{ type: 'text', text: `Typed into: ${result.element}` }],
  };
}

/**
 * Handle select action
 */
export function handleSelect(
  locator: LocatorStrategy,
  option: string,
  options: ActionOptions = {}
): ToolResult {
  const result = executeBrowserAction(
    'selectOption',
    `${JSON.stringify(locator)}, ${JSON.stringify(option)}`,
    options.tab_id
  );

  if (!result.success) {
    return {
      content: [{ type: 'text', text: result.error || 'Select failed' }],
      isError: true,
    };
  }

  return {
    content: [{ type: 'text', text: `Selected in: ${result.element}` }],
  };
}

/**
 * Handle get page structure
 */
export function handleGetPageStructure(
  maxDepth: number = 10,
  tabId?: number
): ToolResult {
  const code = `
    ${BROWSER_BUNDLE}
    JSON.stringify(getPageStructure(${maxDepth}))
  `;

  const result = executeJavaScript(code, tabId);
  const structure = JSON.parse(result);

  return {
    content: [{ type: 'text', text: JSON.stringify(structure, null, 2) }],
  };
}
