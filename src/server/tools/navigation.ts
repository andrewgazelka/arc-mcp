/**
 * Navigation and tab management tool handlers
 */

import { executeAppleScript, executeJavaScript } from '../applescript.js';
import type { ToolResult } from '../../types/tool.js';

/**
 * Open URL in Arc
 */
export function handleOpenUrl(url: string, newTab: boolean = true): ToolResult {
  const script = newTab
    ? `tell application "Arc" to tell front window to make new tab with properties {URL:"${url}"}`
    : `tell application "Arc" to open location "${url}"`;

  executeAppleScript(script);

  return {
    content: [
      {
        type: 'text',
        text: `Opened ${url} in ${newTab ? 'new tab' : 'current tab'}`,
      },
    ],
  };
}

/**
 * Get current tab info
 */
export function handleGetCurrentTab(): ToolResult {
  const script = `
    tell application "Arc"
      tell front window
        set currentTab to active tab
        set tabTitle to title of currentTab
        set tabURL to URL of currentTab
        return tabTitle & "|" & tabURL
      end tell
    end tell
  `;

  const result = executeAppleScript(script);
  const [title, url] = result.split('|');

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ title, url }, null, 2),
      },
    ],
  };
}

/**
 * List all tabs
 */
export function handleListTabs(): ToolResult {
  const script = `
    tell application "Arc"
      tell front window
        set tabList to {}
        set tabIndex to 1
        repeat with t in tabs
          set end of tabList to (tabIndex as string) & "|" & (title of t) & "|" & (URL of t)
          set tabIndex to tabIndex + 1
        end repeat
        return tabList
      end tell
    end tell
  `;

  const result = executeAppleScript(script);
  const tabs = result.split(', ').map((tab) => {
    const parts = tab.split('|');
    const id = parts[0];
    const title = parts[1] ?? '';
    const url = parts[2] ?? '';
    return { id: parseInt(id ?? '0'), title, url };
  });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(tabs, null, 2),
      },
    ],
  };
}

/**
 * Close tab
 */
export function handleCloseTab(tabId: number): ToolResult {
  const script = `
    tell application "Arc"
      tell front window
        close tab ${tabId}
      end tell
    end tell
  `;

  executeAppleScript(script);

  return {
    content: [
      {
        type: 'text',
        text: `Closed tab ${tabId}`,
      },
    ],
  };
}

/**
 * Switch to tab
 */
export function handleSwitchToTab(tabId: number): ToolResult {
  const script = `
    tell application "Arc"
      tell front window
        set active tab to tab ${tabId}
      end tell
    end tell
  `;

  executeAppleScript(script);

  return {
    content: [
      {
        type: 'text',
        text: `Switched to tab ${tabId}`,
      },
    ],
  };
}

/**
 * Reload tab
 */
export function handleReloadTab(tabId?: number): ToolResult {
  const script = tabId
    ? `tell application "Arc" to tell front window to reload tab ${tabId}`
    : `tell application "Arc" to tell front window to reload active tab`;

  executeAppleScript(script);

  return {
    content: [
      {
        type: 'text',
        text: `Reloaded tab${tabId ? ` ${tabId}` : ''}`,
      },
    ],
  };
}

/**
 * Navigate back
 */
export function handleGoBack(tabId?: number): ToolResult {
  const tabSelector = tabId ? `tab ${tabId}` : 'active tab';
  const script = `
    tell application "Arc"
      tell front window
        tell ${tabSelector}
          execute javascript "window.history.back()"
        end tell
      end tell
    end tell
  `;

  executeAppleScript(script);

  return {
    content: [
      {
        type: 'text',
        text: 'Navigated back',
      },
    ],
  };
}

/**
 * Navigate forward
 */
export function handleGoForward(tabId?: number): ToolResult {
  const tabSelector = tabId ? `tab ${tabId}` : 'active tab';
  const script = `
    tell application "Arc"
      tell front window
        tell ${tabSelector}
          execute javascript "window.history.forward()"
        end tell
      end tell
    end tell
  `;

  executeAppleScript(script);

  return {
    content: [
      {
        type: 'text',
        text: 'Navigated forward',
      },
    ],
  };
}

/**
 * Execute arbitrary JavaScript
 */
export function handleExecuteJavaScript(
  code: string,
  tabId?: number
): ToolResult {
  const result = executeJavaScript(code, tabId);

  return {
    content: [
      {
        type: 'text',
        text: result || 'JavaScript executed (no return value)',
      },
    ],
  };
}
