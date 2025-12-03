/**
 * Navigation and tab management functions
 * These use pure AppleScript (not browser JavaScript)
 * Supports Arc (default) and Google Chrome via BROWSER env var
 */
import { executeAppleScript, getBrowserApp } from './applescript.js';
/**
 * Open a URL in the browser
 */
export async function openUrl(url, newTab = true) {
    const browserApp = getBrowserApp();
    const script = newTab
        ? `tell application "${browserApp}" to tell front window to make new tab with properties {URL:"${url}"}`
        : `tell application "${browserApp}" to open location "${url}"`;
    executeAppleScript(script);
    return { success: true };
}
/**
 * Get information about the current active tab
 */
export async function getCurrentTab() {
    const browserApp = getBrowserApp();
    const script = `
    tell application "${browserApp}"
      tell front window
        return (title of active tab) & "|" & (URL of active tab)
      end tell
    end tell
  `;
    const result = executeAppleScript(script);
    const [title, url] = result.split('|');
    return { title, url };
}
/**
 * List all open tabs
 */
export async function listTabs() {
    const browserApp = getBrowserApp();
    const script = `
    tell application "${browserApp}"
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
    if (!result)
        return [];
    return result.split(', ').map((line) => {
        const parts = line.split('|');
        const id = parts[0];
        const title = parts[1] ?? '';
        const url = parts[2] ?? '';
        return { id: parseInt(id ?? '0'), title, url };
    });
}
/**
 * Close a specific tab by index (1-based)
 */
export async function closeTab(tabId) {
    const browserApp = getBrowserApp();
    const script = `
    tell application "${browserApp}"
      tell front window
        close tab ${tabId}
      end tell
    end tell
  `;
    executeAppleScript(script);
}
/**
 * Switch to a specific tab by index (1-based)
 */
export async function switchToTab(tabId) {
    const browserApp = getBrowserApp();
    const script = `
    tell application "${browserApp}"
      tell front window
        set active tab to tab ${tabId}
      end tell
    end tell
  `;
    executeAppleScript(script);
}
/**
 * Reload a tab by index (1-based), or current tab if not specified
 */
export async function reloadTab(tabId) {
    const browserApp = getBrowserApp();
    const script = tabId
        ? `tell application "${browserApp}" to tell front window to reload tab ${tabId}`
        : `tell application "${browserApp}" to tell front window to reload active tab`;
    executeAppleScript(script);
}
/**
 * Navigate back in browser history
 */
export async function goBack(tabId) {
    const browserApp = getBrowserApp();
    const tabSelector = tabId ? `tab ${tabId}` : 'active tab';
    const script = `
    tell application "${browserApp}"
      tell front window
        tell ${tabSelector}
          execute javascript "window.history.back()"
        end tell
      end tell
    end tell
  `;
    executeAppleScript(script);
}
/**
 * Navigate forward in browser history
 */
export async function goForward(tabId) {
    const browserApp = getBrowserApp();
    const tabSelector = tabId ? `tab ${tabId}` : 'active tab';
    const script = `
    tell application "${browserApp}"
      tell front window
        tell ${tabSelector}
          execute javascript "window.history.forward()"
        end tell
      end tell
    end tell
  `;
    executeAppleScript(script);
}
/**
 * Execute arbitrary JavaScript in a tab by index (1-based), or current tab if not specified
 */
export async function executeJavaScript(code, tabId) {
    const browserApp = getBrowserApp();
    const tabSelector = tabId ? `tab ${tabId}` : 'active tab';
    const base64Code = Buffer.from(code).toString('base64');
    const script = `
    tell application "${browserApp}"
      tell front window
        tell ${tabSelector}
          execute javascript "eval(atob('${base64Code}'))"
        end tell
      end tell
    end tell
  `;
    const result = executeAppleScript(script);
    try {
        return JSON.parse(result);
    }
    catch {
        return result;
    }
}
// Re-export for compatibility
export { ensureBrowserRunning as ensureArcRunning } from './applescript.js';
//# sourceMappingURL=navigation.js.map